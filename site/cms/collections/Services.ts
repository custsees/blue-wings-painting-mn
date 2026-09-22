import type { CollectionConfig } from 'payload';
import { anyone, canEditContent, isAdminFieldLevel } from '../access';
import { revalidateCollection, revalidateCollectionOnDelete } from '../revalidate';

/**
 * The services offered, in display order.
 *
 * Replaces `serviceSlugs` + `serviceImages` (content/site.ts) and
 * `t.services.items[slug]` (content/i18n.ts).
 *
 * Adding a service here is safe for the site assistant without any further
 * work: `components/assistant-match.ts` already maps over the service list and
 * matches on the service's own lowercased name, so a new row is findable the
 * moment it exists. `extraKeywords` only adds the synonyms a visitor might use
 * that the name itself does not contain ("sheetrock" for drywall).
 */
export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'sortOrder'],
    group: 'Content',
  },
  access: { read: anyone, create: canEditContent, update: canEditContent, delete: canEditContent },
  versions: { drafts: { autosave: { interval: 400 } } },
  hooks: {
    afterChange: [revalidateCollection('services')],
    afterDelete: [revalidateCollectionOnDelete('services')],
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      // Anchors on /services and the assistant's deep links use this.
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional. Only some services have a photo.' },
    },
    { name: 'name', type: 'text', required: true, localized: true },
    {
      name: 'short',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'One line, used on the home page and in the quote form.' },
    },
    { name: 'body', type: 'textarea', required: true, localized: true },
    {
      name: 'detail',
      type: 'array',
      localized: true,
      labels: { singular: 'Point', plural: 'Points' },
      admin: { description: 'The specifics of what this service covers.' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'imageAlt',
      type: 'text',
      localized: true,
      admin: {
        condition: (data) => Boolean(data?.image),
        description: 'Describes the photo for screen readers.',
      },
    },
    {
      name: 'extraKeywords',
      type: 'text',
      admin: {
        description:
          'Optional. Other words a visitor might use for this, comma separated. The name itself is already matched.',
      },
    },
  ],
};
