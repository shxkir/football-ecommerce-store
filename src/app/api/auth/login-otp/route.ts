import { NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { findUserByEmail } from '@/lib/userStore';
import { createVerificationCode } from '@/lib/verificationCodeStore';
import { sendVerificationEmail } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    // Verify user credentials
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const match = await compare(password, user.password);
    if (!match) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // Generate OTP
    const verificationCode = await createVerificationCode(email, 10); // Expires in 10 minutes

    // Return code so client can send email (EmailJS requires browser context)
    return NextResponse.json(
      {
        message: 'Please verify OTP to complete sign in.',
        requiresOtp: true,
        email,
        code: verificationCode.code, // Send to client for email sending
        userName: user.name || undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[login-otp]', error);
    return NextResponse.json({ message: 'Failed to process login request.' }, { status: 500 });
  }
}
