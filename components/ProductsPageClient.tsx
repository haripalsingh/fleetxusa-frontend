'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductListing from '@/components/ProductListing';
import type { Category, ProductListResult } from '@/lib/types';

const matchKey = (value: string): string =>
  value.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]/g, '').replace(/s$/, '');

/**
 * /products is a static page (output: 'export'), so ?q= search and old
 * ?category=<name> links are handled here in the browser.
 */
export default function ProductsPageClient({
  initial,
  categories,
  detroitPath,
}: {
  initial: ProductListResult;
  categories: Category[];
  detroitPath: string;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const q = (params.get('q') ?? '').trim();
  const category = params.get('category');

  // Old links used /products?category=<name>. Send them to /products/<slug>.
  useEffect(() => {
    if (!category) return;
    if (matchKey(category) === matchKey('engine-parts')) {
      router.replace(detroitPath);
      return;
    }
    const match = categories.find(
      (c) => matchKey(c.name) === matchKey(category) || matchKey(c.slug) === matchKey(category)
    );
    if (match) router.replace(`/products/${match.slug}`);
  }, [category, categories, detroitPath, router]);

  return (
    <ProductListing
      key={q}
      initial={initial}
      query={q}
      scope={categories.map((c) => c.slug)}
      fetchOnMount // refresh prices/stock on open (pages are pre-built)
    />
  );
}
