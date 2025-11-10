'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';

type RegisterPayload = { fullName: string; email: string; password: string };

type AuthHook = {
  user: { id?: string; name?: string | null; email?: string | null } | null;
  loading: boolean;
  message: string | null;
  signInUser: (payload: { email: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  signUpUser: (payload: RegisterPayload) => Promise<{ ok: boolean; error?: string }>;
  signOutUser: () => Promise<void>;
};

export function useAuth(): AuthHook {
  const { data, status } = useSession();
  const [message, setMessage] = useState<string | null>(null);

  const signUpUser = useCallback(async ({ fullName, email, password }: RegisterPayload) => {
    setMessage(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const error = body?.message || 'Failed to create account';
        setMessage(error);
        return { ok: false, error };
      }
      setMessage('Account created. You can now sign in.');
      return { ok: true };
    } catch (error) {
      const fallback = error instanceof Error ? error.message : 'Unable to create account';
      setMessage(fallback);
      return { ok: false, error: fallback };
    }
  }, []);

  const signInUser = useCallback(async ({ email, password }: { email: string; password: string }) => {
    setMessage(null);
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setMessage(result.error);
      return { ok: false, error: result.error };
    }
    return { ok: true };
  }, []);

  const signOutUser = useCallback(async () => {
    setMessage(null);
    await signOut({ redirect: false });
  }, []);

  return {
    user: data?.user ?? null,
    loading: status === 'loading',
    message,
    signInUser,
    signUpUser,
    signOutUser,
  };
}
