import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Served at /robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // private / per-shopper pages - nothing here belongs in search results
      disallow: ['/account', '/cart', '/checkout', '/orders/', '/login', '/signup', '/forgot-password', '/reset-password'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
