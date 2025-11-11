'use client';

import React from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native-web';
import { useCart } from '@/context/CartContext';

export function CartSection() {
  const { items, subtotal, shipping, total, updateQuantity, removeItem } = useCart();

  return (
    <section className="section-shell" id="cart">
      <View style={styles.shell}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.sectionLabel}>Your Cart</Text>
            <Text style={styles.sectionTitle}>Match bag overview</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Adjust sizes, quantity, or clear items before locking checkout.</Text>
        </View>
        {items.length === 0 ? (
          <Text style={styles.emptyState}>Your cart is empty — add a kit to start checkout.</Text>
        ) : (
          <View style={styles.cartList}>
            {items.map((item) => (
              <View key={item.id} style={styles.cartRow}>
                <Image source={{ uri: item.image }} style={styles.thumbnail} alt={`${item.name} preview`} />
                <View style={styles.itemCopy}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>Size {item.size}</Text>
                  <Text style={styles.itemMeta}>${item.price} · Premier dispatch</Text>
                </View>
                <View style={styles.qtyRow}>
                  <Pressable onPress={() => updateQuantity(item.id, item.quantity - 1)} style={styles.qtyButton}>
                    <Text style={styles.qtyButtonText}>-</Text>
                  </Pressable>
                  <TextInput
                    style={styles.qtyInput}
                    value={String(item.quantity)}
                    keyboardType="number-pad"
                    onChangeText={(val) => {
                      const parsed = parseInt(val, 10);
                      if (!Number.isNaN(parsed)) {
                        updateQuantity(item.id, parsed);
                      }
                    }}
                  />
                  <Pressable onPress={() => updateQuantity(item.id, item.quantity + 1)} style={styles.qtyButton}>
                    <Text style={styles.qtyButtonText}>+</Text>
                  </Pressable>
                </View>
                <Pressable onPress={() => removeItem(item.id)} style={styles.removeButton}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
        <View style={styles.totalsRow}>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={styles.totalValue}>${shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Projected Total</Text>
            <Text style={styles.grandTotal}>${total.toFixed(2)}</Text>
          </View>
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
    backgroundColor: 'rgba(5,5,22,0.7)',
    padding: 32,
    gap: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
    flexWrap: 'wrap',
  },
  sectionLabel: {
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.6)',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 600,
    color: '#f5f7ff',
  },
  sectionSubtitle: {
    flex: 1,
    color: 'rgba(233,236,255,0.75)',
  },
  emptyState: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    textAlign: 'center',
    color: 'rgba(233,236,255,0.65)',
  },
  cartList: {
    gap: 16,
    flexDirection: 'column',
  },
  cartRow: {
    borderRadius: 20,
    backgroundColor: 'rgba(12,12,39,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  thumbnail: {
    width: 82,
    height: 82,
    borderRadius: 16,
  },
  itemCopy: {
    flex: 1,
    minWidth: 180,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 600,
    color: '#f6f8ff',
  },
  itemMeta: {
    color: 'rgba(233,236,255,0.6)',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  qtyInput: {
    width: 48,
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    color: '#fff',
    paddingVertical: 6,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  removeText: {
    color: 'rgba(255,255,255,0.7)',
  },
  totalsRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
    gap: 8,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: 'rgba(233,236,255,0.7)',
  },
  totalValue: {
    fontWeight: 600,
    color: '#f6f7ff',
  },
  grandTotal: {
    fontSize: 20,
    fontWeight: 700,
    color: '#58f2ff',
  },
});
