import Link from 'next/link';
import Image from 'next/image';
import { CONTACT, SITE_NAME, SITE_URL, SOCIAL_PROFILES } from '@/lib/site';

type FooterLink = { label: string; href: string; title?: string };

// Descriptive, keyword-rich anchor text helps search engines understand each target page.
const LINK_GROUPS: { id: string; heading: string; links: FooterLink[] }[] = [
  {
    id: 'footer-shop',
    heading: 'Shop Truck Parts',
    links: [
      { label: 'Heavy-Duty Clamps', href: '/products/clamps', title: 'V-band, T-bolt & exhaust clamps' },
      { label: 'Truck Filters', href: '/products/filters', title: 'Oil, fuel & air filters' },
      { label: 'Silicone Hoses', href: '/products/hoses', title: 'Coolant & charge-air hoses' },
      { label: 'O-Rings, Gaskets & Seals', href: '/products/seals' },
      { label: 'All Categories', href: '/categories' },
      { label: 'All Products', href: '/products' },
    ],
  },
  {
    id: 'footer-engine',
    heading: 'Engine Parts',
    links: [
      { label: 'Detroit DD15 Parts Diagrams', href: '/detroit-engine-parts', title: 'Detroit engine parts by exploded-view diagram' },
      { label: 'Cummins Engine Parts', href: '/cummins-engine-parts', title: 'Top Cummins parts by system' },
      { label: 'Request a Part', href: '/contact', title: "Can't find a part? Send us the part number" },
    ],
  },
  {
    id: 'footer-help',
    heading: 'Customer Care',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Shipping & Returns', href: '/shipping-return-policy' },
      { label: 'Cancellations & Refunds', href: '/cancellation-refund-policy' },
      { label: 'Track My Orders', href: '/account/orders' },
      { label: 'About FleetX', href: '/about' },
    ],
  },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-conditions' },
  { label: 'Sitemap', href: '/sitemap.xml' },
];

const TRUST_POINTS = [
  { title: 'Fast Nationwide Shipping', text: 'Quick dispatch across the USA', d: 'M3 7h11v8H3zM14 10h4l3 3v2h-7M7.5 18.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm10 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' },
  { title: 'Quality Heavy-Duty Parts', text: 'Built for the long haul', d: 'M9 12l2 2 4-4m5.62-4.02A11.96 11.96 0 0112 2.94a11.96 11.96 0 01-8.62 3.04A12 12 0 003 9c0 5.6 3.82 10.3 9 11.62 5.18-1.33 9-6.03 9-11.62 0-1.04-.13-2.05-.38-3.02z' },
  { title: 'Parts Experts on Call', text: 'Mon–Fri, 9 AM–6 PM ET', d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z' },
  { title: 'Secure Checkout', text: 'Encrypted, trusted payments', d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
];

const SOCIAL_ICONS: { key: keyof typeof SOCIAL_PROFILES; name: string; d: string }[] = [
  { key: 'facebook', name: 'Facebook', d: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.58v1.9h2.78l-.44 2.91h-2.34v7.03C18.34 21.24 22 17.08 22 12.06z' },
  { key: 'instagram', name: 'Instagram', d: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.23.06 1.27.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.23.41-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.71 3.71 0 01-1.38-.9 3.71 3.71 0 01-.9-1.38c-.16-.42-.36-1.05-.41-2.23-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.62c-3.15 0-3.5.01-4.74.07-.96.04-1.48.2-1.83.34-.46.18-.79.39-1.13.74-.34.34-.55.67-.74 1.13-.14.35-.3.87-.34 1.83-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.04.96.2 1.48.34 1.83.18.46.39.79.74 1.13.34.34.67.55 1.13.74.35.14.87.3 1.83.34 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.96-.04 1.48-.2 1.83-.34.46-.18.79-.39 1.13-.74.34-.34.55-.67.74-1.13.14-.35.3-.87.34-1.83.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.04-.96-.2-1.48-.34-1.83a3.04 3.04 0 00-.74-1.13 3.04 3.04 0 00-1.13-.74c-.35-.14-.87-.3-1.83-.34-1.24-.06-1.59-.07-4.74-.07zm0 4.14a4.08 4.08 0 110 8.16 4.08 4.08 0 010-8.16zm0 6.73a2.65 2.65 0 100-5.3 2.65 2.65 0 000 5.3zm5.19-6.89a.95.95 0 11-1.9 0 .95.95 0 011.9 0z' },
  { key: 'tiktok', name: 'TikTok', d: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.3 0 .58.04.86.13V9.4a6.84 6.84 0 00-.86-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43V8.66a8.16 8.16 0 004.77 1.52V6.73a4.85 4.85 0 01-1.84-.04z' },
  { key: 'x', name: 'X (Twitter)', d: 'M18.24 3h3.11l-6.79 7.76L22.5 21h-6.26l-4.9-6.41L5.7 21H2.58l7.26-8.3L2 3h6.42l4.43 5.86L18.24 3zm-1.09 16.17h1.72L7.94 4.74H6.09l11.06 14.43z' },
  { key: 'youtube', name: 'YouTube', d: 'M21.58 7.2a2.78 2.78 0 00-1.95-1.97C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.63.48A2.78 2.78 0 002.42 7.2 29 29 0 002 12a29 29 0 00.42 4.8 2.78 2.78 0 001.95 1.97c1.73.48 7.63.48 7.63.48s5.9 0 7.63-.48a2.78 2.78 0 001.95-1.97A29 29 0 0022 12a29 29 0 00-.42-4.8zM9.94 15.02V8.98L15.5 12l-5.56 3.02z' },
];

const socialLinks = SOCIAL_ICONS.filter((s) => SOCIAL_PROFILES[s.key]).map((s) => ({ ...s, href: SOCIAL_PROFILES[s.key] }));

const ICON = {
  pin: 'M17.66 16.66L13.41 20.9a2 2 0 01-2.83 0l-4.24-4.24a8 8 0 1111.32 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  phone: TRUST_POINTS[2].d,
  mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
};

const Icon = ({ d, className = 'h-4 w-4' }: { d: string; className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const IconBox = ({ d }: { d: string }) => (
  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-white/10 text-white transition-colors group-hover:bg-gradient-to-r group-hover:from-[#e9e611] group-hover:to-[#00a34f]">
    <Icon d={d} />
  </span>
);

const focusRing = 'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a550] focus-visible:ring-offset-2 focus-visible:ring-offset-black';
const linkClass = `inline-block py-1 text-[15px] text-gray-400 transition-colors hover:text-[#00a550] ${focusRing}`;

// schema.org LocalBusiness data: lets Google show NAP, hours and social profiles in search / Maps.
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'AutoPartsStore',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/fleet-x.png`,
  image: `${SITE_URL}/fleet-x.png`,
  telephone: CONTACT.phoneE164,
  email: CONTACT.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONTACT.street,
    addressLocality: CONTACT.city,
    addressRegion: CONTACT.region,
    postalCode: CONTACT.postalCode,
    addressCountry: CONTACT.country,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: CONTACT.phoneE164,
    email: CONTACT.email,
    contactType: 'customer service',
    areaServed: 'US',
    availableLanguage: 'English',
  },
  ...(socialLinks.length ? { sameAs: socialLinks.map((s) => s.href) } : {}),
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full bg-black text-white" aria-labelledby="site-footer-heading">
      <h2 id="site-footer-heading" className="sr-only">
        {SITE_NAME} footer
      </h2>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />

      <div className="flex h-1.5 w-full" aria-hidden="true">
        <div className="h-full w-1/2 bg-[#e9e611]" />
        <div className="h-full w-1/2 bg-[#00a34f]" />
      </div>

      {/* Trust strip */}
      <div className="border-b border-white/10">
        <ul className="mx-auto grid max-w-[1320px] grid-cols-2 gap-x-4 gap-y-5 px-4 py-6 lg:grid-cols-4">
          {TRUST_POINTS.map((t) => (
            <li key={t.title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#e9e611] to-[#00a34f] text-black">
                <Icon d={t.d} className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-tight text-white">{t.title}</span>
                <span className="block text-xs text-gray-400">{t.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-[1320px] px-4 pt-10 pb-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + NAP */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" aria-label={`${SITE_NAME} home`} className={`inline-block ${focusRing}`}>
              <Image src="/fleet-x.png" alt={`${SITE_NAME} logo`} width={2634} height={583} className="h-8 w-auto" />
            </Link>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-gray-400">
              Heavy-duty truck parts for fleets and owner-operators — clamps, filters, hoses, seals plus Detroit and
              Cummins engine parts, shipped fast across the USA.
            </p>

            <address className="mt-5 flex flex-col gap-3 not-italic">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${CONTACT.street}, ${CONTACT.city}, ${CONTACT.region} ${CONTACT.postalCode}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-start gap-3 text-[15px] leading-snug text-gray-400 hover:text-[#00a550] ${focusRing}`}
              >
                <IconBox d={ICON.pin} />
                <span className="pt-1">
                  {CONTACT.street}
                  <br />
                  {CONTACT.city}, {CONTACT.region} {CONTACT.postalCode}
                </span>
              </a>
              <a href={`tel:${CONTACT.phoneE164}`} className={`group flex items-center gap-3 text-[15px] font-semibold text-white hover:text-[#00a550] ${focusRing}`}>
                <IconBox d={ICON.phone} />
                {CONTACT.phone}
              </a>
              <a href={`mailto:${CONTACT.email}`} className={`group flex items-center gap-3 break-all text-[15px] text-gray-400 hover:text-[#00a550] ${focusRing}`}>
                <IconBox d={ICON.mail} />
                {CONTACT.email}
              </a>
              <p className="group flex items-center gap-3 text-[15px] text-gray-400">
                <IconBox d={ICON.clock} />
                {CONTACT.hoursLabel}
              </p>
            </address>

            {socialLinks.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-bold uppercase tracking-wide text-white">Follow Us</p>
                <ul className="mt-3 flex flex-wrap items-center gap-2.5" aria-label={`Follow ${SITE_NAME} on social media`}>
                  {socialLinks.map((s) => (
                    <li key={s.key}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer me"
                        aria-label={`${SITE_NAME} on ${s.name} (opens in a new tab)`}
                        title={`${SITE_NAME} on ${s.name}`}
                        className={`flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-gray-300 transition-colors hover:bg-gradient-to-r hover:from-[#e9e611] hover:to-[#00a34f] hover:text-black ${focusRing}`}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true" focusable="false">
                          <path d={s.d} />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Link columns */}
          {LINK_GROUPS.map((group) => (
            <nav key={group.id} aria-labelledby={group.id}>
              <h3 id={group.id} className="text-sm font-bold uppercase tracking-wide text-white">
                {group.heading}
              </h3>
              <div className="mt-2 mb-3 h-1 w-12 bg-gradient-to-r from-[#00a550] to-[#f8ef05]" aria-hidden="true" />
              <ul className="flex flex-col gap-1">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} title={link.title} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Part-request CTA */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e9e611]">Can&apos;t find a part?</p>
            <p className="mt-1 text-base font-semibold text-white">Send us the part number — we&apos;ll check stock &amp; price.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={`tel:${CONTACT.phoneE164}`}
              className={`flex items-center justify-center rounded-lg bg-gradient-to-r from-[#e9e611] to-[#00a34f] px-5 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90 ${focusRing}`}
            >
              Call {CONTACT.phone}
            </a>
            <Link
              href="/contact"
              className={`flex items-center justify-center rounded-lg border border-white/40 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black ${focusRing}`}
            >
              Request a part →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1320px] flex-col items-center gap-4 px-4 py-5 text-sm text-gray-500 md:flex-row md:justify-between">
          <p className="text-center md:text-left">
            © {year} {SITE_NAME}. All rights reserved.
          </p>

          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`hover:text-[#00a550] ${focusRing}`} prefetch={link.href.endsWith('.xml') ? false : undefined}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
