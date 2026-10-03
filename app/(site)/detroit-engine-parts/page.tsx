/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import Link from 'next/link';
import CatalogUnavailable from '@/components/CatalogUnavailable';
import DiagramLayout from '@/components/diagrams/DiagramLayout';
import { getDiagramGroups } from '@/lib/catalog';
import type { DiagramGroup } from '@/lib/types';

export const metadata: Metadata = pageMetadata({
  title: 'Detroit Engine Parts | Fleet X Parts',
  description: 'Detroit DD15 engine parts by system: open an exploded-view diagram, click the part number and add it to your cart.',
  path: '/detroit-engine-parts',
});

export default async function PartsDiagramsPage() {
  let groups: DiagramGroup[];
  try {
    groups = await getDiagramGroups();
  } catch (err) {
    return <CatalogUnavailable error={err} />;
  }

  return (
    <DiagramLayout groups={groups} crumbs={[{ label: 'Home', href: '/' }, { label: 'Detroit Engine Parts' }]}>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase text-gray-900">Detroit Engine Parts</h1>
        <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mt-3 mb-4" />
        <p className="max-w-3xl text-gray-700">
          Choose a system below, open its diagram and click the numbered callouts to find the exact part.
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="bg-white p-8 text-gray-600">Diagrams are coming soon.</p>
      ) : (
        <div className="space-y-10">
          {groups.map((g) => (
            <section key={g.id}>
              {groups.length > 1 ? (
                <h2 className="mb-4 text-lg font-bold uppercase text-gray-900">{g.label}</h2>
              ) : null}
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {g.assemblies.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/detroit-engine-parts/${a.slug}`}
                      className="group flex h-full flex-col bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="aspect-[10/7] overflow-hidden border-b border-gray-200 bg-white p-3">
                        {a.diagram_url ? (
                          <img
                            src={a.diagram_url}
                            alt={a.name}
                            loading="lazy"
                            className="h-full w-full object-contain transition-transform group-hover:scale-105"
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-1 items-start justify-between gap-3 p-4">
                        <h3 className="text-sm font-bold uppercase leading-snug text-[#1f6fb2] group-hover:text-[#00a550]">
                          {a.name}
                        </h3>
                        {a.part_count ? (
                          <span className="shrink-0 text-xs text-gray-500">{a.part_count} parts</span>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </DiagramLayout>
  );
}
