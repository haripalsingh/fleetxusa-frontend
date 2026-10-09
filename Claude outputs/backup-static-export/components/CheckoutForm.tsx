'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { formatMoney, refreshCart, useCart } from '@/lib/cart';
import { useAuth } from '@/context/AuthContext';
import type { Address, Order, PaymentMethod, Totals } from '@/lib/types';

type Step = 'shipping' | 'billing' | 'payment';
const ORDER: Step[] = ['shipping', 'billing', 'payment'];

type AddressForm = Omit<Address, 'id' | 'label' | 'is_default' | 'address_line2'> & { address_line2: string };
type Errors = Partial<Record<keyof AddressForm, string>>;

const EMPTY_ADDRESS: AddressForm = {
  full_name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  zip_code: '',
  country: 'United States',
};

type AppliedCoupon = { code: string; description: string | null; discount: number; free_shipping: boolean; totals: Totals };

const INPUT =
  'w-full h-[42px] border border-gray-400 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:border-[#00a550] focus:ring-1 focus:ring-[#00a550]';
const BTN = 'h-[42px] px-8 bg-[#444] text-white text-sm font-medium uppercase hover:bg-black transition-colors disabled:opacity-50';

const Field = ({ label, error, children }: { label: string; error?: string; children: ReactNode }) => (
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
      <h2 className={`text-2xl font-bold ${active || done ? 'text-gray-900' : 'text-gray-800'}`}>{title}</h2>
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

const AddressFields = ({
  value,
  onChange,
  errors,
}: {
  value: AddressForm;
  onChange: (next: AddressForm) => void;
  errors: Errors;
}) => {
  const set = (k: keyof AddressForm) => (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...value, [k]: e.target.value });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Full Name *" error={errors.full_name}>
        <input className={INPUT} value={value.full_name} onChange={set('full_name')} autoComplete="name" />
      </Field>
      <Field label="Phone Number *" error={errors.phone}>
        <input className={INPUT} type="tel" value={value.phone} onChange={set('phone')} autoComplete="tel" />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Address Line 1 *" error={errors.address_line1}>
          <input className={INPUT} value={value.address_line1} onChange={set('address_line1')} autoComplete="address-line1" />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Address Line 2 (Optional)" error={errors.address_line2}>
          <input className={INPUT} value={value.address_line2} onChange={set('address_line2')} autoComplete="address-line2" />
        </Field>
      </div>
      <Field label="City *" error={errors.city}>
        <input className={INPUT} value={value.city} onChange={set('city')} autoComplete="address-level2" />
      </Field>
      <Field label="State *" error={errors.state}>
        <input className={INPUT} value={value.state} onChange={set('state')} autoComplete="address-level1" />
      </Field>
      <Field label="ZIP Code *" error={errors.zip_code}>
        <input className={INPUT} value={value.zip_code} onChange={set('zip_code')} autoComplete="postal-code" />
      </Field>
      <Field label="Country">
        <input className={`${INPUT} bg-gray-100`} value={value.country} readOnly />
      </Field>
    </div>
  );
};

const validateAddress = (a: AddressForm): Errors => {
  const e: Errors = {};
  if (!a.full_name.trim()) e.full_name = 'Full name is required';
  if (!a.phone.trim()) e.phone = 'Phone number is required';
  else if (!/^[0-9+\-\s().]{7,20}$/.test(a.phone.trim())) e.phone = 'Please enter a valid phone number';
  if (!a.address_line1.trim()) e.address_line1 = 'Address is required';
  if (!a.city.trim()) e.city = 'City is required';
  if (!a.state.trim()) e.state = 'State is required';
  if (!a.zip_code.trim()) e.zip_code = 'ZIP code is required';
  else if (!/^[A-Za-z0-9\-\s]{3,10}$/.test(a.zip_code.trim())) e.zip_code = 'Please enter a valid ZIP code';
  return e;
};

const AddressSummary = ({ a }: { a: AddressForm }) => (
  <p className="leading-relaxed">
    {a.full_name}
    <br />
    {a.address_line1}
    {a.address_line2 ? `, ${a.address_line2}` : ''}
    <br />
    {a.city}, {a.state} {a.zip_code}
    <br />
    {a.phone}
  </p>
);

/** Split "shipping_address.city" style API errors into per-form maps. */
const pickErrors = (errors: Record<string, string>, prefix: string): Errors =>
  Object.fromEntries(
    Object.entries(errors)
      .filter(([k]) => k.startsWith(prefix + '.'))
      .map(([k, v]) => [k.slice(prefix.length + 1), v])
  ) as Errors;

export default function CheckoutForm() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { items, ready, count, issues, totals: cartTotals } = useCart();

  const [step, setStep] = useState<Step>('shipping');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const newsletter = false; // newsletter checkbox removed from checkout
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [shipping, setShipping] = useState<AddressForm>(EMPTY_ADDRESS);
  const [shippingErrors, setShippingErrors] = useState<Errors>({});
  const [saveAddress, setSaveAddress] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billing, setBilling] = useState<AddressForm>(EMPTY_ADDRESS);
  const [billingErrors, setBillingErrors] = useState<Errors>({});
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [method, setMethod] = useState('');
  const [note, setNote] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponBusy, setCouponBusy] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');

  // Payment methods enabled on the server
  useEffect(() => {
    api<PaymentMethod[]>('/payments/methods')
      .then((res) => {
        setMethods(res.data);
        setMethod((m) => m || res.data[0]?.code || '');
      })
      .catch(() => setMethods([]));
  }, []);

  // Logged-in customers: prefill email + default address, skip the email step
  useEffect(() => {
    if (!user) return;
    api<Address[]>('/users/me/addresses')
      .then((res) => {
        setSavedAddresses(res.data);
        const def = res.data.find((a) => a.is_default) ?? res.data[0];
        if (def) setShipping((cur) => (cur.address_line1 ? cur : toForm(def)));
        else setSaveAddress(true);
      })
      .catch(() => undefined)
      .finally(() => {
        setEmail((e) => e || user.email);
      });
  }, [user]);

  // A coupon preview is only valid for the cart it was calculated for.
  const coupon = appliedCoupon && appliedCoupon.totals.subtotal === cartTotals.subtotal ? appliedCoupon : null;

  const reached = (s: Step) => ORDER.indexOf(step) > ORDER.indexOf(s);
  const totals = coupon?.totals ?? cartTotals;
  const showShipping = reached('shipping');

  const submitShipping = (e: FormEvent) => {
    e.preventDefault();
    const errs = validateAddress(shipping);
    setShippingErrors(errs);
    const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());
    setEmailError(emailOk ? '' : 'Please enter a valid email address');
    if (emailOk && Object.keys(errs).length === 0) setStep('billing');
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

  const applyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) {
      setCouponMessage('Enter a coupon or gift certificate code.');
      return;
    }
    setCouponBusy(true);
    setCouponMessage('');
    try {
      const res = await api<AppliedCoupon>('/coupons/validate', {
        method: 'POST',
        body: { code, email: email.trim() || undefined },
      });
      setCoupon(res.data);
      setCouponInput('');
    } catch (err) {
      setCouponMessage(err instanceof ApiError ? err.firstError : 'This code isn’t valid.');
    } finally {
      setCouponBusy(false);
    }
  };

  const placeOrder = async () => {
    if (!method) {
      setPlaceError('No payment method is available right now. Please contact us to complete your order.');
      return;
    }
    setPlacing(true);
    setPlaceError('');
    try {
      const res = await api<{ order: Order; payment: { redirect_url?: string }; payment_error: string | null }>('/orders', {
        method: 'POST',
        body: {
          email: email.trim(),
          shipping_address: shipping,
          billing_same_as_shipping: sameAsShipping,
          billing_address: sameAsShipping ? undefined : billing,
          payment_method: method,
          coupon_code: coupon?.code,
          customer_note: note.trim() || undefined,
          newsletter,
        },
      });
      const { order, payment } = res.data;

      if (isAuthenticated && saveAddress) {
        api('/users/me/addresses', { method: 'POST', body: { ...shipping, is_default: savedAddresses.length === 0 } }).catch(
          () => undefined
        );
      }
      await refreshCart();

      if (payment?.redirect_url) {
        window.location.href = payment.redirect_url; // hosted payment page (Stripe)
        return;
      }
      router.push(`/orders/${order.order_number}?key=${order.access_key}&placed=1`);
    } catch (err) {
      setPlacing(false);
      if (!(err instanceof ApiError)) {
        setPlaceError('Something went wrong. Please try again.');
        return;
      }
      if (err.status === 422) {
        const ship = pickErrors(err.errors, 'shipping_address');
        const bill = pickErrors(err.errors, 'billing_address');
        if (Object.keys(ship).length) {
          setShippingErrors(ship);
          setStep('shipping');
        } else if (Object.keys(bill).length) {
          setBillingErrors(bill);
          setStep('billing');
        } else if (err.errors.email) {
          setEmailError(err.errors.email);
          setStep('shipping');
        } else if (err.errors.coupon_code) {
          setCoupon(null);
          setCouponMessage(err.errors.coupon_code);
        }
      }
      if (err.status === 409) await refreshCart(); // stock changed
      setPlaceError(err.status === 409 && err.errors.cart ? `${err.message}` : err.firstError);
    }
  };

  if (!ready || authLoading) {
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

            {issues.length > 0 && (
              <div role="alert" className="mb-4 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {issues.map((m) => (
                  <p key={m}>{m}</p>
                ))}
                <Link href="/cart" className="mt-1 inline-block font-semibold underline">
                  Review your cart
                </Link>
              </div>
            )}

            <Section
              title="Shipping"
              active={step === 'shipping'}
              done={reached('shipping')}
              summary={<AddressSummary a={shipping} />}
              onEdit={() => setStep('shipping')}
            >
              <form onSubmit={submitShipping} noValidate>
                {!isAuthenticated && (
                  <label className="mb-5 block">
                    <span className="block mb-1 text-sm text-gray-700">Email</span>
                    <input
                      id="checkout-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                      }}
                      autoComplete="email"
                      className={INPUT}
                    />
                    {emailError && <span className="mt-1 block text-xs text-red-600">{emailError}</span>}
                  </label>
                )}
                {savedAddresses.length > 0 && (
                  <label className="mb-5 block">
                    <span className="block mb-1 text-sm text-gray-700">Use a saved address</span>
                    <select
                      className={INPUT}
                      defaultValue=""
                      onChange={(e) => {
                        const a = savedAddresses.find((x) => String(x.id) === e.target.value);
                        if (a) {
                          setShipping(toForm(a));
                          setShippingErrors({});
                        }
                      }}
                    >
                      <option value="" disabled>
                        Choose…
                      </option>
                      {savedAddresses.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.label ? `${a.label} - ` : ''}
                          {a.full_name}, {a.address_line1}, {a.city} {a.state}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <AddressFields value={shipping} onChange={setShipping} errors={shippingErrors} />
                {isAuthenticated && (
                  <label className="mt-5 flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="h-4 w-4 accent-[#00a550]"
                    />
                    Save this address to my account
                  </label>
                )}
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
                    <AddressFields value={billing} onChange={setBilling} errors={billingErrors} />
                  </div>
                )}
                <button type="submit" className={`${BTN} mt-6`}>
                  Continue
                </button>
              </form>
            </Section>

            <Section title="Payment" active={step === 'payment'} done={false} onEdit={() => setStep('payment')}>
              <fieldset className="space-y-3">
                <legend className="sr-only">Payment method</legend>
                {methods.length === 0 && (
                  <p className="text-sm text-gray-600">Loading payment options…</p>
                )}
                {methods.map((m) => (
                  <label
                    key={m.code}
                    className={`border p-4 flex items-start gap-3 cursor-pointer ${
                      method === m.code ? 'border-[#00a550] bg-green-50/40' : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={m.code}
                      checked={method === m.code}
                      onChange={() => setMethod(m.code)}
                      className="mt-1 h-4 w-4 accent-[#00a550]"
                    />
                    <span>
                      <span className="block text-sm font-medium text-gray-900">{m.label}</span>
                      <span className="block text-xs text-gray-500">{m.description}</span>
                    </span>
                  </label>
                ))}
              </fieldset>

              <label className="mt-5 block">
                <span className="block mb-1 text-sm text-gray-700">Order notes (optional)</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder="VIN, delivery instructions, PO number…"
                  className="w-full border border-gray-400 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#00a550] focus:ring-1 focus:ring-[#00a550]"
                />
              </label>

              {placeError && (
                <p role="alert" className="mt-4 border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {placeError}
                </p>
              )}

              <button
                type="button"
                onClick={placeOrder}
                disabled={placing || issues.length > 0}
                className="mt-6 h-[46px] w-full sm:w-auto px-10 text-sm font-bold uppercase text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {placing ? 'Placing order…' : `Place Order · ${formatMoney(totals.grand_total)}`}
              </button>
              <p className="mt-3 text-xs text-gray-500">
                By placing your order you agree to our{' '}
                <Link href="/terms-conditions" className="underline">
                  terms
                </Link>{' '}
                and{' '}
                <Link href="/shipping-return-policy" className="underline">
                  shipping &amp; return policy
                </Link>
                .
              </p>
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
                  <li key={item.id} className="grid grid-cols-[90px_1fr_auto] gap-4">
                    <div className="h-[80px] w-[90px] flex items-center justify-center">
                      <img src={item.image_url || '/images/fleet-x-icon.png'} alt="" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="text-sm text-gray-900 min-w-0">
                      <p>
                        {item.quantity} x {item.name}
                      </p>
                      {item.option && <p className="mt-1 text-xs text-gray-500">Option: {item.option}</p>}
                    </div>
                    <p className="text-sm text-gray-900">{formatMoney(item.line_total)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="border-t border-gray-300 px-5 py-4 space-y-3 text-sm text-gray-800">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatMoney(totals.subtotal)}</dd>
              </div>
              {coupon && (
                <div className="flex justify-between text-[#00a550]">
                  <dt>
                    Coupon ({coupon.code}){' '}
                    <button type="button" onClick={() => setCoupon(null)} className="ml-1 text-xs text-gray-500 underline">
                      remove
                    </button>
                  </dt>
                  <dd>{coupon.free_shipping ? 'Free shipping' : `−${formatMoney(coupon.discount)}`}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>{!showShipping ? '—' : totals.shipping_total === 0 ? 'Free' : formatMoney(totals.shipping_total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Sales Tax</dt>
                <dd>{formatMoney(totals.tax_total)}</dd>
              </div>
            </dl>

            <div className="px-5 pb-6">
              <label htmlFor="coupon" className="block text-sm text-gray-800 mb-2">
                Coupon/Gift Certificate
              </label>
              <div className="flex gap-3">
                <input
                  id="coupon"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void applyCoupon();
                    }
                  }}
                  className={`${INPUT} flex-1 min-w-0 uppercase`}
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponBusy}
                  className="h-[42px] px-6 border border-gray-300 bg-white text-sm uppercase text-gray-800 hover:border-[#00a550] disabled:opacity-50"
                >
                  {couponBusy ? '…' : 'Apply'}
                </button>
              </div>
              {couponMessage && <p className="mt-2 text-xs text-red-600">{couponMessage}</p>}
            </div>

            <div className="flex items-center justify-between border-t border-gray-300 px-5 py-5">
              <span className="text-sm text-gray-800">Total ({totals.currency})</span>
              <span className="text-3xl font-medium text-gray-900">
                {formatMoney(showShipping ? totals.grand_total : totals.grand_total - totals.shipping_total)}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function toForm(a: Address): AddressForm {
  return {
    full_name: a.full_name,
    phone: a.phone,
    address_line1: a.address_line1,
    address_line2: a.address_line2 ?? '',
    city: a.city,
    state: a.state,
    zip_code: a.zip_code,
    country: a.country || 'United States',
  };
}
