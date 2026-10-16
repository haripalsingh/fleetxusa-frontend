'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, priceRange, productUrl } from '@/lib/api';
import { removeFromWishlist, useWishlist, wishlistErrorMessage } from '@/lib/wishlist';
import type { ProductSummary } from '@/lib/types';

export default function AccountWishlist() {
  const { ids, ready } = useWishlist();
  // Last fetched product cards, tagged with the id list they were loaded for.
  const [loaded, setLoaded] = useState<{ key: string; products: ProductSummary[] } | null>(null);
  const [error, setError] = useState('');
  const key = ids.join(',');

  useEffect(() => {
    if (!ready || !key) return;
    const controller = new AbortController();
    api<ProductSummary[]>('/products', { query: { ids: key, per_page: 100 }, signal: controller.signal })
      .then((res) => setLoaded({ key, products: res.data }))
      .catch((e) => {
        if (!(e instanceof DOMException && e.name === 'AbortError')) setError('Could not load your wish list.');
      });
    return () => controller.abort();
  }, [ready, key]);

  // Show saved products in wish-list order; a removal hides the card immediately.
  const byId = new Map((loaded?.products ?? []).map((p) => [p.id, p]));
  const products = ids.map((id) => byId.get(id)).filter((p): p is ProductSummary => !!p);
  const loading = !!key && !ids.every((id) => byId.has(id)) && loaded?.key !== key && !error;

  const remove = async (id: number) => {
    setError('');
    try {
      await removeFromWishlist(id);
    } catch (err) {
      setError(wishlistErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">My Wish List</h1>
      <p className="mt-1 text-sm text-gray-600">Parts you saved for later.</p>

      {error && (
        <p role="alert" className="mt-4 border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {!ready || loading ? (
        <div className="mt-8 h-40 animate-pulse rounded-xl bg-gray-100" />
      ) : products.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-gray-700">Your wish list is empty.</p>
          <p className="mt-1 text-sm text-gray-500">Tap the heart on any part to save it here.</p>
          <Link
            href="/products"
            className="mt-6 inline-block px-8 py-3 text-sm font-bold uppercase text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90"
          >
            Shop Parts
          </Link>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-4 p-4">
              <Link href={productUrl(p)} className="h-20 w-20 flex-shrink-0 rounded-lg border border-gray-100 bg-white p-2">
                <img src={p.image_url || '/images/fleet-x-icon.png'} alt={p.name} className="h-full w-full object-contain" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={productUrl(p)} className="line-clamp-2 font-semibold text-gray-900 hover:text-[#00a550]">
                  {p.name}
                </Link>
                <p className="mt-0.5 text-xs text-gray-500">{[p.brand, p.sku && `#${p.sku}`].filter(Boolean).join(' · ')}</p>
                <p className="mt-1 text-sm font-bold text-gray-900">
                  {priceRange(p.price_min, p.price_max)}
                  {!p.in_stock && <span className="ml-2 text-xs font-medium text-red-600">Out of stock</span>}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                <Link
                  href={productUrl(p)}
                  className="px-4 py-2 text-xs font-bold uppercase text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90"
                >
                  View
                </Link>
                <button type="button" onClick={() => remove(p.id)} className="px-3 py-2 text-xs text-gray-600 underline hover:text-red-600">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
