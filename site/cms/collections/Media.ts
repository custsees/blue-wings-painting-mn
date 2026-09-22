import path from 'path';
import { fileURLToPath } from 'url';
import type { CollectionConfig } from 'payload';
import { anyone, canEditContent } from '../access';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Uploaded photography.
 *
 * No alt text here on purpose. Alt belongs to the *use*, not the file: the
 * same deck photo is "weathered gray deck before staining" in a pair and
 * something else in a grid. The consuming entry owns its own alt, per locale,
 * exactly as `content/i18n.ts` does today.
 *
 * `focalPoint` is the replacement for the hand-tuned `focus: 'center 68%'`
 * strings in `content/site.ts`. Those exist because these are phone photos
 * taken months apart rather than a locked-off tripod pair, so each half has to
 * be nudged independently to make the same surface line up across the reveal.
 * That nudging is a judgement about the photo, which is the client's to make —
 * and dragging a crosshair is a thing a painter can do, where typing a CSS
 * object-position value is not.
 *
 * No `imageSizes`: next/image already optimises and serves AVIF/WebP from the
 * original (see next.config.ts), so generating variants on upload would be a
 * second, redundant resize pipeline.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: {
    read: anyone,
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  upload: {
    /*
      Only used when BLOB_READ_WRITE_TOKEN is absent, i.e. local development.
      In production the Vercel Blob plugin takes over and nothing is written to
      disk — Vercel's filesystem does not survive a deploy. Gitignored, so a
      developer's test uploads never reach the repo.
    */
    staticDir: path.resolve(dirname, '../../.uploads/media'),
    mimeTypes: ['image/*'],
    crop: true,
    focalPoint: true,
  },
  fields: [
    {
      name: 'caption',
      type: 'text',
      admin: {
        description:
          'Internal note so you can find this photo again. Not shown on the site.',
      },
    },
  ],
};
