'use client';

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import {
  clearCart,
  formatMoney,
  removeCartItem,
  setCartQuantity,
  useCart,
} from '@/lib/cart';

export default function CartView() {
  const { items, ready, subtotal } = useCart();

  return (
    <div className="w-full font-display">
      {/* ---- Header (black, full width) ---- */}
      <section className="w-full bg-black text-white">
        <div className="max-w-[1320px] mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">Shopping Cart</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mx-auto mb-5" />
          <p className="text-gray-400 text-base md:text-lg">
            {ready ? `${items.length} item${items.length !== 1 ? 's' : ''} in your cart` : ' '}
          </p>
        </div>
      </section>

      <div className="bg-gray-50 min-h-[50vh] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1320px] mx-auto">
          {!ready ? null : items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md px-6 py-16 text-center">
              <svg
                className="w-20 h-20 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h2 className="font-heading text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
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
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <ul>
                    {items.map((item, index) => (
                      <li
                        key={`${item.id}-${item.option ?? ''}-${index}`}
                        className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 border-b last:border-b-0 border-gray-100"
                      >
                        <div className="w-full sm:w-28 h-40 sm:h-28 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                          <img
                            src={item.image_url || '/images/fleet-x-icon.png'}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h2 className="text-base font-semibold text-gray-900">{item.name}</h2>
                          {item.part_number && (
                            <p className="mt-1 text-sm text-gray-500">Part #: {item.part_number}</p>
                          )}
                          {item.option && (
                            <p className="mt-1 text-sm text-gray-500">Option: {item.option}</p>
                          )}
                          <p className="mt-2 text-base font-bold text-[#00a550]">
                            {formatMoney(item.price)}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-4">
                            <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                type="button"
                                aria-label={`Decrease quantity of ${item.name}`}
                                onClick={() => setCartQuantity(index, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="px-3 py-1 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                              >
                                &minus;
                              </button>
                              <span className="px-4 py-1 text-sm font-medium text-gray-900 min-w-10 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label={`Increase quantity of ${item.name}`}
                                onClick={() => setCartQuantity(index, item.quantity + 1)}
                                className="px-3 py-1 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCartItem(index)}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <p className="sm:text-right text-base font-bold text-gray-900">
                          {formatMoney(item.price * item.quantity)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-4 text-sm text-red-600 hover:text-red-700"
                >
                  Clear Cart
                </button>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 lg:sticky lg:top-4">
                  <h2 className="font-heading text-xl font-semibold text-gray-900 mb-6">
                    Order Summary
                  </h2>
                  <dl className="space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <dt>Subtotal</dt>
                      <dd>{formatMoney(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Shipping</dt>
                      <dd>Calculated at checkout</dd>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
                      <dt>Total</dt>
                      <dd>{formatMoney(subtotal)}</dd>
                    </div>
                  </dl>

                  <Link
                    href="/checkout"
                    className="mt-6 block w-full rounded-lg py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90 transition-opacity"
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
