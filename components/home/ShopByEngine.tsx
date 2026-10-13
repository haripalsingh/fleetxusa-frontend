import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from './SectionHeading';

const ENGINES = [
  {
    mark: 'DD',
    title: 'Detroit DD15 Engine Parts',
    text: 'Browse exploded-view diagrams of the DD15 — cylinder head, connecting rods, gaskets and more — and order the exact numbered part.',
    href: '/detroit-engine-parts',
    cta: 'Open Detroit diagrams',
    image: '/images/engine-parts/CONNECTING-ROD-1.jpg',
  },
  {
    mark: 'CU',
    title: 'Cummins Engine Parts',
    text: 'Top Cummins replacement parts organized by system — pistons, liners, head gaskets, seals and bearings.',
    href: '/cummins-engine-parts',
    cta: 'Shop Cummins parts',
    image: '/images/cummins-engine-parts/cylinder-head.jpg',
  },
];

const STEPS = ['Pick your engine & system', 'Click the numbered callout', 'Add the exact part to cart'];

const ShopByEngine = () => (
  <section className="w-full bg-black py-14 md:py-20" aria-labelledby="shop-engine-heading">
    <div className="mx-auto max-w-[1320px] px-4">
      <SectionHeading id="shop-engine-heading" eyebrow="Engine parts" title="Find Parts by Engine Diagram" dark />

      {/* <ol className="mb-8 grid gap-3 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-200">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#e9e611] to-[#00a34f] text-xs font-bold text-black">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol> */}

      <div className="grid gap-6 lg:grid-cols-2">
        {ENGINES.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className="group grid overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-[0_0_0_3px_#00a550] sm:grid-cols-[1fr_1.1fr]"
          >
            <div className="relative aspect-[4/3] bg-white sm:aspect-auto sm:min-h-[260px]">
              <Image
                src={e.image}
                alt={`${e.title} exploded-view diagram`}
                fill
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 100vw"
                className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col border-t border-gray-100 p-6 sm:border-l sm:border-t-0">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">{e.mark}</span>
              <h3 className="mt-4 text-xl font-bold text-[#1d1d1b]">{e.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{e.text}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-[#00a550] transition-all group-hover:gap-2.5">
                {e.cta} <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default ShopByEngine;
