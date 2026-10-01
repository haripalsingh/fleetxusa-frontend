import Link from 'next/link';
import type { ReactNode } from 'react';
import type { DiagramGroup } from '@/lib/types';
import DiagramGroupsNav from './DiagramGroupsNav';

type Crumb = { label: string; href?: string };

/** Page frame for "Shop by Diagram": breadcrumb bar + groups sidebar + content. */
export default function DiagramLayout({
  groups,
  activeSlug,
  crumbs,
  children,
}: {
  groups: DiagramGroup[];
  activeSlug?: string;
  crumbs: Crumb[];
  children: ReactNode;
}) {
  return (
    <div className="w-full bg-[#f0f0f0] font-display">
      <div className="w-full bg-gray-200 border-b border-gray-300">
        <div className="max-w-[1500px] mx-auto px-4 flex flex-wrap items-stretch gap-x-6">
          <span className="hidden sm:flex items-center py-4 pr-6 border-r border-gray-400 font-heading text-sm font-bold text-gray-900">
            Shop by Diagram
          </span>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 py-4 text-sm">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="text-gray-500">&rsaquo;</span>}
                {c.href ? (
                  <Link href={c.href} className="text-gray-600 hover:text-[#00a550]">
                    {c.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-gray-900">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-8">
        <aside>
          <DiagramGroupsNav groups={groups} activeSlug={activeSlug} />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
