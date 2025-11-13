import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { google } from 'googleapis';

export type VerificationCode = {
  id: string;
  email: string;
  code: string;
  expiresAt: string;
  createdAt: string;
  verified: boolean;
};

const LOCAL_STORE_DIR = path.join(process.cwd(), '.data');
const LOCAL_STORE_FILE = path.join(LOCAL_STORE_DIR, 'verification-codes.json');

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

// Generate a 6-digit code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Local storage functions
async function ensureLocalStoreFile() {
  await fs.mkdir(LOCAL_STORE_DIR, { recursive: true });
  try {
    await fs.access(LOCAL_STORE_FILE);
  } catch {
    const initial = { codes: [] as VerificationCode[], updatedAt: new Date().toISOString() };
    await fs.writeFile(LOCAL_STORE_FILE, JSON.stringify(initial, null, 2), 'utf8');
  }
}

async function readLocalCodes(): Promise<VerificationCode[]> {
  await ensureLocalStoreFile();
  try {
    const raw = await fs.readFile(LOCAL_STORE_FILE, 'utf8');
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as { codes?: VerificationCode[] } | VerificationCode[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed.codes && Array.isArray(parsed.codes)) {
      return parsed.codes;
    }
    return [];
  } catch {
    return [];
  }
}

async function writeLocalCodes(codes: VerificationCode[]) {
  await ensureLocalStoreFile();
  const payload = { codes, updatedAt: new Date().toISOString() };
  await fs.writeFile(LOCAL_STORE_FILE, JSON.stringify(payload, null, 2), 'utf8');
}

async function createCodeLocally(email: string, code: string, expiresInMinutes: number = 10) {
  const codes = await readLocalCodes();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInMinutes * 60000);

  const verificationCode: VerificationCode = {
    id: randomUUID(),
    email,
    code,
    expiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString(),
    verified: false,
  };

  codes.push(verificationCode);
  await writeLocalCodes(codes);
  return verificationCode;
}

async function findCodeLocally(email: string, code: string) {
  const codes = await readLocalCodes();
  const now = new Date();

  return codes.find(
    (c) =>
      c.email === email &&
      c.code === code &&
      !c.verified &&
      new Date(c.expiresAt) > now
  ) ?? null;
}

async function markCodeAsVerifiedLocally(id: string) {
  const codes = await readLocalCodes();
  const code = codes.find((c) => c.id === id);
  if (code) {
    code.verified = true;
  }
  await writeLocalCodes(codes);
}

// Google Sheets functions
async function createCodeInSheets(email: string, code: string, expiresInMinutes: number = 10) {
  const { sheets, spreadsheetId } = getSheetsClient();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInMinutes * 60000);

  const verificationCode: VerificationCode = {
    id: randomUUID(),
    email,
    code,
    expiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString(),
    verified: false,
  };

  const values = [
    verificationCode.id,
    email,
    code,
    expiresAt.toISOString(),
    now.toISOString(),
    'false',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'VerificationCodes!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [values],
    },
  });

  return verificationCode;
}

async function findCodeInSheets(email: string, code: string) {
  const { sheets, spreadsheetId } = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'VerificationCodes!A2:F',
  });

  const rows = response.data.values ?? [];
  const now = new Date();

  for (const row of rows) {
    const [id, rowEmail, rowCode, expiresAt, createdAt, verified] = row;

    if (
      rowEmail === email &&
      rowCode === code &&
      verified !== 'true' &&
      new Date(expiresAt) > now
    ) {
      return {
        id,
        email: rowEmail,
        code: rowCode,
        expiresAt,
        createdAt,
        verified: verified === 'true',
      } as VerificationCode;
    }
  }

  return null;
}

async function markCodeAsVerifiedInSheets(id: string) {
  const { sheets, spreadsheetId } = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'VerificationCodes!A2:F',
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
      range: `VerificationCodes!F${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['true']],
      },
    });
  }
}

// Public API
export async function createVerificationCode(email: string, expiresInMinutes: number = 10) {
  const code = generateVerificationCode();

  if (googleConfigured) {
    return createCodeInSheets(email, code, expiresInMinutes);
  }
  return createCodeLocally(email, code, expiresInMinutes);
}

export async function verifyCode(email: string, code: string) {
  let verificationCode: VerificationCode | null;

  if (googleConfigured) {
    verificationCode = await findCodeInSheets(email, code);
  } else {
    verificationCode = await findCodeLocally(email, code);
  }

  if (!verificationCode) {
    return { valid: false, message: 'Invalid or expired verification code' };
  }

  // Mark as verified
  if (googleConfigured) {
    await markCodeAsVerifiedInSheets(verificationCode.id);
  } else {
    await markCodeAsVerifiedLocally(verificationCode.id);
  }

  return { valid: true, message: 'Code verified successfully' };
}

export function isGoogleSheetsEnabled() {
  return googleConfigured;
}
