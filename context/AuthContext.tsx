'use client';

import React, { createContext, useContext } from 'react';

type AuthUser = { email: string };

type AuthResult = {
  success: boolean;
  message?: string;
  requiresOTP?: boolean;
};

export type SignUpData = {
  name: string;
  mobile: string;
  email: string;
  role: 'vendor' | 'dealer' | 'user';
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  verifyOTP: (email: string, otpCode: string) => Promise<AuthResult>;
  resendOTP: (email: string) => Promise<AuthResult>;
  signUp: (data: SignUpData) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const NOT_CONNECTED: AuthResult = {
  success: false,
  message: 'This is not connected to the backend yet.',
};

// Placeholder auth state (signed-out). Swap the provider value for the real
// auth/session logic once the backend is wired up — Header and the login page
// only rely on this shape.
const defaultValue: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  loading: false,
  login: async () => NOT_CONNECTED,
  verifyOTP: async () => NOT_CONNECTED,
  resendOTP: async () => NOT_CONNECTED,
  signUp: async () => NOT_CONNECTED,
  logout: async () => {},
};

const AuthContext = createContext<AuthContextValue>(defaultValue);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider value={defaultValue}>{children}</AuthContext.Provider>
);

export const useAuth = () => useContext(AuthContext);
