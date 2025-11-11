'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { StyleSheet, Text, View } from 'react-native-web';
import { HeroSection } from '@/components/sections/HeroSection';

export default function HomePage() {
  const router = useRouter();

  return (
    <main>
      <section className="section-shell">
        <HeroSection onPrimaryCta={() => router.push('/products')} onSecondaryCta={() => router.push('/products?view=lookbook')} />
      </section>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Liquid Ether FC • React Native web experience with React Bits background + Google Sheets backend.</Text>
      </View>
    </main>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 40,
    opacity: 0.8,
    textAlign: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: 'rgba(235,238,255,0.65)',
  },
});
