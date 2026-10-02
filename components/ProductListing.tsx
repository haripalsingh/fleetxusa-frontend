'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { api, priceRange, productUrl } from '@/lib/api';
import type { Category, ProductListResult, ProductSummary } from '@/lib/types';

type SortKey = 'best' | 'price-asc' | 'price-desc' | 'name' | 'newest';

const priceLabel = (p: ProductSummary) => priceRange(p.price_min, p.price_max);

const RANGE_CLASS =
  'absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-none ' +
  '[&::-webkit-slider-runnable-track]:bg-transparent ' +
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none ' +
  '[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full ' +
  '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-[#00a550] ' +
  '[&::-webkit-slider-thumb]:cursor-pointer ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 ' +
  '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4 ' +
  '[&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-[#00a550] [&::-moz-range-thumb]:cursor-pointer';

const Panel = ({ title, children }: { title: string; children: ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <section className="mb-6 overflow-hidden rounded-xl bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between bg-black text-white px-6 py-4 text-left font-bold uppercase tracking-wide"
      >
        {title}
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 transition-transform ${open ? '' : '-rotate-90'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="bg-white p-6">{children}</div>}
    </section>
  );
};

const CheckList = ({
  options,
  selected,
  onToggle,
}: {
  options: { value: string; label: string; count: number }[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) => (
  <ul className="max-h-[260px] overflow-y-auto pr-2">
    {options.map((o) => (
      <li key={o.value}>
        <label className="flex items-center gap-3 py-1.5 cursor-pointer text-[15px] text-gray-900">
          <input
            type="checkbox"
            checked={selected.has(o.value)}
            onChange={() => onToggle(o.value)}
            className="h-5 w-5 shrink-0 accent-[#00a550]"
          />
          <span>
            {o.label} <span className="text-gray-500">({o.count})</span>
          </span>
        </label>
      </li>
    ))}
    {options.length === 0 && <li className="py-2 text-sm text-gray-500">No matches</li>}
  </ul>
);

export default function ProductListing({
  category,
  initial,
  query = '',
}: {
  /** Omit to show every product (the /products page). */
  category?: Category | null;
  /** First page rendered on the server. */
  initial: ProductListResult;
  /** Search term from ?q= */
  query?: string;
}) {
  const [result, setResult] = useState<ProductListResult>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const bounds = useMemo(() => {
    const max = Math.max(10, Math.ceil((initial.facets?.price.max ?? 0) / 10) * 10);
    return { min: 0, max };
  }, [initial.facets]);
  const facets = result.facets ?? initial.facets;

  const [types, setTypes] = useState<Set<string>>(new Set());
  const [colors, setColors] = useState<Set<string>>(new Set());
  const [cats, setCats] = useState<Set<string>>(new Set());
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [low, setLow] = useState(bounds.min);
  const [high, setHigh] = useState(bounds.max);
  const [perPage, setPerPage] = useState(initial.meta.per_page || 24);
  const [sort, setSort] = useState<SortKey>('best');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const gridTop = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const priceActive = low > bounds.min || high < bounds.max;
  const filtersActive = cats.size > 0 || types.size > 0 || colors.size > 0 || brands.size > 0 || priceActive;

  // Fetch whenever a filter changes (debounced so dragging the price slider doesn't spam the API)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api<ProductSummary[]>('/products', {
          signal: controller.signal,
          query: {
            category: category?.slug,
            categories: [...cats],
            q: query,
            type: [...types],
            color: [...colors],
            brand: [...brands],
            min_price: priceActive ? low : null,
            max_price: priceActive ? high : null,
            sort,
            page,
            per_page: perPage,
          },
        });
        setResult({ data: res.data, meta: res.meta as ProductListResult['meta'], facets: res.facets! });
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          setError(err instanceof Error ? err.message : 'Could not load products.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [category?.slug, cats, types, colors, brands, low, high, priceActive, sort, page, perPage, query]);

  const toggle = (setter: typeof setTypes) => (value: string) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
    setPage(1);
  };

  const setPrice = (lo: number, hi: number) => {
    setLow(Math.max(bounds.min, Math.min(lo, hi)));
    setHigh(Math.min(bounds.max, Math.max(hi, lo)));
    setPage(1);
  };

  const clearFilters = () => {
    setCats(new Set());
    setTypes(new Set());
    setColors(new Set());
    setBrands(new Set());
    setLow(bounds.min);
    setHigh(bounds.max);
    setPage(1);
  };

  const goTo = (n: number) => {
    setPage(n);
    gridTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const { data: products, meta } = result;
  const totalPages = meta.total_pages;
  const current = meta.page;
  const start = (current - 1) * meta.per_page;

  const pct = (v: number) => ((v - bounds.min) / (bounds.max - bounds.min)) * 100;

  const pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === totalPages || Math.abs(n - current) <= 1
  );

  const title = query ? `Search results for “${query}”` : category ? category.name : 'All Products';

  return (
    <div className="w-full bg-[#f0f0f0] font-display">
      <div className="max-w-[1500px] mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-gray-600 text-lg">
          {category || query ? (
            <>
              <Link href="/products" className="hover:text-[#00a550]">
                All Products
              </Link>
              <span className="mx-2" aria-hidden="true">
                &rsaquo;
              </span>
              <span className="font-semibold text-gray-900">{title}</span>
            </>
          ) : (
            <span className="font-semibold text-gray-900">All Products</span>
          )}
        </nav>
        <h1 className={query ? 'text-2xl font-bold text-gray-900 mb-6' : 'sr-only'}>{title}</h1>

        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className="lg:hidden mb-6 w-full rounded-xl flex items-center justify-between bg-black text-white px-5 py-3 font-bold uppercase"
        >
          Filters{filtersActive ? ' (active)' : ''}
          <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-6 lg:gap-8">
          {/* ---- Filters ---- */}
          <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
            {facets.brands.length > 0 && (
              <Panel title="Brand">
                <CheckList
                  options={facets.brands.map((c) => ({ value: c.value, label: c.value, count: c.count }))}
                  selected={brands}
                  onToggle={toggle(setBrands)}
                />
              </Panel>
            )}

            <Panel title="Price Retail">
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { label: 'Minimum price', value: low, set: (v: number) => setPrice(v, high) },
                  { label: 'Maximum price', value: high, set: (v: number) => setPrice(low, v) },
                ].map((f) => (
                  <label key={f.label} className="flex items-center rounded-lg border border-gray-300 px-3 py-3 text-gray-900">
                    <span className="mr-1">$</span>
                    <input
                      type="number"
                      min={bounds.min}
                      max={bounds.max}
                      value={f.value}
                      aria-label={f.label}
                      onChange={(e) => f.set(Number(e.target.value) || 0)}
                      className="w-full min-w-0 bg-transparent focus:outline-none"
                    />
                  </label>
                ))}
              </div>
              <div className="relative h-8 mx-2">
                <div className="absolute top-1/2 -translate-y-1/2 h-1 w-full rounded bg-gray-300" />
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-1 rounded bg-[#00a550]"
                  style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%` }}
                />
                <input
                  type="range"
                  aria-label="Minimum price slider"
                  min={bounds.min}
                  max={bounds.max}
                  value={low}
                  onChange={(e) => setPrice(Number(e.target.value), high)}
                  style={{ zIndex: low > bounds.max - (bounds.max - bounds.min) * 0.1 ? 5 : 3 }}
                  className={RANGE_CLASS}
                />
                <input
                  type="range"
                  aria-label="Maximum price slider"
                  min={bounds.min}
                  max={bounds.max}
                  value={high}
                  onChange={(e) => setPrice(low, Number(e.target.value))}
                  style={{ zIndex: 4 }}
                  className={RANGE_CLASS}
                />
              </div>
            </Panel>

            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="w-full rounded-xl border border-gray-400 bg-white py-3 text-sm font-semibold text-gray-900 hover:border-[#00a550] hover:text-[#00a550]"
              >
                Clear all filters
              </button>
            )}
          </aside>

          {/* ---- Results ---- */}
          <main aria-busy={loading}>
            <div ref={gridTop} className="scroll-mt-4" />
            <p className="text-2xl md:text-3xl text-gray-800 mb-6">
              {meta.total === 0
                ? 'Showing 0 of 0'
                : `Showing ${start + 1}-${Math.min(start + meta.per_page, meta.total)} of ${meta.total}`}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <label className="flex items-center gap-3 bg-white border border-gray-200 px-5 py-4 text-gray-500 rounded-md">
                <span>Products Per Page:</span>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-transparent text-gray-900 focus:outline-none"
                >
                  {[12, 24, 48].map((n) => (
                    <option key={n} value={n}>
                      {n} Items Per Page
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-3 bg-white border border-gray-200 px-5 py-4 text-gray-500 rounded-md">
                <span>Sort By:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortKey);
                    setPage(1);
                  }}
                  className="bg-transparent text-gray-900 focus:outline-none"
                >
                  <option value="best">Best Match</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </label>
            </div>

            {error && (
              <div role="alert" className="mb-5 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {products.length === 0 ? (
              <div className="bg-white py-16 text-center text-gray-700">
                <p className="mb-4">{filtersActive ? 'No products match your filters.' : 'No products found.'}</p>
                {filtersActive && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 transition-opacity ${
                  loading ? 'opacity-50' : ''
                }`}
              >
                {products.map((p) => (
                  <Link
                    key={p.id}
                    href={productUrl(p)}
                    className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-white p-5">
                      <img
                        src={p.image_url || '/images/fleet-x-icon.png'}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      {!p.in_stock && (
                        <span className="absolute left-3 top-3 rounded bg-black/80 px-2 py-1 text-[11px] font-bold uppercase text-white">
                          Out of stock
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col items-center gap-1.5 border-t border-gray-100 px-4 pt-4 pb-5 text-center">
                      <h2 className="line-clamp-2 min-h-[2.75rem] text-[17px] font-bold uppercase leading-snug text-[#878787] transition-colors group-hover:text-[#00a550]">
                        {p.name}
                      </h2>
                      {p.brand && <p className="text-[15px] text-gray-400">{p.brand}</p>}
                      <p className="mt-auto pt-2 text-[18px] font-bold text-gray-900">{priceLabel(p)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={current === 1}
                  onClick={() => goTo(current - 1)}
                  className="h-10 rounded-md px-4 bg-white border border-gray-300 text-sm text-gray-900 hover:border-[#00a550] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                {pageButtons.map((n, i) => (
                  <span key={n} className="flex items-center gap-2">
                    {i > 0 && n - pageButtons[i - 1] > 1 && <span className="text-gray-500">…</span>}
                    <button
                      type="button"
                      onClick={() => goTo(n)}
                      aria-current={n === current ? 'page' : undefined}
                      className={`h-10 min-w-10 px-3 border text-sm rounded-md ${
                        n === current
                          ? 'bg-black text-white border-black'
                          : 'bg-white border-gray-300 text-gray-900 hover:border-[#00a550]'
                      }`}
                    >
                      {n}
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  disabled={current === totalPages}
                  onClick={() => goTo(current + 1)}
                  className="h-10 rounded-md px-4 bg-white border border-gray-300 text-sm text-gray-900 hover:border-[#00a550] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
