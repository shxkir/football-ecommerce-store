'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native-web';
import { kits } from '@/data/kits';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types/store';
import { SmoothPressable } from '@/components/ui/SmoothPressable';

export function StoreSection() {
  const { addItem } = useCart();
  const [sizeSelections, setSizeSelections] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const products = useMemo(() => kits, []);

  const handleSelectSize = (productId: string, size: string) => {
    setSizeSelections((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: Product) => {
    const chosenSize = sizeSelections[product.id] ?? product.sizes[0];
    addItem(product, chosenSize);
    setFeedback(`Added ${product.name} · ${chosenSize} to cart`);
  };

  useEffect(() => {
    if (!feedback) {
      return;
    }
    const timeout = setTimeout(() => setFeedback(null), 2600);
    return () => clearTimeout(timeout);
  }, [feedback]);

  return (
    <section className="section-shell" id="store">
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionLabel}>Matchday Store</Text>
          <Text style={styles.sectionTitle}>Fresh kits, match-engineered.</Text>
        </View>
        <Text style={styles.sectionSubtitle}>Layered fabric stories, limited federation drops, and curated badge tiers.</Text>
      </View>
      {feedback && (
        <View style={styles.feedbackOverlay} pointerEvents="box-none">
          <View style={styles.feedbackToast} accessibilityLiveRegion="polite">
            <Text style={styles.feedbackTitle}>Added to cart</Text>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        </View>
      )}
      <div className="store-grid">
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.imageShell}>
              <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" alt={`${product.name} kit`} />
              <View style={styles.badgeStack}>
                <Text style={styles.badgeText}>{product.badge}</Text>
                {product.limited && <Text style={styles.limitedTag}>Limited</Text>}
              </View>
            </View>
            <View style={styles.productBody}>
              <Text style={styles.productClub}>{product.club}</Text>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productSeason}>{product.season} drop</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <View style={styles.paletteRow}>
                {product.colors.map((color) => (
                  <View key={color} style={[styles.swatch, { backgroundColor: color }]} />
                ))}
              </View>
              <View style={styles.sizeRow}>
                {product.sizes.map((size) => {
                  const active = (sizeSelections[product.id] ?? product.sizes[0]) === size;
                  return (
                    <Pressable key={size} onPress={() => handleSelectSize(product.id, size)} style={[styles.sizePill, active && styles.sizePillActive]}>
                      <Text style={[styles.sizeText, active && styles.sizeTextActive]}>{size}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.price}>${product.price}</Text>
                <SmoothPressable wrapperStyle={styles.addButtonWrapper} style={styles.addButton} onPress={() => handleAddToCart(product)}>
                  <Text style={styles.addButtonText}>Add to cart</Text>
                </SmoothPressable>
              </View>
            </View>
          </View>
        ))}
      </div>
    </section>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  feedbackOverlay: {
    position: 'fixed',
    bottom: 32,
    right: 0,
    left: 0,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
    zIndex: 50,
    pointerEvents: 'none',
  },
  feedbackToast: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(88,242,255,0.35)',
    backgroundColor: 'rgba(5,25,40,0.94)',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 4,
    shadowColor: '#030b12',
    shadowOpacity: 0.65,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    pointerEvents: 'auto',
  },
  feedbackTitle: {
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.55)',
  },
  feedbackText: {
    color: '#58f2ff',
    fontWeight: 600,
    fontSize: 15,
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 34,
    fontWeight: 600,
    color: '#f5f7ff',
  },
  sectionSubtitle: {
    flex: 1,
    minWidth: 240,
    color: 'rgba(235,240,255,0.72)',
    lineHeight: 22,
  },
  productCard: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(5,5,20,0.85)',
    flexDirection: 'column',
  },
  imageShell: {
    height: 220,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  badgeStack: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeText: {
    backgroundColor: 'rgba(5,5,20,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#f6f8ff',
  },
  limitedTag: {
    backgroundColor: 'rgba(255,97,186,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    color: '#05051a',
  },
  productBody: {
    padding: 20,
    gap: 10,
  },
  productClub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
  },
  productName: {
    fontSize: 24,
    fontWeight: 600,
    color: '#f5f7ff',
  },
  productSeason: {
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 2,
  },
  productDescription: {
    color: 'rgba(235,240,255,0.75)',
    lineHeight: 20,
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 8,
  },
  swatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  sizePill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  sizePillActive: {
    borderColor: '#58f2ff',
    backgroundColor: 'rgba(88,242,255,0.08)',
  },
  sizeText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
  },
  sizeTextActive: {
    color: '#58f2ff',
    fontWeight: 600,
  },
  cardFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 22,
    fontWeight: 600,
    color: '#f5f7ff',
  },
  addButtonWrapper: {
    borderRadius: 16,
    shadowColor: '#ec66ff',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  addButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#ec66ff',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#05051a',
  },
});
