'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, priceRange, productUrl } from '@/lib/api';
import type { ProductSummary } from '@/lib/types';
import WishlistButton from '@/components/WishlistButton';

/**
 * Product cards for "Popular Truck Parts". The home page is pre-built, so prices and stock are
 * refreshed from the API when the page opens (same products, same order - only live values change).
 */
export default function FeaturedGrid({ products: built }: { products: ProductSummary[] }) {
  const [products, setProducts] = useState(built);

  useEffect(() => {
    const controller = new AbortController();
    const ids = built.map((p) => p.id);
    Promise.all([
      api<ProductSummary[]>('/products', { query: { featured: true, per_page: 48 }, signal: controller.signal }),
      api<ProductSummary[]>('/products', { query: { per_page: 48 }, signal: controller.signal }),
    ])
      .then(([a, b]) => {
        const fresh = new Map([...b.data, ...a.data].map((p) => [p.id, p]));
        setProducts(ids.map((id, i) => fresh.get(id) ?? built[i]));
      })
      .catch(() => undefined); // keep the built copy if the API is unreachable
    return () => controller.abort();
  }, [built]);

  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {products.map((p) => {
            const price = priceRange(p.price_min, p.price_max);
            return (
              <li key={p.id} className="relative">
                <Link
                  href={productUrl(p)}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-[#00a550] hover:shadow-xl"
                >
                  <div className="relative aspect-square w-full bg-white p-4">
                    <img
                      src={p.image_url || '/images/fleet-x-icon.png'}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <span
                      className={`absolute left-3 top-3 rounded px-2 py-1 text-[11px] font-bold uppercase ${
                        p.in_stock ? 'bg-[#00a550]/10 text-[#00843f]' : 'bg-black/80 text-white'
                      }`}
                    >
                      {p.in_stock ? 'In stock' : 'Out of stock'}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col border-t border-gray-100 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      {[p.brand, p.sku && `#${p.sku}`].filter(Boolean).join(' · ')}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#1d1d1b] group-hover:text-[#00a550] md:text-base">
                      {p.name}
                    </h3>
                    <p className="mt-auto pt-3 text-lg font-bold text-gray-900">{price}</p>
                    <span className="mt-3 flex items-center justify-center rounded-md bg-gradient-to-r from-[#e9e611] to-[#00a34f] py-2.5 text-sm font-semibold text-white transition-opacity group-hover:opacity-90">
                      {price === 'Call for price' ? 'Get a quote' : 'View part'}
                    </span>
                  </div>
                </Link>
                <WishlistButton productId={p.id} productName={p.name} className="absolute right-3 top-3" />
              </li>
            );
          })}
    </ul>
  );
}
