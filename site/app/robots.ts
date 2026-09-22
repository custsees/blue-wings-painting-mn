import type { MetadataRoute } from 'next';
import { getBusiness } from '@/cms/content';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const business = await getBusiness();
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${business.siteUrl}/sitemap.xml`,
  };
}
