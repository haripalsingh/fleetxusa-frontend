// Live category list, loaded in the browser straight from the PHP API.
// The site is a static export (pages are built once), so without this a category
// added/removed in admin would only show after the next `npm run build` + upload.

import { useEffect, useState } from 'react';
import { api } from './api';
import type { Category } from './types';
import { isHiddenCategory } from './catalog';

const MAX_AGE = 60_000; // share one request between components; refresh after a minute
let cache: { at: number; promise: Promise<Category[]> } | null = null;

export function fetchLiveCategories(): Promise<Category[]> {
  if (!cache || Date.now() - cache.at > MAX_AGE) {
    const promise = api<Category[]>('/categories', { cache: 'no-store' }).then((r) =>
      r.data.filter((c) => !isHiddenCategory(c.slug))
    );
    promise.catch(() => {
      cache = null; // retry next time
    });
    cache = { at: Date.now(), promise };
  }
  return cache.promise;
}

/**
 * Starts with `initial` (the list baked in at build time), then swaps in the
 * current list from the API. Returns null (no initial) until loaded.
 */
export function useLiveCategories(): Category[] | null;
export function useLiveCategories(initial: Category[]): Category[];
export function useLiveCategories(initial: Category[] | null = null) {
  const [cats, setCats] = useState<Category[] | null>(initial);
  useEffect(() => {
    let on = true;
    fetchLiveCategories()
      .then((c) => on && setCats(c))
      .catch(() => {}); // API down: keep the built list
    return () => {
      on = false;
    };
  }, []);
  return cats;
}

/** False only when the live list has loaded and a /products/<slug> link's category no longer exists. */
export function isLinkLive(href: string | undefined, live: Category[] | null): boolean {
  if (!live || !href) return true;
  const m = href.match(/^\/products\/([^/?#]+)\/?$/);
  return !m || live.some((c) => c.slug === m[1]);
}
