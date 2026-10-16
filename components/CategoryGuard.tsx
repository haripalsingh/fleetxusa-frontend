'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useLiveCategories } from '@/lib/liveCategories';

/** Category pages are pre-built; if the category was removed in admin since, say so. */
export default function CategoryGuard({ slug, children }: { slug: string; children: ReactNode }) {
  const live = useLiveCategories();
  if (live && !live.some((c) => c.slug === slug)) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center font-display">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">This category is no longer available</h1>
        <p className="mt-3 text-gray-600">It may have been renamed or removed. Browse our other categories instead.</p>
        <div className="mt-6 flex gap-4">
          <Link href="/categories" className="rounded-md bg-[#00a550] px-5 py-2.5 font-semibold text-white hover:opacity-90">All Categories</Link>
          <Link href="/products" className="rounded-md border border-gray-300 px-5 py-2.5 font-semibold text-gray-800 hover:border-[#00a550]">All Products</Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
