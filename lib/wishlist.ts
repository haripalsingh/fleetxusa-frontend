'use client';

// Wish list = logged-in feature. Product IDs are saved on the server (PHP API
// /api/users/me/wishlist) so they follow the customer across devices.
// Guests who tap the heart are sent to log in; the product is added right after.

import { useSyncExternalStore } from 'react';
import { api, ApiError, browserStorage, getAuthToken } from './api';

type WishState = { ids: number[]; ready: boolean };

const EMPTY: WishState = { ids: [], ready: false };
const PENDING_KEY = 'fx_wish_pending';

let state: WishState = EMPTY;
const listeners = new Set<() => void>();

function setIds(ids: number[]) {
  state = { ids, ready: true };
  listeners.forEach((l) => l());
}

type IdsResponse = { product_ids: number[] };

/** Load the signed-in user's wish list (or clear it when signed out). */
export async function refreshWishlist(): Promise<void> {
  if (!getAuthToken()) {
    setIds([]);
    return;
  }
  try {
    const res = await api<IdsResponse>('/users/me/wishlist');
    setIds(res.data.product_ids ?? []);
  } catch {
    setIds([]);
  }
  // Finish an "add to wish list" that was interrupted by the login page.
  const pending = Number(browserStorage.get(PENDING_KEY) || 0);
  if (pending) {
    browserStorage.set(PENDING_KEY, null);
    if (!state.ids.includes(pending)) await addToWishlist(pending).catch(() => undefined);
  }
}

export async function addToWishlist(productId: number): Promise<void> {
  const before = state.ids;
  setIds([productId, ...before.filter((id) => id !== productId)]); // optimistic
  try {
    const res = await api<IdsResponse>('/users/me/wishlist', { method: 'POST', body: { product_id: productId } });
    setIds(res.data.product_ids);
  } catch (err) {
    setIds(before);
    throw err;
  }
}

export async function removeFromWishlist(productId: number): Promise<void> {
  const before = state.ids;
  setIds(before.filter((id) => id !== productId));
  try {
    const res = await api<IdsResponse>(`/users/me/wishlist/${productId}`, { method: 'DELETE' });
    setIds(res.data.product_ids);
  } catch (err) {
    setIds(before);
    throw err;
  }
}

/**
 * Toggle a product. Returns 'login' when the visitor is a guest: the product is remembered
 * and the caller should send them to /login?next=<current page>.
 */
export async function toggleWishlist(productId: number): Promise<'added' | 'removed' | 'login'> {
  if (!getAuthToken()) {
    browserStorage.set(PENDING_KEY, String(productId));
    return 'login';
  }
  if (state.ids.includes(productId)) {
    await removeFromWishlist(productId);
    return 'removed';
  }
  await addToWishlist(productId);
  return 'added';
}

export const wishlistErrorMessage = (err: unknown) =>
  err instanceof ApiError ? err.firstError : 'Could not update your wish list. Please try again.';

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useWishlist() {
  const s = useSyncExternalStore(subscribe, () => state, () => EMPTY);
  return { ...s, count: s.ids.length, has: (id: number) => s.ids.includes(id) };
}
