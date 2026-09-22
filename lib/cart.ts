'use client';

import { useEffect, useState } from 'react';

// Same localStorage shape the React site (and the Header cart badge) already use:
// key "cart" = array of items, "cartUpdate" event fired after every change.

export type CartItem = {
  id: string | number;
  type?: string;
  name: string;
  part_number?: string;
  option?: string;
  price: number;
  image_url?: string | null;
  quantity: number;
};

const KEY = 'cart';

export const formatMoney = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const readCart = (): CartItem[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('cartUpdate'));
  } catch {
    /* storage unavailable (private mode etc.) */
  }
};

export const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
  const cart = readCart();
  const existing = cart.find((c) => c.id === item.id && (c.option ?? '') === (item.option ?? ''));
  if (existing) existing.quantity += quantity;
  else cart.push({ ...item, quantity });
  writeCart(cart);
};

export const setCartQuantity = (index: number, quantity: number) => {
  if (quantity < 1) return;
  const cart = readCart();
  if (!cart[index]) return;
  cart[index].quantity = Math.min(99, quantity);
  writeCart(cart);
};

export const removeCartItem = (index: number) => {
  writeCart(readCart().filter((_, i) => i !== index));
};

export const clearCart = () => writeCart([]);

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setItems(readCart());
      setReady(true);
    };
    sync();
    window.addEventListener('cartUpdate', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('cartUpdate', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  return { items, ready, subtotal, count };
};
