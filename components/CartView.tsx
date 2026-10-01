'use client';

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import Link from 'next/link';
import { ApiError, productUrl } from '@/lib/api';
import { clearCart, formatMoney, removeCartItem, setCartQuantity, useCart } from '@/lib/cart';
import type { CartItem } from '@/lib/types';

export default function CartView() {
  const { items, ready, subtotal, issues, totals } = useCart();
  const [busy, setBusy] = useState<number | 'all' | null>(null);
  const [error, setError] = useState('');

  const run = async (key: number | 'all', fn: () => Promise<void>) => {
    setBusy(key);
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(err instanceof ApiError ? err.firstError : 'Could not update your cart.');
    } finally {
      setBusy(null);
    }
  };

  const changeQty = (item: CartItem, qty: number) => run(item.id, () => setCartQuantity(item, qty));

  return (
    <div className="w-full font-display">
      {/* ---- Header (black, full width) ---- */}
      <section className="w-full bg-black text-white">
        <div className="max-w-[1320px] mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">Shopping Cart</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mx-auto mb-5" />
          <p className="text-gray-400 text-base md:text-lg">
            {ready ? `${items.length} item${items.length !== 1 ? 's' : ''} in your cart` : ' '}
          </p>
        </div>
      </section>

      <div className="bg-gray-50 min-h-[50vh] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1320px] mx-auto">
          {!ready ? (
            <p className="text-center text-gray-500">Loading your cart…</p>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md px-6 py-16 text-center">
              <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h2 className="font-heading text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add some items to get started</p>
              <Link
                href="/products"
                className="inline-block px-8 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2">
                {(issues.length > 0 || error) && (
                  <div role="alert" className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    {error && <p>{error}</p>}
                    {issues.map((m) => (
                      <p key={m}>{m}</p>
                    ))}
                  </div>
                )}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <ul>
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className={`flex flex-col sm:flex-row gap-4 p-4 sm:p-5 border-b last:border-b-0 border-gray-100 ${
                          busy === item.id ? 'opacity-60' : ''
                        } ${!item.available ? 'bg-red-50/50' : ''}`}
                      >
                        <Link
                          href={productUrl(item)}
                          className="w-full sm:w-28 h-40 sm:h-28 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center"
                        >
                          <img src={item.image_url || '/images/fleet-x-icon.png'} alt={item.name} className="h-full w-full object-cover" />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <h2 className="text-base font-semibold text-gray-900">
                            <Link href={productUrl(item)} className="hover:text-[#00a550]">{item.name}</Link>
                          </h2>
                          <p className="mt-1 text-sm text-gray-500">Part #: {item.sku}</p>
                          {item.option && <p className="mt-1 text-sm text-gray-500">Option: {item.option}</p>}
                          <p className="mt-2 text-base font-bold text-[#00a550]">{formatMoney(item.price)}</p>
                          {item.available && item.stock < item.quantity && (
                            <p className="mt-1 text-xs font-semibold text-amber-700">
                              {item.stock === 0 ? 'Out of stock' : `Only ${item.stock} available`}
                            </p>
                          )}
                          {!item.available && <p className="mt-1 text-xs font-semibold text-red-700">No longer available</p>}

                          <div className="mt-3 flex flex-wrap items-center gap-4">
                            <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                type="button"
                                aria-label={`Decrease quantity of ${item.name}`}
                                onClick={() => changeQty(item, item.quantity - 1)}
                                disabled={item.quantity <= 1 || busy !== null}
                                className="px-3 py-1 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                              >
                                &minus;
                              </button>
                              <span className="px-4 py-1 text-sm font-medium text-gray-900 min-w-10 text-center">{item.quantity}</span>
                              <button
                                type="button"
                                aria-label={`Increase quantity of ${item.name}`}
                                onClick={() => changeQty(item, item.quantity + 1)}
                                disabled={busy !== null || item.quantity >= Math.min(99, item.stock)}
                                className="px-3 py-1 hover:bg-gray-100 disabled:opacity-40"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => run(item.id, () => removeCartItem(item))}
                              disabled={busy !== null}
                              className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <p className="sm:text-right text-base font-bold text-gray-900">{formatMoney(item.line_total)}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => run('all', clearCart)}
                  disabled={busy !== null}
                  className="mt-4 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  Clear Cart
                </button>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 lg:sticky lg:top-4">
                  <h2 className="font-heading text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                  <dl className="space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <dt>Subtotal</dt>
                      <dd>{formatMoney(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Shipping</dt>
                      <dd>{totals.shipping_total === 0 ? 'Free' : formatMoney(totals.shipping_total)}</dd>
                    </div>
                    {totals.tax_total > 0 && (
                      <div className="flex justify-between">
                        <dt>Estimated tax</dt>
                        <dd>{formatMoney(totals.tax_total)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
                      <dt>Total</dt>
                      <dd>{formatMoney(totals.grand_total)}</dd>
                    </div>
                  </dl>
                  {totals.free_shipping_threshold && subtotal < totals.free_shipping_threshold && (
                    <p className="mt-3 text-xs text-gray-500">
                      Add {formatMoney(totals.free_shipping_threshold - subtotal)} more for free shipping.
                    </p>
                  )}
                  <p className="mt-3 text-xs text-gray-500">Coupons can be applied at checkout.</p>

                  <Link
                    href="/checkout"
                    aria-disabled={issues.length > 0}
                    className={`mt-6 block w-full rounded-lg py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90 transition-opacity ${
                      issues.length > 0 ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/products"
                    className="mt-3 block w-full rounded-lg border border-gray-300 py-3 text-center text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
