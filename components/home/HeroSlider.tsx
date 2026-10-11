'use client';

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

// Product cut-outs live in /public/images/banners (transparent WebP).
const P = (name: string) => `/images/banners/${name}.webp`;

type Prod = { src: string; alt: string; cls: string };

/** A floating product with a soft shadow + glow under it. `cls` sets position/size (Tailwind). */
const Product = ({ src, alt, cls }: Prod) => (
  <div className={`absolute ${cls}`}>
    <img src={src} alt={alt} className="h-full w-auto max-w-none object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.65)]" />
    <span className="absolute -bottom-2 left-1/2 h-4 w-[90%] -translate-x-1/2 rounded-[50%] bg-[#00e070]/30 blur-md" aria-hidden="true" />
  </div>
);

const Cta = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    className="pointer-events-auto mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[#e9e611] to-[#00a34f] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-black/40 transition-opacity hover:opacity-90 sm:px-7 sm:text-sm"
  >
    {children} <span aria-hidden="true">&rarr;</span>
  </Link>
);

/** Light streaks rushing toward a vanishing point (decorative SVG). */
const Streaks = ({ cx = 50, cy = 55, side = 'both' }: { cx?: number; cy?: number; side?: 'both' | 'right' }) => {
  const lines = [];
  for (let i = 0; i < 18; i++) {
    const y = -10 + i * 7.5;
    if (side === 'both') lines.push({ x1: -5, y1: y, i });
    lines.push({ x1: 105, y1: y, i: i + 18 });
  }
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`st-${side}`} x1="0" x2="1">
          <stop offset="0" stopColor="#e9e611" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#00e070" stopOpacity="0.6" />
          <stop offset="1" stopColor="#00a34f" stopOpacity="0" />
        </linearGradient>
      </defs>
      {lines.map((l) => (
        <line
          key={l.i}
          x1={l.x1}
          y1={l.y1}
          x2={cx}
          y2={cy}
          stroke="#00e070"
          strokeOpacity={l.i % 3 === 0 ? 0.55 : 0.18}
          strokeWidth={l.i % 3 === 0 ? 0.35 : 0.15}
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: l.i % 3 === 0 ? 2 : 1 }}
        />
      ))}
    </svg>
  );
};

/** Perspective floor grid. */
const Floor = () => (
  <div className="absolute inset-x-0 bottom-0 h-[38%] overflow-hidden [perspective:400px]" aria-hidden="true">
    <div
      className="absolute inset-x-[-50%] bottom-0 h-[160%] origin-bottom [transform:rotateX(62deg)] opacity-50"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,224,112,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(0,224,112,.35) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'linear-gradient(to top, black 10%, transparent 90%)',
        WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 90%)',
      }}
    />
  </div>
);

export type Slide = { key: string; label: string; content: (heading: 'h1' | 'h2') => ReactNode };

// ---- Slide 1: diagonal brand panels + product line-up -----------------------------------
const SlideLineup: Slide = {
  key: 'lineup',
  label: 'Heavy-duty truck parts',
  content: (H) => (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,#0f4a30_0%,#07180f_50%,#020604_100%)]">
      <Streaks cx={78} cy={58} side="right" />
      <div className="absolute -left-[12%] top-0 h-full w-[48%] -skew-x-[20deg] bg-gradient-to-b from-[#00a34f]/90 via-[#00a34f]/70 to-[#006b34]/80" aria-hidden="true" />
      <div className="absolute left-[22%] top-0 h-full w-[10%] -skew-x-[20deg] bg-gradient-to-b from-[#00c463]/50 to-transparent" aria-hidden="true" />
      <div className="absolute left-[33%] top-0 h-full w-[1.2%] -skew-x-[20deg] bg-[#e9e611]/80" aria-hidden="true" />
      <Floor />

      <div className="pointer-events-none absolute left-[max(6%,calc((100%-1288px)/2))] top-[9%] z-10 max-w-[80%]">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#e9e611] sm:text-xs">Shipped across the USA</p>
        <H className="font-heading mt-3 text-2xl uppercase leading-[1.15] text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
          Heavy-Duty
          <br />
          Truck Parts
        </H>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/90 sm:text-base">Clamps · Filters · Hoses · Seals</p>
        <Cta href="/products">Shop all parts</Cta>
      </div>

      <Product src={P('lube-filter')} alt="FleetX lube filter" cls="bottom-[9%] left-[41%] hidden h-[38%] sm:block" />
      <Product src={P('hose-orange')} alt="Silicone charge-air hose" cls="bottom-[10%] left-[36%] h-[24%] sm:left-[51%] sm:h-[32%]" />
      <Product src={P('vband-clamp')} alt="V-band clamp" cls="bottom-[10%] left-[61%] hidden h-[28%] lg:block" />
      <Product src={P('water-separator')} alt="FleetX water separator" cls="bottom-[10%] left-[62%] h-[26%] sm:left-[68%] sm:h-[36%] lg:left-[71%]" />
      <Product src={P('hose-blue')} alt="Silicone coolant hose" cls="bottom-[9%] left-[86%] hidden h-[30%] lg:block" />
    </div>
  ),
};

// ---- Slide 2: light tunnel, centered message + product cluster ---------------------------
const SlideTunnel: Slide = {
  key: 'tunnel',
  label: 'Built for the long haul',
  content: (H) => (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_58%,#1e7a4f_0%,#0b2a1b_38%,#030806_75%)]">
      <Streaks cx={50} cy={58} />
      <Floor />
      <div className="pointer-events-none absolute inset-x-0 top-[8%] z-10 px-6 text-center">
        <H className="font-heading text-2xl uppercase leading-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">Built for the Long Haul</H>
        <p className="mx-auto mt-4 inline-block rounded-full bg-gradient-to-r from-[#e9e611] to-[#00a34f] px-5 py-1.5 text-xs font-semibold text-white sm:text-base">
          FleetX filters · hoses · clamps
        </p>
        <div>
          <Cta href="/products/filters">Shop filters</Cta>
        </div>
      </div>

      <Product src={P('hose-black')} alt="Heavy-duty charge-air hose" cls="bottom-[8%] left-[6%] hidden h-[34%] md:block" />
      <Product src={P('fuel-water-element')} alt="FleetX fuel/water separator element" cls="bottom-[9%] left-[8%] h-[22%] sm:left-[24%] sm:h-[34%]" />
      <Product src={P('coolant-filter')} alt="FleetX coolant filter" cls="bottom-[8%] left-1/2 h-[30%] -translate-x-1/2 sm:h-[44%]" />
      <Product src={P('air-dryer')} alt="FleetX air dryer cartridge" cls="bottom-[9%] right-[8%] h-[22%] sm:right-[24%] sm:h-[34%]" />
      <Product src={P('vband-clamp-2')} alt="V-band clamp" cls="bottom-[9%] right-[5%] hidden h-[28%] md:block" />
    </div>
  ),
};

// ---- Slide 3: night horizon, bulk orders + spotlight cluster ------------------------------
const SlideNight: Slide = {
  key: 'night',
  label: 'Fleet and bulk orders',
  content: (H) => (
    <div className="absolute inset-0 bg-gradient-to-b from-[#020604] via-[#06150e] to-[#0c2b1c]">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 12% 18%, #fff, transparent), radial-gradient(1px 1px at 28% 32%, #cfe, transparent), radial-gradient(1.5px 1.5px at 44% 12%, #fff, transparent), radial-gradient(1px 1px at 63% 26%, #dfd, transparent), radial-gradient(1px 1px at 81% 9%, #fff, transparent), radial-gradient(1.5px 1.5px at 92% 34%, #fff, transparent), radial-gradient(1px 1px at 7% 44%, #cfe, transparent), radial-gradient(1px 1px at 52% 40%, #fff, transparent)',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-[62%] h-px bg-gradient-to-r from-transparent via-[#00e070] to-transparent shadow-[0_0_30px_6px_rgba(0,224,112,0.45)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-[#0b3a25]/80 to-[#020604]" aria-hidden="true" />
      {/* spotlights */}
      <div className="absolute right-[18%] top-0 hidden h-[70%] w-[30%] bg-gradient-to-b from-[#e9e611]/0 via-[#00e070]/15 to-transparent [clip-path:polygon(45%_0,55%_0,100%_100%,0_100%)] sm:block" aria-hidden="true" />

      <div className="pointer-events-none absolute left-[max(6%,calc((100%-1288px)/2))] top-[12%] z-10 max-w-[88%] sm:top-[22%]">
        <div className="flex items-end gap-3">
          <span className="font-heading text-5xl leading-none text-white drop-shadow-lg sm:text-7xl lg:text-8xl">1</span>
          <div className="pb-1">
            <span className="font-heading block text-lg uppercase leading-none text-white sm:text-3xl">Quote</span>
            <span className="mt-2 inline-block rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0b3a25] sm:text-xs">
              for your whole fleet
            </span>
          </div>
        </div>
        <H className="mt-4 text-xl font-bold text-white sm:text-3xl lg:text-4xl">Fleet &amp; Bulk Orders</H>
        <p className="mt-2 max-w-sm text-sm text-white/80 sm:text-base">Send your parts list — one quote, one invoice, shipped to your yard.</p>
        <Cta href="/contact">Request a quote</Cta>
      </div>

      <Product src={P('exhaust-clamp')} alt="Exhaust clamp" cls="bottom-[11%] left-[48%] hidden h-[24%] lg:block" />
      <Product src={P('air-filter-blue')} alt="Heavy-duty air filter" cls="bottom-[12%] right-[30%] hidden h-[42%] sm:block" />
      <Product src={P('oil-element')} alt="Oil filter element" cls="bottom-[10%] right-[32%] h-[22%] sm:right-[17%] sm:h-[36%]" />
      <Product src={P('fuel-filter')} alt="FleetX fuel filter" cls="bottom-[10%] right-[8%] h-[24%] sm:right-[5%] sm:h-[36%]" />
    </div>
  ),
};

export const SLIDES: Slide[] = [SlideLineup, SlideTunnel, SlideNight];

const INTERVAL = 6000;

// Hero carousel: fading slides, arrows, dots, autoplay (pauses on hover/focus, off for reduced motion).
export default function HeroSlider({ slides = SLIDES }: { slides?: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const go = useCallback((n: number) => setIndex((n + count) % count), [count]);
  const [touchX, setTouchX] = useState<number | null>(null);

  useEffect(() => {
    if (paused || count < 2) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [index, paused, count, go]);

  return (
    <div
      className="group relative h-full overflow-hidden bg-black"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured truck parts"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        setTouchX(null);
      }}
    >
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={s.key}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${s.label}`}
            aria-hidden={!active}
            inert={!active}
            className={`absolute inset-0 transition-opacity duration-700 ${active ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            {s.content(i === 0 ? 'h1' : 'h2')}
          </div>
        );
      })}

      {count > 1 && (
        <>
          {[
            { dir: -1, label: 'Previous slide', d: 'M15 19l-7-7 7-7', pos: 'left-4' },
            { dir: 1, label: 'Next slide', d: 'M9 5l7 7-7 7', pos: 'right-4' },
          ].map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => go(index + a.dir)}
              aria-label={a.label}
              className={`absolute top-1/2 z-20 ${a.pos} hidden h-10 w-10 md:flex -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-[#00a550] md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={a.d} />
              </svg>
            </button>
          ))}

          <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}: ${s.label}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-[#e9e611]' : 'w-4 bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
