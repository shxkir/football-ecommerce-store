'use client';

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native-web';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function SignOutPage() {
  const router = useRouter();
  const { signOutUser } = useAuth();
  const [status, setStatus] = useState('Signing you out...');

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    (async () => {
      try {
        await signOutUser();
        setStatus('Signed out — redirecting to home.');
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Unable to sign out.');
      } finally {
        timeout = setTimeout(() => router.replace('/'), 1500);
      }
    })();
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [router, signOutUser]);

  return (
    <main>
      <section className="section-shell">
        <View style={styles.card}>
          <Text style={styles.title}>Sign out</Text>
          <Text style={styles.subtitle}>{status}</Text>
        </View>
      </section>
    </main>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(5,5,22,0.75)',
    padding: 32,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: '#f5f7ff',
  },
  subtitle: {
    color: 'rgba(235,238,255,0.8)',
  },
});
