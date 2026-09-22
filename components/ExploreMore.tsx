import Image from 'next/image';
import Link from 'next/link';

type ExploreCard = {
  heading: string;
  text: string;
  image: string;
  href: string;
};

const CARDS: ExploreCard[] = [
  {
    heading: 'Genuine Parts',
    text: 'Get a closer look at our engines and powertrains, electrical systems, and safety and warranty features.',
    image: '/images/our-feature.jpg',
    href: '/products'
  },
  {
    heading: 'Heavy duty parts',
    text: 'From construction and towing to refuse and long haul, our parts fit every industry that keeps fleets moving forward.',
    image: '/images/industries.jpg',
    href: '/products'
  },
  {
    heading: 'Driver & Maintenance',
    text: "We're accelerating the shift to electromobility by helping fleets plan, fulfill and optimize the switch to electric vehicles.",
    image: '/images/electrification.jpg',
    href: '/about'
  }
];

// "Explore More" — centered heading with accent bar and a 3-card grid (image, title, copy, link).
const ExploreMore = () => {
  return (
    <section className="w-full bg-white font-display">
      <div className="max-w-[1320px] mx-auto px-4 py-16 md:py-20">
        <h2 className="font-heading text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-black text-center mb-4">
          Explore More
        </h2>

        <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mx-auto mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {CARDS.map((card) => (
            <Link key={card.heading} href={card.href} className="group flex flex-col">
              <div className="relative w-full aspect-video overflow-hidden rounded-[12px] bg-black transition-transform duration-300 group-hover:scale-[1.02]">
                <Image
                  src={card.image}
                  alt={card.heading}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>

              <h3 className="font-heading pt-5 text-xl font-extrabold uppercase tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-[#00a550]">
                {card.heading}
              </h3>

              <p className="pt-2 pb-4 text-sm sm:text-base leading-relaxed text-slate-600">{card.text}</p>

              <span className="self-start text-xs sm:text-sm font-semibold uppercase tracking-widest underline underline-offset-4 decoration-1 text-slate-900 transition-colors duration-200 group-hover:text-[#00a550]">
                Explore
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreMore;
