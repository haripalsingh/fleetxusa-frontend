import HeroSlider from './HeroSlider';

// Home hero: edge-to-edge banner slider (full browser width, no gaps).
// Slides (text, links, product cut-outs) are defined in HeroSlider.tsx.
const HeroBanners = () => (
  <section className="w-full bg-black" aria-label="Featured offers">
    <div className="h-[440px] w-full sm:h-[500px] lg:h-[560px] xl:h-[600px]">
      <HeroSlider />
    </div>
  </section>
);

export default HeroBanners;
