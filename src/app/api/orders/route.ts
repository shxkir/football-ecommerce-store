import { NextRequest, NextResponse } from 'next/server';
import type { OrderPayload } from '@/types/store';
import { appendOrder, getSheetAccessUrl, isGoogleSheetsEnabled, listOrders } from '@/lib/orderStore';

const ADMIN_ACCESS_TOKEN = process.env.ADMIN_ACCESS_TOKEN || 'demo-admin-token';

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as OrderPayload;
    if (!payload?.user || !payload?.items?.length) {
      return NextResponse.json({ message: 'Invalid order payload.' }, { status: 400 });
    }

    const stored = await appendOrder(payload);
    const source = isGoogleSheetsEnabled() ? 'sheets' : 'local';
    const sheetUrl = getSheetAccessUrl();
    const message = source === 'sheets' ? 'Order synced to Google Sheets ✔' : 'Order placed successfully. (Connect Google Sheets to auto-sync.)';
    const adminReviewUrl = `/api/orders?token=${ADMIN_ACCESS_TOKEN}`;

    return NextResponse.json({ ok: true, orderId: stored.id, source, message, adminReviewUrl, sheetUrl });
  } catch (error) {
    console.error('[orders]', error);
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Failed to append order.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    if (!token || token !== ADMIN_ACCESS_TOKEN) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }
    const orders = await listOrders();
    return NextResponse.json({ orders, source: isGoogleSheetsEnabled() ? 'sheets' : 'local', sheetUrl: getSheetAccessUrl() });
  } catch (error) {
    console.error('[orders.list]', error);
    return NextResponse.json({ message: 'Unable to load orders.' }, { status: 500 });
  }
}
