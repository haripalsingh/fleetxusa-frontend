import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductListing from '@/components/ProductListing';
import {
  DUMMY_CATEGORIES,
  findDummyCategory,
  getDummyProducts,
} from '@/lib/dummyProducts';

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return DUMMY_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = findDummyCategory(category);
  if (!cat) return {};
  const description = `Shop ${cat.name} parts for heavy-duty trucks at Fleet X Parts.`;
  return {
    title: `${cat.name} | Fleet X Parts`,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      title: `${cat.name} | Fleet X Parts`,
      description,
      siteName: 'Fleet X Parts',
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = findDummyCategory(category);
  if (!cat) notFound();

  return <ProductListing category={cat} products={getDummyProducts(cat)} />;
}
