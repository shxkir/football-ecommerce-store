// Client-side EmailJS service (works in browser)
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const VERIFICATION_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_VERIFICATION_TEMPLATE_ID;
const RESET_PASSWORD_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_RESET_PASSWORD_TEMPLATE_ID;

// Initialize EmailJS with public key
if (typeof window !== 'undefined' && EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export async function sendVerificationEmailClient(to: string, code: string, userName?: string) {
  console.log('[sendVerificationEmailClient] Starting...');
  console.log('[sendVerificationEmailClient] Config:', {
    EMAILJS_SERVICE_ID,
    VERIFICATION_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY: EMAILJS_PUBLIC_KEY ? '(set)' : '(missing)',
    to,
    code,
    userName,
  });

  if (!EMAILJS_SERVICE_ID || !VERIFICATION_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn('[sendVerificationEmailClient] EmailJS is not configured properly');
    return { success: false, message: 'Email service not configured' };
  }

  const templateParams = {
    to_email: to,
    to_name: userName || to,
    verification_code: code,
  };

  console.log('[sendVerificationEmailClient] Sending with params:', templateParams);

  try {
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      VERIFICATION_TEMPLATE_ID,
      templateParams
    );

    console.log('[sendVerificationEmailClient] SUCCESS! Result:', result);
    return { success: true, message: 'Verification email sent' };
  } catch (error: any) {
    console.error('[sendVerificationEmailClient] FAILED! Error:', error);
    console.error('[sendVerificationEmailClient] Error details:', {
      message: error?.message,
      text: error?.text,
      status: error?.status,
    });
    return { success: false, message: `Failed to send verification email: ${error?.text || error?.message || 'Unknown error'}` };
  }
}

export async function sendPasswordResetEmailClient(to: string, resetToken: string, userName?: string) {
  console.log('[sendPasswordResetEmailClient] Starting...');
  console.log('[sendPasswordResetEmailClient] Config:', {
    EMAILJS_SERVICE_ID,
    RESET_PASSWORD_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY: EMAILJS_PUBLIC_KEY ? '(set)' : '(missing)',
    to,
    userName,
  });

  if (!EMAILJS_SERVICE_ID || !RESET_PASSWORD_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn('[sendPasswordResetEmailClient] EmailJS is not configured properly');
    return { success: false, message: 'Email service not configured' };
  }

  const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;

  const templateParams = {
    to_email: to,
    to_name: userName || to,
    reset_url: resetUrl,
  };

  console.log('[sendPasswordResetEmailClient] Sending with params:', templateParams);

  try {
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      RESET_PASSWORD_TEMPLATE_ID,
      templateParams
    );

    console.log('[sendPasswordResetEmailClient] SUCCESS! Result:', result);
    return { success: true, message: 'Password reset email sent' };
  } catch (error: any) {
    console.error('[sendPasswordResetEmailClient] FAILED! Error:', error);
    console.error('[sendPasswordResetEmailClient] Error details:', {
      message: error?.message,
      text: error?.text,
      status: error?.status,
    });
    return { success: false, message: `Failed to send reset email: ${error?.text || error?.message || 'Unknown error'}` };
  }
}
