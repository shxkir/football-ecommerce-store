'use client';

import React from 'react';
import { AuthSection } from '@/components/sections/AuthSection';

export default function SignInPage() {
  return (
    <main>
      <AuthSection
        sectionLabel="Sign in"
        title="Return to your squads and saved carts."
        subtitle="Authenticate with the same Firebase-backed account to keep personalization and checkout details on standby."
        initialMode="signin"
        showModeToggle={false}
      />
    </main>
  );
}
