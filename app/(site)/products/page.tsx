import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import { redirect } from 'next/navigation';
import ProductListing from '@/components/ProductListing';
import CatalogUnavailable from '@/components/CatalogUnavailable';
import { getCategories, getProducts, matchKey } from '@/lib/catalog';
import type { ProductListResult } from '@/lib/types';

const DESCRIPTION =
  'Browse our full catalog of heavy-duty truck parts including brake pads, rotors, calipers, hardware kits, and more.';

type Props = { searchParams: Promise<{ q?: string; category?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  if (q) {
    return { title: `Search: ${q} | Fleet X Parts`, robots: { index: false, follow: true } };
  }
  return pageMetadata({
    title: 'Shop Truck Parts | Fleet X Parts',
    description: DESCRIPTION,
    keywords: 'truck parts catalog, brake pads, rotors, calipers, hardware kits, truck parts for sale',
    path: '/products',
  });
}

export default async function ProductsPage({ searchParams }: Props) {
  const { q = '', category } = await searchParams;

  // Old links used /products?category=<name>. Send them to /products/<slug>.
  if (category) {
    const match = (await getCategories()).find(
      (c) => matchKey(c.name) === matchKey(category) || matchKey(c.slug) === matchKey(category)
    );
    if (match) redirect(`/products/${match.slug}`);
  }

  let initial: ProductListResult;
  try {
    initial = await getProducts({ q: q.trim(), per_page: 24 });
  } catch (err) {
    return <CatalogUnavailable error={err} />;
  }

  return <ProductListing key={q} initial={initial} query={q.trim()} />;
}
