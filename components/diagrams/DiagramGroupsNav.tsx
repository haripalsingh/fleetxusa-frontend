'use client';

// Left sidebar of "Shop by Diagram": numbered groups ("20 - ENGINE COOLING-RADIATOR")
// that expand into their diagrams. Includes a part-number / name search.

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { DiagramGroup } from '@/lib/types';

const PlusMinus = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M4 10h12" strokeLinecap="round" />
    {!open && <path d="M10 4v12" strokeLinecap="round" />}
  </svg>
);

export default function DiagramGroupsNav({
  groups,
  activeSlug,
}: {
  groups: DiagramGroup[];
  /** slug of the diagram being viewed (its group starts expanded) */
  activeSlug?: string;
}) {
  const activeGroupId = useMemo(
    () => groups.find((g) => g.assemblies.some((a) => a.slug === activeSlug))?.id,
    [groups, activeSlug]
  );
  const [open, setOpen] = useState<Set<number>>(() => new Set(activeGroupId ? [activeGroupId] : []));
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DiagramGroup[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // server-side search (matches group, diagram, part name and part number / SKU)
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setSearching(true);
      api<DiagramGroup[]>('/diagrams', { query: { q }, signal: ctrl.signal })
        .then((res) => setResults(res.data))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  const searchActive = query.trim().length >= 2 && results !== null;
  const list = searchActive ? results ?? [] : groups;

  const toggle = (id: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allOpen = list.length > 0 && list.every((g) => open.has(g.id));

  return (
    <div className="lg:sticky lg:top-24">
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
        className="lg:hidden mb-4 w-full flex items-center justify-between bg-black text-white px-5 py-3 font-bold uppercase"
      >
        Browse diagram groups
        <span aria-hidden="true">{mobileOpen ? '−' : '+'}</span>
      </button>

      <div className={`${mobileOpen ? 'block' : 'hidden'} lg:block bg-white shadow-sm`}>
        <div className="flex items-center justify-between gap-3 bg-black px-4 py-3 text-white">
          <h2 className="font-bold uppercase tracking-wide text-sm">Design Groups</h2>
          <button
            type="button"
            onClick={() => setOpen(allOpen ? new Set() : new Set(list.map((g) => g.id)))}
            className="rounded border border-white/60 px-3 py-1 text-xs font-semibold hover:bg-white hover:text-black transition-colors"
          >
            {allOpen ? 'Collapse' : 'Expand all'}
          </button>
        </div>

        <div className="p-3 border-b border-gray-200">
          <label className="relative block">
            <span className="sr-only">Search diagrams by part number or name</span>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim().length < 2) setResults(null);
              }}
              placeholder="Search part # or name"
              className="w-full border border-gray-300 px-3 py-2.5 pr-9 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#00a550]"
            />
            <svg viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="9" cy="9" r="6" />
              <path d="M14 14l4 4" strokeLinecap="round" />
            </svg>
          </label>
          {searching && <p className="mt-2 text-xs text-gray-500">Searching…</p>}
          {searchActive && !searching && (
            <p className="mt-2 text-xs text-gray-500">
              {list.length ? `${list.reduce((n, g) => n + g.assemblies.length, 0)} diagram(s) match “${query.trim()}”` : `No diagrams match “${query.trim()}”`}
            </p>
          )}
        </div>

        <ul className="max-h-none lg:max-h-[calc(100vh-300px)] overflow-y-auto">
          {list.map((g) => {
            const isOpen = searchActive || open.has(g.id);
            return (
              <li key={g.id} className="border-b border-gray-200 last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggle(g.id)}
                  aria-expanded={isOpen}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left text-[14px] font-bold uppercase tracking-wide transition-colors ${
                    g.id === activeGroupId ? 'bg-[#e8f6ee] text-gray-900' : 'bg-[#f0f1f4] text-gray-800 hover:bg-[#e6e8ec]'
                  }`}
                >
                  <PlusMinus open={isOpen} />
                  <span className="flex-1">{g.label}</span>
                  <span className="text-xs font-semibold text-gray-500">{g.assemblies.length}</span>
                </button>
                {isOpen && (
                  <ul className="bg-white py-1">
                    {g.assemblies.map((a) => {
                      const active = a.slug === activeSlug;
                      return (
                        <li key={a.id}>
                          <Link
                            href={`/parts-diagrams/${a.slug}`}
                            aria-current={active ? 'page' : undefined}
                            onClick={() => setMobileOpen(false)}
                            className={`block border-l-4 py-2 pl-10 pr-4 text-[13px] font-bold uppercase leading-snug transition-colors ${
                              active
                                ? 'border-[#00a550] bg-[#f3fbf6] text-[#00a550]'
                                : 'border-transparent text-[#1f6fb2] hover:text-[#00a550] hover:bg-gray-50'
                            }`}
                          >
                            {a.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
          {list.length === 0 && !searchActive && <li className="px-4 py-6 text-sm text-gray-500">No diagrams yet.</li>}
        </ul>
      </div>
    </div>
  );
}
