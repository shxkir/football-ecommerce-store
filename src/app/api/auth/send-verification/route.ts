import { NextResponse } from 'next/server';
import { createVerificationCode } from '@/lib/verificationCodeStore';
import { sendVerificationEmail } from '@/lib/emailService';
import { findUserByEmail } from '@/lib/userStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ message: 'No account found with this email.' }, { status: 404 });
    }

    // Create verification code
    const verificationCode = await createVerificationCode(email, 10); // Expires in 10 minutes

    // Send email
    const emailResult = await sendVerificationEmail(email, verificationCode.code, user.name || undefined);

    if (!emailResult.success) {
      console.error('Failed to send verification email');
      // Still return success to avoid leaking information
    }

    return NextResponse.json(
      {
        message: 'Verification code sent to your email.',
        // In development, you might want to return the code for testing
        ...(process.env.NODE_ENV === 'development' && { code: verificationCode.code }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[send-verification]', error);
    return NextResponse.json({ message: 'Failed to send verification code.' }, { status: 500 });
  }
}
