import type { CollectionConfig } from 'payload';
import { anyone, canEditContent } from '../access';
import { revalidateCollection, revalidateCollectionOnDelete } from '../revalidate';

/**
 * Finished jobs with no "before" on file.
 *
 * This collection is the fix for a real bug, not just a move. The gallery used
 * to zip `finishedWorkImages` (content/site.ts) against `t.gallery.finished`
 * (content/i18n.ts) *by array index* — `t.gallery.finished[i].alt`. Adding a
 * photo to one array without adding a matching entry to both language
 * dictionaries threw at render. That is exactly what handing the client an
 * "add a photo" button would have caused on day one. One row per photo now
 * carries its own copy in both languages, so the arrays cannot drift.
 *
 * Labelled as finished work, never as a before/after — the fact ledger is
 * explicit about this.
 */
export const FinishedWork: CollectionConfig = {
  slug: 'finishedWork',
  labels: { singular: 'Finished Job Photo', plural: 'Finished Job Photos' },
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'sortOrder'],
    group: 'Content',
    description: 'Single photos of completed work, where there is no before shot.',
  },
  access: { read: anyone, create: canEditContent, update: canEditContent, delete: canEditContent },
  versions: { drafts: { autosave: { interval: 400 } } },
  hooks: {
    afterChange: [revalidateCollection('finishedWork')],
    afterDelete: [revalidateCollectionOnDelete('finishedWork')],
  },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'sortOrder',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { description: 'Lower numbers show first.', step: 1 },
    },
    {
      name: 'caption',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Shown under the photo.' },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Describes the photo for screen readers.' },
    },
  ],
};
