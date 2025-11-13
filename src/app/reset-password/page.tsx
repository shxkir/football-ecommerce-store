'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native-web';
import { SmoothPressable } from '@/components/ui/SmoothPressable';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleSubmit = async () => {
    if (!token) {
      setError('Invalid reset token');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setMessage(null);
    setError(null);
    setIsBusy(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password reset successfully!');
        setSuccess(true);
        setPassword('');
        setConfirmPassword('');

        // Redirect to sign-in after 3 seconds
        setTimeout(() => {
          window.location.href = '/sign-in';
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <main>
      <section className="section-shell">
        <View style={styles.shell}>
          <View style={styles.copyBlock}>
            <Text style={styles.sectionLabel}>Password Reset</Text>
            <Text style={styles.title}>Set a new password</Text>
            <Text style={styles.subtitle}>
              Choose a strong password that you haven't used before.
            </Text>
          </View>

          <View style={styles.formCard}>
            {success ? (
              <View style={styles.successBlock}>
                <Text style={styles.successTitle}>✓ Password Reset!</Text>
                <Text style={styles.successText}>
                  Your password has been reset successfully. Redirecting to sign in...
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.formTitle}>New Password</Text>

                <TextInput
                  placeholder="New password"
                  secureTextEntry
                  value={password}
                  editable={!isBusy && !!token}
                  onChangeText={setPassword}
                  style={styles.input}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                />

                <TextInput
                  placeholder="Confirm new password"
                  secureTextEntry
                  value={confirmPassword}
                  editable={!isBusy && !!token}
                  onChangeText={setConfirmPassword}
                  style={styles.input}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                />

                <SmoothPressable
                  accessibilityRole="button"
                  onPress={handleSubmit}
                  disabled={isBusy || !token}
                  style={[styles.submitButton, (isBusy || !token) && styles.submitButtonDisabled]}
                >
                  <Text style={styles.submitText}>
                    {isBusy ? 'Resetting...' : 'Reset Password'}
                  </Text>
                </SmoothPressable>

                {message && <Text style={styles.successMessage}>{message}</Text>}
                {error && <Text style={styles.errorMessage}>{error}</Text>}

                <Pressable
                  accessibilityRole="link"
                  onPress={() => (window.location.href = '/sign-in')}
                  style={styles.backLink}
                >
                  <Text style={styles.backLinkText}>← Back to sign in</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
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
      <ResetPasswordContent />
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
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#f4f4ff',
    fontSize: 16,
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
  },
  errorMessage: {
    marginTop: 8,
    color: '#f87171',
    fontSize: 14,
  },
  backLink: {
    marginTop: 12,
    alignSelf: 'center',
  },
  backLinkText: {
    color: '#58f2ff',
    fontSize: 14,
  },
  successBlock: {
    gap: 12,
    alignItems: 'center',
    paddingVertical: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#4ade80',
  },
  successText: {
    color: 'rgba(230,235,255,0.75)',
    textAlign: 'center',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
});
