/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import CatalogUnavailable from '@/components/CatalogUnavailable';
import DiagramLayout from '@/components/diagrams/DiagramLayout';
import { getDiagramGroups } from '@/lib/catalog';
import type { DiagramGroup } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Shop Truck Parts by Diagram | Fleet X Parts',
  description: 'Find the exact heavy-duty truck part on an exploded-view diagram: pick a system, click the part number and add it to your cart.',
  robots: { index: true, follow: true },
};

export default async function PartsDiagramsPage() {
  let groups: DiagramGroup[];
  try {
    groups = await getDiagramGroups();
  } catch (err) {
    return <CatalogUnavailable error={err} />;
  }

  return (
    <DiagramLayout groups={groups} crumbs={[{ label: 'Home', href: '/' }, { label: 'Parts Diagrams' }]}>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase text-gray-900">Shop by Diagram</h1>
        <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mt-3 mb-4" />
        <p className="max-w-3xl text-gray-700">
          Choose a system on the left (or below), open a diagram and click the numbered callouts to find the exact part.
          Search by part number or name to jump straight to the right diagram.
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="bg-white p-8 text-gray-600">Diagrams are coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
          {groups.map((g) => {
            const first = g.assemblies[0];
            return (
              <section key={g.id} className="flex flex-col bg-white shadow-sm">
                <Link href={`/parts-diagrams/${first.slug}`} className="group block border-b border-gray-200">
                  <div className="aspect-[10/7] overflow-hidden bg-white">
                    {first.diagram_url ? (
                      <img src={first.diagram_url} alt="" loading="lazy" className="h-full w-full object-contain transition-transform group-hover:scale-105" />
                    ) : null}
                  </div>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-bold uppercase text-gray-900">{g.label}</h2>
                  <ul className="mt-3 space-y-1.5">
                    {g.assemblies.map((a) => (
                      <li key={a.id}>
                        <Link href={`/parts-diagrams/${a.slug}`} className="text-sm font-semibold uppercase text-[#1f6fb2] hover:text-[#00a550]">
                          {a.name}
                        </Link>
                        {a.part_count ? <span className="ml-2 text-xs text-gray-500">({a.part_count} parts)</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </DiagramLayout>
  );
}
