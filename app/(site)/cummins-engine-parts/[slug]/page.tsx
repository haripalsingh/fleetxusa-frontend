import type { Metadata } from 'next';
import EngineSectionDiagram, { engineDiagramMetadata } from '@/components/diagrams/EngineSectionDiagram';
import { getAllDiagramSlugs } from '@/lib/catalog';

type Props = { params: Promise<{ slug: string }> };

// Static export: one page per diagram in this section, built from the API.
export async function generateStaticParams() {
  return (await getAllDiagramSlugs('cummins')).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return engineDiagramMetadata('cummins', (await params).slug);
}

export default async function DiagramPage({ params }: Props) {
  return <EngineSectionDiagram sectionKey="cummins" slug={(await params).slug} />;
}
