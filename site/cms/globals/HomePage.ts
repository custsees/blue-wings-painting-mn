import type { GlobalConfig } from 'payload';
import { anyone, canEditContent } from '../access';
import { revalidateHomePage } from '../revalidate';

/**
 * The words on the home page.
 *
 * This is the one piece of page copy the client owns. Everything else a
 * visitor reads — form labels, error strings, the assistant's replies — stays
 * in content/i18n.ts, because those are wiring rather than message and an
 * empty one breaks the page rather than reading oddly.
 *
 * The photos, the services grid and the proof strip are NOT here. Those come
 * from the projects, finishedWork and services collections, which the home
 * page already reads. This global is only text.
 *
 * `process` is deliberately excluded too: the four steps are rendered by both
 * the home page and the services page, so they are shared content and editing
 * them here would silently change another page.
 *
 * Every field is localized. Payload falls back to English when a Spanish value
 * is empty, so a half-translated edit shows English rather than a blank
 * headline — better, but it also means a missed translation is invisible.
 */
export const HomePage: GlobalConfig = {
  slug: 'homePage',
  label: 'Home Page Text',
  admin: {
    group: 'Content',
    description:
      'The wording on the home page. Photos and services are edited separately, under Content.',
  },
  access: { read: anyone, update: canEditContent },
  hooks: { afterChange: [revalidateHomePage] },
  fields: [
    {
      type: 'collapsible',
      label: 'Headline',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          required: true,
          localized: true,
          admin: { description: 'Small line above the headline.' },
        },
        {
          /*
            Three fields rather than one because the headline is not one line:
            they stack, and the third is set in the brand blue. Typing all
            three into one box would lose the line breaks and the accent.
          */
          type: 'row',
          fields: [
            {
              name: 'h1a',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '33%', description: 'First line.' },
            },
            {
              name: 'h1b',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '33%', description: 'Second line.' },
            },
            {
              name: 'h1accent',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '34%', description: 'Third line, shown in blue.' },
            },
          ],
        },
        {
          name: 'lede',
          type: 'textarea',
          required: true,
          localized: true,
          admin: {
            description:
              'The paragraph under the headline. Two sentences reads best; much longer pushes the photo below the fold on a phone.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Why us',
      fields: [
        {
          name: 'valueProps',
          type: 'array',
          localized: true,
          required: true,
          minRows: 1,
          maxRows: 4,
          labels: { singular: 'Point', plural: 'Points' },
          admin: {
            description:
              'Shown in a row across the page. Three fits the layout; four gets cramped.',
          },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Section headings',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'servicesEyebrow',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '50%', description: 'Above the services grid.' },
            },
            {
              name: 'servicesTitle',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'proofEyebrow',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '50%', description: 'Above the before/after strip.' },
            },
            {
              name: 'proofTitle',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'proofLede',
          type: 'textarea',
          required: true,
          localized: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'processEyebrow',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                width: '50%',
                description:
                  'Above the numbered steps. The steps themselves also appear on the Services page, so they are not editable here.',
              },
            },
            {
              name: 'processTitle',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'areaEyebrow',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '50%', description: 'Above the service-area section.' },
            },
            {
              name: 'areaTitle',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'areaLede',
          type: 'textarea',
          required: true,
          localized: true,
          admin: {
            description:
              'Follows the list of cities, which is built from Business Info.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Search listing',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description:
              'The clickable line in Google results. Around 60 characters before it is cut off.',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          required: true,
          localized: true,
          admin: {
            description:
              'The grey text under it in Google results. Around 155 characters before it is cut off.',
          },
        },
      ],
    },
  ],
};
