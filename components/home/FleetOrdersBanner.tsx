import Image from 'next/image';
import Link from 'next/link';
import { CONTACT } from '@/lib/site';

// Two side-by-side promos: bulk/fleet quotes and "can't find a part".
const FleetOrdersBanner = () => (
  <section className="w-full bg-[#f5f5f4] py-14 md:py-20">
    <div className="mx-auto grid max-w-[1320px] gap-6 px-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative isolate overflow-hidden rounded-2xl bg-black p-8 md:p-12">
        <Image
          src="/images/HeroSection.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 760px, 100vw"
          className="-z-10 object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-transparent" aria-hidden="true" />
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e9e611]">Fleets &amp; repair shops</p>
        <h2 className="mt-3 max-w-md text-2xl font-bold leading-tight text-white md:text-4xl">Buying parts for a whole fleet?</h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-gray-200">
          Send us your parts list and our team will put together a bulk quote — one order, one invoice, shipped to your yard or shop.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-md bg-gradient-to-r from-[#e9e611] to-[#00a34f] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            Request a bulk quote
          </Link>
          <a href={`tel:${CONTACT.phoneE164}`} className="rounded-md border border-white/40 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black">
            Call {CONTACT.phone}
          </a>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-8 md:p-10">
        <div>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#e9e611] to-[#00a34f] text-black" aria-hidden="true">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0zM10.5 7.5v6m-3-3h6" />
            </svg>
          </span>
          <h2 className="mt-5 text-2xl font-bold text-[#1d1d1b]">Can&apos;t find a part?</h2>
          <p className="mt-3 text-base leading-relaxed text-gray-600">
            Give us the part number, OEM cross-reference or a photo of the old part. We&apos;ll check stock and price for you.
          </p>
        </div>
        <Link
          href="/contact"
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#e9e611] to-[#00a34f] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Request a part <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  </section>
);

export default FleetOrdersBanner;
