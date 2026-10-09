import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import EngineSectionIndex from '@/components/diagrams/EngineSectionIndex';

export const metadata: Metadata = pageMetadata({
  title: 'Cummins Engine Parts | Fleet X Parts',
  description: 'Top Cummins engine parts by system: open an exploded-view diagram, click the part number and add it to your cart.',
  path: '/cummins-engine-parts',
});

export default function CumminsEnginePartsPage() {
  return <EngineSectionIndex sectionKey="cummins" />;
}
