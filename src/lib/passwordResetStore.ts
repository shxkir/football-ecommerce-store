import { randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { google } from 'googleapis';

export type PasswordResetToken = {
  id: string;
  email: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  used: boolean;
};

const LOCAL_STORE_DIR = path.join(process.cwd(), '.data');
const LOCAL_STORE_FILE = path.join(LOCAL_STORE_DIR, 'password-resets.json');

const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');
const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

const googleConfigured = Boolean(clientEmail && privateKey && spreadsheetId);

function getSheetsClient() {
  if (!googleConfigured || !clientEmail || !privateKey || !spreadsheetId) {
    throw new Error('Google Sheets is not configured.');
  }
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  return { sheets, spreadsheetId };
}

// Generate a secure token
export function generateResetToken(): string {
  return randomBytes(32).toString('hex');
}

// Local storage functions
async function ensureLocalStoreFile() {
  await fs.mkdir(LOCAL_STORE_DIR, { recursive: true });
  try {
    await fs.access(LOCAL_STORE_FILE);
  } catch {
    const initial = { tokens: [] as PasswordResetToken[], updatedAt: new Date().toISOString() };
    await fs.writeFile(LOCAL_STORE_FILE, JSON.stringify(initial, null, 2), 'utf8');
  }
}

async function readLocalTokens(): Promise<PasswordResetToken[]> {
  await ensureLocalStoreFile();
  try {
    const raw = await fs.readFile(LOCAL_STORE_FILE, 'utf8');
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as { tokens?: PasswordResetToken[] } | PasswordResetToken[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed.tokens && Array.isArray(parsed.tokens)) {
      return parsed.tokens;
    }
    return [];
  } catch {
    return [];
  }
}

async function writeLocalTokens(tokens: PasswordResetToken[]) {
  await ensureLocalStoreFile();
  const payload = { tokens, updatedAt: new Date().toISOString() };
  await fs.writeFile(LOCAL_STORE_FILE, JSON.stringify(payload, null, 2), 'utf8');
}

async function createTokenLocally(email: string, token: string, expiresInHours: number = 1) {
  const tokens = await readLocalTokens();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInHours * 3600000);

  const resetToken: PasswordResetToken = {
    id: randomBytes(16).toString('hex'),
    email,
    token,
    expiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString(),
    used: false,
  };

  tokens.push(resetToken);
  await writeLocalTokens(tokens);
  return resetToken;
}

async function findTokenLocally(token: string) {
  const tokens = await readLocalTokens();
  const now = new Date();

  return tokens.find(
    (t) =>
      t.token === token &&
      !t.used &&
      new Date(t.expiresAt) > now
  ) ?? null;
}

async function markTokenAsUsedLocally(id: string) {
  const tokens = await readLocalTokens();
  const token = tokens.find((t) => t.id === id);
  if (token) {
    token.used = true;
  }
  await writeLocalTokens(tokens);
}

// Google Sheets functions
async function createTokenInSheets(email: string, token: string, expiresInHours: number = 1) {
  const { sheets, spreadsheetId } = getSheetsClient();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInHours * 3600000);

  const resetToken: PasswordResetToken = {
    id: randomBytes(16).toString('hex'),
    email,
    token,
    expiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString(),
    used: false,
  };

  const values = [
    resetToken.id,
    email,
    token,
    expiresAt.toISOString(),
    now.toISOString(),
    'false',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'PasswordResets!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [values],
    },
  });

  return resetToken;
}

async function findTokenInSheets(token: string) {
  const { sheets, spreadsheetId } = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'PasswordResets!A2:F',
  });

  const rows = response.data.values ?? [];
  const now = new Date();

  for (const row of rows) {
    const [id, email, rowToken, expiresAt, createdAt, used] = row;

    if (
      rowToken === token &&
      used !== 'true' &&
      new Date(expiresAt) > now
    ) {
      return {
        id,
        email,
        token: rowToken,
        expiresAt,
        createdAt,
        used: used === 'true',
      } as PasswordResetToken;
    }
  }

  return null;
}

async function markTokenAsUsedInSheets(id: string) {
  const { sheets, spreadsheetId } = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'PasswordResets!A2:F',
  });

  const rows = response.data.values ?? [];
  let rowIndex = -1;

  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === id) {
      rowIndex = i + 2; // +2 because sheets are 1-indexed and we start from row 2
      break;
    }
  }

  if (rowIndex !== -1) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `PasswordResets!F${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['true']],
      },
    });
  }
}

// Public API
export async function createPasswordResetToken(email: string, expiresInHours: number = 1) {
  const token = generateResetToken();

  if (googleConfigured) {
    return createTokenInSheets(email, token, expiresInHours);
  }
  return createTokenLocally(email, token, expiresInHours);
}

export async function validateResetToken(token: string) {
  let resetToken: PasswordResetToken | null;

  if (googleConfigured) {
    resetToken = await findTokenInSheets(token);
  } else {
    resetToken = await findTokenLocally(token);
  }

  if (!resetToken) {
    return { valid: false, email: null };
  }

  return { valid: true, email: resetToken.email, tokenId: resetToken.id };
}

export async function markTokenAsUsed(tokenId: string) {
  if (googleConfigured) {
    await markTokenAsUsedInSheets(tokenId);
  } else {
    await markTokenAsUsedLocally(tokenId);
  }
}

export function isGoogleSheetsEnabled() {
  return googleConfigured;
}
