/**
 * Every string a visitor reads, in both languages.
 *
 * English is the primary language and lives at the site root; Spanish lives
 * under /es. Both are real routes so both get indexed and hreflang works —
 * a client-side toggle would leave the Spanish copy invisible to search.
 *
 * The Spanish is written for the Twin Cities Latino homeowner Jessica already
 * serves ("Hablamos Español" is the only Spanish signal on her current site).
 * It is a translation of intent, not of syntax: the English leans on short,
 * blunt trade language, and the Spanish does the same rather than tracking
 * the English word order.
 *
 * Facts are NOT duplicated here. Phone, email, cities and image paths come
 * from `content/site.ts`, so there is exactly one place to correct them.
 */

import type { NavKey, ProjectSlug, ServiceSlug } from './site';

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

type ServiceCopy = {
  name: string;
  short: string;
  body: string;
  detail: string[];
  imageAlt?: string;
};

type ProjectCopy = {
  title: string;
  kind: string;
  summary: string;
  beforeAlt: string;
  afterAlt: string;
};

type Meta = { title: string; description: string };

export type Dict = {
  htmlLang: string;
  /** Name of the OTHER language, for the switcher. */
  switchTo: { label: string; aria: string };
  nav: Record<NavKey, string>;

  common: {
    freeEstimate: string;
    getFreeEstimate: string;
    callPhone: (p: string) => string;
    seeAllServices: string;
    seeAllWork: string;
    seeOurWork: string;
    openMenu: string;
    closeMenu: string;
    skipToContent: string;
    themeToLight: string;
    themeToDark: string;
    tagline: string;
    areaName: string;
    /** "including X, Y, Z and surrounding communities" */
    areaIncluding: (cities: string) => string;
    dragToCompare: (what: string) => string;
    before: string;
    after: string;
  };

  home: {
    meta: Meta;
    eyebrow: string;
    h1a: string;
    h1b: string;
    h1accent: string;
    lede: string;
    valueProps: { title: string; body: string }[];
    servicesEyebrow: string;
    servicesTitle: string;
    proofEyebrow: string;
    proofTitle: string;
    proofLede: string;
    processEyebrow: string;
    processTitle: string;
    areaEyebrow: string;
    areaTitle: string;
    areaLede: string;
  };

  services: {
    meta: Meta;
    eyebrow: string;
    h1: string;
    lede: string;
    items: Record<ServiceSlug, ServiceCopy>;
    processEyebrow: string;
    processTitle: string;
    ctaTitle: string;
    ctaLede: string;
  };

  gallery: {
    meta: Meta;
    eyebrow: string;
    h1: string;
    lede: string;
    items: Record<ProjectSlug, ProjectCopy>;
    finishedEyebrow: string;
    finishedTitle: string;
    finishedLede: string;
    finished: { alt: string; caption: string }[];
    ctaTitle: string;
    ctaLede: string;
  };

  about: {
    meta: Meta;
    eyebrow: string;
    h1: string;
    lede: string;
    judgedTitle: string;
    judgedP1: string;
    judgedP2: string;
    valuesEyebrow: string;
    processEyebrow: string;
    processTitle: string;
    areaEyebrow: string;
    spanishNote: string;
  };

  contact: {
    meta: Meta;
    eyebrow: string;
    h1: string;
    lede: string;
    formTitle: string;
    callOrText: string;
    sendText: string;
    emailLabel: string;
    areaLabel: string;
    followLabel: string;
    facebookLink: string;
  };

  form: {
    name: string;
    phone: string;
    email: string;
    optional: string;
    city: string;
    cityPlaceholder: string;
    service: string;
    chooseOne: string;
    somethingElse: string;
    details: string;
    detailsPlaceholder: string;
    submit: string;
    sending: string;
    orCall: (p: string) => string;
    note: string;
    errorSuffix: (phone: string, email: string) => string;
    genericError: string;
    validationError: string;
    sentTitle: string;
    sentBody: string;
    sendAnother: string;
    company: string;
    /* Used when the server cannot send the estimate itself: the visitor is
       handed the same message pre-written and clicks send. Kept as the
       fallback even once RESEND_API_KEY exists, for a rejected key, a dead
       network, or an exhausted quota. */
    mailNote: string;
    emailSubject: (service: string, city: string) => string;
    emailLabels: {
      name: string;
      phone: string;
      email: string;
      city: string;
      service: string;
      details: string;
      language: string;
    };
    emailLanguageValue: string;
    openEmail: string;
    openGmail: string;
    sentFallback: string;
    /* Shown instead of the hand-off copy when the server actually sent the
       email itself (RESEND_API_KEY is set). Then there is nothing for the
       visitor to do. */
    deliveredTitle: string;
    deliveredBody: string;
  };

  footer: {
    pages: string;
    services: string;
    getInTouch: string;
    rights: string;
    freeEstimates: string;
  };

  process: { step: string; title: string; body: string }[];

  notFound: { title: string; lede: string };

  assistant: {
    launcher: string;
    close: string;
    panelTitle: string;
    panelSub: string;
    placeholder: string;
    inputLabel: string;
    send: string;
    ratherTalk: string;
    greeting: string;
    fallback: string;
    suggestions: Record<NavKey, string[]>;
    /** Answers keyed by knowledge-base entry id. */
    answers: Record<string, string>;
    linkLabels: Record<string, string>;
    /** Extra locale-specific match terms, merged with the shared ones. */
    extraKeywords: Record<string, string[]>;
    extraPhrases: Record<string, string[]>;
    moreOn: (service: string) => string;
    coversPrefix: string;
    sevenThings: (list: string) => string;
  };
};

/* ------------------------------------------------------------------ */
/* ENGLISH                                                             */
/* ------------------------------------------------------------------ */

const en: Dict = {
  htmlLang: 'en',
  switchTo: { label: 'ES', aria: 'Ver este sitio en español' },
  nav: {
    home: 'Home',
    services: 'Services',
    gallery: 'Our work',
    about: 'About',
    contact: 'Contact',
  },

  common: {
    freeEstimate: 'Free estimate',
    getFreeEstimate: 'Get a free estimate',
    callPhone: (p) => `Call ${p}`,
    seeAllServices: 'All services →',
    seeAllWork: 'See all work →',
    seeOurWork: 'See all our work',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    skipToContent: 'Skip to content',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
    tagline: 'Interior & exterior painting across the Twin Cities',
    areaName: 'Twin Cities metro',
    areaIncluding: (cities) => `including ${cities} and surrounding communities`,
    dragToCompare: (what) => `Drag to compare ${what} before and after`,
    before: 'Before',
    after: 'After',
  },

  home: {
    meta: {
      title: 'Blue Wings Painting MN — Interior & Exterior Painters, Twin Cities',
      description:
        'Interior and exterior painting across the Twin Cities metro. Cabinets, trim, doors, decks, fences and epoxy floors. Free estimates. Hablamos Español.',
    },
    eyebrow: 'Twin Cities metro · Since the first coat',
    h1a: 'Minnesota',
    h1b: 'wrecks paint.',
    h1accent: 'We fix that.',
    lede:
      'Interior and exterior painting across the Twin Cities. Every job on this page is one of ours, photographed before and after. Drag the handle and see for yourself.',
    valueProps: [
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
    ],
    servicesEyebrow: 'What we do',
    servicesTitle: 'Seven things, done properly',
    proofEyebrow: 'The receipts',
    proofTitle: 'Same house. Same angle.',
    proofLede:
      'Anyone can post a photo of a finished wall. These are the same surfaces before we touched them and after we left.',
    processEyebrow: 'How a job runs',
    processTitle: 'Most of the work happens before the colour goes on',
    areaEyebrow: 'Where we work',
    areaTitle: 'The Twin Cities metro',
    areaLede:
      'Not sure if you’re in range? Call and ask — it’s a short conversation.',
  },

  services: {
    meta: {
      title: 'Services',
      description:
        'Interior and exterior painting, baseboard and trim, kitchen cabinets, doors, fences, decks and epoxy floors across the Twin Cities metro. Free estimates.',
    },
    eyebrow: 'Services',
    h1: 'Seven things, done properly',
    lede:
      'Interior and exterior work across the Twin Cities metro. If it’s a surface that takes paint or stain, it’s on this list.',
    items: {
      'interior-exterior': {
        name: 'Interior & exterior painting',
        short: 'Whole-house repaints, inside and out.',
        body: 'The core of the work: full interior repaints and full exterior repaints on Twin Cities homes and commercial spaces.',
        detail: [
          'Walls, ceilings, and full-room repaints',
          'Siding, stucco, board-and-batten, and painted brick',
          'Surface prep, scraping, and priming before any finish coat goes on',
          'Furniture covered, floors protected, site cleaned at the end of each day',
        ],
        imageAlt:
          'A Twin Cities home after an exterior repaint: painted white brick, white board-and-batten siding, black window frames and a black front door.',
      },
      'baseboard-trim': {
        name: 'Baseboard & trim',
        short: 'The detail work that makes a room read finished.',
        body: 'Trim is where a paint job is judged. Straight lines, no bleed onto the wall, no roller texture on flat stock.',
        detail: [
          'Baseboards, casing, crown, and window trim',
          'Caulking and filling before paint, not instead of it',
          'Enamel finishes that stand up to being cleaned',
        ],
      },
      cabinets: {
        name: 'Kitchen cabinet painting',
        short: 'A new kitchen finish without a new kitchen.',
        body: 'Cabinet refinishing changes the whole room for a fraction of a replacement, and it is the job where prep matters most.',
        detail: [
          'Doors and drawer fronts removed, labelled, and finished off the box',
          'Degreasing and sanding so the finish actually bonds',
          'Cabinet-grade enamel built for daily handling',
        ],
      },
      doors: {
        name: 'Door painting',
        short: 'Entry doors, interior doors, and garage doors.',
        body: 'Doors take more abuse than any other painted surface in a house, and a failing door is the first thing a visitor sees.',
        detail: [
          'Entry and interior doors',
          'Garage doors, including stripping failed factory finishes',
          'Hardware removed rather than cut around',
        ],
        imageAlt:
          'Two garage doors finished in black against fresh white board-and-batten siding.',
      },
      fence: {
        name: 'Fence painting & staining',
        short: 'Sealed against Minnesota winters.',
        body: 'An unsealed fence in this climate goes gray and splits. Stain and paint both buy it years.',
        detail: [
          'Cleaning and prep before finish',
          'Solid stain, semi-transparent stain, or paint',
          'Full runs and repairs to existing finishes',
        ],
      },
      deck: {
        name: 'Deck painting & staining',
        short: 'The job where before-and-after is most obvious.',
        body: 'A weathered deck is gray, dry, and rough. Cleaned, prepped and stained, the same boards come back warm.',
        detail: [
          'Deck boards, stairs, railings, and skirting',
          'Cleaning and sanding before stain',
          'Stain or solid-color finish, matched to the house',
        ],
        imageAlt:
          'Deck stairs and a landing after cleaning and staining, the wood finished in a warm cedar tone.',
      },
      'epoxy-floors': {
        name: 'Epoxy floors',
        short: 'Garage and basement floors that wipe clean.',
        body: 'Epoxy turns a dusting concrete slab into a sealed floor that takes road salt, oil, and a snow blower.',
        detail: [
          'Garage, basement, and shop floors',
          'Concrete prep and patching before coating',
          'Sealed surface that cleans with a mop',
        ],
      },
    },
    processEyebrow: 'Every job, same order',
    processTitle: 'Most of the work happens before the colour goes on',
    ctaTitle: 'Tell us what needs painting.',
    ctaLede: 'Free estimates. Hablamos Español.',
  },

  gallery: {
    meta: {
      title: 'Our work',
      description:
        'Before and after photos from real Blue Wings Painting jobs across the Twin Cities: deck staining, garage doors, exterior repaints and interior painting.',
    },
    eyebrow: 'Our work',
    h1: 'Before, and after.',
    lede:
      'Every pair below is the same surface, photographed twice. Drag the handle to move between them — or use the arrow keys.',
    items: {
      'deck-stairs': {
        title: 'Deck stairs and landing',
        kind: 'Deck staining',
        summary:
          'Weathered gray boards, cleaned, prepped, and brought back with a warm cedar stain. Same stairs, same railing, same fence line behind them.',
        beforeAlt:
          'Before: a deck landing and stairs weathered to flat gray, with a paint pole lying across the boards.',
        afterAlt:
          'After: the same stairs and landing finished in a warm cedar stain, grain visible in the sunlight.',
      },
      'garage-doors': {
        title: 'Garage doors and siding',
        kind: 'Exterior repaint',
        summary:
          'Factory finish had failed down to bare wood on the doors and trim. Stripped, prepped, and refinished in black against new white board-and-batten.',
        beforeAlt:
          'Before: tan garage doors with paint peeling off in sheets, and trim failing at the edges.',
        afterAlt:
          'After: the same garage bays finished in black, set against crisp white board-and-batten siding.',
      },
      'interior-room': {
        title: 'Interior room, new construction',
        kind: 'Interior painting',
        summary:
          'Bare taped drywall in a Minnesota winter, finished into a painted room with a white ceiling and soft gray walls.',
        beforeAlt:
          'Before: a room in bare taped drywall, unpainted, with snow visible through the window.',
        afterAlt:
          'After: the same room painted, with soft gray walls, a white ceiling, and recessed lighting on.',
      },
    },
    finishedEyebrow: 'Finished work',
    finishedTitle: 'More of what we’ve left behind',
    finishedLede:
      'No “before” on file for these, so they’re shown as what they are: finished jobs.',
    finished: [
      {
        alt: 'Cream board-and-batten gables with black window frames, photographed from below against an overcast sky.',
        caption: 'Exterior repaint — board-and-batten and trim',
      },
      {
        alt: 'A two-storey home with painted white brick, white board-and-batten, black windows and a black front door.',
        caption: 'Exterior repaint — painted brick and siding',
      },
      {
        alt: 'A painted addition in cream board-and-batten with black window trim and white lattice skirting below the deck.',
        caption: 'Exterior repaint — addition, trim and lattice',
      },
    ],
    ctaTitle: 'Want yours on this page?',
    ctaLede: 'Free estimates across the Twin Cities. Hablamos Español.',
  },

  about: {
    meta: {
      title: 'About',
      description:
        'Blue Wings Painting MN is an interior and exterior painting company serving the Twin Cities metro. Free estimates. Hablamos Español.',
    },
    eyebrow: 'About',
    h1: 'A painting company, not a marketing company.',
    lede:
      'Blue Wings Painting MN does interior and exterior work across the Twin Cities metro. The photographs on this site are our jobs — not stock, not someone else’s portfolio.',
    judgedTitle: 'What we’d rather be judged on',
    judgedP1:
      'Painting is a trade where the marketing all sounds the same. Every company says quality, reliability and care. The difference only shows up on the wall.',
    judgedP2:
      'So the argument we’d rather make is the one on the right: a garage whose factory finish had failed down to bare wood, and the same garage after. Drag it. That’s the standard.',
    valuesEyebrow: 'How we work',
    processEyebrow: 'Every job, same order',
    processTitle: 'The parts you don’t see are the parts that last',
    areaEyebrow: 'Service area',
    spanishNote: 'llámanos para un presupuesto gratis.',
  },

  contact: {
    meta: {
      /*
        {phone} is filled from the CMS at render — see fill() at the bottom of
        this file. The number used to be typed out here in full, in both
        languages, where no admin panel could reach it: changing it in the CMS
        would have updated every visible call button while leaving the search
        result telling people to ring the old one.
      */
      title: 'Contact',
      description:
        'Get a free painting estimate from Blue Wings Painting MN. Call {phone}, text, or send details through the form. Serving the Twin Cities metro. Hablamos Español.',
    },
    eyebrow: 'Contact',
    h1: 'Free estimate, no pressure.',
    lede:
      'Tell us what needs painting and where. If it’s easier to talk, call or text — both reach the same place.',
    formTitle: 'Request an estimate',
    callOrText: 'Call or text',
    sendText: 'Send a text →',
    emailLabel: 'Email',
    areaLabel: 'Service area',
    followLabel: 'Follow the work',
    facebookLink: 'Facebook →',
  },

  form: {
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    optional: 'optional',
    city: 'City',
    cityPlaceholder: 'Brooklyn Center',
    service: 'What needs painting?',
    chooseOne: 'Choose one',
    somethingElse: 'Something else',
    details: 'Tell us about the job',
    detailsPlaceholder:
      'Rooms, square footage, current condition, when you’d like it done.',
    submit: 'Request my free estimate',
    sending: 'Sending…',
    orCall: (p) => `Or call ${p}`,
    note: 'Free estimates. Hablamos Español.',
    errorSuffix: (phone, email) =>
      ` You can also call ${phone} or email ${email}.`,
    genericError: 'Something went wrong.',
    validationError:
      'Please fill in your name, phone, city and what needs painting.',
    sentTitle: 'Almost there — press send.',
    sentBody:
      'Your request is written out and ready to go. Open it and press send — that is the last step.',
    sendAnother: 'Start another request',
    company: 'Company',
    mailNote:
      'We write the email for you. The next screen hands it to you ready to send — in your email app or in Gmail.',
    emailSubject: (service, city) => `Free estimate — ${service} in ${city}`,
    emailLabels: {
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      city: 'City',
      service: 'What needs painting',
      details: 'Details',
      language: 'Customer wrote in',
    },
    emailLanguageValue: 'English',
    openEmail: 'Open in my email app',
    openGmail: 'Open in Gmail',
    sentFallback:
      'Neither one working? Call or text {phone}, or email {email} directly — same result.',
    deliveredTitle: 'Got it — your request is in.',
    deliveredBody:
      'It went straight to Blue Wings Painting. Expect a call or text back to set up your free estimate.',
  },

  footer: {
    pages: 'Pages',
    services: 'Services',
    getInTouch: 'Get in touch',
    rights: 'All rights reserved.',
    freeEstimates: 'Free estimates.',
  },

  process: [
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
  ],

  notFound: {
    title: 'That page isn’t here.',
    lede: 'The work is, though.',
  },

  assistant: {
    launcher: 'Ask about our work',
    close: 'Close',
    panelTitle: 'Ask about our work',
    panelSub: 'Answers come from this site only — not an AI guess.',
    placeholder: 'Do you paint cabinets?',
    inputLabel: 'Ask a question about Blue Wings Painting',
    send: 'Send',
    ratherTalk: 'Rather talk to a person?',
    greeting:
      'Ask me anything about the work on this site — services, service area, how a job runs, or how to get an estimate. I only answer from what’s actually published here.',
    fallback:
      'I don’t have that on the site. For anything not covered here, call or text {phone}, or email {email} — free estimates either way.',
    suggestions: {
      home: [
        'What services do you offer?',
        'What areas do you cover?',
        'How much does it cost?',
      ],
      services: [
        'Do you paint kitchen cabinets?',
        'What about deck staining?',
        'What paint do you use?',
      ],
      gallery: [
        'Can I see before and after work?',
        'Do you do garage doors?',
        'How do I get an estimate?',
      ],
      about: [
        'How does the process work?',
        'Will you clean up afterwards?',
        'Are you licensed and insured?',
      ],
      contact: [
        'What areas do you cover?',
        '¿Hablan español?',
        'How long does a job take?',
      ],
    },
    answers: {
      'services-overview': '',
      area:
        'The Twin Cities metro, including {cities} and surrounding communities. If you’re not sure whether you’re in range, call {phone} and ask — it’s a short conversation.',
      estimate:
        'Estimates are free. Send your name, phone, city and what needs painting through the form and we’ll get back to you — or call {phone} and skip the typing. Photos help.',
      contact:
        'Phone {phone}. Email {email}. You can text that number too.',
      spanish:
        'Sí — Hablamos Español. Llama al {phone} para un presupuesto gratis.',
      'work-proof':
        'There are three before/after pairs on the site — the same surface photographed before we started and after we finished: a deck restoration, a garage door repaint, and an interior room. Drag the handle on any of them to move between the two.',
      process:
        'Five steps: free estimate, then colours and a written scope, then prep (scraping, sanding, filling, caulking, priming, masking), then paint, then a walkthrough with you and cleanup. Most of the labour is in the prep — that is where a paint job is won or lost.',
      materials:
        'Premium paints and finishes, chosen for the surface and for the Minnesota weather that is going to hit it. For the exact product on your job, ask during the estimate — it depends what is being coated.',
      commercial: 'Yes — residential and commercial both. Same process either way.',
      cleanup:
        'Furniture gets covered, floors get protected, and the site is cleaned at the end of each day. On-time completion with professional cleanup — the site gets put back together, not left for you.',
      price:
        'Prices aren’t published here — every job is priced off the actual surfaces, their condition, and the prep they need. The estimate is free, so the fastest way to a real number is to call {phone} or send a few photos through the form.',
      timeline:
        'Timelines aren’t published here — they depend on the size of the job and what’s already booked. Call {phone} and ask about current availability.',
      licence:
        'Licensing, bonding, insurance and warranty terms aren’t published on this site, so I won’t guess at them. Ask directly at {phone} or {email} and you’ll get a straight answer.',
      hours:
        'Business hours aren’t published here. Call or text {phone} — that’s the quickest way to reach someone.',
      reviews:
        'There are no testimonials on this site — rather than write filler ones, the work is shown as before/after photos of real jobs. The Facebook page is the place to look for public comments.',
      scope:
        'Blue Wings is a painting company — what we do is the list on this site: painting, staining and epoxy coatings. If what you need isn’t a coating, it’s outside what we take on. Call {phone} if you’re not sure which it is.',
    },
    linkLabels: {
      'services-overview': 'See all services',
      scope: 'See all services',
      area: 'Contact and service area',
      estimate: 'Request a free estimate',
      contact: 'All contact details',
      spanish: 'Contacto',
      'work-proof': 'See the work',
      process: 'How a job runs',
      materials: 'Services',
      commercial: 'Services',
      cleanup: 'How we work',
      price: 'Get a free estimate',
      timeline: 'Contact',
      licence: 'Contact',
      hours: 'Contact',
      reviews: 'See the before/after work',
    },
    extraKeywords: {},
    extraPhrases: {},
    moreOn: (service) => `More on ${service}`,
    coversPrefix: 'What that covers',
    sevenThings: (list) =>
      `Seven things: ${list}. Interior and exterior, residential and commercial.`,
  },
};

/* ------------------------------------------------------------------ */
/* SPANISH                                                             */
/* ------------------------------------------------------------------ */

const es: Dict = {
  htmlLang: 'es',
  switchTo: { label: 'EN', aria: 'View this site in English' },
  nav: {
    home: 'Inicio',
    services: 'Servicios',
    gallery: 'Trabajos',
    about: 'Nosotros',
    contact: 'Contacto',
  },

  common: {
    freeEstimate: 'Presupuesto gratis',
    getFreeEstimate: 'Pide tu presupuesto gratis',
    callPhone: (p) => `Llama al ${p}`,
    seeAllServices: 'Todos los servicios →',
    seeAllWork: 'Ver todos los trabajos →',
    seeOurWork: 'Ver todos nuestros trabajos',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    skipToContent: 'Ir al contenido',
    themeToLight: 'Cambiar a tema claro',
    themeToDark: 'Cambiar a tema oscuro',
    tagline: 'Pintura interior y exterior en las Ciudades Gemelas',
    areaName: 'Área metro de Twin Cities',
    areaIncluding: (cities) => `incluyendo ${cities} y comunidades cercanas`,
    dragToCompare: (what) => `Arrastra para comparar ${what} antes y después`,
    before: 'Antes',
    after: 'Después',
  },

  home: {
    meta: {
      title: 'Blue Wings Painting MN — Pintores interiores y exteriores, Twin Cities',
      description:
        'Pintura interior y exterior en el área metropolitana de Twin Cities. Gabinetes, molduras, puertas, decks, cercas y pisos epóxicos. Presupuestos gratis. Hablamos Español.',
    },
    eyebrow: 'Área metro de Twin Cities · Desde la primera capa',
    h1a: 'Minnesota',
    h1b: 'arruina la pintura.',
    h1accent: 'Lo arreglamos.',
    lede:
      'Pintura interior y exterior en las Ciudades Gemelas. Cada trabajo en esta página es nuestro, fotografiado antes y después. Arrastra el control y compruébalo tú mismo.',
    valueProps: [
      {
        title: 'Materiales duraderos y de calidad',
        body: 'Pinturas y acabados premium, elegidos según la superficie y el clima de Minnesota que va a golpearla.',
      },
      {
        title: 'Diseños a la medida de cada espacio',
        body: 'Colores y acabados que combinan con el estilo de tu casa y con el uso real de cada cuarto.',
      },
      {
        title: 'Rapidez y obra limpia',
        body: 'Terminamos a tiempo y limpiamos al terminar. Dejamos el lugar en orden, no hecho un desastre.',
      },
    ],
    servicesEyebrow: 'Lo que hacemos',
    servicesTitle: 'Siete cosas, bien hechas',
    proofEyebrow: 'Las pruebas',
    proofTitle: 'Misma casa. Mismo ángulo.',
    proofLede:
      'Cualquiera puede subir la foto de una pared terminada. Estas son las mismas superficies antes de que llegáramos y después de irnos.',
    processEyebrow: 'Cómo trabajamos',
    processTitle: 'La mayor parte del trabajo ocurre antes del color',
    areaEyebrow: 'Dónde trabajamos',
    areaTitle: 'El área metro de Twin Cities',
    areaLede:
      '¿No sabes si llegamos hasta tu zona? Llámanos y pregunta — es una llamada corta.',
  },

  services: {
    meta: {
      title: 'Servicios',
      description:
        'Pintura interior y exterior, molduras y zócalos, gabinetes de cocina, puertas, cercas, decks y pisos epóxicos en el área metro de Twin Cities. Presupuestos gratis.',
    },
    eyebrow: 'Servicios',
    h1: 'Siete cosas, bien hechas',
    lede:
      'Trabajo interior y exterior en el área metro de Twin Cities. Si es una superficie que acepta pintura o tinte, está en esta lista.',
    items: {
      'interior-exterior': {
        name: 'Pintura interior y exterior',
        short: 'Repintado completo, por dentro y por fuera.',
        body: 'El corazón del trabajo: repintado interior completo y repintado exterior completo en casas y locales comerciales de Twin Cities.',
        detail: [
          'Paredes, techos y cuartos completos',
          'Siding, estuco, board-and-batten y ladrillo pintado',
          'Preparación, raspado e imprimación antes de cualquier capa final',
          'Muebles cubiertos, pisos protegidos y limpieza al final de cada día',
        ],
        imageAlt:
          'Una casa de Twin Cities después del repintado exterior: ladrillo pintado de blanco, siding board-and-batten blanco, marcos de ventana negros y puerta principal negra.',
      },
      'baseboard-trim': {
        name: 'Zócalos y molduras',
        short: 'El detalle que hace que un cuarto se vea terminado.',
        body: 'Las molduras son donde se juzga un trabajo de pintura. Líneas rectas, sin escurrimientos en la pared, sin textura de rodillo en superficie lisa.',
        detail: [
          'Zócalos, marcos, cornisas y molduras de ventana',
          'Sellado y resanado antes de pintar, no en lugar de pintar',
          'Acabados esmaltados que aguantan la limpieza',
        ],
      },
      cabinets: {
        name: 'Pintura de gabinetes de cocina',
        short: 'Una cocina nueva sin cambiar la cocina.',
        body: 'Repintar los gabinetes cambia el cuarto entero por una fracción de lo que cuesta reemplazarlos, y es el trabajo donde la preparación importa más.',
        detail: [
          'Puertas y frentes de cajón desmontados, etiquetados y terminados fuera del mueble',
          'Desengrasado y lijado para que el acabado de verdad se adhiera',
          'Esmalte para gabinetes, hecho para el uso diario',
        ],
      },
      doors: {
        name: 'Pintura de puertas',
        short: 'Puertas de entrada, interiores y de garaje.',
        body: 'Las puertas reciben más maltrato que cualquier otra superficie pintada de la casa, y una puerta descarapelada es lo primero que ve una visita.',
        detail: [
          'Puertas de entrada e interiores',
          'Puertas de garaje, incluyendo el retiro de acabados de fábrica ya fallados',
          'Herrajes desmontados, no bordeados con la brocha',
        ],
        imageAlt:
          'Dos puertas de garaje terminadas en negro contra siding board-and-batten blanco recién pintado.',
      },
      fence: {
        name: 'Pintura y tinte de cercas',
        short: 'Selladas contra los inviernos de Minnesota.',
        body: 'Una cerca sin sellar en este clima se pone gris y se raja. El tinte y la pintura le dan años de vida.',
        detail: [
          'Limpieza y preparación antes del acabado',
          'Tinte sólido, tinte semitransparente o pintura',
          'Tramos completos y reparación de acabados existentes',
        ],
      },
      deck: {
        name: 'Pintura y tinte de decks',
        short: 'El trabajo donde el antes y después salta a la vista.',
        body: 'Un deck maltratado está gris, seco y áspero. Limpio, preparado y con tinte, esas mismas tablas recuperan su color.',
        detail: [
          'Tablas, escalones, barandales y faldones',
          'Limpieza y lijado antes del tinte',
          'Tinte o acabado de color sólido, a juego con la casa',
        ],
        imageAlt:
          'Escalones y descanso de un deck después de limpiarlos y aplicarles tinte, con la madera en un tono cedro cálido.',
      },
      'epoxy-floors': {
        name: 'Pisos epóxicos',
        short: 'Pisos de garaje y sótano que se limpian con un trapeador.',
        body: 'El epóxico convierte una losa de concreto que suelta polvo en un piso sellado que aguanta sal de carretera, aceite y la quitanieves.',
        detail: [
          'Pisos de garaje, sótano y taller',
          'Preparación y resane del concreto antes del recubrimiento',
          'Superficie sellada que se limpia con trapeador',
        ],
      },
    },
    processEyebrow: 'Cada trabajo, el mismo orden',
    processTitle: 'La mayor parte del trabajo ocurre antes del color',
    ctaTitle: 'Dinos qué necesitas pintar.',
    ctaLede: 'Presupuestos gratis. Hablamos Español.',
  },

  gallery: {
    meta: {
      title: 'Trabajos',
      description:
        'Fotos de antes y después de trabajos reales de Blue Wings Painting en Twin Cities: tinte de decks, puertas de garaje, repintado exterior y pintura interior.',
    },
    eyebrow: 'Nuestros trabajos',
    h1: 'Antes, y después.',
    lede:
      'Cada par de abajo es la misma superficie, fotografiada dos veces. Arrastra el control para pasar de una a otra — o usa las flechas del teclado.',
    items: {
      'deck-stairs': {
        title: 'Escalones y descanso de deck',
        kind: 'Tinte de deck',
        summary:
          'Tablas grises y maltratadas, limpiadas, preparadas y recuperadas con un tinte cedro cálido. Mismos escalones, mismo barandal, misma cerca al fondo.',
        beforeAlt:
          'Antes: el descanso y los escalones de un deck desgastados hasta quedar gris mate, con un extensor de rodillo tirado sobre las tablas.',
        afterAlt:
          'Después: los mismos escalones y descanso terminados con un tinte cedro cálido, con la veta visible bajo el sol.',
      },
      'garage-doors': {
        title: 'Puertas de garaje y siding',
        kind: 'Repintado exterior',
        summary:
          'El acabado de fábrica se había caído hasta la madera desnuda en puertas y molduras. Retirado, preparado y terminado en negro contra board-and-batten blanco nuevo.',
        beforeAlt:
          'Antes: puertas de garaje color café claro con la pintura cayéndose en placas y las molduras deshaciéndose en los bordes.',
        afterAlt:
          'Después: las mismas puertas de garaje terminadas en negro, sobre siding board-and-batten blanco impecable.',
      },
      'interior-room': {
        title: 'Cuarto interior, obra nueva',
        kind: 'Pintura interior',
        summary:
          'Tablaroca con cinta y sin pintar en pleno invierno de Minnesota, terminada como un cuarto pintado con techo blanco y paredes gris suave.',
        beforeAlt:
          'Antes: un cuarto con tablaroca encintada y sin pintar, con nieve visible por la ventana.',
        afterAlt:
          'Después: el mismo cuarto pintado, con paredes gris suave, techo blanco y luces empotradas encendidas.',
      },
    },
    finishedEyebrow: 'Trabajos terminados',
    finishedTitle: 'Más de lo que hemos dejado atrás',
    finishedLede:
      'De estos no tenemos foto del “antes”, así que se muestran por lo que son: trabajos terminados.',
    finished: [
      {
        alt: 'Frontones board-and-batten color crema con marcos de ventana negros, fotografiados desde abajo contra un cielo nublado.',
        caption: 'Repintado exterior — board-and-batten y molduras',
      },
      {
        alt: 'Una casa de dos pisos con ladrillo pintado de blanco, board-and-batten blanco, ventanas negras y puerta principal negra.',
        caption: 'Repintado exterior — ladrillo pintado y siding',
      },
      {
        alt: 'Una ampliación pintada en board-and-batten color crema con molduras de ventana negras y celosía blanca bajo el deck.',
        caption: 'Repintado exterior — ampliación, molduras y celosía',
      },
    ],
    ctaTitle: '¿Quieres el tuyo en esta página?',
    ctaLede: 'Presupuestos gratis en todo Twin Cities. Hablamos Español.',
  },

  about: {
    meta: {
      title: 'Nosotros',
      description:
        'Blue Wings Painting MN es una empresa de pintura interior y exterior que atiende el área metro de Twin Cities. Presupuestos gratis. Hablamos Español.',
    },
    eyebrow: 'Nosotros',
    h1: 'Una empresa de pintura, no de publicidad.',
    lede:
      'Blue Wings Painting MN hace trabajo interior y exterior en el área metro de Twin Cities. Las fotos de este sitio son de nuestros trabajos — no son de banco de imágenes ni el portafolio de alguien más.',
    judgedTitle: 'Por lo que preferimos que nos juzguen',
    judgedP1:
      'La pintura es un oficio donde toda la publicidad suena igual. Cada empresa dice calidad, confianza y cuidado. La diferencia solo se ve en la pared.',
    judgedP2:
      'Así que el argumento que preferimos es el de la derecha: un garaje cuyo acabado de fábrica se había caído hasta la madera desnuda, y ese mismo garaje después. Arrástralo. Ese es el estándar.',
    valuesEyebrow: 'Cómo trabajamos',
    processEyebrow: 'Cada trabajo, el mismo orden',
    processTitle: 'Lo que no se ve es lo que hace que dure',
    areaEyebrow: 'Zona de servicio',
    spanishNote: 'llámanos para un presupuesto gratis.',
  },

  contact: {
    meta: {
      title: 'Contacto',
      description:
        'Pide un presupuesto de pintura gratis a Blue Wings Painting MN. Llama al {phone}, manda mensaje o envía los detalles por el formulario. Atendemos el área metro de Twin Cities. Hablamos Español.',
    },
    eyebrow: 'Contacto',
    h1: 'Presupuesto gratis, sin compromiso.',
    lede:
      'Dinos qué necesitas pintar y dónde. Si prefieres hablar, llama o manda un mensaje — los dos llegan al mismo lugar.',
    formTitle: 'Pide tu presupuesto',
    callOrText: 'Llama o manda mensaje',
    sendText: 'Mandar un mensaje →',
    emailLabel: 'Correo',
    areaLabel: 'Zona de servicio',
    followLabel: 'Sigue el trabajo',
    facebookLink: 'Facebook →',
  },

  form: {
    name: 'Nombre',
    phone: 'Teléfono',
    email: 'Correo',
    optional: 'opcional',
    city: 'Ciudad',
    cityPlaceholder: 'Brooklyn Center',
    service: '¿Qué necesitas pintar?',
    chooseOne: 'Elige una opción',
    somethingElse: 'Otra cosa',
    details: 'Cuéntanos del trabajo',
    detailsPlaceholder:
      'Cuartos, metros aproximados, en qué estado está y para cuándo lo necesitas.',
    submit: 'Pedir mi presupuesto gratis',
    sending: 'Enviando…',
    orCall: (p) => `O llama al ${p}`,
    note: 'Presupuestos gratis. Hablamos Español.',
    errorSuffix: (phone, email) =>
      ` También puedes llamar al ${phone} o escribir a ${email}.`,
    genericError: 'Algo salió mal.',
    validationError:
      'Por favor completa tu nombre, teléfono, ciudad y qué necesitas pintar.',
    sentTitle: 'Ya casi — solo dale enviar.',
    sentBody:
      'Tu solicitud ya está escrita y lista. Ábrela y dale enviar — ese es el último paso.',
    sendAnother: 'Hacer otra solicitud',
    company: 'Empresa',
    mailNote:
      'Nosotros escribimos el correo por ti. En la siguiente pantalla te lo entregamos listo para enviar — en tu correo o en Gmail.',
    emailSubject: (service, city) =>
      `Presupuesto gratis — ${service} en ${city}`,
    emailLabels: {
      name: 'Nombre',
      phone: 'Teléfono',
      email: 'Correo',
      city: 'Ciudad',
      service: 'Qué necesita pintura',
      details: 'Detalles',
      language: 'El cliente escribió en',
    },
    emailLanguageValue: 'Español',
    openEmail: 'Abrir en mi correo',
    openGmail: 'Abrir en Gmail',
    sentFallback:
      '¿Ninguno de los dos abre? Llama o manda mensaje al {phone}, o escribe directo a {email} — es lo mismo.',
    deliveredTitle: 'Listo — ya recibimos tu solicitud.',
    deliveredBody:
      'Llegó directo a Blue Wings Painting. Te van a llamar o mandar mensaje para agendar tu presupuesto gratis.',
  },

  footer: {
    pages: 'Páginas',
    services: 'Servicios',
    getInTouch: 'Contáctanos',
    rights: 'Todos los derechos reservados.',
    freeEstimates: 'Presupuestos gratis.',
  },

  process: [
    {
      step: '01',
      title: 'Presupuesto gratis',
      body: 'Manda fotos y una descripción, o llama. Vemos las superficies reales antes de dar un número.',
    },
    {
      step: '02',
      title: 'Colores y alcance',
      body: 'Acabados elegidos por superficie y por cuarto, y por escrito qué incluye el trabajo.',
    },
    {
      step: '03',
      title: 'Preparación',
      body: 'Raspado, lijado, resane, sellado, imprimación y protección. Aquí se va la mayor parte del trabajo y aquí se gana o se pierde una pintura.',
    },
    {
      step: '04',
      title: 'Pintura',
      body: 'Capas completas, manteniendo el borde húmedo, sin marcas de traslape. Materiales premium según la superficie.',
    },
    {
      step: '05',
      title: 'Revisión y limpieza',
      body: 'Recorremos el trabajo contigo, corregimos lo que nos señales y dejamos el lugar limpio.',
    },
  ],

  notFound: {
    title: 'Esta página no existe.',
    lede: 'El trabajo sí.',
  },

  assistant: {
    launcher: 'Pregunta sobre el trabajo',
    close: 'Cerrar',
    panelTitle: 'Pregunta sobre el trabajo',
    panelSub: 'Las respuestas salen solo de este sitio — no son inventadas.',
    placeholder: '¿Pintan gabinetes?',
    inputLabel: 'Haz una pregunta sobre Blue Wings Painting',
    send: 'Enviar',
    ratherTalk: '¿Prefieres hablar con una persona?',
    greeting:
      'Pregúntame lo que quieras sobre el trabajo de este sitio — servicios, zona de servicio, cómo se hace un trabajo o cómo pedir un presupuesto. Solo respondo con lo que está publicado aquí.',
    fallback:
      'Eso no lo tengo en el sitio. Para cualquier cosa que no esté aquí, llama o manda mensaje al {phone}, o escribe a {email} — el presupuesto es gratis de todos modos.',
    suggestions: {
      home: [
        '¿Qué servicios ofrecen?',
        '¿Qué zonas cubren?',
        '¿Cuánto cuesta?',
      ],
      services: [
        '¿Pintan gabinetes de cocina?',
        '¿Y el tinte de decks?',
        '¿Qué pintura usan?',
      ],
      gallery: [
        '¿Puedo ver trabajos de antes y después?',
        '¿Hacen puertas de garaje?',
        '¿Cómo pido un presupuesto?',
      ],
      about: [
        '¿Cómo funciona el proceso?',
        '¿Limpian al terminar?',
        '¿Tienen licencia y seguro?',
      ],
      contact: [
        '¿Qué zonas cubren?',
        '¿Hablan español?',
        '¿Cuánto tarda un trabajo?',
      ],
    },
    answers: {
      'services-overview': '',
      area:
        'El área metro de Twin Cities, incluyendo {cities} y comunidades cercanas. Si no sabes si llegamos hasta tu zona, llama al {phone} y pregunta — es una llamada corta.',
      estimate:
        'Los presupuestos son gratis. Manda tu nombre, teléfono, ciudad y qué necesitas pintar por el formulario y te contactamos — o llama al {phone} y te ahorras escribir. Las fotos ayudan.',
      contact:
        'Teléfono {phone}. Correo {email}. A ese número también puedes mandar mensaje.',
      spanish:
        'Sí — Hablamos Español. Llama al {phone} para un presupuesto gratis.',
      'work-proof':
        'Hay tres pares de antes y después en el sitio — la misma superficie fotografiada antes de empezar y al terminar: la restauración de un deck, el repintado de unas puertas de garaje y un cuarto interior. Arrastra el control en cualquiera para pasar de una a otra.',
      process:
        'Cinco pasos: presupuesto gratis, luego colores y alcance por escrito, luego preparación (raspado, lijado, resane, sellado, imprimación y protección), luego pintura, y al final un recorrido contigo y limpieza. La mayor parte del trabajo está en la preparación — ahí se gana o se pierde una pintura.',
      materials:
        'Pinturas y acabados premium, elegidos según la superficie y el clima de Minnesota que va a golpearla. Para el producto exacto de tu trabajo, pregunta durante el presupuesto — depende de qué se va a recubrir.',
      commercial:
        'Sí — residencial y comercial. El proceso es el mismo en los dos casos.',
      cleanup:
        'Cubrimos los muebles, protegemos los pisos y limpiamos al final de cada día. Terminamos a tiempo y con limpieza profesional — dejamos el lugar en orden, no hecho un desastre.',
      price:
        'Aquí no publicamos precios — cada trabajo se cotiza según las superficies reales, su estado y la preparación que necesitan. El presupuesto es gratis, así que la forma más rápida de tener un número real es llamar al {phone} o mandar unas fotos por el formulario.',
      timeline:
        'Aquí no publicamos tiempos — dependen del tamaño del trabajo y de lo que ya esté agendado. Llama al {phone} y pregunta por la disponibilidad actual.',
      licence:
        'La licencia, la fianza, el seguro y las garantías no están publicados en este sitio, así que no voy a inventarlos. Pregunta directo al {phone} o a {email} y te dan una respuesta clara.',
      hours:
        'El horario no está publicado aquí. Llama o manda mensaje al {phone} — es la forma más rápida de localizar a alguien.',
      reviews:
        'En este sitio no hay testimonios — en lugar de inventar unos de relleno, el trabajo se muestra con fotos de antes y después de trabajos reales. La página de Facebook es donde puedes ver comentarios del público.',
      scope:
        'Blue Wings es una empresa de pintura — lo que hacemos es la lista de este sitio: pintura, tinte y recubrimientos epóxicos. Si lo que necesitas no es un recubrimiento, está fuera de lo que tomamos. Llama al {phone} si tienes duda.',
    },
    linkLabels: {
      'services-overview': 'Ver todos los servicios',
      scope: 'Ver todos los servicios',
      area: 'Contacto y zona de servicio',
      estimate: 'Pedir un presupuesto gratis',
      contact: 'Todos los datos de contacto',
      spanish: 'Contacto',
      'work-proof': 'Ver los trabajos',
      process: 'Cómo se hace un trabajo',
      materials: 'Servicios',
      commercial: 'Servicios',
      cleanup: 'Cómo trabajamos',
      price: 'Pedir un presupuesto gratis',
      timeline: 'Contacto',
      licence: 'Contacto',
      hours: 'Contacto',
      reviews: 'Ver los trabajos de antes y después',
    },
    /* Spanish match terms. Accents are stripped by the matcher, so these are
       written unaccented where that is what the normaliser produces. */
    extraKeywords: {
      'service-interior-exterior': [
        'interior', 'exterior', 'adentro', 'afuera', 'casa', 'pared', 'paredes',
        'techo', 'techos', 'siding', 'estuco', 'ladrillo', 'cuarto', 'cuartos',
        'recamara', 'sala',
      ],
      'service-baseboard-trim': [
        'zocalo', 'zocalos', 'moldura', 'molduras', 'marco', 'marcos', 'cornisa',
      ],
      'service-cabinets': [
        'gabinete', 'gabinetes', 'cocina', 'alacena', 'alacenas', 'cajon', 'cajones',
      ],
      'service-doors': ['puerta', 'puertas', 'garaje', 'garage', 'entrada', 'zaguan'],
      'service-fence': ['cerca', 'cercas', 'barda', 'bardas', 'reja', 'rejas'],
      'service-deck': [
        'deck', 'decks', 'terraza', 'tinte', 'barandal', 'barandales', 'escalon', 'escalones',
      ],
      'service-epoxy-floors': [
        'epoxico', 'epoxi', 'piso', 'pisos', 'sotano', 'concreto', 'losa', 'taller',
      ],
      'services-overview': ['servicios', 'ofrecen', 'pintan', 'pintura', 'trabajos'],
      area: [
        'zona', 'zonas', 'area', 'areas', 'donde', 'ubicacion', 'ciudad', 'ciudades',
        'cubren', 'llegan', 'atienden', 'minneapolis', 'minnesota',
      ],
      estimate: [
        'presupuesto', 'presupuestos', 'cotizacion', 'cotizar', 'estimado', 'agendar',
      ],
      contact: ['contacto', 'telefono', 'llamar', 'numero', 'correo', 'mensaje', 'contactar'],
      spanish: ['espanol', 'ingles', 'idioma', 'hablan', 'hablas'],
      'work-proof': [
        'fotos', 'foto', 'galeria', 'portafolio', 'ejemplos', 'antes', 'despues', 'trabajos',
      ],
      process: ['proceso', 'pasos', 'preparacion', 'funciona', 'esperar'],
      materials: ['materiales', 'calidad', 'marca', 'marcas', 'productos'],
      commercial: ['comercial', 'negocio', 'oficina', 'local', 'renta'],
      cleanup: ['limpian', 'limpieza', 'muebles', 'cochinero', 'desastre', 'polvo'],
      price: ['precio', 'precios', 'costo', 'cuesta', 'cobran', 'barato', 'caro', 'anticipo'],
      timeline: ['tarda', 'tiempo', 'dias', 'semanas', 'rapido', 'cuando', 'disponibilidad'],
      licence: ['licencia', 'seguro', 'asegurados', 'fianza', 'garantia', 'garantizan'],
      hours: ['horario', 'horarios', 'abren', 'abierto', 'sabado', 'domingo', 'fin'],
      reviews: ['resenas', 'testimonios', 'referencias', 'opiniones', 'calificacion'],
      scope: [
        'techumbre', 'tejado', 'tejados', 'plomeria', 'electricidad',
        'jardineria', 'albanileria', 'mudanza', 'roof',
      ],
    },
    extraPhrases: {
      area: ['zona de servicio', 'donde trabajan', 'hasta donde', 'que zonas', 'llegan a'],
      estimate: ['presupuesto gratis', 'pedir presupuesto', 'como empiezo', 'quiero cotizar'],
      price: ['cuanto cuesta', 'cuanto cobran', 'que precio', 'por metro'],
      timeline: ['cuanto tarda', 'cuanto tiempo', 'para cuando', 'que tan rapido'],
      licence: ['tienen licencia', 'estan asegurados', 'dan garantia'],
      spanish: ['hablan espanol', 'se habla espanol'],
      'work-proof': ['antes y despues', 'ver trabajos', 'ejemplos de'],
      process: ['como funciona', 'como trabajan', 'que pasa', 'paso a paso'],
      materials: ['que pintura', 'que marca', 'que productos'],
      cleanup: ['dejan limpio', 'hacen cochinero', 'mis muebles'],
      commercial: ['trabajo comercial', 'hacen comercial', 'mi negocio'],
      hours: ['que horario', 'estan abiertos'],
      reviews: ['tienen resenas', 'hay testimonios', 'que dicen los clientes'],
      /* "techo" alone means ceiling, which IS painted. These phrases are the
         roofing sense and must beat the interior/exterior service entry. */
      scope: [
        'arreglan techos', 'arreglan el techo', 'reparan techos',
        'reparacion de techo', 'cambian el techo', 'hacen techos',
        'arreglan goteras',
      ],
    },
    moreOn: (service) => `Más sobre ${service}`,
    coversPrefix: 'Qué incluye',
    sevenThings: (list) =>
      `Siete cosas: ${list}. Interior y exterior, residencial y comercial.`,
  },
};

export const dictionaries: Record<Locale, Dict> = { en, es };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/** Fills {phone} / {email} / {cities} placeholders. */
export function fill(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (m, k) => values[k] ?? m);
}
