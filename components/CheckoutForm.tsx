'use client';

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import Link from 'next/link';
import { formatMoney, useCart } from '@/lib/cart';

type Step = 'customer' | 'shipping' | 'billing' | 'payment';
const ORDER: Step[] = ['customer', 'shipping', 'billing', 'payment'];

type Address = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

const EMPTY_ADDRESS: Address = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
};

const SHIPPING_FLAT_RATE = 15; // same flat rate the React checkout uses

const INPUT =
  'w-full h-[42px] border border-gray-400 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:border-[#00a550] focus:ring-1 focus:ring-[#00a550]';
const BTN =
  'h-[42px] px-8 bg-[#444] text-white text-sm font-medium uppercase hover:bg-black transition-colors';

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) => (
  <label className="block">
    <span className="block mb-1 text-sm text-gray-700">{label}</span>
    {children}
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);

const Section = ({
  title,
  active,
  done,
  summary,
  onEdit,
  children,
}: {
  title: string;
  active: boolean;
  done: boolean;
  summary?: ReactNode;
  onEdit: () => void;
  children: ReactNode;
}) => (
  <section className="border-t border-gray-300 py-6 first:border-t-0">
    <div className="flex items-baseline justify-between gap-4">
      <h2 className={`text-2xl font-bold ${active || done ? 'text-gray-900' : 'text-gray-800'}`}>
        {title}
      </h2>
      {done && !active && (
        <button type="button" onClick={onEdit} className="text-sm text-[#00a550] hover:underline">
          Edit
        </button>
      )}
    </div>
    {done && !active && summary && <div className="mt-3 text-sm text-gray-700">{summary}</div>}
    {active && <div className="mt-6">{children}</div>}
  </section>
);

const AddressForm = ({
  value,
  onChange,
  errors,
}: {
  value: Address;
  onChange: (next: Address) => void;
  errors: Partial<Record<keyof Address, string>>;
}) => {
  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [k]: e.target.value });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Full Name *" error={errors.fullName}>
        <input className={INPUT} value={value.fullName} onChange={set('fullName')} autoComplete="name" />
      </Field>
      <Field label="Phone Number *" error={errors.phone}>
        <input className={INPUT} type="tel" value={value.phone} onChange={set('phone')} autoComplete="tel" />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Address Line 1 *" error={errors.addressLine1}>
          <input className={INPUT} value={value.addressLine1} onChange={set('addressLine1')} autoComplete="address-line1" />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Address Line 2 (Optional)">
          <input className={INPUT} value={value.addressLine2} onChange={set('addressLine2')} autoComplete="address-line2" />
        </Field>
      </div>
      <Field label="City *" error={errors.city}>
        <input className={INPUT} value={value.city} onChange={set('city')} autoComplete="address-level2" />
      </Field>
      <Field label="State *" error={errors.state}>
        <input className={INPUT} value={value.state} onChange={set('state')} autoComplete="address-level1" />
      </Field>
      <Field label="ZIP Code *" error={errors.zipCode}>
        <input className={INPUT} value={value.zipCode} onChange={set('zipCode')} autoComplete="postal-code" />
      </Field>
      <Field label="Country">
        <input className={`${INPUT} bg-gray-100`} value={value.country} readOnly />
      </Field>
    </div>
  );
};

const validateAddress = (a: Address) => {
  const e: Partial<Record<keyof Address, string>> = {};
  if (!a.fullName.trim()) e.fullName = 'Full name is required';
  if (!a.phone.trim()) e.phone = 'Phone number is required';
  if (!a.addressLine1.trim()) e.addressLine1 = 'Address is required';
  if (!a.city.trim()) e.city = 'City is required';
  if (!a.state.trim()) e.state = 'State is required';
  if (!a.zipCode.trim()) e.zipCode = 'ZIP code is required';
  return e;
};

const AddressSummary = ({ a }: { a: Address }) => (
  <p className="leading-relaxed">
    {a.fullName}
    <br />
    {a.addressLine1}
    {a.addressLine2 ? `, ${a.addressLine2}` : ''}
    <br />
    {a.city}, {a.state} {a.zipCode}
    <br />
    {a.phone}
  </p>
);

export default function CheckoutForm() {
  const { items, ready, subtotal, count } = useCart();

  const [step, setStep] = useState<Step>('customer');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  const [shipping, setShipping] = useState<Address>(EMPTY_ADDRESS);
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof Address, string>>>({});
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billing, setBilling] = useState<Address>(EMPTY_ADDRESS);
  const [billingErrors, setBillingErrors] = useState<Partial<Record<keyof Address, string>>>({});
  const [coupon, setCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [placed, setPlaced] = useState(false);

  const reached = (s: Step) => ORDER.indexOf(step) > ORDER.indexOf(s);
  const shippingCost = reached('shipping') ? SHIPPING_FLAT_RATE : null;
  const tax = 0;
  const total = subtotal + (shippingCost ?? 0) + tax;

  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setStep('shipping');
  };

  const submitShipping = (e: FormEvent) => {
    e.preventDefault();
    const errs = validateAddress(shipping);
    setShippingErrors(errs);
    if (Object.keys(errs).length === 0) setStep('billing');
  };

  const submitBilling = (e: FormEvent) => {
    e.preventDefault();
    if (!sameAsShipping) {
      const errs = validateAddress(billing);
      setBillingErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    setStep('payment');
  };

  if (!ready) {
    return <div className="min-h-[60vh] bg-white" />;
  }

  if (items.length === 0) {
    return (
      <div className="w-full bg-white font-display">
        <div className="max-w-[700px] mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add a few parts to your cart before checking out.</p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 text-sm font-bold uppercase text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90"
          >
            Shop Parts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white font-display">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_480px] gap-10 lg:gap-16">
          {/* ---------------- Left: steps ---------------- */}
          <div className="max-w-[860px] w-full">
            <h1 className="sr-only">Checkout</h1>

            <Section
              title="Customer"
              active={step === 'customer'}
              done={reached('customer')}
              summary={<p>{email}</p>}
              onEdit={() => setStep('customer')}
            >
              <form onSubmit={submitEmail} noValidate>
                <label htmlFor="checkout-email" className="block mb-1 text-sm text-gray-700">
                  Email
                </label>
                <div className="flex flex-col xl:flex-row gap-4 xl:items-start">
                  <div className="flex-1 min-w-0">
                    <input
                      id="checkout-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className={`${INPUT} h-[42px]`}
                    />
                    {emailError && <span className="mt-1 block text-xs text-red-600">{emailError}</span>}
                  </div>
                  <button type="submit" className={`${BTN} xl:w-[338px]`}>
                    Continue
                  </button>
                </div>

                <label className="mt-5 flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="h-4 w-4 accent-[#00a550]"
                  />
                  Subscribe to our newsletter.
                </label>
                <p className="mt-4 text-sm text-gray-700">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#00a550] hover:underline">
                    Sign in now
                  </Link>
                </p>
              </form>
            </Section>

            <Section
              title="Shipping"
              active={step === 'shipping'}
              done={reached('shipping')}
              summary={<AddressSummary a={shipping} />}
              onEdit={() => setStep('shipping')}
            >
              <form onSubmit={submitShipping} noValidate>
                <AddressForm value={shipping} onChange={setShipping} errors={shippingErrors} />
                <button type="submit" className={`${BTN} mt-6`}>
                  Continue
                </button>
              </form>
            </Section>

            <Section
              title="Billing"
              active={step === 'billing'}
              done={reached('billing')}
              summary={sameAsShipping ? <p>Same as shipping address</p> : <AddressSummary a={billing} />}
              onEdit={() => setStep('billing')}
            >
              <form onSubmit={submitBilling} noValidate>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="h-4 w-4 accent-[#00a550]"
                  />
                  My billing address is the same as my shipping address.
                </label>
                {!sameAsShipping && (
                  <div className="mt-5">
                    <AddressForm value={billing} onChange={setBilling} errors={billingErrors} />
                  </div>
                )}
                <button type="submit" className={`${BTN} mt-6`}>
                  Continue
                </button>
              </form>
            </Section>

            <Section
              title="Payment"
              active={step === 'payment'}
              done={false}
              onEdit={() => setStep('payment')}
            >
              <div className="border border-gray-300 p-4 flex items-center gap-3">
                <input type="radio" checked readOnly className="h-4 w-4 accent-[#00a550]" aria-label="Credit or debit card" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Credit / Debit Card</p>
                  <p className="text-xs text-gray-500">Pay securely with Stripe</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Card entry will appear here once Stripe is connected.
              </p>
              <button
                type="button"
                onClick={() => setPlaced(true)}
                className="mt-6 h-[46px] w-full sm:w-auto px-10 text-sm font-bold uppercase text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90 transition-opacity"
              >
                Place Order
              </button>
              {placed && (
                <p role="status" className="mt-4 border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-900">
                  Payments aren&apos;t connected yet, so no order was placed. This page is the checkout layout only.
                </p>
              )}
            </Section>
          </div>

          {/* ---------------- Right: order summary ---------------- */}
          <aside className="self-start w-full lg:sticky lg:top-4 border border-gray-300 bg-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-300">
              <h2 className="text-base text-gray-900">Order Summary</h2>
              <Link href="/cart" className="text-sm text-[#00a550] hover:underline">
                Edit Cart
              </Link>
            </div>

            <div className="px-5 py-5">
              <p className="text-sm text-gray-700 mb-4">
                {count} Item{count !== 1 ? 's' : ''}
              </p>
              <ul className="space-y-6">
                {items.map((item) => (
                  <li key={`${item.id}-${item.option ?? ''}`} className="grid grid-cols-[90px_1fr_auto] gap-4">
                    <div className="h-[80px] w-[90px] flex items-center justify-center">
                      <img
                        src={item.image_url || '/images/fleet-x-icon.png'}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="text-sm text-gray-900 min-w-0">
                      <p>
                        {item.quantity} x {item.name}
                      </p>
                      {item.option && (
                        <p className="mt-1 text-xs text-gray-500">Option: {item.option}</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-900">{formatMoney(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="border-t border-gray-300 px-5 py-4 space-y-3 text-sm text-gray-800">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatMoney(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>{shippingCost === null ? '—' : formatMoney(shippingCost)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Sales Tax</dt>
                <dd>{formatMoney(tax)}</dd>
              </div>
            </dl>

            <div className="px-5 pb-6">
              <label htmlFor="coupon" className="block text-sm text-gray-800 mb-2">
                Coupon/Gift Certificate
              </label>
              <div className="flex gap-3">
                <input
                  id="coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className={`${INPUT} flex-1 min-w-0`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setCouponMessage(
                      coupon.trim() ? 'This code isn’t valid.' : 'Enter a coupon or gift certificate code.'
                    )
                  }
                  className="h-[42px] px-6 border border-gray-300 bg-white text-sm uppercase text-gray-800 hover:border-[#00a550]"
                >
                  Apply
                </button>
              </div>
              {couponMessage && <p className="mt-2 text-xs text-red-600">{couponMessage}</p>}
            </div>

            <div className="flex items-center justify-between border-t border-gray-300 px-5 py-5">
              <span className="text-sm text-gray-800">Total (USD)</span>
              <span className="text-3xl font-medium text-gray-900">{formatMoney(total)}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
