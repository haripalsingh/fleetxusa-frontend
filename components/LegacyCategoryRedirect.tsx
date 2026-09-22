'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resolveCategorySlug } from '@/lib/dummyProducts';

// Old links used /products?category=<name>. Send them to /products/<category>.
export default function LegacyCategoryRedirect() {
  const router = useRouter();
  const param = useSearchParams().get('category');

  useEffect(() => {
    const slug = param ? resolveCategorySlug(param) : undefined;
    if (slug) router.replace(`/products/${slug}`);
  }, [param, router]);

  return null;
}
