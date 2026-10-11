'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export type Slide = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  text?: string;
  cta: string;
  href: string;
};

const INTERVAL = 6000;

// Center banner: fading slider with arrows, dots, autoplay (pauses on hover/focus, off for reduced motion).
export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const go = useCallback((n: number) => setIndex((n + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [index, paused, count, go]);

  return (
    <div
      className="group relative h-full overflow-hidden rounded-xl bg-black"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured truck parts"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((s, i) => {
        const active = i === index;
        const Heading = i === 0 ? 'h1' : 'h2';
        return (
          <div
            key={s.href + i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-700 ${active ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <Image src={s.image} alt={s.alt} fill priority={i === 0} sizes="(min-width: 1320px) 1290px, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-14 pt-6 text-center sm:px-10 sm:pb-16">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e9e611]">{s.eyebrow}</p>
              <Heading className="mx-auto mt-3 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">{s.title}</Heading>
              {s.text && <p className="mx-auto mt-3 max-w-md text-sm text-gray-200 sm:text-base">{s.text}</p>}
              <Link
                href={s.href}
                tabIndex={active ? 0 : -1}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[#e9e611] to-[#00a34f] px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
              >
                {s.cta} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        );
      })}

      {count > 1 && (
        <>
          {[
            { dir: -1, label: 'Previous slide', d: 'M15 19l-7-7 7-7', pos: 'left-3' },
            { dir: 1, label: 'Next slide', d: 'M9 5l7 7-7 7', pos: 'right-3' },
          ].map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => go(index + a.dir)}
              aria-label={a.label}
              className={`absolute top-1/2 ${a.pos} flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-100 transition hover:bg-[#00a550] md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={a.d} />
              </svg>
            </button>
          ))}

          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
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
