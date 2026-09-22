import type { GlobalConfig } from 'payload';
import { anyone, canEditContent, isAdminFieldLevel } from '../access';
import { revalidateBusinessInfo } from '../revalidate';

/**
 * The facts, in one place.
 *
 * Nothing here is localized, and that is deliberate rather than an omission.
 * This mirrors what content/site.ts already established: a phone number and an
 * email are the same string in every language, and city names are proper nouns
 * that are not translated. Anything a visitor *reads* — "Twin Cities metro",
 * the taglines — stays in content/i18n.ts as code.
 *
 * `phoneHref` and the SMS link are NOT stored. They are derived from `phone`
 * in cms/contact.ts, because storing them was the original bug: the number
 * lived in four places (`phone`, `phoneHref`, a hardcoded `sms:+1...` in
 * smsHrefFor, and both meta descriptions) and changing one would have left the
 * others stale. One field in, every link out.
 *
 * The ledger rule still applies to whoever edits this: nothing goes in that is
 * not traceable to the client's own site, her Facebook page, or a direct
 * instruction from her. No years-in-business, license number, warranty, price
 * or response-time promise until it is confirmed.
 */
export const BusinessInfo: GlobalConfig = {
  slug: 'businessInfo',
  label: 'Business Info',
  admin: {
    group: 'Settings',
    description: 'Phone, email and service area. These appear on every page.',
  },
  access: { read: anyone, update: canEditContent },
  hooks: { afterChange: [revalidateBusinessInfo] },
  fields: [
    {
      type: 'collapsible',
      label: 'Contact',
      fields: [
        {
          name: 'phone',
          type: 'text',
          required: true,
          admin: {
            description:
              'As it should read on the page, e.g. (612) 636-5194. The call and text links are built from this automatically.',
          },
        },
        { name: 'email', type: 'email', required: true },
        {
          name: 'facebook',
          type: 'text',
          admin: { description: 'Full URL to the Facebook page.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Service area',
      fields: [
        {
          name: 'namedCities',
          type: 'array',
          labels: { singular: 'City', plural: 'Cities' },
          admin: {
            description:
              'Cities named as examples on the site. Not translated — these are place names.',
          },
          fields: [{ name: 'name', type: 'text', required: true }],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Identity',
      admin: { initCollapsed: true },
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'nameFull',
          type: 'text',
          required: true,
          admin: { description: 'Used in page titles and the estimate emails.' },
        },
        {
          name: 'spanish',
          type: 'text',
          required: true,
          admin: {
            description:
              'The Spanish-spoken badge. A brand phrase, shown as-is in both languages.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Domain (Pedro only)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'siteUrl',
          type: 'text',
          required: true,
          access: { update: isAdminFieldLevel },
          admin: {
            description:
              'Canonical URL, no trailing slash. Feeds the sitemap and social previews — wrong values here break search indexing.',
          },
        },
        {
          name: 'domain',
          type: 'text',
          required: true,
          access: { update: isAdminFieldLevel },
          admin: { description: 'Display form, e.g. bluewingspainting.com' },
        },
      ],
    },
  ],
};
