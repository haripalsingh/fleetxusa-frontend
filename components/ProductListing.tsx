'use client';

/* eslint-disable @next/next/no-img-element */

import { useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import type { DummyCategory, DummyProduct } from '@/lib/dummyProducts';

type SortKey = 'best' | 'price-asc' | 'price-desc' | 'name';

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const priceLabel = (p: DummyProduct) =>
  p.priceMax > p.priceMin ? `${money(p.priceMin)}-${money(p.priceMax)}` : money(p.priceMin);

const countBy = (products: DummyProduct[], key: 'type' | 'color' | 'categoryName') => {
  const map = new Map<string, number>();
  products.forEach((p) => map.set(p[key], (map.get(p[key]) ?? 0) + 1));
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
};

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
    <section className="mb-6 shadow-sm">
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
  options: [string, number][];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) => (
  <ul className="max-h-[260px] overflow-y-auto pr-2">
    {options.map(([value, count]) => (
      <li key={value}>
        <label className="flex items-center gap-3 py-1.5 cursor-pointer text-[15px] text-gray-900">
          <input
            type="checkbox"
            checked={selected.has(value)}
            onChange={() => onToggle(value)}
            className="h-5 w-5 shrink-0 accent-[#00a550]"
          />
          <span>
            {value} <span className="text-gray-500">({count})</span>
          </span>
        </label>
      </li>
    ))}
    {options.length === 0 && <li className="py-2 text-sm text-gray-500">No matches</li>}
  </ul>
);

export default function ProductListing({
  category,
  products,
}: {
  /** Omit to show every product (the /products page). */
  category?: DummyCategory;
  products: DummyProduct[];
}) {
  const bounds = useMemo(() => {
    const max = Math.ceil(Math.max(...products.map((p) => p.priceMax)) / 10) * 10;
    return { min: 0, max };
  }, [products]);

  const typeCounts = useMemo(() => countBy(products, 'type'), [products]);
  const colorCounts = useMemo(() => countBy(products, 'color'), [products]);
  const categoryCounts = useMemo(() => countBy(products, 'categoryName'), [products]);

  const [lookup, setLookup] = useState('');
  const [types, setTypes] = useState<Set<string>>(new Set());
  const [colors, setColors] = useState<Set<string>>(new Set());
  const [cats, setCats] = useState<Set<string>>(new Set());
  const [low, setLow] = useState(bounds.min);
  const [high, setHigh] = useState(bounds.max);
  const [perPage, setPerPage] = useState(24);
  const [sort, setSort] = useState<SortKey>('best');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const gridTop = useRef<HTMLDivElement>(null);

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

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (cats.size === 0 || cats.has(p.categoryName)) &&
        (types.size === 0 || types.has(p.type)) &&
        (colors.size === 0 || colors.has(p.color)) &&
        p.priceMax >= low &&
        p.priceMin <= high
    );
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.priceMin - b.priceMin);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.priceMin - a.priceMin);
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, cats, types, colors, low, high, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * perPage;
  const visible = filtered.slice(start, start + perPage);
  const filtersActive = cats.size > 0 || types.size > 0 || colors.size > 0 || low > bounds.min || high < bounds.max;

  const clearFilters = () => {
    setCats(new Set());
    setTypes(new Set());
    setColors(new Set());
    setLookup('');
    setLow(bounds.min);
    setHigh(bounds.max);
    setPage(1);
  };

  const goTo = (n: number) => {
    setPage(n);
    gridTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const visibleTypes = typeCounts.filter(([t]) => t.toLowerCase().includes(lookup.trim().toLowerCase()));
  const pct = (v: number) => ((v - bounds.min) / (bounds.max - bounds.min)) * 100;

  const pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === totalPages || Math.abs(n - current) <= 1
  );

  return (
    <div className="w-full bg-[#f0f0f0] font-display">
      <div className="max-w-[1500px] mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600">
          {category ? (
            <>
              <Link href="/products" className="hover:text-[#00a550]">
                All Products
              </Link>
              <span className="mx-2" aria-hidden="true">
                &rsaquo;
              </span>
              <span className="font-semibold text-gray-900">{category.name}</span>
            </>
          ) : (
            <span className="font-semibold text-gray-900">All Products</span>
          )}
        </nav>
        <h1 className="sr-only">{category ? category.name : 'All Products'}</h1>

        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className="lg:hidden mb-6 w-full flex items-center justify-between bg-black text-white px-5 py-3 font-bold uppercase"
        >
          Filters{filtersActive ? ' (active)' : ''}
          <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-6 lg:gap-8">
          {/* ---- Filters ---- */}
          <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
            {!category && (
              <Panel title="Category">
                <CheckList options={categoryCounts} selected={cats} onToggle={toggle(setCats)} />
              </Panel>
            )}

            <Panel title="Product Type">
              <input
                type="search"
                value={lookup}
                onChange={(e) => setLookup(e.target.value)}
                placeholder="Quick Lookup"
                aria-label="Quick lookup product type"
                className="w-full mb-5 px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#00a550]"
              />
              <CheckList options={visibleTypes} selected={types} onToggle={toggle(setTypes)} />
            </Panel>

            <Panel title="Price Retail">
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { label: 'Minimum price', value: low, set: (v: number) => setPrice(v, high) },
                  { label: 'Maximum price', value: high, set: (v: number) => setPrice(low, v) },
                ].map((f) => (
                  <label key={f.label} className="flex items-center border border-gray-300 px-3 py-3 text-gray-900">
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

            <Panel title="Color">
              <CheckList options={colorCounts} selected={colors} onToggle={toggle(setColors)} />
            </Panel>

            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="w-full border border-gray-400 bg-white py-3 text-sm font-semibold text-gray-900 hover:border-[#00a550] hover:text-[#00a550]"
              >
                Clear all filters
              </button>
            )}
          </aside>

          {/* ---- Results ---- */}
          <main>
            <div ref={gridTop} className="scroll-mt-4" />
            <p className="text-2xl md:text-3xl text-gray-800 mb-6">
              {filtered.length === 0
                ? 'Showing 0 of 0'
                : `Showing ${start + 1}-${Math.min(start + perPage, filtered.length)} of ${filtered.length}`}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <label className="flex items-center gap-3 bg-white border border-gray-200 px-5 py-4 text-gray-500">
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
              <label className="flex items-center gap-3 bg-white border border-gray-200 px-5 py-4 text-gray-500">
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
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </label>
            </div>

            {visible.length === 0 ? (
              <div className="bg-white py-16 text-center text-gray-700">
                <p className="mb-4">No products match your filters.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {visible.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.categorySlug}/${p.id}`}
                    className="group flex flex-col bg-white shadow-sm transition-shadow hover:shadow-lg"
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col items-center px-3 pt-5 pb-6 text-center">
                      <h2 className="text-[15px] leading-snug text-gray-900 group-hover:text-[#00a550] transition-colors">{p.name}</h2>
                      <p className="mt-3 text-[15px] text-gray-500">{p.brand}</p>
                      <p className="mt-auto pt-4 text-[15px] font-bold text-red-600">{priceLabel(p)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={current === 1}
                  onClick={() => goTo(current - 1)}
                  className="px-4 py-2 bg-white border border-gray-300 text-sm disabled:opacity-40"
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
                      className={`h-10 min-w-10 px-3 border text-sm ${
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
                  className="px-4 py-2 bg-white border border-gray-300 text-sm disabled:opacity-40"
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
