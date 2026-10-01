'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/** Only allow same-site relative redirects (?next=/checkout). */
const safeNext = (value: string | null) =>
  value && value.startsWith('/') && !value.startsWith('//') ? value : '/account';

const INPUT_CLASS =
  'appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#00a550] focus:border-[#00a550] sm:text-sm';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get('next'));
  const justReset = searchParams.get('reset') === '1';
  const { login, verifyOTP, resendOTP, isAuthenticated, loading: authLoading } = useAuth();

  // Already signed in? Go straight on.
  useEffect(() => {
    if (!authLoading && isAuthenticated && !showOTPModal) router.replace(next);
  }, [authLoading, isAuthenticated, next, router, showOTPModal]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      return setError('Please fill in all fields');
    }

    try {
      setError('');
      setLoading(true);
      const result = await login(email, password);

      if (result.success) {
        if (result.requiresOTP) {
          setShowOTPModal(true);
          setLoading(false);
        } else {
          router.push(next);
        }
      } else {
        setError(result.message || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to log in. Please try again.'
      );
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setError('');
      setOtpLoading(true);
      const result = await verifyOTP(email, otpCode);

      if (result.success) {
        router.push(next);
      } else {
        setError(result.message || 'Invalid OTP');
        setOtpLoading(false);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Verification failed. Please try again.'
      );
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setError('');
      setNotice('');
      const result = await resendOTP(email);
      if (result.success) {
        setNotice('A new code has been sent to your email');
      } else {
        setError(result.message || 'Failed to resend code');
      }
    } catch {
      setError('Failed to resend code');
    }
  };

  const closeOTPModal = () => {
    setShowOTPModal(false);
    setOtpCode('');
    setError('');
    setNotice('');
  };

  return (
    <div className="flex-1 bg-gray-50 font-display flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10">
        <div className="text-center">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
            Sign in to your account
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mx-auto mt-4" />
        </div>

        <form className="mt-8 space-y-7" onSubmit={handleSubmit}>
          {justReset && !error && (
            <div role="status" className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
              Your password was reset. Please log in with your new password.
            </div>
          )}
          {error && !showOTPModal && (
            <div
              role="alert"
              className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLASS}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-[#00a550] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={INPUT_CLASS}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white shadow-md bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00a550] disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-sm text-center">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to home
            </Link>
          </div>

          <p className="text-sm text-center text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href={next !== '/account' ? `/signup?next=${encodeURIComponent(next)}` : '/signup'}
              className="text-[#00a550] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>

      {showOTPModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="otp-title"
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 id="otp-title" className="font-heading text-xl font-bold mb-4">
              Verify Your Email
            </h2>
            <p className="text-gray-600 mb-2 text-sm">
              We&apos;ve sent a 6-digit code to {email}
            </p>
            <p className="text-orange-600 bg-orange-50 p-3 rounded-lg mb-4 text-sm">
              ⚠️ Tip: If you don&apos;t see the email, please check your Spam or
              Junk folder as the verification code may have ended up there.
            </p>
            {error && (
              <div
                role="alert"
                className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm"
              >
                {error}
              </div>
            )}
            {notice && (
              <div
                role="status"
                className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm"
              >
                {notice}
              </div>
            )}
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-4">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:ring-[#00a550] focus:border-[#00a550]"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={otpLoading}
                className="w-full bg-gradient-to-r from-[#e9e611] to-[#00a34f] text-white py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
              >
                {otpLoading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
            <div className="mt-4 text-center text-sm">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-[#00a550] hover:underline"
              >
                Resend Code
              </button>{' '}
              |{' '}
              <button
                type="button"
                onClick={closeOTPModal}
                className="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
