'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import type { SignUpData } from '@/context/AuthContext';

const ROLE_OPTIONS: { value: SignUpData['role']; label: string }[] = [
  { value: 'vendor', label: 'Vendor' },
  { value: 'dealer', label: 'Dealer' },
  { value: 'user', label: 'Normal User' },
];

const INPUT_CLASS =
  'appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#00a550] focus:border-[#00a550] sm:text-sm';

const EMPTY_FORM = { name: '', mobile: '', email: '', role: '' };

export default function SignUpForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim() || !form.mobile.trim() || !form.email.trim() || !form.role) {
      return setError('Please fill in all fields');
    }

    const digits = form.mobile.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      return setError('Please enter a valid mobile number');
    }

    try {
      setLoading(true);
      const result = await signUp({
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        role: form.role as SignUpData['role'],
      });

      if (result.success) {
        setSuccess(result.message || 'Account created successfully.');
        setForm(EMPTY_FORM);
      } else {
        setError(result.message || 'Sign up failed');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to sign up. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 font-display flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10">
        <div className="text-center">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mx-auto mt-4" />
        </div>

        <form className="mt-8 space-y-7" onSubmit={handleSubmit} noValidate>
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div
              role="status"
              className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm"
            >
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className={INPUT_CLASS}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile number
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                inputMode="tel"
                required
                autoComplete="tel"
                value={form.mobile}
                onChange={handleChange}
                className={INPUT_CLASS}
                placeholder="Enter your mobile number"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className={INPUT_CLASS}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Account type
              </label>
              <select
                id="role"
                name="role"
                required
                value={form.role}
                onChange={handleChange}
                className={`${INPUT_CLASS} bg-white ${form.role ? '' : 'text-gray-500'}`}
              >
                <option value="" disabled>
                  Select account type
                </option>
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-gray-900">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white shadow-md bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00a550] disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-[#00a550] font-medium hover:underline">
              Log in
            </Link>
          </p>

          <div className="text-sm text-center">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
