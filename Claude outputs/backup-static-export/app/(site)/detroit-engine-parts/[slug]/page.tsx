import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
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
  const title = `${a.name} — ${a.group.label} Detroit Engine Parts | Fleet X Parts`;
  const description = `Exploded-view diagram of the ${a.name.toLowerCase()} with ${a.parts.length} parts. Click a number to find and order the right part.`;
  return pageMetadata({ title, description, path: `/detroit-engine-parts/${a.slug}`, image: a.diagram_url });
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
        { label: 'Detroit Engine Parts', href: '/detroit-engine-parts' },
        { label: assembly.group.label },
        { label: assembly.name },
      ]}
    >
      <AssemblyView key={assembly.slug} assembly={assembly} />
    </DiagramLayout>
  );
}
