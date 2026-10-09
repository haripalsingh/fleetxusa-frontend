import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import ProductDetail from '@/components/ProductDetail';
import CatalogUnavailable from '@/components/CatalogUnavailable';
import { getProduct } from '@/lib/catalog';
import { productUrl } from '@/lib/api';
import type { Product } from '@/lib/types';

type Props = { params: Promise<{ category: string; product: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await params;
  const found = await getProduct(product).catch(() => null);
  if (!found) return {};
  const title = found.meta_title || `${found.name} | Fleet X Parts`;
  const description =
    found.meta_description ||
    found.short_description ||
    `${found.name}${found.brand ? ` by ${found.brand}` : ''}. Shop ${found.category?.name ?? 'truck'} parts at Fleet X Parts.`;
  return pageMetadata({ title, description, path: productUrl(found), image: found.image_url });
}

export default async function ProductPage({ params }: Props) {
  const { category, product } = await params;

  let found: Product | null;
  try {
    found = await getProduct(product);
  } catch (err) {
    return <CatalogUnavailable error={err} />;
  }
  if (!found) notFound();
  // keep one canonical URL per product
  if ((found.category?.slug ?? 'parts') !== category) permanentRedirect(productUrl(found));

  return <ProductDetail product={found} />;
}
