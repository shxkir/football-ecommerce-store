'use client';

import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native-web';
import { SmoothPressable } from '@/components/ui/SmoothPressable';
import { sendPasswordResetEmailClient } from '@/lib/clientEmailService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setMessage(null);
    setError(null);
    setIsBusy(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Send password reset email from client-side
        const emailResult = await sendPasswordResetEmailClient(
          email.trim().toLowerCase(),
          data.token,
          data.userName
        );

        if (emailResult.success) {
          setMessage('Password reset email sent! Check your inbox.');
          setEmail('');
        } else {
          setError('Failed to send reset email. Please try again.');
        }
      } else if (response.ok) {
        // User doesn't exist, but we show generic success message for security
        setMessage(data.message || 'If an account exists, a reset link has been sent.');
        setEmail('');
      } else {
        setError(data.message || 'Failed to send reset email');
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
            <Text style={styles.title}>Forgot your password?</Text>
            <Text style={styles.subtitle}>
              No worries! Enter your email address and we'll send you a link to reset your password.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Reset Password</Text>

            <TextInput
              placeholder="Email address"
              value={email}
              editable={!isBusy}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor="rgba(255,255,255,0.5)"
            />

            <SmoothPressable
              accessibilityRole="button"
              onPress={handleSubmit}
              disabled={isBusy}
              style={[styles.submitButton, isBusy && styles.submitButtonDisabled]}
            >
              <Text style={styles.submitText}>
                {isBusy ? 'Sending...' : 'Send Reset Link'}
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
          </View>
        </View>
      </section>
    </main>
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
});
