import type { CollectionConfig } from 'payload';
import { anyone, canEditContent, isAdminFieldLevel } from '../access';
import { revalidateCollection, revalidateCollectionOnDelete } from '../revalidate';

/**
 * Before/after pairs — the site's entire argument.
 *
 * Replaces three things that used to be joined by hand: `projectSlugs` (order)
 * and `projectImages` (files + crops) in content/site.ts, and
 * `t.gallery.items[slug]` (copy, per language) in content/i18n.ts. One row now
 * carries the photos and both languages together, which is the whole reason a
 * CMS is possible here: the old shape was keyed by *locale* first, and no
 * editor can be asked to keep three structures in step by hand.
 *
 * Every pair must stay a verified same-job pair — matching railings, door
 * bays, window views. Never label a standalone photo as a pair; that is what
 * `finishedWork` is for.
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Before / After Pair', plural: 'Before / After Pairs' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'sortOrder'],
    group: 'Content',
    description:
      'Two photos of the same job. Only use a pair where the before and after are genuinely the same place.',
  },
  access: { read: anyone, create: canEditContent, update: canEditContent, delete: canEditContent },
  versions: { drafts: { autosave: { interval: 400 } } },
  hooks: {
    afterChange: [revalidateCollection('projects')],
    afterDelete: [revalidateCollectionOnDelete('projects')],
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      // The site assistant and the /services#anchor links key off this, so a
      // casual rename would quietly break inbound links. Admin-only to change.
      access: { update: isAdminFieldLevel },
      admin: { description: 'Used in links. Ask Pedro before changing an existing one.' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { description: 'Lower numbers show first.', step: 1 },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'before',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { width: '50%', description: 'The damaged/unfinished state.' },
        },
        {
          name: 'after',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { width: '50%', description: 'The finished work.' },
        },
      ],
    },
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'kind',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Short label above the title, e.g. "Exterior" / "Exteriores".' },
    },
    { name: 'summary', type: 'textarea', required: true, localized: true },
    {
      type: 'row',
      fields: [
        {
          name: 'beforeAlt',
          type: 'text',
          required: true,
          localized: true,
          admin: { width: '50%', description: 'Describes the before photo for screen readers.' },
        },
        {
          name: 'afterAlt',
          type: 'text',
          required: true,
          localized: true,
          admin: { width: '50%', description: 'Describes the after photo for screen readers.' },
        },
      ],
    },
  ],
};
