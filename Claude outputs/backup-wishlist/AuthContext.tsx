'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, ApiError, browserStorage, getAuthToken, setAuthToken } from '@/lib/api';
import { mergeGuestCart, refreshCart, resetCart } from '@/lib/cart';
import type { User } from '@/lib/types';

type AuthResult = {
  success: boolean;
  message?: string;
  requiresOTP?: boolean;
  errors?: Record<string, string>;
};

export type SignUpData = {
  name: string;
  mobile: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'dealer' | 'user';
  /** required when role is 'dealer' */
  company_name?: string;
  newsletter?: boolean;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  verifyOTP: (email: string, otpCode: string) => Promise<AuthResult>;
  resendOTP: (email: string) => Promise<AuthResult>;
  signUp: (data: SignUpData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  /** Replace the session after a password change or profile update. */
  setSession: (token: string | null, user: User | null) => void;
  refreshUser: () => Promise<void>;
};

const USER_KEY = 'fx_user';

const fail = (err: unknown): AuthResult =>
  err instanceof ApiError
    ? { success: false, message: err.status === 422 ? err.firstError : err.message, errors: err.errors }
    : { success: false, message: 'Something went wrong. Please try again.' };

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setSession = useCallback((token: string | null, next: User | null) => {
    setAuthToken(token);
    browserStorage.set(USER_KEY, next ? JSON.stringify(next) : null);
    setUser(next);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api<User>('/users/me');
      browserStorage.set(USER_KEY, JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setSession(null, null);
    }
  }, [setSession]);

  // Restore the session after mount (cached user shows instantly, then is verified).
  // Reading localStorage must happen after hydration, so these setState calls are intentional.
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    try {
      const cached = browserStorage.get(USER_KEY);
      if (cached) setUser(JSON.parse(cached));
    } catch {
      /* ignore bad cache */
    }
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  // Any API call that gets a 401 while we think we're logged in ends the session.
  useEffect(() => {
    const onUnauthorized = () => {
      setSession(null, null);
      void resetCart();
    };
    window.addEventListener('fx:unauthorized', onUnauthorized);
    return () => window.removeEventListener('fx:unauthorized', onUnauthorized);
  }, [setSession]);

  const completeLogin = useCallback(
    async (token: string, next: User) => {
      setSession(token, next);
      await mergeGuestCart();
    },
    [setSession]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        const res = await api<{ token?: string; user?: User; requires_otp?: boolean }>('/auth/login', {
          method: 'POST',
          body: { email, password },
        });
        if (res.data.requires_otp) return { success: true, requiresOTP: true, message: res.message };
        await completeLogin(res.data.token!, res.data.user!);
        return { success: true };
      } catch (err) {
        return fail(err);
      }
    },
    [completeLogin]
  );

  const verifyOTP = useCallback(
    async (email: string, code: string): Promise<AuthResult> => {
      try {
        const res = await api<{ token: string; user: User }>('/auth/verify-otp', {
          method: 'POST',
          body: { email, code },
        });
        await completeLogin(res.data.token, res.data.user);
        return { success: true };
      } catch (err) {
        return fail(err);
      }
    },
    [completeLogin]
  );

  const resendOTP = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      const res = await api<null>('/auth/resend-otp', { method: 'POST', body: { email } });
      return { success: true, message: res.message };
    } catch (err) {
      return fail(err);
    }
  }, []);

  const signUp = useCallback(
    async (data: SignUpData): Promise<AuthResult> => {
      try {
        const res = await api<{ token: string; user: User }>('/auth/register', { method: 'POST', body: data });
        await completeLogin(res.data.token, res.data.user);
        return { success: true, message: res.message };
      } catch (err) {
        return fail(err);
      }
    },
    [completeLogin]
  );

  const logout = useCallback(async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {
      /* token may already be invalid */
    }
    setSession(null, null);
    await resetCart();
  }, [setSession]);

  // keep cart in sync with auth changes
  useEffect(() => {
    if (!loading) void refreshCart();
  }, [loading, user?.id]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      verifyOTP,
      resendOTP,
      signUp,
      logout,
      setSession,
      refreshUser,
    }),
    [user, loading, login, verifyOTP, resendOTP, signUp, logout, setSession, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
