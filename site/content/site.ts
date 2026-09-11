/**
 * Single source of truth for every published fact.
 *
 * Rules, per the project playbook and the private fact-and-proof ledger:
 *  - Nothing goes in this file that is not traceable to the client's own site,
 *    Facebook page, or a direct instruction from Jessica.
 *  - No testimonials. None exist. Do not add placeholders "to show the layout".
 *  - No years-in-business, license number, warranty, price, or response-time
 *    promise until it lands in the ledger as confirmed.
 */

export const business = {
  name: 'Blue Wings Painting',
  nameFull: 'Blue Wings Painting MN',
  tagline: 'Interior & exterior painting across the Twin Cities',
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
  /** Verbatim from the current site. The only Spanish signal published today. */
  spanish: 'Hablamos Español',
  domain: 'bluewingspainting.com',
  siteUrl: 'https://www.bluewingspainting.com',
} as const;

/**
 * SMS deep link. The current Systeme site routes every CTA through tel:/sms:,
 * which works on a phone and dead-ends on a laptop. We keep the fast path and
 * pair it with a real form everywhere it appears.
 */
export const smsHref = `sms:+16122055308?&body=${encodeURIComponent(
  "Hi! I'd like a free estimate for ",
)}`;

/**
 * Service area.
 *
 * CONFLICT (see the private fact-and-proof ledger): the live site claims "Minnesota, Metro Area Twin
 * Cities" while the Facebook bio names Brooklyn Center, Maple Grove and
 * Plymouth. Both readings are satisfied by stating the metro and naming the
 * three cities as examples. Jessica confirms the real list before launch.
 */
export const serviceArea = {
  headline: 'Twin Cities metro',
  namedCities: ['Brooklyn Center', 'Maple Grove', 'Plymouth'],
  note: 'and surrounding communities',
} as const;

export type Service = {
  slug: string;
  name: string;
  short: string;
  body: string;
  /** What actually gets done — kept concrete, no invented guarantees. */
  detail: string[];
  image?: string;
  imageAlt?: string;
};

/**
 * The seven services published on the current site, expanded with concrete
 * scope. Descriptions stay within what the live copy already claims: premium
 * materials, custom work per space, clean sites, on-time completion.
 */
export const services: Service[] = [
  {
    slug: 'interior-exterior',
    name: 'Interior & exterior painting',
    short: 'Whole-house repaints, inside and out.',
    body: 'The core of the work: full interior repaints and full exterior repaints on Twin Cities homes and commercial spaces.',
    detail: [
      'Walls, ceilings, and full-room repaints',
      'Siding, stucco, board-and-batten, and painted brick',
      'Surface prep, scraping, and priming before any finish coat goes on',
      'Furniture covered, floors protected, site cleaned at the end of each day',
    ],
    image: '/img/exterior-white-brick.jpg',
    imageAlt:
      'A Twin Cities home after an exterior repaint: painted white brick, white board-and-batten siding, black window frames and a black front door.',
  },
  {
    slug: 'baseboard-trim',
    name: 'Baseboard & trim',
    short: 'The detail work that makes a room read finished.',
    body: 'Trim is where a paint job is judged. Straight lines, no bleed onto the wall, no roller texture on flat stock.',
    detail: [
      'Baseboards, casing, crown, and window trim',
      'Caulking and filling before paint, not instead of it',
      'Enamel finishes that stand up to being cleaned',
    ],
  },
  {
    slug: 'cabinets',
    name: 'Kitchen cabinet painting',
    short: 'A new kitchen finish without a new kitchen.',
    body: 'Cabinet refinishing changes the whole room for a fraction of a replacement, and it is the job where prep matters most.',
    detail: [
      'Doors and drawer fronts removed, labelled, and finished off the box',
      'Degreasing and sanding so the finish actually bonds',
      'Cabinet-grade enamel built for daily handling',
    ],
  },
  {
    slug: 'doors',
    name: 'Door painting',
    short: 'Entry doors, interior doors, and garage doors.',
    body: 'Doors take more abuse than any other painted surface in a house, and a failing door is the first thing a visitor sees.',
    detail: [
      'Entry and interior doors',
      'Garage doors, including stripping failed factory finishes',
      'Hardware removed rather than cut around',
    ],
    image: '/img/garage-doors-after.jpg',
    imageAlt:
      'Two garage doors finished in black against fresh white board-and-batten siding.',
  },
  {
    slug: 'fence',
    name: 'Fence painting & staining',
    short: 'Sealed against Minnesota winters.',
    body: 'An unsealed fence in this climate goes gray and splits. Stain and paint both buy it years.',
    detail: [
      'Cleaning and prep before finish',
      'Solid stain, semi-transparent stain, or paint',
      'Full runs and repairs to existing finishes',
    ],
  },
  {
    slug: 'deck',
    name: 'Deck painting & staining',
    short: 'The job where before-and-after is most obvious.',
    body: 'A weathered deck is gray, dry, and rough. Cleaned, prepped and stained, the same boards come back warm.',
    detail: [
      'Deck boards, stairs, railings, and skirting',
      'Cleaning and sanding before stain',
      'Stain or solid-color finish, matched to the house',
    ],
    image: '/img/deck-stairs-after.jpg',
    imageAlt:
      'Deck stairs and a landing after cleaning and staining, the wood finished in a warm cedar tone.',
  },
  {
    slug: 'epoxy-floors',
    name: 'Epoxy floors',
    short: 'Garage and basement floors that wipe clean.',
    body: 'Epoxy turns a dusting concrete slab into a sealed floor that takes road salt, oil, and a snow blower.',
    detail: [
      'Garage, basement, and shop floors',
      'Concrete prep and patching before coating',
      'Sealed surface that cleans with a mop',
    ],
  },
];

/**
 * Value propositions. These are the client's own, from the live site's
 * value-prop block — kept because they are specific enough to be credible,
 * reworded only for tone. No new claims added.
 */
export const valueProps = [
  {
    title: 'Durable, high-quality materials',
    body: 'Premium paints and finishes, chosen for the surface and the Minnesota weather that is going to hit it.',
  },
  {
    title: 'Custom designs for every space',
    body: 'Colors and finishes matched to your home’s style and how the room actually gets used.',
  },
  {
    title: 'Fast turnaround & clean worksites',
    body: 'On-time completion with professional cleanup. The site gets put back together, not left for you.',
  },
] as const;

/**
 * One half of a pair. `focus` is the object-position used inside the 3:4 crop.
 * These are phone photos taken months apart, not a locked-off tripod pair, so
 * each half is nudged independently to make the same surface line up across
 * the reveal.
 */
export type ProjectFrame = {
  src: string;
  alt: string;
  focus?: string;
};

export type Project = {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  before: ProjectFrame;
  after: ProjectFrame;
  /** Fallback focus when a frame does not set its own. */
  focus?: string;
};

/**
 * Before/after pairs. Every one of these is verified in the fact-and-proof ledger as the same
 * job photographed twice — matching railings, door bays, or window views.
 * These four pairs are the entire argument of the site.
 */
export const projects: Project[] = [
  {
    slug: 'deck-stairs',
    title: 'Deck stairs and landing',
    kind: 'Deck staining',
    summary:
      'Weathered gray boards, cleaned, prepped, and brought back with a warm cedar stain. Same stairs, same railing, same fence line behind them.',
    before: {
      src: '/img/deck-stairs-before.jpg',
      alt: 'Before: a deck landing and stairs weathered to flat gray, with a paint pole lying across the boards.',
      focus: 'center 68%',
    },
    after: {
      src: '/img/deck-stairs-after.jpg',
      alt: 'After: the same stairs and landing finished in a warm cedar stain, grain visible in the sunlight.',
      focus: '38% 55%',
    },
    focus: 'center 50%',
  },
  {
    slug: 'garage-doors',
    title: 'Garage doors and siding',
    kind: 'Exterior repaint',
    summary:
      'Factory finish had failed down to bare wood on the doors and trim. Stripped, prepped, and refinished in black against new white board-and-batten.',
    before: {
      src: '/img/garage-doors-before.jpg',
      alt: 'Before: tan garage doors with paint peeling off in sheets, and trim failing at the edges.',
      focus: '62% 58%',
    },
    after: {
      src: '/img/garage-doors-after.jpg',
      alt: 'After: the same garage bays finished in black, set against crisp white board-and-batten siding.',
      focus: '35% 52%',
    },
    focus: 'center 50%',
  },
  {
    slug: 'interior-room',
    title: 'Interior room, new construction',
    kind: 'Interior painting',
    summary:
      'Bare taped drywall in a Minnesota winter, finished into a painted room with a white ceiling and soft gray walls.',
    before: {
      src: '/img/interior-room-before.png',
      alt: 'Before: a room in bare taped drywall, unpainted, with snow visible through the window.',
      focus: 'center 62%',
    },
    after: {
      src: '/img/interior-room-after.png',
      alt: 'After: the same room painted, with soft gray walls, a white ceiling, and recessed lighting on.',
      focus: 'center 38%',
    },
    focus: 'center 50%',
  },
];

/**
 * Finished work with no "before" on file. Labelled as finished work, never as
 * a before/after — the ledger is explicit about this.
 */
export const finishedWork = [
  {
    src: '/img/exterior-board-batten-gables.jpg',
    alt: 'Cream board-and-batten gables with black window frames, photographed from below against an overcast sky.',
    caption: 'Exterior repaint — board-and-batten and trim',
  },
  {
    src: '/img/exterior-white-brick.jpg',
    alt: 'A two-storey home with painted white brick, white board-and-batten, black windows and a black front door.',
    caption: 'Exterior repaint — painted brick and siding',
  },
  {
    src: '/img/exterior-addition-lattice.jpg',
    alt: 'A painted addition in cream board-and-batten with black window trim and white lattice skirting below the deck.',
    caption: 'Exterior repaint — addition, trim and lattice',
  },
] as const;

/**
 * How a job runs. Drawn from what the live site already claims about process
 * (clear process, attention to detail, open communication, on-time completion,
 * professional cleanup) — stated concretely, with no timeline promised.
 */
export const process = [
  {
    step: '01',
    title: 'Free estimate',
    body: 'Send photos and a description, or call. We look at the actual surfaces before quoting a number.',
  },
  {
    step: '02',
    title: 'Colors and scope',
    body: 'Finishes chosen per surface and per room, and a written scope of what is included.',
  },
  {
    step: '03',
    title: 'Prep',
    body: 'Scraping, sanding, filling, caulking, priming, masking. This is where most of the labour goes and where a paint job is won or lost.',
  },
  {
    step: '04',
    title: 'Paint',
    body: 'Full coats, wet edge kept moving, no lap marks. Premium materials matched to the surface.',
  },
  {
    step: '05',
    title: 'Walkthrough and cleanup',
    body: 'We walk it with you, fix anything you flag, and leave the site clean.',
  },
] as const;

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Our work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;
