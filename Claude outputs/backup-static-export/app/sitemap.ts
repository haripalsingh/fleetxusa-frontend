import type { MetadataRoute } from 'next';
import { productUrl } from '@/lib/api';
import { getCategories, getDiagramGroups, getProducts } from '@/lib/catalog';
import { SITE_URL } from '@/lib/site';
import type { ProductSummary } from '@/lib/types';

// Served at /sitemap.xml. Rebuilt hourly so new products/categories show up without a redeploy.
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

const STATIC_PAGES: { path: string; changeFrequency: Entry['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/products', changeFrequency: 'daily', priority: 0.9 },
  { path: '/categories', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/detroit-engine-parts', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/faqs', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/shipping-return-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cancellation-refund-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms-conditions', changeFrequency: 'yearly', priority: 0.3 },
];

/** Every product in the catalog (the API returns at most 100 per page). */
async function getAllProducts(): Promise<ProductSummary[]> {
  const first = await getProducts({ per_page: 100, page: 1 });
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.meta.total_pages - 1) }, (_, i) => getProducts({ per_page: 100, page: i + 2 }))
  );
  return [first, ...rest].flatMap((r) => r.data);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // If the API is down, still serve the static pages rather than failing the whole sitemap.
  const [categories, products, groups] = await Promise.all([
    getCategories(),
    getAllProducts().catch(() => []),
    getDiagramGroups().catch(() => []),
  ]);

  return [
    ...STATIC_PAGES.map(({ path, changeFrequency, priority }): Entry => ({
      url: `${SITE_URL}${path === '/' ? '' : path}`,
      lastModified,
      changeFrequency,
      priority,
    })),
    ...categories
      .filter((c) => c.is_active)
      .map((c): Entry => ({
        url: `${SITE_URL}/products/${c.slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
      })),
    ...products.map((p): Entry => ({
      url: `${SITE_URL}${productUrl(p)}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
      ...(p.image_url?.startsWith('http') ? { images: [p.image_url] } : {}),
    })),
    ...groups
      .flatMap((g) => g.assemblies)
      .filter((a) => a.is_active)
      .map((a): Entry => ({
        url: `${SITE_URL}/detroit-engine-parts/${a.slug}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.6,
      })),
  ];
}
