/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { getCategories } from '@/lib/catalog';
import SectionHeading from './SectionHeading';

type Tile = { title: string; slug: string; image: string; count?: number | null; desc?: string };

// Short descriptions for the known categories (shown under the name).
const DESCS: Record<string, string> = {
  clamps: 'V-band, T-bolt & exhaust',
  filters: 'Oil, fuel & air filtration',
  hoses: 'Silicone coolant & charge-air',
  seals: 'O-rings, gaskets & seals',
};

// Category pictures chosen for the home page (override the admin image when set).
const IMAGES: Record<string, string> = {
  filters: '/images/banners/water-separator.webp',
};

const FALLBACK: Tile[] = [
  { title: 'Clamps', slug: 'clamps', image: '/images/Clamps/20592783.JPG' },
  { title: 'Filters', slug: 'filters', image: IMAGES.filters },
  { title: 'Hoses', slug: 'hoses', image: '/images/Hoses/01-33096-000.JPG' },
  { title: 'Seals', slug: 'seals', image: '/images/Seals/3033247.JPG' },
];

const ShopByCategory = async () => {
  const fromApi = await getCategories();
  const tiles: Tile[] = fromApi.length
    ? fromApi
        .filter((c) => !c.parent_id)
        .slice(0, 8)
        .map((c) => ({ title: c.name, slug: c.slug, image: IMAGES[c.slug] || c.image_url || '/images/fleet-x-icon.png', count: c.product_count }))
    : FALLBACK;

  return (
    <section className="w-full bg-[#f5f5f4] py-14 md:py-20" aria-labelledby="shop-category-heading">
      <div className="mx-auto max-w-[1320px] px-4">
        <SectionHeading id="shop-category-heading" eyebrow="Shop parts" title="Shop by Category" link={{ href: '/categories', label: 'All categories' }} />

        <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {tiles.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/products/${t.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:border-[#00a550] hover:shadow-xl"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-white p-5">
                  <img
                    src={t.image}
                    alt={`${t.title} for heavy-duty trucks`}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col border-t border-gray-100 p-4 md:p-5">
                  <h3 className="text-base font-bold text-[#1d1d1b] md:text-lg">{t.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {DESCS[t.slug.toLowerCase()] ?? (t.count ? `${t.count} parts` : 'Heavy-duty truck parts')}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-[#00a550] transition-all group-hover:gap-2.5">
                    Shop now <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ShopByCategory;
