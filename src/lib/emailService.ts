import emailjs from '@emailjs/nodejs';

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

// Template IDs
const VERIFICATION_TEMPLATE_ID = process.env.EMAILJS_VERIFICATION_TEMPLATE_ID;
const RESET_PASSWORD_TEMPLATE_ID = process.env.EMAILJS_RESET_PASSWORD_TEMPLATE_ID;

const emailConfigured = Boolean(
  EMAILJS_SERVICE_ID &&
  EMAILJS_PUBLIC_KEY &&
  EMAILJS_PRIVATE_KEY &&
  VERIFICATION_TEMPLATE_ID &&
  RESET_PASSWORD_TEMPLATE_ID
);

export function isEmailServiceConfigured() {
  return emailConfigured;
}

export async function sendVerificationEmail(to: string, code: string, userName?: string) {
  if (!emailConfigured || !EMAILJS_SERVICE_ID || !VERIFICATION_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
    console.warn('EmailJS is not configured. Skipping verification email.');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      VERIFICATION_TEMPLATE_ID,
      {
        to_email: to,
        to_name: userName || to,
        verification_code: code,
        subject: 'Your Verification Code',
      },
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      }
    );

    console.log('Verification email sent:', response);
    return { success: true, message: 'Verification email sent' };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, message: 'Failed to send verification email' };
  }
}

export async function sendPasswordResetEmail(to: string, resetToken: string, userName?: string) {
  if (!emailConfigured || !EMAILJS_SERVICE_ID || !RESET_PASSWORD_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
    console.warn('EmailJS is not configured. Skipping password reset email.');
    return { success: false, message: 'Email service not configured' };
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      RESET_PASSWORD_TEMPLATE_ID,
      {
        to_email: to,
        to_name: userName || to,
        reset_url: resetUrl,
        subject: 'Reset Your Password',
      },
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      }
    );

    console.log('Password reset email sent:', response);
    return { success: true, message: 'Password reset email sent' };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, message: 'Failed to send password reset email' };
  }
}
