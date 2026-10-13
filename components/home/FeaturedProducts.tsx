import { getProducts } from '@/lib/catalog';
import type { ProductSummary } from '@/lib/types';
import SectionHeading from './SectionHeading';
import FeaturedGrid from './FeaturedGrid';

/** Featured products, topped up with the latest ones; renders nothing if the API is unreachable. */
async function loadProducts(limit: number): Promise<ProductSummary[]> {
  try {
    const featured = (await getProducts({ featured: true, per_page: limit })).data;
    if (featured.length >= limit) return featured.slice(0, limit);
    const more = (await getProducts({ per_page: limit * 2 })).data.filter((p) => !featured.some((f) => f.id === p.id));
    return [...featured, ...more].slice(0, limit);
  } catch {
    return [];
  }
}

const FeaturedProducts = async () => {
  const products = await loadProducts(8);
  if (!products.length) return null;

  return (
    <section className="w-full bg-white py-14 md:py-20" aria-labelledby="popular-parts-heading">
      <div className="mx-auto max-w-[1320px] px-4">
        <SectionHeading id="popular-parts-heading" eyebrow="Top picks" title="Popular Truck Parts" link={{ href: '/products', label: 'View all products' }} />

        <FeaturedGrid products={products} />
      </div>
    </section>
  );
};

export default FeaturedProducts;
