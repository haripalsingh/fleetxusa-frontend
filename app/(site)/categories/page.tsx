/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategories } from '@/lib/catalog';
import CatalogUnavailable from '@/components/CatalogUnavailable';

export const metadata: Metadata = {
  title: 'Shop by Category | Fleet X Parts',
  description: 'Browse heavy-duty truck parts by category: clamps, filters, hoses and seals.',
  robots: { index: true, follow: true },
};

export default async function CategoriesPage() {
  const categories = await getCategories();
  if (!categories.length) return <CatalogUnavailable />;

  const top = categories.filter((c) => !c.parent_id);
  const children = (id: number) => categories.filter((c) => c.parent_id === id);

  return (
    <div className="w-full font-display">
      <section className="w-full bg-black text-white">
        <div className="max-w-[1320px] mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">Shop by Category</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mx-auto mb-5" />
          <p className="text-gray-400 text-base md:text-lg">Quality parts for every system on your truck</p>
        </div>
      </section>

      <div className="bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {top.map((c) => (
            <div key={c.id} className="group bg-white shadow-sm hover:shadow-lg transition-shadow overflow-hidden rounded-md">
              <Link href={`/products/${c.slug}`} className="block">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={c.image_url || '/images/fleet-x-icon.png'}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-contain bg-[#ffffff]  transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 text-center">
                  <h2 className="text-lg font-bold uppercase text-gray-900 group-hover:text-[#00a550]">{c.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">{c.product_count ?? 0} products</p>
                  {/* {c.description && <p className="mt-2 text-sm text-gray-600 line-clamp-2">{c.description}</p>} */}
                </div>
              </Link>
              {children(c.id).length > 0 && (
                <ul className="px-5 pb-5 flex flex-wrap gap-2">
                  {children(c.id).map((s) => (
                    <li key={s.id}>
                      <Link href={`/products/${s.slug}`} className="inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-[#00a550] hover:text-[#00a550]">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
