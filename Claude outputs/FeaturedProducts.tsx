/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { getProducts } from '@/lib/catalog';
import { priceRange, productUrl } from '@/lib/api';
import type { ProductSummary } from '@/lib/types';
import SectionHeading from './SectionHeading';

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

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {products.map((p) => {
            const price = priceRange(p.price_min, p.price_max);
            return (
              <li key={p.id}>
                <Link
                  href={productUrl(p)}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-[#00a550] hover:shadow-xl"
                >
                  <div className="relative aspect-square w-full bg-white p-4">
                    <img
                      src={p.image_url || '/images/fleet-x-icon.png'}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <span
                      className={`absolute left-3 top-3 rounded px-2 py-1 text-[11px] font-bold uppercase ${
                        p.in_stock ? 'bg-[#00a550]/10 text-[#00843f]' : 'bg-black/80 text-white'
                      }`}
                    >
                      {p.in_stock ? 'In stock' : 'Out of stock'}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col border-t border-gray-100 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      {[p.brand, p.sku && `#${p.sku}`].filter(Boolean).join(' · ')}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#1d1d1b] group-hover:text-[#00a550] md:text-base">
                      {p.name}
                    </h3>
                    <p className="mt-auto pt-3 text-lg font-bold text-gray-900">{price}</p>
                    <span className="mt-3 flex items-center justify-center rounded-md bg-gradient-to-r from-[#e9e611] to-[#00a34f] py-2.5 text-sm font-semibold text-white transition-opacity group-hover:opacity-90">
                      {price === 'Call for price' ? 'Get a quote' : 'View part'}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default FeaturedProducts;
