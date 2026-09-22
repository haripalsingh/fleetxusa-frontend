'use client';

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import Link from 'next/link';
import type { DummyCategory, DummyProduct } from '@/lib/dummyProducts';
import { addToCart } from '@/lib/cart';

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const OPTIONS = ['Standard Fit', 'With Hardware Kit', 'With Mounting Straps'];

const TABS = [
  { key: 'description', label: 'Description' },
  { key: 'videos', label: 'Videos' },
  { key: 'warranty', label: 'Warranty Information' },
  { key: 'additional', label: 'Additional Information' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'qa', label: 'Questions & Answers' },
] as const;

type TabKey = (typeof TABS)[number]['key'];
type Thumb = { kind: 'video' } | { kind: 'image'; label: string };

const THUMBS: Thumb[] = [
  { kind: 'video' },
  { kind: 'image', label: 'Front view' },
  { kind: 'image', label: 'Side view' },
];

const PlayIcon = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M6 3l15 9-15 9V3z" fill="currentColor" />
  </svg>
);

export default function ProductDetail({
  category,
  product,
}: {
  category: DummyCategory;
  product: DummyProduct;
}) {
  const [thumb, setThumb] = useState(1);
  const [option, setOption] = useState(OPTIONS[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabKey>('description');
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);

  const isRange = product.priceMax > product.priceMin;
  const price = isRange
    ? `${money(product.priceMin)} - ${money(product.priceMax)}`
    : money(product.priceMin);
  const active = THUMBS[thumb];

  const setQuantity = (n: number) => setQty(Math.max(1, Math.min(99, n)));

  return (
    <div className="w-full bg-[#f0f0f0] font-display">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold uppercase text-gray-400"
        >
          <Link href="/" className="hover:text-[#00a550]">Home</Link>
          <span aria-hidden="true">&rsaquo;</span>
          <Link href="/products" className="hover:text-[#00a550]">All Products</Link>
          <span aria-hidden="true">&rsaquo;</span>
          <Link href={`/products/${category.slug}`} className="hover:text-[#00a550]">
            {category.name}
          </Link>
          <span aria-hidden="true">&rsaquo;</span>
          <span>{product.type}</span>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-black">{product.name}</span>
        </nav>

        {/* ---- Main card ---- */}
        <div className="bg-white border border-gray-200 shadow-sm p-5 md:p-8 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 md:gap-10">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[4/3] w-full bg-white flex items-center justify-center">
              {active.kind === 'video' ? (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gray-900 text-white">
                  <PlayIcon className="h-16 w-16 text-red-600" />
                  <p className="mt-3 text-sm">Product video coming soon</p>
                </div>
              ) : (
                <img
                  src={product.image}
                  alt={`${product.name} - ${active.label}`}
                  className={`h-full w-full object-contain ${thumb === 2 ? '-scale-x-100' : ''}`}
                />
              )}
            </div>
            <div className="mt-6 flex gap-3">
              {THUMBS.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setThumb(i)}
                  aria-label={t.kind === 'video' ? 'Play video' : t.label}
                  aria-pressed={thumb === i}
                  className={`h-[62px] w-[62px] sm:h-[76px] sm:w-[76px] flex flex-col items-center justify-center bg-white border ${
                    thumb === i ? 'border-black border-2' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {t.kind === 'video' ? (
                    <>
                      <PlayIcon className="h-8 w-8 text-red-600" />
                      <span className="text-[10px] text-gray-800">Play Video</span>
                    </>
                  ) : (
                    <img
                      src={product.image}
                      alt=""
                      className={`h-full w-full object-cover ${i === 2 ? '-scale-x-100' : ''}`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Purchase panel */}
          <div>
            <h1 className="text-2xl md:text-[28px] font-bold leading-tight text-gray-900">
              {product.name}
            </h1>
            <p className="mt-2 pb-2 border-b border-gray-300 text-xs font-semibold uppercase text-gray-500">
              {product.brand}
            </p>

            <p className="mt-5 text-3xl font-medium text-gray-900">{price}</p>
            <p className="mt-4 text-xs text-gray-900">
              <span className="font-bold">SKU:</span> <span className="ml-1">{product.sku}</span>
            </p>

            <div className="mt-4 border border-green-800/60 bg-green-50 px-3 py-2 text-xs text-gray-900">
              <p className="font-bold">In Stock. Ships Within 1-3 Business Days*</p>
              <p>* Date estimate based on your delivery location</p>
            </div>

            <p className="mt-4 text-[11px] text-gray-600">
              Pay in 4 interest-free payments of {money(product.priceMin / 4)}
            </p>

            <div className="mt-5">
              <label htmlFor="option" className="text-xs font-bold uppercase text-gray-900">
                Choose Option{' '}
                <span className="ml-1 text-[11px] font-semibold text-gray-400">Required</span>
              </label>
              <select
                id="option"
                value={option}
                onChange={(e) => setOption(e.target.value)}
                className="mt-2 block w-full max-w-[290px] border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#00a550]"
              >
                {OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <p className="mt-5 text-xs font-bold text-green-700">In Stock!</p>

            <p className="mt-4 text-xs font-bold uppercase text-gray-900">Quantity:</p>
            <div className="mt-2 inline-flex items-stretch border border-gray-300">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity(qty - 1)}
                className="h-8 w-8 text-gray-700 hover:bg-gray-100"
              >
                &minus;
              </button>
              <input
                type="number"
                min={1}
                max={99}
                value={qty}
                aria-label="Quantity"
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="h-8 w-12 border-x border-gray-300 text-center text-xs [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity(qty + 1)}
                className="h-8 w-8 text-gray-700 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-3">
              <button
                type="button"
                onClick={() => {
                  addToCart(
                    {
                      id: product.id,
                      type: 'product',
                      name: product.name,
                      part_number: product.sku,
                      option,
                      price: product.priceMin,
                      image_url: product.image,
                    },
                    qty
                  );
                  setAdded(true);
                }}
                className="py-3 text-xs font-bold uppercase text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90 transition-opacity"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => setWished((v) => !v)}
                aria-pressed={wished}
                className="flex items-center justify-between border border-gray-300 bg-white px-4 py-3 text-xs font-bold uppercase text-gray-900 hover:border-[#00a550]"
              >
                <span className="flex-1 text-center">
                  {wished ? 'In Wish List' : 'Add to Wish List'}
                </span>
                <svg viewBox="0 0 20 20" className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {added && (
              <div role="status" className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-green-300 bg-green-50 px-3 py-2 text-xs text-green-800">
                <span>
                  Added {qty} &times; {product.name} to your cart.
                </span>
                <Link href="/checkout" className="font-bold uppercase underline hover:text-[#00a550]">
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ---- Tabs ---- */}
        <div className="mt-6 bg-white border border-gray-200 shadow-sm">
          <div role="tablist" className="flex flex-wrap border-b border-gray-200 bg-gray-50">
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                type="button"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-4 text-[11px] font-bold uppercase border-r border-gray-200 ${
                  tab === t.key
                    ? 'bg-white text-[#00a550]'
                    : 'text-gray-900 hover:text-[#00a550]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div role="tabpanel" className="p-5 md:p-8 text-sm leading-relaxed text-gray-800">
            {tab === 'description' && (
              <>
                <h2 className="font-bold text-gray-900 mb-6">{product.name}</h2>
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="mb-4">
                  {product.brand} {product.type.toLowerCase()} designed for heavy-duty trucks and
                  fleet duty cycles. Built to hold up to long hauls, heat and vibration, so your
                  trucks spend more time on the road and less time in the shop.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Category: {category.name}</li>
                  <li>Finish / color: {product.color}</li>
                  <li>Direct-fit design for common Class 8 applications</li>
                  <li>Verify fitment with your VIN before ordering</li>
                </ul>
              </>
            )}
            {tab === 'videos' && <p>No videos are available for this product yet.</p>}
            {tab === 'warranty' && (
              <p>
                This product is backed by the manufacturer&apos;s warranty against defects in
                material and workmanship. Contact our support team with your order number for
                warranty assistance.
              </p>
            )}
            {tab === 'additional' && (
              <table className="w-full max-w-xl text-left">
                <tbody className="divide-y divide-gray-200">
                  {[
                    ['SKU', product.sku],
                    ['Brand', product.brand],
                    ['Category', category.name],
                    ['Product type', product.type],
                    ['Color', product.color],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <th scope="row" className="py-2 pr-4 font-bold text-gray-900 w-40">{k}</th>
                      <td className="py-2">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {tab === 'reviews' && <p>There are no reviews for this product yet.</p>}
            {tab === 'qa' && (
              <p>
                No questions yet. Have a question about this part?{' '}
                <Link href="/contact" className="text-[#00a550] underline">
                  Contact us
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
