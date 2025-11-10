'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from '@/types/store';

interface CartContextValue {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  addItem: (product: Product, size: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CART_KEY = 'fe_cart';
const SHIPPING_FLAT = 12;

const CartContext = createContext<CartContextValue | undefined>(undefined);

const readCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const payload = window.localStorage.getItem(CART_KEY);
    return payload ? (JSON.parse(payload) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const persistCart = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    persistCart(items);
  }, [items]);

  const addItem = useCallback((product: Product, size: string) => {
    setItems((prev) => {
      const next = [...prev];
      const existing = next.find((item) => item.productId === product.id && item.size === size);
      if (existing) {
        existing.quantity += 1;
        return [...next];
      }
      next.push({
        id: crypto.randomUUID(),
        productId: product.id,
        name: `${product.name} ${size}`,
        size,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
      return next;
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const shipping = items.length > 0 ? SHIPPING_FLAT : 0;
  const total = subtotal + shipping;

  const value = useMemo(
    () => ({ items, subtotal, shipping, total, addItem, updateQuantity, removeItem, clearCart }),
    [items, subtotal, shipping, total, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
