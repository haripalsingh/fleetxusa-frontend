'use client';

import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, ApiError } from '@/lib/api';

const INPUT_CLASS =
  'appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#00a550] focus:border-[#00a550] sm:text-sm';
const BUTTON_CLASS =
  'w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-lg text-white shadow-md bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90 transition-opacity disabled:opacity-50';

const Shell = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="flex-1 bg-gray-50 font-display flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10">
      <div className="text-center">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
        <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mx-auto mt-4" />
      </div>
      {children}
    </div>
  </div>
);

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      const res = await api<null>('/auth/forgot-password', { method: 'POST', body: { email: email.trim() } });
      setMessage(res.message || 'Check your inbox for a reset link.');
    } catch (err) {
      setError(err instanceof ApiError ? err.firstError : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell title="Forgot your password?">
      <form onSubmit={submit} noValidate className="mt-8 space-y-6">
        <p className="text-sm text-gray-600">Enter the email for your account and we&apos;ll send you a link to reset your password.</p>
        {error && <div role="alert" className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">{error}</div>}
        {message && <div role="status" className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">{message}</div>}
        <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT_CLASS} placeholder="Enter your email" aria-label="Email address" />
        <button type="submit" disabled={loading} className={BUTTON_CLASS}>
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
        <p className="text-sm text-center">
          <Link href="/login" className="text-[#00a550] hover:underline">← Back to log in</Link>
        </p>
      </form>
    </Shell>
  );
}

export function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') ?? '';
  const email = params.get('email') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api('/auth/reset-password', {
        method: 'POST',
        body: { email, token, password, password_confirmation: confirm },
      });
      router.push('/login?reset=1');
    } catch (err) {
      setError(err instanceof ApiError ? err.firstError : 'Something went wrong.');
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <Shell title="Reset password">
        <p className="mt-8 text-sm text-gray-600 text-center">
          This reset link is incomplete.{' '}
          <Link href="/forgot-password" className="text-[#00a550] hover:underline">Request a new one</Link>.
        </p>
      </Shell>
    );
  }

  return (
    <Shell title="Choose a new password">
      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <p className="text-sm text-gray-600">For {email}</p>
        {error && <div role="alert" className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">{error}</div>}
        <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={INPUT_CLASS} placeholder="New password (8+ characters)" aria-label="New password" />
        <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={INPUT_CLASS} placeholder="Confirm new password" aria-label="Confirm new password" />
        <button type="submit" disabled={loading} className={BUTTON_CLASS}>
          {loading ? 'Saving…' : 'Reset password'}
        </button>
      </form>
    </Shell>
  );
}
