import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import ProductListing from '@/components/ProductListing';
import CatalogUnavailable from '@/components/CatalogUnavailable';
import CategoryGuard from '@/components/CategoryGuard';
import { getAllCategorySlugs, getCategory, getProducts, hiddenCategoryPath, isHiddenCategory } from '@/lib/catalog';
import type { Category, ProductListResult } from '@/lib/types';

type Props = { params: Promise<{ category: string }> };

// Static export: one page per category, built from the API.
export async function generateStaticParams() {
  return (await getAllCategorySlugs()).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategory(category).catch(() => null);
  if (!cat) return {};
  const title = cat.meta_title || `${cat.name} | Fleet X Parts`;
  const description = cat.meta_description || cat.description || `Shop ${cat.name} parts for heavy-duty trucks at Fleet X Parts.`;
  return pageMetadata({ title, description, path: `/products/${cat.slug}`, image: cat.image_url });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  // Detroit / Cummins engine parts have their own section, not a normal category page.
  if (isHiddenCategory(category)) redirect(hiddenCategoryPath(category));

  let cat: Category | null;
  try {
    cat = await getCategory(category);
  } catch (err) {
    return <CatalogUnavailable error={err} />;
  }
  if (!cat) notFound();

  let initial: ProductListResult;
  try {
    initial = await getProducts({ category: cat.slug, per_page: 24 });
  } catch (err) {
    return <CatalogUnavailable error={err} />;
  }

  // fetchOnMount: the page is pre-built, so prices/stock refresh from the API on open
  // CategoryGuard: shows "no longer available" if the category was removed in admin after the build
  return (
    <CategoryGuard slug={cat.slug}>
      <ProductListing key={cat.slug} category={cat} initial={initial} fetchOnMount />
    </CategoryGuard>
  );
}
