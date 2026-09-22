import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetail from '@/components/ProductDetail';
import {
  DUMMY_CATEGORIES,
  getDummyProduct,
  getDummyProducts,
} from '@/lib/dummyProducts';

type Props = { params: Promise<{ category: string; product: string }> };

export function generateStaticParams() {
  return DUMMY_CATEGORIES.flatMap((c) =>
    getDummyProducts(c).map((p) => ({ category: c.slug, product: p.id }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, product } = await params;
  const found = getDummyProduct(category, product);
  if (!found) return {};
  const title = `${found.product.name} | Fleet X Parts`;
  const description = `${found.product.name} by ${found.product.brand}. Shop ${found.category.name} parts at Fleet X Parts.`;
  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: { title, description, siteName: 'Fleet X Parts', type: 'website' },
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, product } = await params;
  const found = getDummyProduct(category, product);
  if (!found) notFound();

  return <ProductDetail category={found.category} product={found.product} />;
}
