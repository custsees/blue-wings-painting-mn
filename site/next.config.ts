import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
  poweredByHeader: false,

  /*
    English is the primary language and is served at the site root — no /en
    prefix and no redirect hop on the homepage the client will be sharing.
    Routes live under app/[locale]/ so the layout can set <html lang> correctly
    and the pages stay statically generated; these rewrites map the bare paths
    onto the English locale internally. Spanish keeps its visible /es prefix.
  */
  async rewrites() {
    return [
      { source: '/', destination: '/en' },
      { source: '/services', destination: '/en/services' },
      { source: '/gallery', destination: '/en/gallery' },
      { source: '/about', destination: '/en/about' },
      { source: '/contact', destination: '/en/contact' },
    ];
  },
};

export default nextConfig;
