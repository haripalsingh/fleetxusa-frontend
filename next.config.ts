

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
};

module.exports = nextConfig;


