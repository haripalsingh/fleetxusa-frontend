// Server-side catalog reads (used by server components / generateMetadata).
// Responses are cached by Next.js for REVALIDATE seconds.

import { api, ApiError } from './api';
import type { Category, DiagramAssembly, DiagramGroup, Product, ProductListResult } from './types';

const REVALIDATE = 60;

/**
 * Categories that live only in their own section (not in the normal shop).
 * "engine-parts" = the Detroit DD15 diagram parts, shown only at /detroit-engine-parts.
 */
export const HIDDEN_CATEGORY_SLUGS = ['engine-parts'];
export const DETROIT_SECTION_PATH = '/detroit-engine-parts';
export const isHiddenCategory = (slug?: string | null) => !!slug && HIDDEN_CATEGORY_SLUGS.includes(slug);

export type ProductQuery = {
  category?: string;
  categories?: string[];
  q?: string;
  type?: string[];
  color?: string[];
  brand?: string[];
  min_price?: number | null;
  max_price?: number | null;
  sort?: string;
  page?: number;
  per_page?: number;
  featured?: boolean;
  in_stock?: boolean;
};

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await api<Category[]>('/categories', { next: { revalidate: REVALIDATE, tags: ['categories'] } });
    return res.data.filter((c) => !isHiddenCategory(c.slug));
  } catch {
    return [];
  }
}

export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const res = await api<Category>(`/categories/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE, tags: ['categories'] },
    });
    return res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductListResult> {
  // Normal shop (no category chosen): limit to the visible categories so
  // Detroit engine parts don't show up in "All Products" / search.
  if (!query.category && !query.categories?.length) {
    const visible = (await getCategories()).map((c) => c.slug);
    if (visible.length) query = { ...query, categories: visible };
  }
  const res = await api<ProductListResult['data']>('/products', {
    query: query as Record<string, string | number | boolean | string[] | null | undefined>,
    next: { revalidate: REVALIDATE, tags: ['products'] },
  });
  const facets = res.facets!;
  return {
    data: res.data,
    meta: res.meta as ProductListResult['meta'],
    facets: { ...facets, categories: (facets?.categories ?? []).filter((c) => !isHiddenCategory(c.slug)) },
  };
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await api<Product>(`/products/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE, tags: ['products', `product:${slug}`] },
    });
    return res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

/** "cooling-systems" (old links) matches "Cooling System" / "cooling-system". */
export const matchKey = (value: string): string =>
  value.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]/g, '').replace(/s$/, '');

// ---- Parts diagrams ------------------------------------------------------------------
export async function getDiagramGroups(): Promise<DiagramGroup[]> {
  const res = await api<DiagramGroup[]>('/diagrams', { next: { revalidate: REVALIDATE, tags: ['diagrams'] } });
  return res.data;
}

export async function getDiagram(slug: string): Promise<DiagramAssembly | null> {
  try {
    const res = await api<DiagramAssembly>(`/diagrams/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE, tags: ['diagrams', `diagram:${slug}`] },
    });
    return res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}
