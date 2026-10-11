import HeroSlider, { type Slide } from './HeroSlider';

// ---- Edit banners here -------------------------------------------------------------
// Center slider. Swap `image` for a designed banner any time (wide, dark images work best).
const SLIDES: Slide[] = [
  {
    image: '/images/HeroSection.png',
    alt: 'Heavy-duty truck with replacement parts',
    eyebrow: 'Shipped across the USA',
    title: 'Heavy-Duty Truck Parts, Shipped Fast',
    cta: 'Shop all parts',
    href: '/products',
  },
  {
    image: '/images/filter-cat.jpg',
    alt: 'FleetX oil, fuel and air filters',
    eyebrow: 'Filtration',
    title: 'Oil, Fuel & Air Filters',
    text: 'Keep engines clean and running longer.',
    cta: 'Shop filters',
    href: '/products/filters',
  },
  {
    image: '/images/banner1.jpg',
    alt: 'Heavy-duty truck parts for fleet orders',
    eyebrow: 'Fleets & repair shops',
    title: 'Bulk Orders for Your Fleet',
    text: 'Send your parts list — we’ll quote the whole order.',
    cta: 'Request a quote',
    href: '/contact',
  },
];

// -------------------------------------------------------------------------------------

// Home hero: one full-width slider inside the site container.
const HeroBanners = () => (
  <section className="w-full bg-[#f5f5f4] py-4 md:py-6" aria-label="Featured offers">
    <div className="mx-auto h-[420px] max-w-[1320px] px-4 sm:h-[460px] lg:h-[540px]">
      <HeroSlider slides={SLIDES} />
    </div>
  </section>
);

export default HeroBanners;
