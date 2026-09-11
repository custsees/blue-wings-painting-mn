/**
 * Locale-invariant facts and asset references.
 *
 * Anything a visitor READS lives in `content/i18n.ts`, keyed by locale.
 * This file holds only what is the same in every language: phone numbers,
 * email, URLs, image paths, crop positions, slugs, and ordering.
 *
 * Rules, per the project playbook and the private fact-and-proof ledger:
 *  - Nothing here that is not traceable to the client's own site, Facebook
 *    page, or a direct instruction from Jessica.
 *  - No testimonials. None exist. Do not add placeholders "to show the layout".
 *  - No years-in-business, license number, warranty, price, or response-time
 *    promise until it lands in the ledger as confirmed.
 */

export const business = {
  name: 'Blue Wings Painting',
  nameFull: 'Blue Wings Painting MN',
  /** Live-site meta description, verbatim. */
  descriptionSource: 'We are an Interior and Exterior Painting Company',
  phone: '(612) 205-5308',
  phoneHref: 'tel:+16122055308',
  phoneAlt: '(612) 636-5194',
  phoneAltHref: 'tel:+16126365194',
  email: 'bluewingspaintingmn@gmail.com',
  emailHref: 'mailto:bluewingspaintingmn@gmail.com',
  facebook:
    'https://www.facebook.com/people/Blue-Wings-Painting-MN/61579866406131/',
  /** Verbatim from the current site. Untranslated on purpose — it is a brand
      phrase, and it is already Spanish. */
  spanish: 'Hablamos Español',
  domain: 'bluewingspainting.com',
  siteUrl: 'https://www.bluewingspainting.com',
} as const;

/**
 * Service area.
 *
 * CONFLICT (see the private fact-and-proof ledger): the live site claims
 * "Minnesota, Metro Area Twin Cities" while the Facebook bio names Brooklyn
 * Center, Maple Grove and Plymouth. Both readings are satisfied by stating the
 * metro and naming the three cities as examples. Jessica confirms the real
 * list before launch. City names are proper nouns — not translated.
 */
export const namedCities = ['Brooklyn Center', 'Maple Grove', 'Plymouth'];

/** Service slugs, in display order. Copy for each lives in i18n. */
export const serviceSlugs = [
  'interior-exterior',
  'baseboard-trim',
  'cabinets',
  'doors',
  'fence',
  'deck',
  'epoxy-floors',
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

/** Photography attached to a service, where one exists. */
export const serviceImages: Partial<Record<ServiceSlug, string>> = {
  'interior-exterior': '/img/exterior-white-brick.jpg',
  doors: '/img/garage-doors-after.jpg',
  deck: '/img/deck-stairs-after.jpg',
};

/** Project slugs, in display order. */
export const projectSlugs = [
  'deck-stairs',
  'garage-doors',
  'interior-room',
] as const;

export type ProjectSlug = (typeof projectSlugs)[number];

/**
 * Before/after image pairs. Every one is verified in the ledger as the same
 * job photographed twice — matching railings, door bays, or window views.
 *
 * `focus` is the object-position inside the 3:4 crop. These are phone photos
 * taken months apart, not a locked-off tripod pair, so each half is nudged
 * independently to make the same surface line up across the reveal.
 */
export const projectImages: Record<
  ProjectSlug,
  { before: { src: string; focus?: string }; after: { src: string; focus?: string } }
> = {
  'deck-stairs': {
    before: { src: '/img/deck-stairs-before.jpg', focus: 'center 68%' },
    after: { src: '/img/deck-stairs-after.jpg', focus: '38% 55%' },
  },
  'garage-doors': {
    before: { src: '/img/garage-doors-before.jpg', focus: '62% 58%' },
    after: { src: '/img/garage-doors-after.jpg', focus: '35% 52%' },
  },
  'interior-room': {
    before: { src: '/img/interior-room-before.png', focus: 'center 62%' },
    after: { src: '/img/interior-room-after.png', focus: 'center 38%' },
  },
};

/**
 * Finished work with no "before" on file. Labelled as finished work, never as
 * a before/after — the ledger is explicit about this.
 */
export const finishedWorkImages = [
  '/img/exterior-board-batten-gables.jpg',
  '/img/exterior-white-brick.jpg',
  '/img/exterior-addition-lattice.jpg',
] as const;

/** Route keys. Paths are built per locale in i18n. */
export const navKeys = ['home', 'services', 'gallery', 'about', 'contact'] as const;
export type NavKey = (typeof navKeys)[number];

/** Path for a route key in a given locale. English lives at the root. */
export function pathFor(key: NavKey, locale: 'en' | 'es'): string {
  const seg: Record<NavKey, string> = {
    home: '',
    services: '/services',
    gallery: '/gallery',
    about: '/about',
    contact: '/contact',
  };
  const prefix = locale === 'es' ? '/es' : '';
  return `${prefix}${seg[key]}` || '/';
}

/**
 * SMS deep link. The current Systeme site routes every CTA through tel:/sms:,
 * which works on a phone and dead-ends on a laptop. We keep the fast path and
 * pair it with a real form everywhere it appears.
 */
export function smsHrefFor(body: string): string {
  return `sms:+16122055308?&body=${encodeURIComponent(body)}`;
}
