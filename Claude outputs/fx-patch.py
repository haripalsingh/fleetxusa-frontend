import re,sys
root=sys.argv[1]
def rw(p,fn):
    p=root+'/'+p; raw=open(p,newline='',encoding='utf-8').read(); crlf='\r\n' in raw; s=raw.replace('\r\n','\n'); t=fn(s)
    print(('ok ' if t!=s else '!! UNCHANGED ')+p)
    if crlf: t=t.replace('\n','\r\n')
    open(p,'w',newline='',encoding='utf-8').write(t)
def cat(s):
    old=s[s.index('/** Every product in the catalog, all categories'):s.index('/** Every Detroit diagram assembly slug. */')]
    new='''/**
 * Every product page to build, as { category, product } URL params:
 * the normal catalog (max 100 per API page) PLUS the Detroit engine parts, which
 * the /products list leaves out and only appear inside the diagrams.
 */
export async function getAllProductParamsForBuild(): Promise<{ category: string; product: string }[]> {
  const first = await api<Product[]>('/products', { query: { per_page: 100, page: 1 } });
  const pages = Number((first.meta as { total_pages?: number } | undefined)?.total_pages ?? 1);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pages - 1) }, (_, i) =>
      api<Product[]>('/products', { query: { per_page: 100, page: i + 2 } })
    )
  );
  const catalog = [first, ...rest].flatMap((r) => r.data);

  const groups = await getDiagramGroups();
  const assemblies = await Promise.all(
    groups.flatMap((g) => g.assemblies).map((a) => getDiagram(a.slug).catch(() => null))
  );
  const diagramProducts = assemblies.flatMap((a) => a?.parts ?? []).flatMap((p) => (p.product ? [p.product] : []));

  const params = new Map<string, { category: string; product: string }>();
  for (const p of [...catalog, ...diagramProducts]) {
    if (!p?.slug) continue;
    params.set(p.slug, { category: p.category?.slug || 'parts', product: p.slug });
  }
  return requireData('products', [...params.values()]);
}

'''
    return s.replace(old,new)
rw('lib/catalog.ts',cat)
rw('app/(site)/products/[category]/[product]/page.tsx', lambda s: s.replace("import { getAllProductsForBuild, getProduct } from '@/lib/catalog';","import { getAllProductParamsForBuild, getProduct } from '@/lib/catalog';").replace(
"export const dynamicParams = false;\nexport async function generateStaticParams() {\n  return (await getAllProductsForBuild()).map((p) => ({ category: p.category?.slug || 'parts', product: p.slug }));\n}",
"// (new products added after a build only exist after the next build + upload)\nexport async function generateStaticParams() {\n  return getAllProductParamsForBuild();\n}"))
for f in ['app/(site)/products/[category]/page.tsx','app/(site)/detroit-engine-parts/[slug]/page.tsx']:
    rw(f, lambda s: s.replace("export const dynamicParams = false;\n",""))
