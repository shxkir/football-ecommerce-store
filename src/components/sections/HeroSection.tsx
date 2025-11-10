'use client';

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native-web';
import LiquidEther from '@/components/backgrounds/LiquidEther';

interface HeroSectionProps {
  onShopPress: () => void;
}

const heroStats = [
  { label: 'Elite Kits', value: '48 drops' },
  { label: 'Members', value: '32K+' },
  { label: 'Avg. Ship', value: '48 hrs' },
];

export function HeroSection({ onShopPress }: HeroSectionProps) {
  return (
    <View style={styles.heroWrapper}>
      <View style={styles.background}>
        <LiquidEther
          colors={['#4c1aff', '#15f0ff', '#ec66ff']}
          cursorSize={140}
          autoIntensity={2.6}
          resolution={0.4}
        />
        <View style={styles.heroGradient} />
      </View>
      <View style={styles.heroContent}>
        <Text style={styles.tag}>Liquid Ether FC • Footy Boutique</Text>
        <Text style={styles.title}>Collect the kits that feel like future football.</Text>
        <Text style={styles.subtitle}>
          Authenticated drops, stitched personalization, and a cart that follows you from scouting to checkout.
        </Text>
        <View style={styles.ctaRow}>
          <Pressable accessibilityRole="button" onPress={onShopPress} style={styles.primaryCta}>
            <Text style={styles.primaryCtaText}>Shop Kits</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => onShopPress()} style={styles.secondaryCta}>
            <Text style={styles.secondaryCtaText}>Browse Lookbook</Text>
          </Pressable>
        </View>
        <View style={styles.statsRow}>
          {heroStats.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrapper: {
    position: 'relative',
    minHeight: 520,
    borderRadius: 36,
    overflow: 'hidden',
    marginBottom: 48,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,4,13,0.6)',
  },
  heroContent: {
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 16,
    flex: 1,
  },
  tag: {
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.72)',
  },
  title: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: 600,
    color: '#f6f7ff',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    color: 'rgba(243,244,255,0.8)',
    maxWidth: 720,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  primaryCta: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    backgroundColor: '#58f2ff',
  },
  primaryCtaText: {
    color: '#05051a',
    fontSize: 16,
    fontWeight: 600,
  },
  secondaryCta: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(5,5,26,0.4)',
  },
  secondaryCtaText: {
    color: '#ecf2ff',
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
    marginTop: 12,
  },
  statCard: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(6,6,24,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    minWidth: 140,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 4,
    color: '#f5f7ff',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
  },
});
