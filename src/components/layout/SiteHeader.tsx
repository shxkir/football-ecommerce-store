'use client';

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native-web';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';

interface NavItem {
  key: string;
  label: string;
  path: string;
}

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { items } = useCart();

  const navItems: NavItem[] = [
    { key: 'home', label: 'Home', path: '/' },
    { key: 'products', label: 'Products', path: '/products' },
  ];

  if (!user) {
    navItems.push({ key: 'register', label: 'Register', path: '/register' });
    navItems.push({ key: 'signin', label: 'Sign in', path: '/sign-in' });
  } else {
    navItems.push({ key: 'signout', label: 'Sign out', path: '/sign-out' });
  }

  navItems.push({ key: 'cart', label: `Cart · ${items.length}`, path: '/cart' });

  const handleNavigate = (path: string) => {
    if (pathname === path) {
      return;
    }
    router.push(path);
  };

  return (
    <header
      className="section-shell"
      style={{ paddingTop: 24, paddingBottom: 12, display: 'flex', justifyContent: 'center', width: '100%' }}
    >
      <View style={styles.navbarShell}>
        <View style={styles.navbar}>
          <Pressable accessibilityRole="link" onPress={() => handleNavigate('/')}>
            <Text style={styles.brand}>Liquid Ether FC</Text>
          </Pressable>
          <View style={styles.navLinks}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Pressable
                  key={item.key}
                  accessibilityRole="link"
                  onPress={() => handleNavigate(item.path)}
                  style={[styles.navLink, isActive && styles.navLinkActive]}
                >
                  <Text style={[styles.navLinkText, isActive && styles.navLinkTextActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.statusBubble}>
            <Text style={styles.statusText}>{user ? `Signed in as ${user.name ?? user.email ?? 'Member'}` : 'Guest Mode'}</Text>
          </View>
        </View>
      </View>
    </header>
  );
}

const styles = StyleSheet.create({
  navbarShell: {
    width: '100%',
  },
  navbar: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(5,5,20,0.65)',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  brand: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 1,
    color: '#fff',
  },
  navLinks: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: 1,
  },
  navLink: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  navLinkActive: {
    borderColor: '#58f2ff',
    backgroundColor: 'rgba(88,242,255,0.08)',
  },
  navLinkText: {
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
  },
  navLinkTextActive: {
    color: '#58f2ff',
  },
  statusBubble: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  statusText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
});
