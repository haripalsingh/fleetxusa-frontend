'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import type { Address } from '@/lib/types';
import { Card, INPUT, PRIMARY_BTN, SECONDARY_BTN } from './AccountShell';

const EMPTY: Address = {
  label: '',
  full_name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  zip_code: '',
  country: 'United States',
  is_default: false,
};

const FIELDS: { key: keyof Address; label: string; full?: boolean; auto?: string }[] = [
  { key: 'label', label: 'Label (e.g. Shop, Yard)' },
  { key: 'full_name', label: 'Full name *', auto: 'name' },
  { key: 'phone', label: 'Phone *', auto: 'tel' },
  { key: 'address_line1', label: 'Address line 1 *', full: true, auto: 'address-line1' },
  { key: 'address_line2', label: 'Address line 2', full: true, auto: 'address-line2' },
  { key: 'city', label: 'City *', auto: 'address-level2' },
  { key: 'state', label: 'State *', auto: 'address-level1' },
  { key: 'zip_code', label: 'ZIP code *', auto: 'postal-code' },
];

export default function AccountAddresses() {
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [editing, setEditing] = useState<Address | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () =>
    api<Address[]>('/users/me/addresses')
      .then((res) => setAddresses(res.data))
      .catch(() => setAddresses([]));

  useEffect(() => {
    void load();
  }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setErrors({});
    try {
      const body = { ...editing };
      delete body.id;
      await api(editing.id ? `/users/me/addresses/${editing.id}` : '/users/me/addresses', {
        method: editing.id ? 'PUT' : 'POST',
        body,
      });
      setEditing(null);
      setMessage('Address saved.');
      await load();
    } catch (err) {
      if (err instanceof ApiError) setErrors({ ...err.errors, _: err.status === 422 ? '' : err.message });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (a: Address) => {
    if (!confirm('Delete this address?')) return;
    try {
      await api(`/users/me/addresses/${a.id}`, { method: 'DELETE' });
      setMessage('Address deleted.');
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not delete address.');
    }
  };

  if (editing) {
    return (
      <Card title={editing.id ? 'Edit address' : 'Add address'}>
        <form onSubmit={save} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {errors._ && <p className="sm:col-span-2 text-sm text-red-600">{errors._}</p>}
          {FIELDS.map((f) => (
            <label key={f.key} className={`block ${f.full ? 'sm:col-span-2' : ''}`}>
              <span className="block mb-1 text-sm text-gray-700">{f.label}</span>
              <input
                className={INPUT}
                autoComplete={f.auto}
                value={(editing[f.key] as string) ?? ''}
                onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
              />
              {errors[f.key] && <span className="mt-1 block text-xs text-red-600">{errors[f.key]}</span>}
            </label>
          ))}
          <label className="sm:col-span-2 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!editing.is_default}
              onChange={(e) => setEditing({ ...editing, is_default: e.target.checked })}
              className="h-4 w-4 accent-[#00a550]"
            />
            Use as my default shipping address
          </label>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className={PRIMARY_BTN} disabled={saving}>
              {saving ? 'Saving…' : 'Save address'}
            </button>
            <button type="button" className={SECONDARY_BTN} onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card
      title="My Addresses"
      action={
        <button type="button" className={PRIMARY_BTN} onClick={() => { setErrors({}); setEditing({ ...EMPTY }); }}>
          + Add address
        </button>
      }
    >
      {message && <p role="status" className="mb-4 text-sm text-green-700">{message}</p>}
      {addresses === null ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : addresses.length === 0 ? (
        <p className="text-sm text-gray-600">No saved addresses yet. Add one to check out faster.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <li key={a.id} className={`rounded-lg border p-4 text-sm ${a.is_default ? 'border-[#00a550]' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{a.label || 'Address'}</span>
                {a.is_default && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">Default</span>}
              </div>
              <p className="text-gray-700 leading-relaxed">
                {a.full_name}
                <br />
                {a.address_line1}
                {a.address_line2 ? `, ${a.address_line2}` : ''}
                <br />
                {a.city}, {a.state} {a.zip_code}
                <br />
                {a.phone}
              </p>
              <div className="mt-3 flex gap-4">
                <button type="button" className="text-[#00a550] hover:underline" onClick={() => { setErrors({}); setEditing({ ...a, address_line2: a.address_line2 ?? '', label: a.label ?? '' }); }}>
                  Edit
                </button>
                <button type="button" className="text-red-600 hover:underline" onClick={() => remove(a)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
