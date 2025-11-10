'use client';

import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native-web';
import { HeroSection } from '@/components/sections/HeroSection';
import { StoreSection } from '@/components/sections/StoreSection';
import { AuthSection } from '@/components/sections/AuthSection';
import { CartSection } from '@/components/sections/CartSection';
import { CheckoutSection } from '@/components/sections/CheckoutSection';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();
  const { items } = useCart();

  const handleShopPress = useCallback(() => {
    const store = document.getElementById('store');
    if (store) {
      store.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <main>
      <View style={styles.navbar}>
        <Text style={styles.brand}>Liquid Ether FC</Text>
        <View style={styles.navRight}>
          <Text style={styles.memberBadge}>{user ? `Signed in as ${user.name ?? user.email ?? 'Member'}` : 'Guest Mode'}</Text>
          <Pressable accessibilityRole="button" onPress={handleShopPress} style={styles.navButton}>
            <Text style={styles.navButtonText}>Store · {items.length} items</Text>
          </Pressable>
        </View>
      </View>
      <HeroSection onShopPress={handleShopPress} />
      <StoreSection />
      <AuthSection />
      <CartSection />
      <CheckoutSection />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Liquid Ether FC • React Native web experience with React Bits background + Google Sheets backend.</Text>
      </View>
    </main>
  );
}

const styles = StyleSheet.create({
  navbar: {
    padding: 24,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  brand: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 1,
  },
  navRight: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  memberBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  navButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  navButtonText: {
    fontWeight: 600,
  },
  footer: {
    padding: 40,
    opacity: 0.8,
  },
  footerText: {
    textAlign: 'center',
    color: 'rgba(235,238,255,0.65)',
  },
});
