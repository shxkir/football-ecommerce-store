'use client';

import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native-web';
import { useAuth } from '@/hooks/useAuth';
import { SmoothPressable } from '@/components/ui/SmoothPressable';

interface AuthSectionProps {
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  initialMode?: 'signup' | 'signin';
  showModeToggle?: boolean;
}

export function AuthSection({
  sectionLabel = 'Account Deck',
  title = 'Sign up to save carts, track drops, and push orders straight to the sheet.',
  subtitle = 'Accounts are stored via NextAuth + Firebase (Firestore), so you can sign in from any device while staying entirely in your stack.',
  initialMode = 'signup',
  showModeToggle = true,
}: AuthSectionProps = {}) {
  const { user, loading, signInUser, signUpUser, signOutUser, message } = useAuth();
  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode);
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [banner, setBanner] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpEmail, setOtpEmail] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setBanner(null);
    setIsBusy(true);
    try {
      if (mode === 'signup') {
        const created = await signUpUser({ fullName: form.fullName, email: form.email, password: form.password });
        if (created.ok) {
          await signInUser({ email: form.email, password: form.password });
          setBanner('Account created — you are signed in.');
          setForm((prev) => ({ ...prev, password: '' }));
        }
      } else {
        // Request OTP for sign-in
        const response = await fetch('/api/auth/login-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });

        const data = await response.json();

        if (response.ok && data.requiresOtp) {
          // Redirect to OTP verification page
          const params = new URLSearchParams({
            email: form.email,
            password: form.password,
          });
          window.location.href = `/verify-otp?${params.toString()}`;
        } else if (!response.ok) {
          setBanner(data.message || 'Login failed');
        }
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleVerifyOtp = async () => {
    setBanner(null);
    setIsBusy(true);
    try {
      const response = await fetch('/api/auth/verify-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, code: otpCode }),
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        // Now actually sign in with NextAuth
        const signedIn = await signInUser({ email: form.email, password: form.password });
        if (signedIn.ok) {
          setBanner('OTP verified! Welcome back!');
          setForm((prev) => ({ ...prev, password: '' }));
          setOtpRequired(false);
          setOtpCode('');
        }
      } else {
        setBanner(data.message || 'Invalid OTP code');
      }
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <section className="section-shell">
      <View style={styles.shell}>
        <View style={styles.copyBlock}>
          <Text style={styles.sectionLabel}>{sectionLabel}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.formCard}>
          {user ? (
            <View style={styles.welcomeBlock}>
              <Text style={styles.welcomeTitle}>Hi {user.name ?? user.email}</Text>
              <Text style={styles.welcomeCopy}>You are connected — add kits and finish checkout when you are ready.</Text>
              <Pressable accessibilityRole="button" onPress={signOutUser} style={styles.signOutButton}>
                <Text style={styles.signOutText}>Sign out</Text>
              </Pressable>
            </View>
          ) : otpRequired ? (
            <>
              <Text style={styles.fixedModeLabel}>Verify OTP</Text>
              <Text style={styles.otpInstructions}>
                Enter the 6-digit code sent to your email
              </Text>
              <TextInput
                placeholder="6-digit code"
                value={otpCode}
                editable={!isBusy}
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={setOtpCode}
                style={[styles.input, styles.otpInput]}
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
              <SmoothPressable
                accessibilityRole="button"
                onPress={handleVerifyOtp}
                disabled={isBusy || otpCode.length !== 6}
                style={[styles.submitButton, (isBusy || otpCode.length !== 6) && styles.submitButtonDisabled]}
              >
                <Text style={styles.submitText}>Verify OTP</Text>
              </SmoothPressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setOtpRequired(false);
                  setOtpCode('');
                  setBanner(null);
                }}
                style={styles.backLink}
              >
                <Text style={styles.backLinkText}>← Back to sign in</Text>
              </Pressable>
              {banner && <Text style={styles.message}>{banner}</Text>}
            </>
          ) : (
            <>
              {showModeToggle ? (
                <View style={styles.modeRow}>
                  <Pressable onPress={() => setMode('signup')} style={[styles.modeButton, mode === 'signup' && styles.modeButtonActive]}>
                    <Text style={[styles.modeText, mode === 'signup' && styles.modeTextActive]}>Create account</Text>
                  </Pressable>
                  <Pressable onPress={() => setMode('signin')} style={[styles.modeButton, mode === 'signin' && styles.modeButtonActive]}>
                    <Text style={[styles.modeText, mode === 'signin' && styles.modeTextActive]}>Sign in</Text>
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.fixedModeLabel}>{mode === 'signup' ? 'Create account' : 'Sign in'}</Text>
              )}
              {mode === 'signup' && (
                <TextInput
                  placeholder="Full name"
                  value={form.fullName}
                  editable={!isBusy}
                  onChangeText={(text) => handleChange('fullName', text)}
                  style={styles.input}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                />
              )}
              <TextInput
                placeholder="Email"
                value={form.email}
                editable={!isBusy}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(text) => handleChange('email', text)}
                style={styles.input}
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
              <TextInput
                placeholder="Password"
                secureTextEntry
                value={form.password}
                editable={!isBusy}
                onChangeText={(text) => handleChange('password', text)}
                style={styles.input}
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
              {mode === 'signin' && (
                <Pressable
                  accessibilityRole="link"
                  onPress={() => (window.location.href = '/forgot-password')}
                  style={styles.forgotPasswordLink}
                >
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </Pressable>
              )}
              <SmoothPressable
                accessibilityRole="button"
                onPress={handleSubmit}
                disabled={isBusy || loading}
                style={[styles.submitButton, (isBusy || loading) && styles.submitButtonDisabled]}
              >
                <Text style={styles.submitText}>{mode === 'signup' ? 'Create & sign in' : 'Sign in'}</Text>
              </SmoothPressable>
              {(banner || message) && <Text style={styles.message}>{banner || message}</Text>}
            </>
          )}
        </View>
      </View>
    </section>
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
  modeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fixedModeLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontWeight: 600,
    fontSize: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
  },
  modeButtonActive: {
    borderColor: '#58f2ff',
    backgroundColor: 'rgba(88,242,255,0.08)',
  },
  modeText: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 500,
  },
  modeTextActive: {
    color: '#58f2ff',
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
  message: {
    marginTop: 8,
    color: '#ffd977',
  },
  welcomeBlock: {
    gap: 12,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#f5f7ff',
  },
  welcomeCopy: {
    color: 'rgba(230,235,255,0.75)',
  },
  signOutButton: {
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  signOutText: {
    color: '#fdfdfd',
    fontWeight: 600,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 4,
  },
  forgotPasswordText: {
    color: '#58f2ff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  otpInstructions: {
    color: 'rgba(230,235,255,0.7)',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 8,
    textAlign: 'center',
  },
  backLink: {
    alignSelf: 'center',
    marginTop: 12,
  },
  backLinkText: {
    color: '#58f2ff',
    fontSize: 14,
  },
});
