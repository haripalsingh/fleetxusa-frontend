'use client';

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api, ApiError, formatDate, formatMoney, productUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Address, Order } from '@/lib/types';
import OrderStatusBadge from './account/OrderStatusBadge';

const STEPS = ['pending', 'processing', 'shipped', 'delivered'] as const;

const AddressBlock = ({ title, a }: { title: string; a: Address }) => (
  <div>
    <h3 className="text-sm font-bold uppercase text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-700 leading-relaxed">
      {a.full_name}
      <br />
      {a.address_line1}
      {a.address_line2 ? `, ${a.address_line2}` : ''}
      <br />
      {a.city}, {a.state} {a.zip_code}
      <br />
      {a.country}
      <br />
      {a.phone}
    </p>
  </div>
);

/** Order details for the owner (logged in) or a guest holding the ?key= link. */
export default function OrderDetails({ number }: { number: string }) {
  const params = useSearchParams();
  const key = params.get('key') ?? undefined;
  const justPlaced = params.get('placed') === '1';
  const payment = params.get('payment'); // success | cancelled (Stripe return)
  const { loading: authLoading, isAuthenticated } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  const load = useCallback(
    () =>
      api<Order>(`/orders/${encodeURIComponent(number)}`, { query: { key } })
        .then((res) => {
          setOrder(res.data);
          setError(null);
        })
        .catch((err) =>
          setError(
            err instanceof ApiError
              ? { status: err.status, message: err.message }
              : { status: 0, message: 'Could not load this order.' }
          )
        ),
    [number, key]
  );

  useEffect(() => {
    if (authLoading) return;
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [authLoading, isAuthenticated, load]);

  // Stripe confirms payment by webhook a moment after the redirect - poll briefly.
  useEffect(() => {
    if (payment !== 'success' || !order || order.payment_status === 'paid') return;
    const t = setTimeout(load, 3000);
    return () => clearTimeout(t);
  }, [payment, order, load]);

  const cancel = async () => {
    if (!order || !confirm('Cancel this order?')) return;
    setBusy(true);
    setActionError('');
    try {
      const res = await api<Order>(`/orders/${order.order_number}/cancel`, { method: 'POST', query: { key } });
      setOrder({ ...order, ...res.data });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not cancel the order.');
    } finally {
      setBusy(false);
    }
  };

  const payNow = async () => {
    if (!order) return;
    setBusy(true);
    setActionError('');
    try {
      const res = await api<{ redirect_url?: string }>(`/payments/${order.order_number}/retry`, { method: 'POST', query: { key } });
      if (res.data.redirect_url) window.location.href = res.data.redirect_url;
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not start payment.');
      setBusy(false);
    }
  };

  if (error) {
    return (
      <div className="bg-gray-50 min-h-[60vh] px-4 py-20 font-display">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{error.status === 404 ? 'Order not found' : 'We couldn’t open this order'}</h1>
          <p className="text-gray-600 mb-6">
            {error.status === 401 ? 'Please log in with the account you used to place this order.' : error.message}
          </p>
          {error.status === 401 ? (
            <Link href={`/login?next=${encodeURIComponent(`/orders/${number}`)}`} className="inline-block px-8 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f]">
              Log in
            </Link>
          ) : (
            <Link href="/products" className="text-[#00a550] hover:underline">
              Continue shopping
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!order) return <div className="min-h-[60vh] bg-gray-50" aria-busy="true" />;

  const stepIndex = STEPS.indexOf(order.status as (typeof STEPS)[number]);
  const cancelled = order.status === 'cancelled' || order.status === 'refunded';

  return (
    <div className="w-full font-display">
      <section className="w-full bg-black text-white">
        <div className="max-w-[1100px] mx-auto px-4 py-10 md:py-12">
          {isAuthenticated && (
            <Link href="/account/orders" className="text-sm text-gray-400 hover:text-white">
              ← My Orders
            </Link>
          )}
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold mt-2">Order {order.order_number}</h1>
          <p className="mt-2 text-gray-400">Placed {formatDate(order.created_at)}</p>
        </div>
      </section>

      <div className="bg-gray-50 py-8 px-4">
        <div className="max-w-[1100px] mx-auto space-y-6">
          {(justPlaced || payment === 'success') && (
            <div role="status" className="rounded-lg border border-green-300 bg-green-50 p-5 text-green-900">
              <p className="text-lg font-bold">Thank you! Your order has been placed.</p>
              <p className="text-sm mt-1">
                A confirmation was sent to <strong>{order.email}</strong>.
                {!isAuthenticated && ' Bookmark this page to check your order status any time.'}
                {payment === 'success' && order.payment_status !== 'paid' && ' We are confirming your payment…'}
              </p>
            </div>
          )}
          {payment === 'cancelled' && order.payment_status !== 'paid' && (
            <div role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-5 text-amber-900 text-sm">
              Payment was not completed. Your order is saved - you can pay now using the button below.
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <span className="text-sm text-gray-500">Payment:</span>
                <OrderStatusBadge status={order.payment_status} />
              </div>
              <div className="flex gap-3">
                {order.can_pay && (
                  <button type="button" onClick={payNow} disabled={busy} className="h-10 px-5 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] disabled:opacity-50">
                    Pay now
                  </button>
                )}
                {order.can_cancel && (
                  <button type="button" onClick={cancel} disabled={busy} className="h-10 px-5 rounded-md border border-red-300 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50">
                    Cancel order
                  </button>
                )}
              </div>
            </div>
            {actionError && <p className="mt-3 text-sm text-red-600">{actionError}</p>}

            {!cancelled && stepIndex >= 0 && (
              <ol className="mt-6 grid grid-cols-4 gap-2" aria-label="Order progress">
                {STEPS.map((s, i) => (
                  <li key={s} className="text-center">
                    <div className={`h-1.5 rounded-full ${i <= stepIndex ? 'bg-[#00a550]' : 'bg-gray-200'}`} />
                    <span className={`mt-2 block text-xs capitalize ${i <= stepIndex ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>{s}</span>
                  </li>
                ))}
              </ol>
            )}
            {order.tracking_number && (
              <p className="mt-5 text-sm text-gray-800">
                <span className="font-semibold">Tracking:</span> {order.carrier ? `${order.carrier} ` : ''}
                {order.tracking_number}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {order.items?.map((i) => (
                  <li key={i.id} className="flex gap-4 p-4 sm:p-5">
                    <div className="h-20 w-20 flex-shrink-0 rounded-md bg-gray-100 overflow-hidden">
                      <img src={i.image_url || '/images/fleet-x-icon.png'} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-sm">
                      {i.slug ? (
                        <Link href={productUrl({ slug: i.slug, category_slug: i.category_slug })} className="font-semibold text-gray-900 hover:text-[#00a550]">
                          {i.name}
                        </Link>
                      ) : (
                        <span className="font-semibold text-gray-900">{i.name}</span>
                      )}
                      <p className="text-gray-500 mt-1">Part #: {i.sku}</p>
                      {i.option && <p className="text-gray-500">Option: {i.option}</p>}
                      <p className="text-gray-700 mt-1">
                        {i.quantity} × {formatMoney(i.unit_price)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{formatMoney(i.line_total)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h2 className="text-sm font-bold uppercase text-gray-900 mb-3">Summary</h2>
                <dl className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(order.subtotal)}</dd></div>
                  {order.discount_total > 0 && (
                    <div className="flex justify-between text-[#00a550]"><dt>Discount{order.coupon_code ? ` (${order.coupon_code})` : ''}</dt><dd>−{formatMoney(order.discount_total)}</dd></div>
                  )}
                  <div className="flex justify-between"><dt>Shipping</dt><dd>{order.shipping_total === 0 ? 'Free' : formatMoney(order.shipping_total)}</dd></div>
                  <div className="flex justify-between"><dt>Tax</dt><dd>{formatMoney(order.tax_total)}</dd></div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900"><dt>Total</dt><dd>{formatMoney(order.grand_total)}</dd></div>
                </dl>
                <p className="mt-3 text-xs text-gray-500 capitalize">Paid with: {order.payment_method === 'manual' ? 'Invoice / phone' : order.payment_method}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-5 space-y-5">
                <AddressBlock title="Shipping address" a={order.shipping_address} />
                <AddressBlock title="Billing address" a={order.billing_address} />
              </div>
              {order.customer_note && (
                <div className="bg-white rounded-lg shadow-sm p-5 text-sm">
                  <h2 className="font-bold uppercase text-gray-900 mb-2">Order notes</h2>
                  <p className="text-gray-700 whitespace-pre-line">{order.customer_note}</p>
                </div>
              )}
            </div>
          </div>

          {order.history && order.history.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-5 md:p-6">
              <h2 className="text-sm font-bold uppercase text-gray-900 mb-4">History</h2>
              <ol className="space-y-3 border-l-2 border-gray-200 pl-4">
                {order.history.map((h, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-semibold capitalize text-gray-900">{h.status}</span>{' '}
                    <span className="text-gray-500">· {formatDate(h.created_at)}</span>
                    {h.note && <p className="text-gray-700">{h.note}</p>}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <p className="text-center text-sm text-gray-600">
            Questions about this order?{' '}
            <Link href="/contact" className="text-[#00a550] hover:underline">
              Contact us
            </Link>{' '}
            and mention order <strong>{order.order_number}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
