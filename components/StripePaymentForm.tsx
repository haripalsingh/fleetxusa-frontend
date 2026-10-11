'use client';

// Stripe Payment Element (card form) used on checkout and on the order page ("Pay now").
// Card details go straight from the browser to Stripe - they never touch our API.
// Only the PUBLISHABLE key is used here; the secret key lives in the PHP backend .env.

import { useEffect, useRef, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Appearance, PaymentIntent, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';

export type StripeHandle = { stripe: Stripe; elements: StripeElements };

const stripePromises = new Map<string, Promise<Stripe | null>>();
const getStripe = (publishableKey: string) => {
  if (!stripePromises.has(publishableKey)) stripePromises.set(publishableKey, loadStripe(publishableKey));
  return stripePromises.get(publishableKey)!;
};

/** Dollars → cents, the unit Stripe expects. */
export const toCents = (amount: number) => Math.round(Number(amount || 0) * 100);

const APPEARANCE: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#00a550',
    colorText: '#111827',
    colorDanger: '#dc2626',
    fontFamily: 'Arial, Helvetica, sans-serif',
    borderRadius: '0px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': { border: '1px solid #9ca3af', boxShadow: 'none' },
    '.Input:focus': { border: '1px solid #00a550', boxShadow: '0 0 0 1px #00a550' },
  },
};

type Props = {
  publishableKey: string;
  /** Checkout (order not created yet): amount in cents + currency. */
  amount?: number;
  currency?: string;
  /** Order page: client secret of an existing PaymentIntent. */
  clientSecret?: string;
  onReady: (handle: StripeHandle | null) => void;
};

export default function StripePaymentForm({ publishableKey, amount = 0, currency = 'usd', clientSecret, onReady }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<StripeElements | null>(null);
  const onReadyRef = useRef(onReady);
  const amountRef = useRef(amount);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    onReadyRef.current = onReady;
    amountRef.current = amount;
  });

  // Mount once per key / intent; amount changes are applied below without remounting.
  useEffect(() => {
    let cancelled = false;
    let element: StripePaymentElement | undefined;

    getStripe(publishableKey)
      .then((stripe) => {
        if (cancelled) return;
        if (!stripe || !mountRef.current) {
          setStatus('error');
          return;
        }
        const elements = clientSecret
          ? stripe.elements({ clientSecret, appearance: APPEARANCE })
          : stripe.elements({ mode: 'payment', amount: amountRef.current, currency, appearance: APPEARANCE });
        element = elements.create('payment', { layout: 'tabs' });
        element.on('ready', () => setStatus('ready'));
        element.on('loaderror', () => setStatus('error'));
        element.mount(mountRef.current);
        elementsRef.current = elements;
        onReadyRef.current({ stripe, elements });
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
      element?.destroy();
      elementsRef.current = null;
      onReadyRef.current(null);
    };
  }, [publishableKey, clientSecret, currency]);

  useEffect(() => {
    if (!clientSecret && amount > 0) elementsRef.current?.update({ amount });
  }, [amount, clientSecret]);

  return (
    <div>
      {status === 'loading' && <p className="mb-3 text-sm text-gray-500">Loading secure card form…</p>}
      {status === 'error' && (
        <p role="alert" className="mb-3 border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          The card form could not load. Check your connection and refresh, or choose another payment method.
        </p>
      )}
      <div ref={mountRef} />
      <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Payments are encrypted and processed securely by Stripe.
      </p>
    </div>
  );
}

type ConfirmResult = { ok: true; intent: PaymentIntent } | { ok: false; message: string };

/**
 * Confirm the card with Stripe (handles 3-D Secure pop-ups). Only redirects for bank-redirect
 * methods; cards resolve in place. `clientSecret` is required when the form was mounted in
 * checkout mode (amount + currency).
 */
export async function confirmStripePayment(
  handle: StripeHandle,
  opts: { clientSecret?: string; returnUrl: string; billing?: { name?: string; email?: string; phone?: string } }
): Promise<ConfirmResult> {
  try {
    const { error, paymentIntent } = await handle.stripe.confirmPayment({
      elements: handle.elements,
      ...(opts.clientSecret ? { clientSecret: opts.clientSecret } : {}),
      confirmParams: {
        return_url: opts.returnUrl,
        ...(opts.billing ? { payment_method_data: { billing_details: opts.billing } } : {}),
      },
      redirect: 'if_required',
    });
    if (error) {
      const friendly = error.type === 'card_error' || error.type === 'validation_error';
      return { ok: false, message: friendly && error.message ? error.message : 'Your payment could not be processed. Please try again.' };
    }
    if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
      return { ok: true, intent: paymentIntent };
    }
    return { ok: false, message: 'Your card was not charged. Please try again or use another card.' };
  } catch {
    return { ok: false, message: 'Could not reach the payment provider. Please try again.' };
  }
}
