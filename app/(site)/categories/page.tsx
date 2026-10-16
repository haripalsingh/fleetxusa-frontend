import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import { getCategories } from '@/lib/catalog';
import CatalogUnavailable from '@/components/CatalogUnavailable';
import CategoriesGrid from '@/components/CategoriesGrid';

export const metadata: Metadata = pageMetadata({
  title: 'Shop by Category | Fleet X Parts',
  description: 'Browse heavy-duty truck parts by category: clamps, filters, hoses and seals.',
  path: '/categories',
});

export default async function CategoriesPage() {
  const categories = await getCategories();
  if (!categories.length) return <CatalogUnavailable />;

  return (
    <div className="w-full font-display">
      <section className="w-full bg-black text-white">
        <div className="max-w-[1320px] mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">Shop by Category</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mx-auto mb-5" />
          <p className="text-gray-400 text-base md:text-lg">Quality parts for every system on your truck</p>
        </div>
      </section>

      <CategoriesGrid initial={categories} />
    </div>
  );
}
