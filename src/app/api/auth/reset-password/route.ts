import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { validateResetToken, markTokenAsUsed } from '@/lib/passwordResetStore';
import { updateUserPassword } from '@/lib/userStore';

const MIN_PASSWORD = 6;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body.token === 'string' ? body.token.trim() : '';
    const newPassword = typeof body.password === 'string' ? body.password : '';

    if (!token || !newPassword) {
      return NextResponse.json({ message: 'Token and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < MIN_PASSWORD) {
      return NextResponse.json(
        { message: `Password must be at least ${MIN_PASSWORD} characters.` },
        { status: 400 }
      );
    }

    // Validate token
    const validation = await validateResetToken(token);

    if (!validation.valid || !validation.email) {
      return NextResponse.json({ message: 'Invalid or expired reset token.' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await updateUserPassword(validation.email, hashedPassword);

    // Mark token as used
    if (validation.tokenId) {
      await markTokenAsUsed(validation.tokenId);
    }

    return NextResponse.json(
      {
        message: 'Password has been reset successfully. You can now log in with your new password.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[reset-password]', error);
    return NextResponse.json({ message: 'Failed to reset password.' }, { status: 500 });
  }
}
