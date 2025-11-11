'use client';

import React from 'react';
import { AuthSection } from '@/components/sections/AuthSection';

export default function RegisterPage() {
  return (
    <main>
      <AuthSection
        sectionLabel="Register"
        title="Claim your Liquid Ether locker."
        subtitle="Create an account to save carts, personalize jerseys, and keep every drop synced across your devices."
        initialMode="signup"
        showModeToggle={false}
      />
    </main>
  );
}
