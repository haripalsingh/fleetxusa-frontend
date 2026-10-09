// "Shop by Diagram" engine sections. Diagram groups are split by their name in the admin:
// a group whose name contains "Cummins" shows at /cummins-engine-parts, every other group
// at /detroit-engine-parts. To add another engine brand, add an entry here + its 2 pages.

import type { DiagramGroup } from './types';

export type EngineSectionKey = 'detroit' | 'cummins';

export type EngineSection = {
  key: EngineSectionKey;
  title: string;
  path: string;
  intro: string;
  /** category in the admin that belongs to this section (hidden from the normal shop) */
  categorySlug: string;
};

export const ENGINE_SECTIONS: Record<EngineSectionKey, EngineSection> = {
  detroit: {
    key: 'detroit',
    title: 'Detroit Engine Parts',
    path: '/detroit-engine-parts',
    intro: 'Choose a system below, open its diagram and click the numbered callouts to find the exact part.',
    categorySlug: 'engine-parts',
  },
  cummins: {
    key: 'cummins',
    title: 'Cummins Engine Parts',
    path: '/cummins-engine-parts',
    intro: 'Top Cummins engine parts by system: open a diagram and click the numbered callouts to find the exact part.',
    categorySlug: 'cummins-engine-parts',
  },
};

export const sectionKeyOfGroup = (g: Pick<DiagramGroup, 'name'> & { label?: string }): EngineSectionKey =>
  /cummins/i.test(`${g.name} ${g.label ?? ''}`) ? 'cummins' : 'detroit';

export const groupsForSection = <T extends Pick<DiagramGroup, 'name'> & { label?: string }>(
  groups: T[],
  key: EngineSectionKey
): T[] => groups.filter((g) => sectionKeyOfGroup(g) === key);
