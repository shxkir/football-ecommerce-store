'use client';

import React from 'react';
import { StyleSheet, Text, View } from 'react-native-web';
import { CheckoutSection } from '@/components/sections/CheckoutSection';

export default function CheckoutPage() {
  return (
    <main>
      <section className="section-shell">
        <View style={styles.introCard}>
          <Text style={styles.label}>Checkout</Text>
          <Text style={styles.title}>Personalize, confirm, and sync your drop.</Text>
          <Text style={styles.subtitle}>Fill in dispatch details, jersey notes, and push the payload straight to your Google Sheet.</Text>
        </View>
      </section>
      <CheckoutSection />
    </main>
  );
}

const styles = StyleSheet.create({
  introCard: {
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(5,5,22,0.7)',
    padding: 32,
    gap: 12,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  title: {
    fontSize: 34,
    fontWeight: 600,
    color: '#f5f7ff',
  },
  subtitle: {
    color: 'rgba(235,238,255,0.75)',
    maxWidth: 640,
    lineHeight: 24,
  },
});
