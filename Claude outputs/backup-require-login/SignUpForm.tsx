'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { SignUpData } from '@/context/AuthContext';

const ROLE_OPTIONS: { value: SignUpData['role']; label: string }[] = [
  { value: 'user', label: 'Normal User' },
  { value: 'dealer', label: 'Dealer' },
];

const INPUT_CLASS =
  'appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#00a550] focus:border-[#00a550] sm:text-sm';

const EMPTY_FORM = { name: '', mobile: '', email: '', role: '', password: '', password_confirmation: '', company_name: '' };
type FormKey = keyof typeof EMPTY_FORM;

const safeNext = (value: string | null) =>
  value && value.startsWith('/') && !value.startsWith('//') ? value : '/account';

export default function SignUpForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FormKey, string>>>({});
  const [loading, setLoading] = useState(false);
  const { signUp, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace(next);
  }, [authLoading, isAuthenticated, next, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errs: Partial<Record<FormKey, string>> = {};
    if (form.name.trim().length < 2) errs.name = 'Please enter your full name';
    const digits = form.mobile.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) errs.mobile = 'Please enter a valid mobile number';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = 'Please enter a valid email address';
    if (!form.role) errs.role = 'Please choose an account type';
    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))
      errs.password = 'At least 8 characters with a letter and a number';
    if (form.password !== form.password_confirmation) errs.password_confirmation = 'Passwords do not match';
    if (form.role === 'dealer' && form.company_name.trim().length < 2) errs.company_name = 'Please enter your company name';
    return errs;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    const result = await signUp({
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      role: form.role as SignUpData['role'],
      password: form.password,
      password_confirmation: form.password_confirmation,
      ...(form.role === 'dealer' ? { company_name: form.company_name.trim() } : {}),
    });
    setLoading(false);

    if (result.success) {
      router.push(next);
    } else {
      setError(result.message || 'Sign up failed');
      if (result.errors) setFieldErrors(result.errors as Partial<Record<FormKey, string>>);
    }
  };

  const fieldError = (k: FormKey) =>
    fieldErrors[k] ? <p className="mt-1 text-xs text-red-600">{fieldErrors[k]}</p> : null;

  return (
    <div className="flex-1 bg-gray-50 font-display flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10">
        <div className="text-center">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">Create your account</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mx-auto mt-4" />
        </div>

        <form className="mt-8 space-y-7" onSubmit={handleSubmit} noValidate>
          {error && (
            <div role="alert" className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input id="name" name="name" type="text" required autoComplete="name" value={form.name} onChange={handleChange} className={INPUT_CLASS} placeholder="Enter your name" />
              {fieldError('name')}
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile number
              </label>
              <input id="mobile" name="mobile" type="tel" inputMode="tel" required autoComplete="tel" value={form.mobile} onChange={handleChange} className={INPUT_CLASS} placeholder="Enter your mobile number" />
              {fieldError('mobile')}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input id="email" name="email" type="email" required autoComplete="email" value={form.email} onChange={handleChange} className={INPUT_CLASS} placeholder="Enter your email" />
              {fieldError('email')}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input id="password" name="password" type="password" required autoComplete="new-password" value={form.password} onChange={handleChange} className={INPUT_CLASS} placeholder="At least 8 characters" />
              {fieldError('password')}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <input id="password_confirmation" name="password_confirmation" type="password" required autoComplete="new-password" value={form.password_confirmation} onChange={handleChange} className={INPUT_CLASS} placeholder="Repeat your password" />
              {fieldError('password_confirmation')}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Account type
              </label>
              <select id="role" name="role" required value={form.role} onChange={handleChange} className={`${INPUT_CLASS} bg-white ${form.role ? '' : 'text-gray-500'}`}>
                <option value="" disabled>
                  Select account type
                </option>
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-gray-900">
                    {opt.label}
                  </option>
                ))}
              </select>
              {fieldError('role')}
            </div>

            {form.role === 'dealer' && (
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                  {/* Company name <span className="text-red-600">*</span> */}
                </label>
                <input id="company_name" name="company_name" type="text" required autoComplete="organization" value={form.company_name} onChange={handleChange} className={INPUT_CLASS} placeholder="Enter your company name" />
                {fieldError('company_name')}
              </div>
            )}
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
            <Link href={next !== '/account' ? `/login?next=${encodeURIComponent(next)}` : '/login'} className="text-[#00a550] font-medium hover:underline">
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
