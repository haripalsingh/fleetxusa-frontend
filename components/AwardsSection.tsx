import Image from 'next/image';
import Link from 'next/link';

const HIGHLIGHTS = [
  'Survey results: Based on investor trust, customer trust and employee trust',
  'Social listening analysis: Based on the number of mentions, sentiment, virality and reach'
];

const AwardsSection = () => {
  return (
    <section className="w-full bg-[#2B2A29] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-0 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-12">
        {/* Award image */}
        <Image
          src="/images/trustworthy_awards_2026.jpg"
          alt="Newsweek Most Trustworthy Companies in America 2026"
          width={1128}
          height={549}
          sizes="(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw"
          className="w-full h-auto rounded-lg"
        />

        {/* Copy */}
        <div className="text-white">
          <h2 className="text-2xl md:text-[28px] font-medium uppercase leading-snug tracking-tight mb-6">
            FleetX named one of the most trustworthy companies
          </h2>

          <p className="text-lg md:text-xl leading-relaxed text-white/90 mb-5">
            FleetX is honored to be recognized on Newsweek&rsquo;s list of the Most Trustworthy Companies in
            America 2026.
          </p>

          <ul className="list-disc pl-6 space-y-2 text-base md:text-lg leading-relaxed text-white/90 mb-8">
            {HIGHLIGHTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <Link
            href="/about"
            className="inline-block border-b-2 border-white pb-0.5 text-sm font-semibold uppercase tracking-[0.15em] text-white hover:text-[#00a550] hover:border-[#00a550] transition-colors"
          >
            Explore
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
