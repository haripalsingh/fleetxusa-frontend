

/** @type {import('next').NextConfig} */
const nextConfig = {
  // static export only for `next build` (GoDaddy upload); `next dev` runs normally so
  // /orders/<number> and new products work locally without .htaccess
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: true,  
  },
  images: {
    unoptimized: true,
  },
  // The build fetches every page's data from the live PHP API (GoDaddy). Too many parallel
  // workers overload it and requests time out, so build gently and retry failed pages.
  experimental: {
    cpus: 2,
    staticGenerationMaxConcurrency: 4,
    staticGenerationRetryCount: 3,
  },
};

module.exports = nextConfig;


