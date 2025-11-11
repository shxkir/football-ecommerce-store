'use client';

import React from 'react';
import { StyleSheet, Text, View } from 'react-native-web';
import { StoreSection } from '@/components/sections/StoreSection';

export default function ProductsPage() {
  return (
    <main>
      <section className="section-shell">
        <View style={styles.introCard}>
          <Text style={styles.label}>Products</Text>
          <Text style={styles.title}>Elite drops, studio-finished kits, and personalization.</Text>
          <Text style={styles.subtitle}>Every kit is staged with a badge tier, color palette, and live size selection before it hits your cart.</Text>
        </View>
      </section>
      <StoreSection />
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
