// Server-side catalog reads (used by server components / generateMetadata).
// Responses are cached by Next.js for REVALIDATE seconds.

import { api, ApiError } from './api';
import type { Category, DiagramAssembly, DiagramGroup, Product, ProductListResult } from './types';
import { ENGINE_SECTIONS, groupsForSection, type EngineSectionKey } from './engineSections';

const REVALIDATE = 60;

/**
 * Categories that live only in their own engine section (not in the normal shop):
 * "engine-parts" -> /detroit-engine-parts, "cummins-engine-parts" -> /cummins-engine-parts.
 */
export const HIDDEN_CATEGORY_SLUGS = Object.values(ENGINE_SECTIONS).map((s) => s.categorySlug);
export const DETROIT_SECTION_PATH = ENGINE_SECTIONS.detroit.path;
export const isHiddenCategory = (slug?: string | null) => !!slug && HIDDEN_CATEGORY_SLUGS.includes(slug);
/** Where a hidden category's URL should go (its engine section). */
export const hiddenCategoryPath = (slug: string) =>
  Object.values(ENGINE_SECTIONS).find((s) => s.categorySlug === slug)?.path ?? DETROIT_SECTION_PATH;

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

// ---- Static export (output: 'export') ----------------------------------------------
// Every dynamic page is generated at build time from the live API, so the API must be
// reachable when running `npm run build`. New products/categories need a rebuild + upload.

function requireData<T>(what: string, list: T[]): T[] {
  if (!list.length) {
    throw new Error(
      `[static export] No ${what} returned by the API (${process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'default API URL'}). ` +
        'Check the API is online, then run the build again.'
    );
  }
  return list;
}

/** Every category slug, including hidden ones (those pages redirect to their own section). */
export async function getAllCategorySlugs(): Promise<string[]> {
  const res = await api<Category[]>('/categories');
  return requireData('categories', res.data.map((c) => c.slug));
}

/**
 * Every product page to build, as { category, product } URL params:
 * the normal catalog (max 100 per API page) PLUS the Detroit engine parts, which
 * the /products list leaves out and only appear inside the diagrams.
 */
export async function getAllProductParamsForBuild(): Promise<{ category: string; product: string }[]> {
  const first = await api<Product[]>('/products', { query: { per_page: 100, page: 1 } });
  const pages = Number((first.meta as { total_pages?: number } | undefined)?.total_pages ?? 1);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pages - 1) }, (_, i) =>
      api<Product[]>('/products', { query: { per_page: 100, page: i + 2 } })
    )
  );
  const catalog = [first, ...rest].flatMap((r) => r.data);

  const groups = await getDiagramGroups();
  const assemblies = await Promise.all(
    groups.flatMap((g) => g.assemblies).map((a) => getDiagram(a.slug).catch(() => null))
  );
  const diagramProducts = assemblies.flatMap((a) => a?.parts ?? []).flatMap((p) => (p.product ? [p.product] : []));

  const params = new Map<string, { category: string; product: string }>();
  for (const p of [...catalog, ...diagramProducts]) {
    if (!p?.slug) continue;
    params.set(p.slug, { category: p.category?.slug || 'parts', product: p.slug });
  }
  return requireData('products', [...params.values()]);
}

/** Every diagram assembly slug in one engine section (Detroit / Cummins). */
export async function getAllDiagramSlugs(section: EngineSectionKey): Promise<string[]> {
  const groups = groupsForSection(await getDiagramGroups(), section);
  return requireData(`${ENGINE_SECTIONS[section].title} diagrams`, groups.flatMap((g) => g.assemblies.map((a) => a.slug)));
}
