import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import { Suspense } from 'react';
import ProductsPageClient from '@/components/ProductsPageClient';
import CatalogUnavailable from '@/components/CatalogUnavailable';
import { DETROIT_SECTION_PATH, getCategories, getProducts } from '@/lib/catalog';
import type { ProductListResult } from '@/lib/types';

const DESCRIPTION =
  'Browse our full catalog of heavy-duty truck parts including brake pads, rotors, calipers, hardware kits, and more.';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: 'Shop Truck Parts | Fleet X Parts',
    description: DESCRIPTION,
    keywords: 'truck parts catalog, brake pads, rotors, calipers, hardware kits, truck parts for sale',
    path: '/products',
  });
}

export default async function ProductsPage() {
  const categories = await getCategories();

  let initial: ProductListResult;
  try {
    initial = await getProducts({ per_page: 24 });
  } catch (err) {
    return <CatalogUnavailable error={err} />;
  }

  // ?q= search and old ?category= links are read in the browser (static export)
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ProductsPageClient initial={initial} categories={categories} detroitPath={DETROIT_SECTION_PATH} />
    </Suspense>
  );
}
