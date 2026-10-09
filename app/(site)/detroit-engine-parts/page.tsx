import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import EngineSectionIndex from '@/components/diagrams/EngineSectionIndex';

export const metadata: Metadata = pageMetadata({
  title: 'Detroit Engine Parts | Fleet X Parts',
  description: 'Detroit DD15 engine parts by system: open an exploded-view diagram, click the part number and add it to your cart.',
  path: '/detroit-engine-parts',
});

export default function DetroitEnginePartsPage() {
  return <EngineSectionIndex sectionKey="detroit" />;
}
