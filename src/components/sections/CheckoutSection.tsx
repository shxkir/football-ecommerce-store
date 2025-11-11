'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native-web';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import type { ShippingDetails } from '@/types/store';

type StatusLink = { url: string; label: string };

const initialForm: ShippingDetails = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  paymentMethod: 'Apple Pay',
  deliveryNotes: '',
  jerseyName: '',
  jerseyNumber: '',
};

export function CheckoutSection() {
  const { user } = useAuth();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const [form, setForm] = useState<ShippingDetails>(initialForm);
  const [status, setStatus] = useState<string | null>(null);
  const [statusLink, setStatusLink] = useState<StatusLink | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      fullName: user?.name ?? prev.fullName,
      email: user?.email ?? prev.email,
    }));
  }, [user]);

  const handleChange = (key: keyof ShippingDetails, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateStatus = (message: string | null, link?: StatusLink) => {
    setStatus(message);
    setStatusLink(link ?? null);
  };

  const handleStatusLinkPress = useCallback(() => {
    if (!statusLink?.url) {
      return;
    }
    if (typeof window !== 'undefined') {
      window.open(statusLink.url, '_blank', 'noopener,noreferrer');
    }
  }, [statusLink]);

  const handleSubmit = async () => {
    updateStatus(null);
    if (!user) {
      updateStatus('Please sign in to place an order.');
      return;
    }
    if (items.length === 0) {
      updateStatus('Add at least one kit to your cart.');
      return;
    }
    if (!form.address || !form.city || !form.country) {
      updateStatus('Fill out your shipping details.');
      return;
    }

    setSubmitting(true);
    try {
      const safeUser = {
        id: user.id ?? 'unknown',
        fullName: form.fullName || user.name || 'Football Insider',
        email: user.email ?? form.email,
      };
      const payload = {
        user: safeUser,
        items,
        totals: { subtotal, shipping, total },
        shipping: form,
        placedAt: new Date().toISOString(),
      };
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error((data && typeof data.message === 'string' && data.message) || 'Unable to sync order.');
      }
      const successMessage = (data && typeof data.message === 'string' && data.message) || 'Order synced to Google Sheets ✔';
      const sheetUrl = data && typeof data.sheetUrl === 'string' ? data.sheetUrl : null;
      const adminReviewUrl = data && typeof data.adminReviewUrl === 'string' ? data.adminReviewUrl : null;
      const link: StatusLink | undefined = sheetUrl
        ? { url: sheetUrl, label: 'Open Google Sheet' }
        : adminReviewUrl
          ? { url: adminReviewUrl, label: 'Review stored orders' }
          : undefined;
      updateStatus(successMessage, link);
      clearCart();
    } catch (error) {
      updateStatus(error instanceof Error ? error.message : 'Unexpected error while creating order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-shell">
      <View style={styles.shell}>
        <View style={styles.copyBlock}>
          <Text style={styles.sectionLabel}>Checkout</Text>
          <Text style={styles.title}>Personalize & sync straight to your Google Sheet.</Text>
          <Text style={styles.subtitle}>
            When you confirm, the payload (user, cart, totals, shipping) is appended to your configured Google Sheet via a Service
            Account. Perfect for tracking real drops or mock data.
          </Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryTotal}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Shipping</Text>
          <TextInput style={styles.input} placeholder="Full name" value={form.fullName} onChangeText={(text) => handleChange('fullName', text)} placeholderTextColor="rgba(255,255,255,0.5)" />
          <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={(text) => handleChange('email', text)} placeholderTextColor="rgba(255,255,255,0.5)" />
          <TextInput style={styles.input} placeholder="Phone" keyboardType="phone-pad" value={form.phone} onChangeText={(text) => handleChange('phone', text)} placeholderTextColor="rgba(255,255,255,0.5)" />
          <TextInput style={styles.input} placeholder="Street address" value={form.address} onChangeText={(text) => handleChange('address', text)} placeholderTextColor="rgba(255,255,255,0.5)" />
          <View style={styles.inlineRow}>
            <TextInput style={[styles.input, styles.inlineInput]} placeholder="City" value={form.city} onChangeText={(text) => handleChange('city', text)} placeholderTextColor="rgba(255,255,255,0.5)" />
            <TextInput style={[styles.input, styles.inlineInput]} placeholder="Country" value={form.country} onChangeText={(text) => handleChange('country', text)} placeholderTextColor="rgba(255,255,255,0.5)" />
          </View>
          <TextInput style={styles.input} placeholder="Payment method (Apple Pay, Visa, etc.)" value={form.paymentMethod} onChangeText={(text) => handleChange('paymentMethod', text)} placeholderTextColor="rgba(255,255,255,0.5)" />
          <View style={styles.inlineRow}>
            <TextInput style={[styles.input, styles.inlineInput]} placeholder="Jersey name" value={form.jerseyName} onChangeText={(text) => handleChange('jerseyName', text)} placeholderTextColor="rgba(255,255,255,0.5)" />
            <TextInput style={[styles.input, styles.inlineInput]} placeholder="Number" keyboardType="number-pad" value={form.jerseyNumber} onChangeText={(text) => handleChange('jerseyNumber', text)} placeholderTextColor="rgba(255,255,255,0.5)" />
          </View>
          <TextInput
            style={[styles.input, styles.notes]}
            placeholder="Delivery notes"
            multiline
            numberOfLines={3}
            value={form.deliveryNotes}
            onChangeText={(text) => handleChange('deliveryNotes', text)}
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
          <Pressable accessibilityRole="button" onPress={handleSubmit} disabled={submitting} style={[styles.submitButton, submitting && styles.submitDisabled]}>
            <Text style={styles.submitText}>{submitting ? 'Syncing…' : 'Place order'}</Text>
          </Pressable>
          {status && <Text style={styles.status}>{status}</Text>}
          {statusLink && (
            <Pressable accessibilityRole="link" onPress={handleStatusLinkPress} style={styles.statusLinkButton}>
              <Text style={styles.statusLinkText}>{statusLink.label}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </section>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: 32,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(5,5,19,0.75)',
    padding: 32,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  copyBlock: {
    flex: 1,
    minWidth: 260,
    gap: 16,
  },
  sectionLabel: {
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.55)',
  },
  title: {
    fontSize: 32,
    fontWeight: 600,
    color: '#f5f7ff',
  },
  subtitle: {
    color: 'rgba(233,236,255,0.7)',
    lineHeight: 22,
    maxWidth: 460,
  },
  summaryCard: {
    marginTop: 12,
    padding: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(12,12,39,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 12,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: 'rgba(233,236,255,0.75)',
  },
  summaryValue: {
    fontWeight: 600,
    color: '#f6f8ff',
  },
  summaryTotal: {
    fontSize: 22,
    fontWeight: 700,
    color: '#58f2ff',
  },
  formCard: {
    flex: 1,
    minWidth: 280,
    borderRadius: 32,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(12,12,36,0.75)',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 4,
    color: '#f5f7ff',
  },
  input: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 15,
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inlineInput: {
    flex: 1,
  },
  notes: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: '#58f2ff',
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#05051a',
    fontWeight: 700,
    fontSize: 16,
  },
  status: {
    marginTop: 8,
    color: '#fedf76',
  },
  statusLinkButton: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(88,242,255,0.5)',
  },
  statusLinkText: {
    color: '#58f2ff',
    fontWeight: 600,
  },
});
