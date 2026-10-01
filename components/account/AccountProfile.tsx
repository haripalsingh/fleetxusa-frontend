'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { User } from '@/lib/types';
import { Card, INPUT, PRIMARY_BTN } from './AccountShell';

export function ProfileForm() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [mobile, setMobile] = useState(user?.mobile ?? '');
  const [newsletter, setNewsletter] = useState(!!user?.newsletter);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage('');
    try {
      await api<User>('/users/me', { method: 'PUT', body: { name: name.trim(), mobile: mobile.trim(), newsletter } });
      await refreshUser();
      setMessage('Profile updated.');
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.status === 422 ? err.errors : { _: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Profile">
      <form onSubmit={submit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {message && <p role="status" className="sm:col-span-2 text-sm text-green-700">{message}</p>}
        {errors._ && <p className="sm:col-span-2 text-sm text-red-600">{errors._}</p>}
        <label className="block">
          <span className="block mb-1 text-sm text-gray-700">Full name</span>
          <input className={INPUT} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name}</span>}
        </label>
        <label className="block">
          <span className="block mb-1 text-sm text-gray-700">Mobile number</span>
          <input className={INPUT} value={mobile} onChange={(e) => setMobile(e.target.value)} autoComplete="tel" />
          {errors.mobile && <span className="mt-1 block text-xs text-red-600">{errors.mobile}</span>}
        </label>
        <label className="block sm:col-span-2">
          <span className="block mb-1 text-sm text-gray-700">Email</span>
          <input className={`${INPUT} bg-gray-100`} value={user?.email ?? ''} readOnly />
          <span className="mt-1 block text-xs text-gray-500">Contact support to change your email address.</span>
        </label>
        <label className="sm:col-span-2 flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="h-4 w-4 accent-[#00a550]" />
          Send me deals and new product updates
        </label>
        <div className="sm:col-span-2">
          <button className={PRIMARY_BTN} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </Card>
  );
}

export function PasswordForm() {
  const { setSession } = useAuth();
  const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: 'Passwords do not match.' });
      return;
    }
    setSaving(true);
    try {
      const res = await api<{ token: string; user: User }>('/users/me/password', { method: 'PUT', body: form });
      setSession(res.data.token, res.data.user); // other devices are signed out, this one stays in
      setForm({ current_password: '', password: '', password_confirmation: '' });
      setMessage('Password changed. You have been signed out on other devices.');
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.status === 422 ? err.errors : { _: err.message });
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof typeof form, label: string, auto: string) => (
    <label className="block">
      <span className="block mb-1 text-sm text-gray-700">{label}</span>
      <input
        type="password"
        className={INPUT}
        autoComplete={auto}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
      {errors[key] && <span className="mt-1 block text-xs text-red-600">{errors[key]}</span>}
    </label>
  );

  return (
    <Card title="Change Password">
      <form onSubmit={submit} noValidate className="grid gap-4 max-w-md">
        {message && <p role="status" className="text-sm text-green-700">{message}</p>}
        {errors._ && <p className="text-sm text-red-600">{errors._}</p>}
        {field('current_password', 'Current password', 'current-password')}
        {field('password', 'New password (8+ characters, a letter and a number)', 'new-password')}
        {field('password_confirmation', 'Confirm new password', 'new-password')}
        <div>
          <button className={PRIMARY_BTN} disabled={saving}>
            {saving ? 'Saving…' : 'Update password'}
          </button>
        </div>
      </form>
    </Card>
  );
}
