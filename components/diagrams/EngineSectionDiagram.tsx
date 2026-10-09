import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { pageMetadata } from '@/lib/site';
import CatalogUnavailable from '@/components/CatalogUnavailable';
import AssemblyView from '@/components/diagrams/AssemblyView';
import DiagramLayout from '@/components/diagrams/DiagramLayout';
import { getDiagram, getDiagramGroups } from '@/lib/catalog';
import { ENGINE_SECTIONS, groupsForSection, sectionKeyOfGroup, type EngineSectionKey } from '@/lib/engineSections';
import type { DiagramAssembly, DiagramGroup } from '@/lib/types';

export async function engineDiagramMetadata(sectionKey: EngineSectionKey, slug: string): Promise<Metadata> {
  const section = ENGINE_SECTIONS[sectionKey];
  const a = await getDiagram(slug).catch(() => null);
  if (!a) return {};
  const title = `${a.name} — ${a.group.label} ${section.title} | Fleet X Parts`;
  const description = `Exploded-view diagram of the ${a.name.toLowerCase()} with ${a.parts.length} parts. Click a number to find and order the right part.`;
  return pageMetadata({ title, description, path: `${section.path}/${a.slug}`, image: a.diagram_url });
}

/** One diagram page inside an engine section (sidebar + exploded view + parts list). */
export default async function EngineSectionDiagram({ sectionKey, slug }: { sectionKey: EngineSectionKey; slug: string }) {
  const section = ENGINE_SECTIONS[sectionKey];
  let groups: DiagramGroup[];
  let assembly: DiagramAssembly | null;
  try {
    const [all, a] = await Promise.all([getDiagramGroups(), getDiagram(slug)]);
    groups = groupsForSection(all, sectionKey);
    assembly = a;
  } catch (err) {
    return <CatalogUnavailable error={err} />;
  }
  if (!assembly) notFound();

  // Diagram belongs to the other engine section -> send it there.
  const owner = sectionKeyOfGroup(assembly.group);
  if (owner !== sectionKey) redirect(`${ENGINE_SECTIONS[owner].path}/${assembly.slug}`);

  // Previous / next stay inside this section.
  const flat = groups.flatMap((g) => g.assemblies);
  const i = flat.findIndex((a) => a.slug === assembly!.slug);
  const pick = (j: number) => (j >= 0 && j < flat.length ? { name: flat[j].name, slug: flat[j].slug } : null);
  const view: DiagramAssembly = i >= 0 ? { ...assembly, previous: pick(i - 1), next: pick(i + 1) } : assembly;

  return (
    <DiagramLayout
      title={section.title}
      basePath={section.path}
      sectionKey={sectionKey}
      groups={groups}
      activeSlug={assembly.slug}
      crumbs={[
        { label: 'Home', href: '/' },
        { label: section.title, href: section.path },
        { label: assembly.group.label },
        { label: assembly.name },
      ]}
    >
      <AssemblyView key={assembly.slug} assembly={view} basePath={section.path} />
    </DiagramLayout>
  );
}
