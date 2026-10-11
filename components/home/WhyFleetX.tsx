import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';

const POINTS = [
  { title: 'Search by part number', text: 'Look up parts by OEM or FleetX number and get straight to the right product page.', d: 'M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z' },
  { title: 'Exploded-view diagrams', text: 'Match the numbered callout on the diagram to the part on your engine — no guesswork.', d: 'M4 5h16v14H4zM9 9h.01M15 15h.01M9 9l6 6' },
  { title: 'Built for heavy duty', text: 'Parts chosen for Class 8 trucks, long-haul tractors and vocational fleets.', d: 'M9 12l2 2 4-4m5.62-4.02A11.96 11.96 0 0112 2.94a11.96 11.96 0 01-8.62 3.04A12 12 0 003 9c0 5.6 3.82 10.3 9 11.62 5.18-1.33 9-6.03 9-11.62 0-1.04-.13-2.05-.38-3.02z' },
  { title: 'Real people on the phone', text: 'Talk to someone who knows trucks before you order, Monday to Friday.', d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z' },
];

const link = 'font-semibold text-[#00a550] hover:underline';

// Why-buy section with crawlable intro copy and internal links (good for the homepage's SEO).
const WhyFleetX = () => (
  <section className="w-full bg-white py-14 md:py-20" aria-labelledby="why-heading">
    <div className="mx-auto grid max-w-[1320px] gap-10 px-4 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#00a550]">Why {SITE_NAME}</p>
        <h2 id="why-heading" className="mt-2 text-2xl font-bold text-[#1d1d1b] md:text-4xl">
          Heavy-Duty Truck Parts for Fleets, Shops &amp; Owner-Operators
        </h2>
        <div className="mt-3 h-1 w-16 bg-gradient-to-r from-[#00a550] to-[#f8ef05]" aria-hidden="true" />
        <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-600">
          <p>
            Downtime costs money. {SITE_NAME} stocks the wear and replacement parts heavy-duty trucks need most — from{' '}
            <Link href="/products/clamps" className={link}>exhaust and V-band clamps</Link> and{' '}
            <Link href="/products/filters" className={link}>oil, fuel and air filters</Link> to{' '}
            <Link href="/products/hoses" className={link}>silicone coolant hoses</Link> and{' '}
            <Link href="/products/seals" className={link}>O-rings, gaskets and seals</Link>.
          </p>
          <p>
            Working on the engine? Use our{' '}
            <Link href="/detroit-engine-parts" className={link}>Detroit DD15 parts diagrams</Link> or browse{' '}
            <Link href="/cummins-engine-parts" className={link}>Cummins engine parts</Link> by system to order the exact
            part number. Have a question about shipping or returns? See our{' '}
            <Link href="/faqs" className={link}>FAQs</Link>.
          </p>
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {POINTS.map((p) => (
          <li key={p.title} className="rounded-xl border border-gray-200 bg-[#fafaf9] p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-black text-white" aria-hidden="true">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={p.d} />
              </svg>
            </span>
            <h3 className="mt-4 text-base font-bold text-[#1d1d1b]">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{p.text}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default WhyFleetX;
