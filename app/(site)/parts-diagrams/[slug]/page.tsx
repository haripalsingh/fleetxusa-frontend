import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CatalogUnavailable from '@/components/CatalogUnavailable';
import AssemblyView from '@/components/diagrams/AssemblyView';
import DiagramLayout from '@/components/diagrams/DiagramLayout';
import { getDiagram, getDiagramGroups } from '@/lib/catalog';
import type { DiagramAssembly, DiagramGroup } from '@/lib/types';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getDiagram(slug).catch(() => null);
  if (!a) return {};
  const title = `${a.name} — ${a.group.label} Parts Diagram | Fleet X Parts`;
  const description = `Exploded-view diagram of the ${a.name.toLowerCase()} with ${a.parts.length} parts. Click a number to find and order the right part.`;
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: `/parts-diagrams/${a.slug}` },
    openGraph: { title, description, siteName: 'Fleet X Parts', type: 'website', images: a.diagram_url ? [a.diagram_url] : undefined },
  };
}

export default async function DiagramPage({ params }: Props) {
  const { slug } = await params;
  let groups: DiagramGroup[];
  let assembly: DiagramAssembly | null;
  try {
    [groups, assembly] = await Promise.all([getDiagramGroups(), getDiagram(slug)]);
  } catch (err) {
    return <CatalogUnavailable error={err} />;
  }
  if (!assembly) notFound();

  return (
    <DiagramLayout
      groups={groups}
      activeSlug={assembly.slug}
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Parts Diagrams', href: '/parts-diagrams' },
        { label: assembly.group.label },
        { label: assembly.name },
      ]}
    >
      <AssemblyView key={assembly.slug} assembly={assembly} />
    </DiagramLayout>
  );
}
