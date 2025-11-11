import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { google } from 'googleapis';
import type { OrderPayload } from '@/types/store';

const LOCAL_STORE_DIR = path.join(process.cwd(), '.data');
const LOCAL_STORE_FILE = path.join(LOCAL_STORE_DIR, 'orders.json');

export type StoredOrder = OrderPayload & { id: string };

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

async function ensureLocalStoreFile() {
  await fs.mkdir(LOCAL_STORE_DIR, { recursive: true });
  try {
    await fs.access(LOCAL_STORE_FILE);
  } catch {
    await fs.writeFile(LOCAL_STORE_FILE, JSON.stringify({ orders: [] as StoredOrder[], updatedAt: new Date().toISOString() }, null, 2), 'utf8');
  }
}

async function readLocalOrders(): Promise<StoredOrder[]> {
  await ensureLocalStoreFile();
  try {
    const raw = await fs.readFile(LOCAL_STORE_FILE, 'utf8');
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as { orders?: StoredOrder[] } | StoredOrder[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed.orders && Array.isArray(parsed.orders)) {
      return parsed.orders;
    }
    return [];
  } catch {
    return [];
  }
}

async function writeLocalOrders(orders: StoredOrder[]) {
  await ensureLocalStoreFile();
  const payload = { orders, updatedAt: new Date().toISOString() };
  await fs.writeFile(LOCAL_STORE_FILE, JSON.stringify(payload, null, 2), 'utf8');
}

async function appendOrderLocally(payload: OrderPayload) {
  const orders = await readLocalOrders();
  const stored: StoredOrder = { ...payload, id: randomUUID() };
  orders.push(stored);
  await writeLocalOrders(orders);
  return stored;
}

async function appendOrderToSheets(payload: OrderPayload) {
  const stored: StoredOrder = { ...payload, id: randomUUID() };
  const { sheets, spreadsheetId } = getSheetsClient();
  const values = [
    stored.id,
    payload.placedAt,
    payload.user.fullName,
    payload.user.email,
    payload.shipping.fullName,
    payload.shipping.email,
    payload.shipping.phone,
    payload.shipping.address,
    `${payload.shipping.city}, ${payload.shipping.country}`,
    payload.shipping.paymentMethod,
    payload.shipping.jerseyName || '',
    payload.shipping.jerseyNumber || '',
    payload.totals.subtotal,
    payload.totals.shipping,
    payload.totals.total,
    JSON.stringify(payload.items),
    JSON.stringify(payload.shipping),
    JSON.stringify(payload),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Orders!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [values],
    },
  });

  return stored;
}

async function listLocalOrders() {
  return readLocalOrders();
}

async function listSheetOrders() {
  const { sheets, spreadsheetId } = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Orders!A2:R',
  });
  const rows = response.data.values ?? [];
  const orders: StoredOrder[] = [];
  for (const row of rows) {
    const payloadJSON = row[17] ?? row[row.length - 1];
    if (!payloadJSON) {
      continue;
    }
    try {
      const payload = JSON.parse(payloadJSON) as OrderPayload;
      const id = (row[0] as string | undefined) || payload.user?.id || randomUUID();
      orders.push({ ...payload, id });
    } catch {
      continue;
    }
  }
  return orders;
}

export async function appendOrder(payload: OrderPayload) {
  if (googleConfigured) {
    return appendOrderToSheets(payload);
  }
  return appendOrderLocally(payload);
}

export async function listOrders() {
  if (googleConfigured) {
    return listSheetOrders();
  }
  return listLocalOrders();
}

export function isGoogleSheetsEnabled() {
  return googleConfigured;
}

export function getSheetAccessUrl() {
  if (!spreadsheetId) {
    return null;
  }
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
}
