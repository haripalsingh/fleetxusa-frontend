'use client';

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ApiError, formatMoney, priceOrCall, priceRange, productUrl } from '@/lib/api';
import { addToCart } from '@/lib/cart';
import type { Product } from '@/lib/types';

const TABS = [
  { key: 'description', label: 'Description' },
  { key: 'additional', label: 'Additional Information' },
] as const;

type TabKey = (typeof TABS)[number]['key'];
type Slide = { kind: 'video'; url: string } | { kind: 'image'; url: string; alt: string };

const PlayIcon = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M6 3l15 9-15 9V3z" fill="currentColor" />
  </svg>
);

const PLACEHOLDER = '/images/fleet-x-icon.png';

export default function ProductDetail({ product }: { product: Product }) {
  const variants = useMemo(() => product.variants.filter((v) => v.is_active), [product.variants]);
  const firstInStock = variants.find((v) => v.in_stock) ?? variants[0];

  const slides = useMemo<Slide[]>(() => {
    const imgs: Slide[] = product.images.map((i) => ({ kind: 'image', url: i.url, alt: i.alt || product.name }));
    if (!imgs.length) imgs.push({ kind: 'image', url: PLACEHOLDER, alt: product.name });
    return product.video_url ? [{ kind: 'video', url: product.video_url }, ...imgs] : imgs;
  }, [product]);

  const [slide, setSlide] = useState(product.video_url ? 1 : 0);
  const [variantId, setVariantId] = useState<number | undefined>(firstInStock?.id);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabKey>('description');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [wished, setWished] = useState(false);

  const variant = variants.find((v) => v.id === variantId) ?? firstInStock;
  const hasOptions = variants.length > 1;
  const stock = variant?.stock ?? 0;
  const inStock = stock > 0;
  const maxQty = Math.max(1, Math.min(99, stock));
  const active = slides[slide] ?? slides[0];

  const unitPrice = variant ? variant.price : product.price_min;
  // price 0 in the catalog = "Call for price": shown, but not purchasable online
  const callForPrice = !(unitPrice > 0);
  const price = priceOrCall(unitPrice);
  const rangeLabel =
    product.price_max > product.price_min && product.price_min > 0
      ? `${formatMoney(product.price_min)} - ${formatMoney(product.price_max)}`
      : null;

  const setQuantity = (n: number) => setQty(Math.max(1, Math.min(maxQty, n)));

  const handleAdd = async () => {
    if (!variant) return;
    setError('');
    setAdded(null);
    setAdding(true);
    try {
      await addToCart(variant.id, qty);
      setAdded(qty);
    } catch (err) {
      setError(err instanceof ApiError ? err.firstError : 'Could not add this item. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const specs: [string, string][] = [
    ['SKU', variant?.sku ?? product.sku],
    ...(product.brand ? [['Brand', product.brand] as [string, string]] : []),
    ...(product.category ? [['Category', product.category.name] as [string, string]] : []),
    ...(product.product_type ? [['Product type', product.product_type] as [string, string]] : []),
    ...(variant?.color ? [['Color', variant.color] as [string, string]] : []),
    ...(variant?.size ? [['Size', variant.size] as [string, string]] : []),
    ...(product.weight_lbs ? [['Weight', `${product.weight_lbs} lbs`] as [string, string]] : []),
    ...product.specifications.map((s) => [s.label, s.value] as [string, string]),
  ];

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
          {product.category && (
            <>
              <span aria-hidden="true">&rsaquo;</span>
              <Link href={`/products/${product.category.slug}`} className="hover:text-[#00a550]">
                {product.category.name}
              </Link>
            </>
          )}
          {product.product_type && (
            <>
              <span aria-hidden="true">&rsaquo;</span>
              <span>{product.product_type}</span>
            </>
          )}
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-black">{product.name}</span>
        </nav>

        {/* ---- Main card ---- */}
        <div className="bg-white border border-gray-200 shadow-sm p-5 md:p-8 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 md:gap-10">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[4/3] w-full bg-white flex items-center justify-center">
              {active.kind === 'video' ? (
                <iframe
                  src={active.url}
                  title={`${product.name} video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img src={active.url} alt={active.alt} className="h-full w-full object-contain" />
              )}
            </div>
            {slides.length > 1 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {slides.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSlide(i)}
                    aria-label={s.kind === 'video' ? 'Play video' : `Image ${i + 1}`}
                    aria-pressed={slide === i}
                    className={`h-[62px] w-[62px] sm:h-[76px] sm:w-[76px] flex flex-col items-center justify-center bg-white border ${
                      slide === i ? 'border-black border-2' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {s.kind === 'video' ? (
                      <>
                        <PlayIcon className="h-8 w-8 text-red-600" />
                        <span className="text-[10px] text-gray-800">Play Video</span>
                      </>
                    ) : (
                      <img src={s.url} alt="" className="h-full w-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Purchase panel */}
          <div>
            <h1 className="text-2xl md:text-[28px] font-bold leading-tight text-gray-900">{product.name}</h1>
            {product.brand && (
              <p className="mt-2 pb-2 border-b border-gray-300 text-xs font-semibold uppercase text-gray-500">
                {product.brand}
              </p>
            )}

            <p className="mt-5 text-3xl font-medium text-gray-900">
              {price}
              {variant?.compare_at_price && variant.compare_at_price > variant.price && (
                <span className="ml-3 text-lg text-gray-400 line-through">{formatMoney(variant.compare_at_price)}</span>
              )}
            </p>
            {hasOptions && rangeLabel && <p className="mt-1 text-xs text-gray-500">Options from {rangeLabel}</p>}
            <p className="mt-4 text-xs text-gray-900">
              <span className="font-bold">SKU:</span> <span className="ml-1">{variant?.sku ?? product.sku}</span>
            </p>

            {inStock ? (
              <div className="mt-4 border border-green-800/60 bg-green-50 px-3 py-2 text-xs text-gray-900">
                <p className="font-bold">In Stock. Ships Within 1-3 Business Days*</p>
                <p>* Date estimate based on your delivery location</p>
              </div>
            ) : (
              <div className="mt-4 border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800">
                <p className="font-bold">Out of stock</p>
                <p>
                  {hasOptions ? 'Try another option, or ' : ''}
                  <Link href="/contact" className="underline">contact us</Link> for availability.
                </p>
              </div>
            )}

            {callForPrice && (
              <p className="mt-4 text-xs text-gray-700">
                Pricing for this part is available on request.{' '}
                <Link href="/contact" className="font-semibold text-[#00a550] underline">Contact us</Link> for a quote.
              </p>
            )}

            {variant && !callForPrice && (
              <p className="mt-4 text-[11px] text-gray-600">
                Pay in 4 interest-free payments of {formatMoney(variant.price / 4)}
              </p>
            )}

            {hasOptions && (
              <div className="mt-5">
                <label htmlFor="option" className="text-xs font-bold uppercase text-gray-900">
                  Choose Option <span className="ml-1 text-[11px] font-semibold text-gray-400">Required</span>
                </label>
                <select
                  id="option"
                  value={variant?.id}
                  onChange={(e) => {
                    setVariantId(Number(e.target.value));
                    setQty(1);
                    setAdded(null);
                    setError('');
                  }}
                  className="mt-2 block w-full max-w-[290px] border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#00a550]"
                >
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} - {priceOrCall(v.price)}
                      {v.in_stock ? '' : ' (out of stock)'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {inStock && (
              <p className={`mt-5 text-xs font-bold ${stock <= 5 ? 'text-amber-600' : 'text-green-700'}`}>
                {stock <= 5 ? `Only ${stock} left in stock!` : 'In Stock!'}
              </p>
            )}

            <p className="mt-4 text-xs font-bold uppercase text-gray-900">Quantity:</p>
            <div className="mt-2 inline-flex items-stretch border border-gray-300">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity(qty - 1)}
                disabled={!inStock}
                className="h-8 w-8 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
              >
                &minus;
              </button>
              <input
                type="number"
                min={1}
                max={maxQty}
                value={qty}
                disabled={!inStock}
                aria-label="Quantity"
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="h-8 w-12 border-x border-gray-300 text-black text-center text-xs [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity(qty + 1)}
                disabled={!inStock}
                className="h-8 w-8 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
              >
                +
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-3">
              {callForPrice ? (
                <Link
                  href="/contact"
                  className="py-3 text-center text-xs font-bold uppercase text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90 transition-opacity"
                >
                  Call for Price
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!inStock || adding}
                  className="py-3 text-xs font-bold uppercase text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {adding ? 'Adding…' : inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setWished((v) => !v)}
                aria-pressed={wished}
                className="flex items-center justify-between border border-gray-300 bg-white px-4 py-3 text-xs font-bold uppercase text-gray-900 hover:border-[#00a550]"
              >
                <span className="flex-1 text-center">{wished ? 'In Wish List' : 'Add to Wish List'}</span>
                <svg viewBox="0 0 20 20" className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {error && (
              <p role="alert" className="mt-4 border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </p>
            )}
            {added !== null && (
              <div role="status" className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-green-300 bg-green-50 px-3 py-2 text-xs text-green-800">
                <span>
                  Added {added} &times; {product.name} to your cart.
                </span>
                <span className="flex gap-4">
                  <Link href="/cart" className="font-bold uppercase underline hover:text-[#00a550]">View Cart</Link>
                  <Link href="/checkout" className="font-bold uppercase underline hover:text-[#00a550]">Checkout</Link>
                </span>
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
                  tab === t.key ? 'bg-white text-[#00a550]' : 'text-gray-900 hover:text-[#00a550]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div role="tabpanel" className="p-5 md:p-8 text-sm leading-relaxed text-gray-800">
            {tab === 'description' && (
              <p className="whitespace-pre-line">{product.description || 'No description available yet.'}</p>
            )}
            {tab === 'additional' && (
              <table className="w-full max-w-xl text-left">
                <tbody className="divide-y divide-gray-200">
                  {specs.map(([k, v], i) => (
                    <tr key={`${k}-${i}`}>
                      <th scope="row" className="py-2 pr-4 font-bold text-gray-900 w-40 align-top">{k}</th>
                      <td className="py-2">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ---- Related ---- */}
        {product.related && product.related.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-5 text-xl font-bold uppercase text-gray-900">You may also need</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {product.related.map((p) => (
                <Link key={p.id} href={productUrl(p)} className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img src={p.image_url || PLACEHOLDER} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col items-center px-3 pt-4 pb-5 text-center">
                    <h3 className="text-md text-black font-bold group-hover:text-[#00a550]">{p.name}</h3>
                    <p className="mt-auto pt-3 text-sm font-bold text-red-600">
                      {priceRange(p.price_min, p.price_max)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
