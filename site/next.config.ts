import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    /*
      Uploaded photography is served from Vercel Blob in production, because
      Vercel's filesystem is ephemeral and cannot hold uploads. Without this the
      Image component refuses the remote host and every client-uploaded photo
      renders broken — while the committed /public images keep working, which
      makes it look like the upload failed rather than the config.
    */
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  poweredByHeader: false,

  /*
    English at the site root is handled by middleware.ts, not by a rewrite
    here. See that file for why — the short version is that a rewrite in this
    config broke client-side navigation to "/" on Vercel.
  */
};

/*
  withPayload adds the admin panel's bundling requirements — it keeps Payload's
  server-only packages out of the client bundle and off Turbopack's transitive
  externalisation. The public site's config above is passed through untouched.
*/
export default withPayload(nextConfig);
