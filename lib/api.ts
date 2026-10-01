// Single HTTP client for the PHP REST API.
// Next.js never talks to MySQL - every read/write goes through these helpers.

import type { PageMeta, ProductFacets } from './types';

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fleetxusa.com/fleetxusa-backend/api'
).replace(/\/+$/, '');

// Server components can use a private/internal URL if the API is on the same machine.
// "localhost" is swapped for 127.0.0.1 because Node may resolve localhost to IPv6 (::1),
// which XAMPP's Apache often doesn't listen on.
export const SERVER_API_BASE_URL = (process.env.API_BASE_URL || API_BASE_URL)
  .replace('://localhost', '://127.0.0.1')
  .replace(/\/+$/, '');

export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
  meta?: PageMeta & Record<string, unknown>;
  facets?: ProductFacets;
  errors?: Record<string, string>;
};

export class ApiError extends Error {
  status: number;
  errors: Record<string, string>;
  /** Technical detail (URL + cause) for debugging; never shown to shoppers in production. */
  detail?: string;

  constructor(message: string, status: number, errors: Record<string, string> = {}, detail?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.detail = detail;
  }

  /** First field error, or the general message. */
  get firstError(): string {
    return Object.values(this.errors)[0] || this.message;
  }
}

// ---- browser-side token storage ---------------------------------------------------
const TOKEN_KEY = 'fx_token';
const CART_TOKEN_KEY = 'fx_cart_token';

const storage = {
  get(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string | null) {
    if (typeof window === 'undefined') return;
    try {
      if (value === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, value);
    } catch {
      /* storage unavailable (private mode etc.) */
    }
  },
};

export const getAuthToken = () => storage.get(TOKEN_KEY);
export const setAuthToken = (t: string | null) => storage.set(TOKEN_KEY, t);
export const getCartToken = () => storage.get(CART_TOKEN_KEY);
export const setCartToken = (t: string | null) => storage.set(CART_TOKEN_KEY, t);
export const browserStorage = storage;

// ---- request helper -----------------------------------------------------------------
type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | string[] | null | undefined>;
  signal?: AbortSignal;
  /** Next.js fetch cache options (server components only). */
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: RequestCache;
  /** Server-side calls use SERVER_API_BASE_URL and never send browser tokens. */
  server?: boolean;
};

export function buildQuery(query: RequestOptions['query']): string {
  if (!query) return '';
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '' || value === false) return;
    if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(','));
    } else {
      params.set(key, String(value));
    }
  });
  const s = params.toString();
  return s ? `?${s}` : '';
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<ApiEnvelope<T>> {
  const { method = 'GET', body, query, signal, next, cache, server = typeof window === 'undefined' } = options;
  const base = server ? SERVER_API_BASE_URL : API_BASE_URL;
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (!server) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const cartToken = getCartToken();
    if (cartToken) headers['X-Cart-Token'] = cartToken;
  }
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const url = `${base}${path}${buildQuery(query)}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
      ...(next ? { next } : {}),
      ...(cache ? { cache } : {}),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    const cause = err instanceof Error ? `${err.message}${err.cause instanceof Error ? ` (${err.cause.message})` : ''}` : String(err);
    throw new ApiError('Cannot reach the store server. Please check your connection and try again.', 0, {}, `${method} ${url} → ${cause}`);
  }

  let json: ApiEnvelope<T> | null = null;
  try {
    json = (await res.json()) as ApiEnvelope<T>;
  } catch {
    /* empty or non-JSON body */
  }

  if (!res.ok || !json || json.success === false) {
    if (res.status === 401 && !server && getAuthToken() && typeof window !== 'undefined') {
      // token expired/revoked - let AuthContext drop the session
      window.dispatchEvent(new Event('fx:unauthorized'));
    }
    throw new ApiError(
      json?.message || `Request failed (${res.status})`,
      res.status,
      json?.errors || {},
      `${method} ${url} → HTTP ${res.status}${json ? `: ${json.message}` : ' (response was not JSON - is this the API URL?)'}`
    );
  }
  return json;
}

export const formatMoney = (n: number, currency = 'USD') =>
  Number(n || 0).toLocaleString('en-US', { style: 'currency', currency });

export const formatDate = (s: string | null | undefined) =>
  s
    ? new Date(s.replace(' ', 'T') + 'Z').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

export const productUrl = (p: { slug: string; category?: { slug: string } | null; category_slug?: string | null }) =>
  `/products/${p.category?.slug || p.category_slug || 'parts'}/${p.slug}`;

/** Price 0 in the catalog sheet means "Call for price" - those items can't be added to the cart. */
export const priceOrCall = (n: number | null | undefined) => (n && n > 0 ? formatMoney(n) : 'Call for price');

/** "$12.00" / "$12.00-$30.00" / "Call for price" for a product card. */
export const priceRange = (min: number, max: number, sep = '-') =>
  !(max > 0) ? 'Call for price' : max > min && min > 0 ? `${formatMoney(min)}${sep}${formatMoney(max)}` : priceOrCall(min > 0 ? min : max);
