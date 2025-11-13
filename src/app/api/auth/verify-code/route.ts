import { NextResponse } from 'next/server';
import { verifyCode } from '@/lib/verificationCodeStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const code = typeof body.code === 'string' ? body.code.trim() : '';

    if (!email || !code) {
      return NextResponse.json({ message: 'Email and code are required.' }, { status: 400 });
    }

    const result = await verifyCode(email, code);

    if (!result.valid) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: result.message,
        verified: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[verify-code]', error);
    return NextResponse.json({ message: 'Failed to verify code.' }, { status: 500 });
  }
}
