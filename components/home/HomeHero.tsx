import Link from 'next/link';

const POPULAR_SEARCHES = ['DD15', 'V-band clamp', 'Oil filter', 'Coolant hose', 'O-ring'];

const CHECKS = ['Fast nationwide shipping', 'Parts experts on call', 'Secure checkout'];

// Storefront hero: background video, keyword H1 and a part-number search that posts to /products?q=
// (a plain GET form, so it works without JavaScript and on the static export).
const HomeHero = () => (
  <section className="relative isolate w-full overflow-hidden bg-black">
    <video
      className="absolute inset-0 -z-10 h-full w-full object-cover"
      src="/images/fleetx-video.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
    <div className="absolute inset-0 -z-10 bg-black/65" aria-hidden="true" />

    <div className="mx-auto max-w-[1320px] px-4 text-center py-16 md:py-24 lg:py-28">
      <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
        Heavy-Duty Truck Parts, Shipped Fast
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-gray-200 md:text-lg">Search by part number or shop by category.</p>

      <form action="/products" method="get" role="search" className="mx-auto mt-8 max-w-2xl text-left">
        <label htmlFor="hero-search" className="sr-only">
          Search truck parts by part number or keyword
        </label>
        <div className="flex overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-[#00a550]">
          <span className="flex items-center pl-4 text-gray-400" aria-hidden="true">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
          </span>
          <input
            id="hero-search"
            name="q"
            type="search"
            required
            autoComplete="off"
            placeholder="Part number or keyword"
            className="min-w-0 flex-1 bg-transparent px-3 py-4 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            className="m-1.5 rounded-md bg-gradient-to-r from-[#e9e611] to-[#00a34f] px-5 text-sm font-bold uppercase tracking-wide text-black transition-opacity hover:opacity-90 sm:px-8"
          >
            Search
          </button>
        </div>
      </form>

      {/* <div className="mx-auto mt-4 flex max-w-2xl justify-center flex-wrap items-center gap-2 text-sm">
        <span className="text-gray-300">Popular:</span>
        {POPULAR_SEARCHES.map((term) => (
          <Link
            key={term}
            href={`/products?q=${encodeURIComponent(term)}`}
            className="rounded-full border border-white/25 bg-white/5 px-3 py-1 text-gray-100 transition-colors hover:border-[#00a550] hover:text-white"
          >
            {term}
          </Link>
        ))}
      </div> */}

      <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-200">
        {CHECKS.map((c) => (
          <li key={c} className="flex items-center gap-2">
            <svg className="h-4 w-4 text-[#00a550]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {c}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default HomeHero;
