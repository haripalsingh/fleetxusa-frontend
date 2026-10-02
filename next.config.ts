import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // old "Shop by Diagram" URLs → new Detroit engine parts URLs
  async redirects() {
    return [
      { source: '/parts-diagrams', destination: '/detroit-engine-parts', permanent: true },
      { source: '/parts-diagrams/:slug', destination: '/detroit-engine-parts/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
