import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import sharp from 'sharp';

import { Users } from './cms/collections/Users';
import { Media } from './cms/collections/Media';
import { Projects } from './cms/collections/Projects';
import { FinishedWork } from './cms/collections/FinishedWork';
import { Services } from './cms/collections/Services';
import { BusinessInfo } from './cms/globals/BusinessInfo';
import { HomePage } from './cms/globals/HomePage';
import { locales, defaultLocale } from './content/i18n';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Blue Wings Painting',
    },
  },

  /*
    NOT the default '/api'. Payload mounts a catch-all at `{routes.api}/[...slug]`,
    and this app already owns `app/api/quote/route.ts` — two route groups
    resolving the same path is a build error in Next, and even where it resolved
    it would be ambiguous. Moving Payload's API aside leaves the existing quote
    endpoint exactly where it is, which matters because it is the site's only
    conversion path.
  */
  routes: { api: '/cms-api' },

  /*
    Both languages are real, editable content rather than a translation layer:
    the client serves a Spanish-speaking customer base directly and edits both
    herself. `fallback` means an untranslated field shows the English rather
    than rendering blank — better a visitor reads English than an empty page.
    The cost is that a missed translation is invisible; see the check in
    scripts/ for finding fields that are identical across locales.
  */
  localization: {
    locales: locales.map((code) => ({
      code,
      label: code === 'es' ? 'Español' : 'English',
    })),
    defaultLocale,
    fallback: true,
  },

  collections: [Projects, FinishedWork, Services, Media, Users],
  globals: [HomePage, BusinessInfo],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
  }),
  sharp,

  // Nothing consumes the GraphQL API; the pages use the Local API directly.
  graphQL: { disable: true },

  typescript: { outputFile: path.resolve(dirname, 'cms/payload-types.ts') },

  plugins: [
    /*
      Vercel's filesystem is ephemeral, so uploads cannot live on disk in
      production. This follows the pattern app/api/quote/route.ts already uses
      for RESEND_API_KEY: the feature works without the key (local disk, fine
      for development) and gets better the moment it exists. That way a fresh
      clone runs with no cloud credentials at all.
    */
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { [Media.slug]: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
});
