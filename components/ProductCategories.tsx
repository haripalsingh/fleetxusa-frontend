import Image from 'next/image';
import Link from 'next/link';

type Category = {
  title: string;
  slug: string;
  image: string;
};

const CATEGORIES: Category[] = [
  { title: 'Cooling System', slug: 'cooling-systems', image: '/images/cooling-systems.jpg' },
  { title: 'Steering System', slug: 'steering-system', image: '/images/categories/steering-system.jpg' },
  { title: 'Body and Cabin', slug: 'body-and-cabin', image: '/images/categories/body-and-cabin.jpg' },
  { title: 'Air Spring & Shocks', slug: 'air-spring-shocks', image: '/images/categories/air-spring-shocks.jpg' },
  { title: 'Air Brake & Wheel', slug: 'air-brake-wheel', image: '/images/categories/air-brake-wheel.jpg' },
  { title: 'Chrome & Stainless', slug: 'chrome-stainless', image: '/images/categories/chrome-stainless.jpg' }
];

const ProductCategories = () => {
  return (
    <section className="w-full bg-white py-16 md:py-24">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/products/${category.slug}`}
              className="group block"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-6 text-2xl md:text-[28px] font-medium uppercase tracking-tight text-[#2B2A29]">
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
