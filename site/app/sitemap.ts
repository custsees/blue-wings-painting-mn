import type { MetadataRoute } from 'next';
import { business } from '@/content/site';

/**
 * Both languages, with hreflang alternates so Google serves the right one.
 * English URLs carry no locale prefix (see the rewrites in next.config.ts).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = ['', '/services', '/gallery', '/about', '/contact'];

  return paths.map((path) => ({
    url: `${business.siteUrl}${path || '/'}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
    alternates: {
      languages: {
        'en-US': `${business.siteUrl}${path || '/'}`,
        'es-US': `${business.siteUrl}/es${path}`,
      },
    },
  }));
}
