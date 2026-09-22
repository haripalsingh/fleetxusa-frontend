'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  getCategories,
  getCategoryImage,
  getCategoryItems,
  matchKey,
  slugify,
} from '@/lib/categories';
import type { Category, Item } from '@/lib/categories';
import { resolveCategorySlug } from '@/lib/dummyProducts';

type SortOrder = 'default' | 'asc' | 'desc';

const PLACEHOLDER = '/images/fleet-x-icon.png';

// White bordered tile: big product image on top, name (and count) centred at the bottom.
const CARD_CLASS =
  'group flex flex-col aspect-[17/20] bg-white border border-gray-200 rounded transition-shadow hover:shadow-md';
const LABEL_CLASS =
  'px-3 pb-8 text-center text-sm md:text-[15px] font-semibold text-gray-900 group-hover:text-[#00a550] transition-colors';

const categoryHref = (c?: Category) =>
  c ? `/products/${resolveCategorySlug(c.name) ?? slugify(c.name)}` : '/products';

export default function ProductBrowser() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('category');

  const [categories, setCategories] = useState<Category[]>([]);
  const [itemsByCat, setItemsByCat] = useState<Record<string, Item[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    (async () => {
      try {
        const cats = await getCategories();
        if (cancelled) return;
        setCategories(cats);
        setLoading(false);
        // Load each category's products in parallel; counts fill in as they arrive.
        cats.forEach((c) => {
          getCategoryItems(c.id).then((list) => {
            if (!cancelled) setItemsByCat((prev) => ({ ...prev, [String(c.id)]: list }));
          });
        });
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const selected = useMemo(
    () => (slug ? categories.find((c) => matchKey(c.name) === matchKey(slug)) : undefined),
    [categories, slug]
  );

  const sortByName = <T extends { name: string }>(list: T[]): T[] => {
    if (sortOrder === 'asc') return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortOrder === 'desc') return [...list].sort((a, b) => b.name.localeCompare(a.name));
    return list;
  };

  const selectedItems = selected ? itemsByCat[String(selected.id)] : undefined;
  const itemsLoading = !!selected && selectedItems === undefined;
  const title = selected ? selected.name : 'Product Categories';
  const results = selected ? sortByName(selectedItems ?? []) : sortByName(categories);

  return (
    <div className="w-full bg-gray-100 font-display">
      {/* ---- Top bar: tab + breadcrumb ---- */}
      <div className="w-full bg-gray-200 border-b border-gray-300">
        <div className="max-w-[1320px] mx-auto px-4 flex flex-wrap items-stretch gap-x-6">
          <span className="hidden sm:flex items-center py-4 pr-6 border-r border-gray-400 font-heading text-sm font-bold text-gray-900">
            Shop Parts
          </span>
          <Link
            href="/products"
            className={`py-4 text-sm border-b-4 ${
              selected
                ? 'border-transparent text-gray-600 hover:text-[#00a550]'
                : 'border-[#00a550] text-gray-900 font-medium'
            }`}
          >
            Product Categories
          </Link>
          {selected && (
            <>
              <span aria-hidden="true" className="py-4 text-sm text-gray-500">
                &rsaquo;
              </span>
              <span className="py-4 text-sm border-b-4 border-[#00a550] text-gray-900 font-medium">
                {selected.name}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 py-8 md:py-12">
        {/* Mobile: toggle sidebar */}
        <button
          type="button"
          onClick={() => setFilterOpen((v) => !v)}
          aria-expanded={filterOpen}
          className="lg:hidden mb-6 w-full flex items-center justify-between rounded-lg bg-white border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900"
        >
          Shop By: {selected ? selected.name : 'All Categories'}
          <span className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`}>▾</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* ---- Sidebar ---- */}
          <aside className={`${filterOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="lg:sticky lg:top-4">
              <p className="text-sm font-bold text-gray-900">Product Category</p>
              <h2 className="font-heading text-xl font-bold text-gray-900 mt-2 mb-5">Shop By:</h2>
              <nav aria-label="Product categories" className="space-y-1">
                <Link
                  href="/products"
                  className={`block py-1 text-base hover:text-[#00a550] ${
                    !selected ? 'font-bold text-[#00a550]' : 'text-gray-800'
                  }`}
                >
                  All Categories
                </Link>
                {categories.map((c) => {
                  const list = itemsByCat[String(c.id)];
                  const active = selected?.id === c.id;
                  return (
                    <Link
                      key={c.id}
                      href={categoryHref(c)}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setFilterOpen(false)}
                      className={`block py-1 text-base leading-snug hover:text-[#00a550] ${
                        active ? 'font-bold text-[#00a550]' : 'text-gray-800'
                      }`}
                    >
                      {c.name}
                      {list ? ` (${list.length})` : ''}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* ---- Main ---- */}
          <main>
            <h1 className="font-heading text-xl md:text-2xl font-bold uppercase text-center text-gray-900 mb-8">
              {title}
            </h1>

            {loading && (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a550]" />
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            )}

            {!loading && error && (
              <div className="text-center py-16">
                <p className="text-gray-700 mb-4">
                  We couldn&apos;t load the products. Please try again.
                </p>
                <button
                  type="button"
                  onClick={() => setAttempt((n) => n + 1)}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-300">
                  <p className="text-sm text-gray-600">
                    {itemsLoading
                      ? 'Loading products...'
                      : `Showing all ${results.length} result${results.length !== 1 ? 's' : ''}`}
                  </p>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    aria-label="Sort"
                    className="text-sm border border-gray-300 bg-white rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00a550]/30"
                  >
                    <option value="default">Default sorting</option>
                    <option value="asc">Name: A to Z</option>
                    <option value="desc">Name: Z to A</option>
                  </select>
                </div>

                {!itemsLoading && results.length === 0 && (
                  <p className="text-center text-gray-600 py-12">
                    {selected ? 'No products in this category yet.' : 'No categories found.'}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {selected
                    ? (results as Item[]).map((item) => (
                        <Link
                          key={item.id}
                          href={`/sub-items?item=${item.id}&name=${encodeURIComponent(item.name)}&category=${slugify(selected.name)}`}
                          className={CARD_CLASS}
                        >
                          <div className="relative flex-1 m-6">
                            <img
                              src={item.image_url || PLACEHOLDER}
                              alt={item.name}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-contain"
                            />
                          </div>
                          <p className={LABEL_CLASS}>{item.name}</p>
                        </Link>
                      ))
                    : (results as Category[]).map((c) => {
                        const list = itemsByCat[String(c.id)];
                        return (
                          <Link key={c.id} href={categoryHref(c)} className={CARD_CLASS}>
                            <div className="relative flex-1 m-6">
                              <img
                                src={getCategoryImage(c) || PLACEHOLDER}
                                alt={c.name}
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-contain"
                              />
                            </div>
                            <p className={LABEL_CLASS}>
                              {c.name}
                              {list ? ` (${list.length})` : ''}
                            </p>
                          </Link>
                        );
                      })}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
