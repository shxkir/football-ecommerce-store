'use client';

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native-web';
import { useRouter } from 'next/navigation';
import { CartSection } from '@/components/sections/CartSection';

export default function CartPage() {
  const router = useRouter();

  return (
    <main>
      <CartSection />
      <section className="section-shell">
        <View style={styles.checkoutCard}>
          <View style={styles.copyStack}>
            <Text style={styles.checkoutTitle}>Ready to finish checkout?</Text>
            <Text style={styles.checkoutSubtitle}>Review your shipping and personalization details on the next screen.</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push('/checkout')} style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Go to checkout</Text>
          </Pressable>
        </View>
      </section>
    </main>
  );
}

const styles = StyleSheet.create({
  checkoutCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(5,5,22,0.75)',
    padding: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  },
  copyStack: {
    flex: 1,
    minWidth: 220,
    gap: 6,
  },
  checkoutTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#f5f7ff',
  },
  checkoutSubtitle: {
    color: 'rgba(233,236,255,0.72)',
  },
  checkoutButton: {
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#ec66ff',
  },
  checkoutButtonText: {
    color: '#05051a',
    fontWeight: 600,
  },
});
