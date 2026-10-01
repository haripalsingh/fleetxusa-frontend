'use client';

// Cart state lives on the server (PHP API /api/cart). This module keeps one shared
// client-side copy so every component (header badge, cart page, checkout) stays in sync.
// Guests are identified by a random cart token; logged-in users by their account.

import { useEffect, useSyncExternalStore } from 'react';
import { api, browserStorage, getCartToken, setCartToken } from './api';
import type { Cart, CartItem, Totals } from './types';

export type { CartItem } from './types';
export { formatMoney } from './api';

type CartState = Cart & { ready: boolean };

const EMPTY_TOTALS: Totals = {
  subtotal: 0,
  discount_total: 0,
  shipping_total: 0,
  tax_total: 0,
  grand_total: 0,
  currency: 'USD',
  free_shipping_threshold: null,
};

const EMPTY: CartState = { token: null, items: [], count: 0, subtotal: 0, issues: [], totals: EMPTY_TOTALS, ready: false };

let state: CartState = EMPTY;
const listeners = new Set<() => void>();
let loading: Promise<void> | null = null;

function setState(cart: Cart) {
  if (cart.token) setCartToken(cart.token);
  state = { ...cart, ready: true };
  // Mirror a light copy to localStorage: the Header badge reads key "cart" + "cartUpdate" event.
  browserStorage.set('cart', JSON.stringify(cart.items.map((i) => ({ id: i.id, quantity: i.quantity }))));
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('cartUpdate'));
  listeners.forEach((l) => l());
}

export async function refreshCart(): Promise<void> {
  if (!loading) {
    loading = api<Cart>('/cart')
      .then((res) => setState(res.data))
      .catch(() => {
        if (!state.ready) setState({ ...EMPTY, ready: true } as Cart);
      })
      .finally(() => {
        loading = null;
      });
  }
  return loading;
}

/** Add a product variant. Throws ApiError (e.g. "Only 3 in stock") so the UI can show it. */
export async function addToCart(variantId: number, quantity = 1): Promise<Cart> {
  const res = await api<Cart>('/cart/items', { method: 'POST', body: { variant_id: variantId, quantity } });
  setState(res.data);
  return res.data;
}

export async function setCartQuantity(item: CartItem, quantity: number): Promise<void> {
  if (quantity < 1) return;
  const res = await api<Cart>(`/cart/items/${item.id}`, { method: 'PATCH', body: { quantity: Math.min(99, quantity) } });
  setState(res.data);
}

export async function removeCartItem(item: CartItem): Promise<void> {
  const res = await api<Cart>(`/cart/items/${item.id}`, { method: 'DELETE' });
  setState(res.data);
}

export async function clearCart(): Promise<void> {
  const res = await api<Cart>('/cart', { method: 'DELETE' });
  setState(res.data);
}

/** After login: move the guest cart into the user's cart. */
export async function mergeGuestCart(): Promise<void> {
  const guestToken = getCartToken();
  try {
    const res = await api<Cart>('/cart/merge', { method: 'POST' });
    setCartToken(null);
    setState(res.data);
  } catch {
    if (guestToken) setCartToken(null);
    await refreshCart();
  }
}

/** After logout: forget the local copy and start a fresh guest cart. */
export async function resetCart(): Promise<void> {
  setCartToken(null);
  state = EMPTY;
  await refreshCart();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useCart() {
  const cart = useSyncExternalStore(subscribe, () => state, () => EMPTY);

  useEffect(() => {
    if (!state.ready) void refreshCart();
    // another tab changed the cart
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'cart') void refreshCart();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return cart;
}
