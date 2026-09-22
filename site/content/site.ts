/**
 * Routing helpers, plus the original content the CMS was seeded from.
 *
 * READ THIS BEFORE EDITING. The site no longer renders the facts, services,
 * projects or photos below — those live in Payload now and are edited by the
 * client at /admin. Changing `business.phone` here will not change the phone
 * number on the site. It is kept because `cms/seed.ts` reads it to populate a
 * fresh database, so a new environment (or a new client site built from this
 * one) can be brought up without retyping anything.
 *
 * Still live, and still the right place for new code: `navKeys`, `pathFor`,
 * and the slug types that `content/i18n.ts` uses to key its dictionaries.
 * Those are routing and structure, not content.
 *
 * Anything a visitor READS that is still in code lives in `content/i18n.ts`,
 * keyed by locale.
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
  phone: '(612) 636-5194',
  phoneHref: 'tel:+16126365194',
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

/*
  smsHrefFor lived here and hardcoded +16126365194 a second time. It is now
  smsHrefOf(phone, body) in cms/contact.ts, built from the number the client
  actually edits — see the note on that file about the five places this number
  used to appear.
*/
