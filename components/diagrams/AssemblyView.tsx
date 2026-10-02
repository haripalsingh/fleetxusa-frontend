'use client';

/* eslint-disable @next/next/no-img-element */

// Exploded diagram with clickable callout numbers (hotspots) + the matching parts list.
// Click a number → the part is highlighted in the list (and vice versa).

import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import Link from 'next/link';
import { ApiError, formatMoney, priceOrCall, productUrl } from '@/lib/api';
import { addToCart } from '@/lib/cart';
import type { DiagramAssembly, DiagramPart } from '@/lib/types';

const PLACEHOLDER = '/images/fleet-x-icon.png';
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

type Status = { kind: 'ok' | 'error'; text: string };

function PartCard({
  part,
  active,
  onSelect,
  onHover,
  innerRef,
}: {
  part: DiagramPart;
  active: boolean;
  onSelect: () => void;
  onHover: (on: boolean) => void;
  innerRef: (el: HTMLLIElement | null) => void;
}) {
  const [variantId, setVariantId] = useState<number | undefined>(part.variant?.id);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [showNote, setShowNote] = useState(false);

  const variant = part.variants.find((v) => v.id === variantId) ?? part.variant;
  const stock = variant?.stock ?? 0;
  const callForPrice = !!variant && !(variant.price > 0);
  const canBuy = !!variant && variant.in_stock && part.product.status === 'active' && !callForPrice;
  const href = productUrl(part.product);

  const add = async () => {
    if (!variant) return;
    setAdding(true);
    setStatus(null);
    try {
      await addToCart(variant.id, qty);
      setStatus({ kind: 'ok', text: `Added ${qty} to your cart.` });
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof ApiError ? err.firstError : 'Could not add this item.' });
    } finally {
      setAdding(false);
    }
  };

  return (
    <li
      ref={innerRef}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest('a,button,input,select')) onSelect();
      }}
      className={`scroll-mt-28 bg-white border-l-4 p-4 sm:p-5 shadow-sm transition-colors cursor-pointer ${
        active ? 'border-[#00a550] bg-[#f3fbf6] ring-1 ring-[#00a550]/40' : 'border-transparent hover:border-gray-300'
      }`}
    >
      <div className="flex gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border-2 px-2 text-xs font-bold ${
              active ? 'border-red-600 bg-red-600 text-white' : 'border-red-600 bg-white text-red-600'
            }`}
            aria-label={`Diagram number ${part.callout}`}
          >
            {part.callout}
          </span>
          <Link href={href} className="block h-16 w-16 sm:h-20 sm:w-20 border border-gray-200 bg-white">
            <img src={part.product.image_url || PLACEHOLDER} alt="" className="h-full w-full object-contain" loading="lazy" />
          </Link>
        </div>

        <div className="min-w-0 flex-1">
          <Link href={href} className="text-[15px] font-bold leading-snug text-[#1f6fb2] hover:text-[#00a550]">
            {part.product.brand ? `${part.product.brand} ` : ''}
            {variant?.sku ?? part.product.sku}
          </Link>
          <p className="mt-0.5 text-sm font-semibold uppercase text-gray-900">{part.product.name}</p>
          {part.product.short_description && <p className="mt-1 text-xs text-gray-500 line-clamp-2">{part.product.short_description}</p>}

          {/* <p className="mt-2 text-lg font-bold text-gray-900">
            {variant?.compare_at_price && variant.compare_at_price > variant.price && (
              <s className="mr-2 text-sm font-normal text-gray-400">{formatMoney(variant.compare_at_price)}</s>
            )}
            {variant ? priceOrCall(variant.price) : '—'}
            {!callForPrice && <span className="text-xs font-normal text-gray-500"> (each)</span>}
          </p> */}
          {/* <p className={`text-xs font-semibold ${canBuy ? (stock <= (variant?.low_stock_threshold ?? 5) ? 'text-amber-600' : 'text-green-700') : 'text-red-600'}`}>
            {callForPrice ? 'Contact us for a quote' : canBuy ? `${stock} available` : 'Out of stock'}
          </p> */}
          {/* <p className="mt-1 text-xs text-gray-600">Quantity used in assembly: {part.quantity}</p> */}

          {part.variants.length > 1 && (
            <label className="mt-3 block max-w-xs">
              <span className="sr-only">Option</span>
              <select
                value={variantId}
                onChange={(e) => setVariantId(Number(e.target.value))}
                className="w-full border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#00a550]"
              >
                {part.variants.map((v) => (
                  <option key={v.id} value={v.id} disabled={!v.in_stock}>
                    {v.name} — {priceOrCall(v.price)}
                    {!v.in_stock ? ' (out of stock)' : ''}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {callForPrice ? (
              <Link href="/contact" className="inline-flex h-9 items-center px-5 text-xs font-bold uppercase text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90">
                Call for Price
              </Link>
            ) : (
            <>
            <input
              type="number"
              min={1}
              max={Math.max(1, Math.min(99, stock))}
              value={qty}
              aria-label={`Quantity of ${part.product.name}`}
              onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
              className="h-9 w-16 border border-gray-300 text-center text-sm focus:outline-none focus:border-[#00a550]"
            />
            <button
              type="button"
              onClick={add}
              disabled={!canBuy || adding}
              className="h-9 px-5 text-xs font-bold uppercase text-white bg-gradient-to-r from-[#e9e611] to-[#00a34f] hover:opacity-90 disabled:opacity-40"
            >
              {adding ? 'Adding…' : 'Add to Cart'}
            </button>
            </>
            )}
            {part.note && (
              <button type="button" onClick={() => setShowNote((v) => !v)} className="text-xs font-semibold text-gray-600 hover:text-[#00a550]">
                {showNote ? '− Footnotes' : '+ Footnotes'}
              </button>
            )}
          </div>

          {status && (
            <p role={status.kind === 'error' ? 'alert' : 'status'} className={`mt-2 text-xs ${status.kind === 'ok' ? 'text-green-700' : 'text-red-600'}`}>
              {status.text}{' '}
              {status.kind === 'ok' && (
                <Link href="/cart" className="font-bold underline">
                  View cart
                </Link>
              )}
            </p>
          )}
          {showNote && part.note && <p className="mt-2 border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700">{part.note}</p>}
        </div>
      </div>
    </li>
  );
}

export default function AssemblyView({ assembly }: { assembly: DiagramAssembly }) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [hoverId, setHoverId] = useState<number | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null);
  const cards = useRef(new Map<number, HTMLLIElement>());

  const parts = assembly.parts;
  const selectFromDiagram = (id: number) => {
    setActiveId(id);
    cards.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const setZoomClamped = (z: number) => {
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(z * 100) / 100));
    setZoom(next);
    if (next === 1) setPan({ x: 0, y: 0 });
  };

  // drag to pan when zoomed in
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (zoom === 1 || (e.target as HTMLElement).closest('button')) return; // hotspots stay clickable
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    setPan({ x: d.px + dx, y: d.py + dy });
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const highlighted = hoverId ?? activeId;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{assembly.group.label}</p>
          <h1 className="text-2xl md:text-[28px] font-bold uppercase leading-tight text-gray-900">
            {assembly.code ? `${assembly.code} - ` : ''}
            {assembly.name}
          </h1>
          {assembly.description && <p className="mt-1 text-sm text-gray-600">{assembly.description}</p>}
        </div>
        <div className="flex gap-2 text-sm">
          {assembly.previous && (
            <Link href={`/detroit-engine-parts/${assembly.previous.slug}`} className="border border-gray-300 bg-white px-3 py-2 hover:border-[#00a550]" title={assembly.previous.name}>
              ← Previous
            </Link>
          )}
          {assembly.next && (
            <Link href={`/detroit-engine-parts/${assembly.next.slug}`} className="border border-gray-300 bg-white px-3 py-2 hover:border-[#00a550]" title={assembly.next.name}>
              Next →
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 items-start">
        {/* ---------------- diagram ---------------- */}
        <section className="self-start xl:sticky xl:top-28 bg-white shadow-sm" aria-label="Parts diagram">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-3">
            <button
              type="button"
              onClick={() => setShowHotspots((v) => !v)}
              aria-pressed={showHotspots}
              className="inline-flex items-center gap-2 rounded bg-[#1f6fb2] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#185a91]"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-white" aria-hidden="true" />
              {showHotspots ? 'Hide Hotspots' : 'Show All Hotspots'}
            </button>
            <div className="flex items-center gap-1" role="group" aria-label="Zoom">
              <button type="button" onClick={() => setZoomClamped(zoom - 0.5)} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out" className="h-8 w-8 border border-gray-300 text-lg leading-none hover:border-[#00a550] disabled:opacity-40">−</button>
              <span className="w-12 text-center text-xs text-gray-600">{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => setZoomClamped(zoom + 0.5)} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in" className="h-8 w-8 border border-gray-300 text-lg leading-none hover:border-[#00a550] disabled:opacity-40">+</button>
              <button type="button" onClick={() => setZoomClamped(1)} aria-label="Reset zoom" className="ml-1 h-8 w-8 border border-gray-300 hover:border-[#00a550]">
                <svg viewBox="0 0 20 20" className="mx-auto h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 10a6 6 0 1 0 2-4.5M4 3v3h3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className={`relative overflow-hidden bg-white touch-none ${zoom > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {assembly.diagram_url ? (
              <div
                className="relative origin-center transition-transform duration-150"
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
              >
                <img src={assembly.diagram_url} alt={`${assembly.name} diagram`} className="block w-full h-auto select-none" draggable={false} />
                {showHotspots &&
                  parts.map((p) =>
                    p.hotspot ? (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => selectFromDiagram(p.id)}
                        onMouseEnter={() => setHoverId(p.id)}
                        onMouseLeave={() => setHoverId(null)}
                        aria-label={`Part ${p.callout}: ${p.product.name}`}
                        title={`${p.callout} — ${p.product.name}`}
                        style={{ left: `${p.hotspot.x}%`, top: `${p.hotspot.y}%`, transform: `translate(-50%, -50%) scale(${1 / zoom})` }}
                        className={`absolute inline-flex h-7 min-w-7 items-center justify-center rounded-full border-2 px-1.5 text-[11px] font-bold shadow-sm transition-colors ${
                          highlighted === p.id
                            ? 'border-red-600 bg-red-600 text-white z-10'
                            : 'border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white'
                        }`}
                      >
                        {p.callout}
                      </button>
                    ) : null
                  )}
              </div>
            ) : (
              <div className="flex aspect-[10/7] items-center justify-center text-sm text-gray-500">Diagram image coming soon</div>
            )}
          </div>
          <p className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
            Click a number to find the part. {zoom > 1 ? 'Drag to move around.' : 'Use + to zoom in.'}
          </p>
        </section>

        {/* ---------------- parts ---------------- */}
        {/* parts list grows with its content (no inner scroll); the diagram keeps its own height */}
        <section aria-label="Parts in this diagram" className="self-start">
          <div className="mb-3 flex items-center justify-between bg-black px-4 py-3 text-white">
            <h2 className="text-sm font-bold uppercase tracking-wide">Parts ({parts.length})</h2>
            {activeId !== null && (
              <button type="button" onClick={() => setActiveId(null)} className="text-xs underline">
                Clear selection
              </button>
            )}
          </div>
          {parts.length === 0 ? (
            <p className="bg-white p-6 text-sm text-gray-600">No parts have been added to this diagram yet.</p>
          ) : (
            <ul className="space-y-3">
              {parts.map((p) => (
                <PartCard
                  key={p.id}
                  part={p}
                  active={highlighted === p.id}
                  onSelect={() => setActiveId(p.id)}
                  onHover={(on) => setHoverId(on ? p.id : null)}
                  innerRef={(el) => {
                    if (el) cards.current.set(p.id, el);
                    else cards.current.delete(p.id);
                  }}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
