/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/lib/catalog';

type Category = {
  title: string;
  slug: string;
  image: string;
};

// Fallback when the API is unreachable (e.g. during a build without the backend running).
const FALLBACK: Category[] = [
  { title: 'Clamps', slug: 'clamps', image: '/images/Clamps/20592783.JPG' },
  { title: 'Filters', slug: 'filters', image: '/images/filter-cat.jpg' },
  { title: 'Hoses', slug: 'hoses', image: '/images/Hoses/01-33096-000.JPG' },
  { title: 'Seals', slug: 'seals', image: '/images/Seals/3033247.JPG' }
];

const ProductCategories = async () => {
  const fromApi = await getCategories();
  const CATEGORIES: Category[] = fromApi.length
    ? fromApi
        .filter((c) => !c.parent_id)
        .slice(0, 4)
        .map((c) => ({ title: c.name, slug: c.slug, image: c.image_url || '/images/fleet-x-icon.png' }))
    : FALLBACK;

  return (
    <section className="w-full bg-[#f7f7f7] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        {/* Section heading */}
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium uppercase tracking-tight text-[#2B2A29]">
              Product Categories
            </h2>
            <div className="mt-3 w-20 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05]" />
          </div>
          <Link
            href="/products"
            className="whitespace-nowrap text-base md:text-lg font-medium text-[#00a550] hover:opacity-80 transition-opacity"
          >
            View All Products &rarr;
          </Link>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/products/${category.slug}`}
              className="group block"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl shadow-lg bg-[#f7f7f7] transition-shadow duration-500 group-hover:shadow-2xl ">
                {category.image.startsWith('/') ? (
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={category.image}
                    alt={category.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain bg-[#ffffff] transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="mt-6 text-xl md:text-2xl font-medium uppercase tracking-tight text-[#2B2A29]">
                {category.title}
              </h3>
              <span className="mt-6 inline-block border-b-2 border-[#2B2A29] pb-0.5 text-sm font-semibold uppercase tracking-[0.15em] text-[#2B2A29] group-hover:text-[#00a550] group-hover:border-[#00a550] transition-colors">
                Explore
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
