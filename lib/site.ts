// Site-wide SEO constants (metadata, robots.txt, sitemap.xml).

import type { Metadata } from 'next';

/** Public origin of the storefront, without a trailing slash. Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://fleetxusa.com').replace(/\/+$/, '');

export const SITE_NAME = 'Fleet X Parts';

export const SITE_DESCRIPTION =
  'Fleet X Parts supplies heavy-duty truck parts for fleets: clamps, filters, hoses, seals and more. Shop by category or exploded-view parts diagram, with fast nationwide shipping.';

/** Fallback social-share image for pages without their own. */
export const OG_IMAGE = { url: '/fleet-x.png', width: 2634, height: 583, alt: SITE_NAME };

type PageMeta = {
  title: string;
  description: string;
  /** Canonical path of the page, e.g. "/about". */
  path: string;
  keywords?: string;
  /** Absolute image URL for social sharing; falls back to the site logo. */
  image?: string | null;
};

/** Title, description, canonical URL and Open Graph tags for an indexable page. */
export function pageMetadata({ title, description, path, keywords, image }: PageMeta): Metadata {
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: 'website',
      images: image?.startsWith('http') ? [{ url: image, alt: title }] : [OG_IMAGE],
    },
  };
}

/** Business contact details (NAP) — used by the footer and its LocalBusiness structured data. */
export const CONTACT = {
  phone: '917-293-3704',
  /** E.164 format for tel: links and schema.org. */
  phoneE164: '+19172933704',
  email: 'support@fleetxusa.com',
  street: '1101 Milliken Ave, Ste E',
  city: 'Ontario',
  region: 'CA',
  postalCode: '91761',
  country: 'US',
  hoursLabel: 'Mon–Fri 9:00 AM–6:00 PM ET',
} as const;

/** Official social profiles (icons render in this order). Leave a URL empty to hide that icon. */
export const SOCIAL_PROFILES: Record<'facebook' | 'instagram' | 'tiktok' | 'x' | 'youtube', string> = {
  facebook: 'https://www.facebook.com/fleetxusa',
  instagram: 'https://www.instagram.com/fleetxusa',
  tiktok: 'https://www.tiktok.com/@fleetxusa',
  x: 'https://x.com/fleetxusa',
  youtube: 'https://www.youtube.com/@fleetxusa',
};
