import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';
import Image from 'next/image';

export const metadata: Metadata = pageMetadata({
  title: 'About Us | Fleet X Parts',
  description: 'Learn about Fleet X Parts, a trusted supplier of heavy-duty truck brake parts built for fleet reliability.',
  keywords: 'about fleet x parts, truck parts company, fleet parts supplier',
  path: '/about',
});

const VALUES = [
  {
    title: 'Quality First',
    text: 'Every part we sell is tested and verified to meet OE-level standards, so your fleet stays on the road, not in the shop.'
  },
  {
    title: 'Fleet-Proven Reliability',
    text: 'From delivery vans to long-haul trucks, our parts are chosen by fleet managers who cannot afford downtime.'
  },
  {
    title: 'Fast, Nationwide Shipping',
    text: 'With warehouses positioned across the country, most orders ship the same day and arrive when you need them.'
  },
  {
    title: 'Real Support, Real People',
    text: 'Our parts specialists know brake systems inside and out and are ready to help you find the right fit, fast.'
  }
];

const AboutPage = () => {
  return (
    <div className="w-full bg-white font-display">
      {/* ---- Header (black, full width, matches Contact Us page) ---- */}
      <section className="w-full bg-black text-white">
        <div className="max-w-[1320px] mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">About FleetX</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mx-auto mb-6" />
        </div>
      </section>

      {/* ---- Our Story ---- */}
      <section className="w-full">
        <div className="max-w-[1320px] mx-auto px-4 py-16 ">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-8 space-y-6">
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-black mb-2">Our Story</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mb-6" />
            <p className="text-gray-600 leading-relaxed mb-4">
              This is dummy placeholder text. Fleet X Parts was founded with a simple goal: make it easier for
              fleet operators to find reliable, heavy-duty parts without the guesswork. Replace this paragraph
              with your company&apos;s real founding story.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Another placeholder paragraph. Over the years we have grown from a small regional supplier into a
              nationwide parts partner, but our commitment to quality and fast shipping has stayed the same.
              Update this copy with real milestones and details.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Another placeholder paragraph. Over the years we have grown from a small regional supplier into a
              nationwide parts partner, but our commitment to quality and fast shipping has stayed the same.
              Update this copy with real milestones and details.
            </p>
              </div>

                <div className="lg:col-span-4 space-y-6">
<Image
              src="/images/trustworthy_awards_2026.jpg"
              alt="Fleet X Parts"
              width={1128}
              height={549}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="max-w-full h-auto"
              priority
            />
                  </div>
            </div>
          

          
          </div>
 
       
      </section>

      {/* ---- Values grid ---- */}
      <section className="w-full bg-gray-50">
        <div className="max-w-[1320px] mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-black mb-2">
              Why FleetX Choose Us
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00a550] to-[#f8ef05] mx-auto mb-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => (
              <div key={value.title} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="w-8 h-8 rounded-full bg-[#00a550]/10 text-[#00a550] flex items-center justify-center font-bold mb-4">
                  {i + 1}
                </div>
                <h3 className="font-heading font-bold text-black mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
