import { NextResponse } from 'next/server';
import { createPasswordResetToken } from '@/lib/passwordResetStore';
import { sendPasswordResetEmail } from '@/lib/emailService';
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
      // Don't reveal that the user doesn't exist for security reasons
      return NextResponse.json(
        {
          message: 'If an account with that email exists, a password reset link has been sent.',
        },
        { status: 200 }
      );
    }

    // Create reset token
    const resetToken = await createPasswordResetToken(email, 1); // Expires in 1 hour

    // Return token so client can send email (EmailJS requires browser context)
    return NextResponse.json(
      {
        message: 'If an account with that email exists, a password reset link has been sent.',
        token: resetToken.token,
        userName: user.name || undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[forgot-password]', error);
    return NextResponse.json({ message: 'Failed to process password reset request.' }, { status: 500 });
  }
}
