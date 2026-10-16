'use client';
import type { ReactNode } from 'react';
import { isLinkLive, useLiveCategories } from '@/lib/liveCategories';

/** Renders children unless `href` points to a category that was removed in admin. */
export default function LiveCategoryItem({ href, children }: { href: string; children: ReactNode }) {
  const live = useLiveCategories();
  return isLinkLive(href, live) ? <>{children}</> : null;
}
