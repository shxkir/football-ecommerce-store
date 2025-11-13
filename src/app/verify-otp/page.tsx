'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native-web';
import { SmoothPressable } from '@/components/ui/SmoothPressable';
import { signIn } from 'next-auth/react';
import { sendVerificationEmailClient } from '@/lib/clientEmailService';

function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const password = searchParams.get('password');

  const [otpCode, setOtpCode] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email || !password) {
      setError('Invalid verification request. Please sign in again.');
      return;
    }

    // Request OTP and send email when component loads
    const requestOtp = async () => {
      try {
        const response = await fetch('/api/auth/login-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.code) {
          // Send verification email from client-side
          const emailResult = await sendVerificationEmailClient(
            email,
            data.code,
            data.userName
          );

          if (!emailResult.success) {
            console.error('Failed to send email:', emailResult.message);
            setError('Failed to send verification email. Please try resending.');
          }
        } else {
          setError(data.message || 'Failed to generate verification code');
        }
      } catch (err) {
        console.error('Error requesting OTP:', err);
        setError('An error occurred. Please try again.');
      }
    };

    requestOtp();
  }, [email, password]);

  const handleVerifyOtp = async () => {
    if (!email || !password) {
      setError('Invalid verification request');
      return;
    }

    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setMessage(null);
    setError(null);
    setIsBusy(true);

    try {
      // Verify OTP
      const response = await fetch('/api/auth/verify-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpCode }),
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        // Now sign in with NextAuth
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.ok) {
          setMessage('OTP verified! Redirecting...');
          setTimeout(() => {
            router.push('/');
          }, 1500);
        } else {
          setError('Failed to complete sign in');
        }
      } else {
        setError(data.message || 'Invalid or expired OTP code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || !password) return;

    setMessage(null);
    setError(null);
    setIsBusy(true);

    try {
      const response = await fetch('/api/auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.code) {
        // Send verification email from client-side
        const emailResult = await sendVerificationEmailClient(
          email,
          data.code,
          data.userName
        );

        if (emailResult.success) {
          setMessage('New code sent to your email!');
        } else {
          setError('Failed to send verification email');
        }
      } else {
        setError('Failed to resend code');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <main>
      <section className="section-shell">
        <View style={styles.shell}>
          <View style={styles.copyBlock}>
            <Text style={styles.sectionLabel}>Two-Factor Authentication</Text>
            <Text style={styles.title}>Verify your identity</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code to <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Enter Verification Code</Text>

            <TextInput
              placeholder="000000"
              value={otpCode}
              editable={!isBusy && !!email}
              keyboardType="number-pad"
              maxLength={6}
              onChangeText={setOtpCode}
              style={styles.otpInput}
              placeholderTextColor="rgba(255,255,255,0.3)"
              autoFocus
            />

            <SmoothPressable
              accessibilityRole="button"
              onPress={handleVerifyOtp}
              disabled={isBusy || !email || otpCode.length !== 6}
              style={[styles.submitButton, (isBusy || !email || otpCode.length !== 6) && styles.submitButtonDisabled]}
            >
              <Text style={styles.submitText}>
                {isBusy ? 'Verifying...' : 'Verify & Sign In'}
              </Text>
            </SmoothPressable>

            {message && <Text style={styles.successMessage}>{message}</Text>}
            {error && <Text style={styles.errorMessage}>{error}</Text>}

            <View style={styles.resendSection}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              <Pressable
                accessibilityRole="button"
                onPress={handleResendOtp}
                disabled={isBusy}
                style={styles.resendButton}
              >
                <Text style={styles.resendButtonText}>Resend Code</Text>
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="link"
              onPress={() => router.push('/sign-in')}
              style={styles.backLink}
            >
              <Text style={styles.backLinkText}>← Back to sign in</Text>
            </Pressable>
          </View>
        </View>
      </section>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <main>
        <section className="section-shell">
          <View style={styles.shell}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </section>
      </main>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(5,5,20,0.65)',
    padding: 32,
    flexDirection: 'row',
    gap: 32,
    flexWrap: 'wrap',
  },
  copyBlock: {
    flex: 1,
    minWidth: 260,
    gap: 12,
  },
  sectionLabel: {
    textTransform: 'uppercase',
    fontSize: 13,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.55)',
  },
  title: {
    fontSize: 32,
    fontWeight: 600,
    color: '#f5f7ff',
  },
  subtitle: {
    color: 'rgba(230,235,255,0.7)',
    lineHeight: 22,
    maxWidth: 460,
  },
  emailHighlight: {
    color: '#58f2ff',
    fontWeight: '600',
  },
  formCard: {
    flex: 1,
    minWidth: 280,
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(12,12,39,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 14,
  },
  formTitle: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 600,
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  otpInput: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(88,242,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 20,
    color: '#f4f4ff',
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: 12,
    textAlign: 'center',
    marginVertical: 12,
  },
  submitButton: {
    marginTop: 4,
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#ec66ff',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#05051a',
    fontWeight: 600,
    fontSize: 16,
  },
  successMessage: {
    marginTop: 8,
    color: '#4ade80',
    fontSize: 14,
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 8,
    color: '#f87171',
    fontSize: 14,
    textAlign: 'center',
  },
  resendSection: {
    marginTop: 16,
    alignItems: 'center',
    gap: 8,
  },
  resendText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    color: '#58f2ff',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  backLink: {
    marginTop: 12,
    alignSelf: 'center',
  },
  backLinkText: {
    color: '#58f2ff',
    fontSize: 14,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
});
