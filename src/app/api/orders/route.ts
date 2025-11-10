import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import type { OrderPayload } from '@/types/store';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error('Missing Google Sheets environment variables.');
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return { sheets, spreadsheetId };
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as OrderPayload;
    if (!payload?.user || !payload?.items?.length) {
      return NextResponse.json({ message: 'Invalid order payload.' }, { status: 400 });
    }

    const { sheets, spreadsheetId } = getSheetsClient();
    const shipping = payload.shipping;
    const values = [
      payload.placedAt,
      payload.user.fullName,
      payload.user.email,
      shipping.fullName,
      shipping.email,
      shipping.phone,
      shipping.address,
      `${shipping.city}, ${shipping.country}`,
      shipping.paymentMethod,
      shipping.jerseyName || '',
      shipping.jerseyNumber || '',
      payload.totals.subtotal,
      payload.totals.shipping,
      payload.totals.total,
      payload.items
        .map((item) => `${item.name} x${item.quantity} (${item.size}) - $${item.price}`)
        .join(' | '),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Orders!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [values],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[orders]', error);
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Failed to append order.' }, { status: 500 });
  }
}
