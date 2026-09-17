import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
  poweredByHeader: false,

  /*
    English at the site root is handled by middleware.ts, not by a rewrite
    here. See that file for why — the short version is that a rewrite in this
    config broke client-side navigation to "/" on Vercel.
  */
};

export default nextConfig;
