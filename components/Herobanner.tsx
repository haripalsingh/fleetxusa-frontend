import Link from 'next/link';

// Hero banner — looping background video (served from /public/images) with heading, copy and CTA on top.
const HeroBanner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-black min-h-[500px] md:h-[500px] flex items-center">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/images/fleetx-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Dark overlay keeps the text readable over the video */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-0 py-12 md:py-8">
        <h1 className="max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-wide text-white mb-6">
          Heavy-Duty Parts
          <br />
          Engineered to Endure
        </h1>

        <p className="max-w-4xl text-lg md:text-xl leading-relaxed text-white mb-8">
          FleetX is expertly engineered to help modern fleets improve efficiency, reduce operating costs,
          and gain complete visibility into their vehicles. With intelligent fleet management, real-time
          tracking, and data-driven insights, FleetX helps businesses make smarter decisions and keep their
          fleets moving.
        </p>

        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#e9e611] to-[#00a34f] px-10 py-4 text-xl font-semibold text-white transition-opacity hover:opacity-90"
        >
          Explore more
        </Link>
      </div>
    </section>
  );
};

export default HeroBanner;
