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
      return NextResponse.json({ message: result.message || 'Invalid or expired OTP code.' }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: 'OTP verified successfully. You can now sign in.',
        verified: true,
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[verify-login-otp]', error);
    return NextResponse.json({ message: 'Failed to verify OTP code.' }, { status: 500 });
  }
}
