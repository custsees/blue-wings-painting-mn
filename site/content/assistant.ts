/**
 * Knowledge base for the on-site assistant.
 *
 * This is deliberately NOT a language model. It retrieves from the same
 * `content/site.ts` that renders the pages, so it can only ever say things the
 * site already says — which is the whole point on a contractor site, where an
 * invented price, warranty or licence number is a real liability, not a typo.
 *
 * Rules, same as the rest of the build (see the private fact-and-proof ledger):
 *  - Every answer traces to published content or to a deliberate "we don't
 *    publish that — call and ask".
 *  - The unknowns (price, hours, licence, timeline) get honest non-answers
 *    that hand the visitor the phone number. They do not get guesses.
 *
 * When Jessica's OpenRouter key exists, an LLM can be layered on top with
 * these entries as its grounding context. The retrieval below stays as the
 * fallback for when the API is down or rate-limited.
 */

import { business, serviceArea, services, smsHref } from './site';

export type AssistantEntry = {
  id: string;
  /** Single words. One hit is a match, so keep them specific. */
  keywords: string[];
  /** Multi-word, matched against the raw question. Weighted higher. */
  phrases?: string[];
  answer: string;
  link?: { href: string; label: string };
};

/** Extra vocabulary per service, beyond the words already in its name. */
const serviceKeywords: Record<string, string[]> = {
  'interior-exterior': [
    'interior', 'exterior', 'inside', 'outside', 'house', 'home', 'wall',
    'walls', 'ceiling', 'ceilings', 'siding', 'stucco', 'brick', 'repaint',
    'room', 'rooms', 'bedroom', 'living',
  ],
  'baseboard-trim': [
    'baseboard', 'baseboards', 'trim', 'casing', 'crown', 'moulding',
    'molding', 'skirting',
  ],
  cabinets: [
    'cabinet', 'cabinets', 'kitchen', 'cupboard', 'cupboards', 'refinish',
    'refinishing', 'drawer', 'drawers',
  ],
  doors: ['door', 'doors', 'garage', 'entry', 'entryway'],
  fence: ['fence', 'fences', 'fencing'],
  deck: ['deck', 'decks', 'stain', 'staining', 'porch', 'railing', 'railings'],
  'epoxy-floors': [
    'epoxy', 'floor', 'floors', 'flooring', 'basement', 'concrete', 'slab',
    'shop',
  ],
};

const serviceEntries: AssistantEntry[] = services.map((s) => ({
  id: `service-${s.slug}`,
  keywords: serviceKeywords[s.slug] ?? [],
  phrases: [s.name.toLowerCase()],
  answer: `${s.body}\n\nWhat that covers: ${s.detail.join('; ')}.`,
  link: { href: `/services#${s.slug}`, label: `More on ${s.name.toLowerCase()}` },
}));

export const entries: AssistantEntry[] = [
  ...serviceEntries,

  {
    id: 'services-overview',
    keywords: ['services', 'offer', 'paint', 'painting', 'work', 'jobs'],
    phrases: [
      'what do you do', 'what do you offer', 'what services',
      'kind of work', 'types of work',
    ],
    answer: `Seven things: ${services
      .map((s) => s.name.toLowerCase())
      .join(', ')}. Interior and exterior, residential and commercial.`,
    link: { href: '/services', label: 'See all services' },
  },

  {
    id: 'area',
    keywords: [
      'area', 'where', 'located', 'location', 'city', 'cities', 'minneapolis',
      'stpaul', 'twin', 'metro', 'minnesota', 'brooklyn', 'maple', 'plymouth',
      'near', 'travel', 'serve',
    ],
    phrases: [
      'service area', 'where are you', 'do you work in', 'how far',
      'do you cover', 'what areas',
    ],
    answer: `The ${serviceArea.headline}, including ${serviceArea.namedCities.join(
      ', ',
    )} ${serviceArea.note}. If you're not sure whether you're in range, call ${
      business.phone
    } and ask — it's a short conversation.`,
    link: { href: '/contact', label: 'Contact and service area' },
  },

  {
    id: 'estimate',
    keywords: ['estimate', 'quote', 'quotes', 'estimates', 'consultation'],
    phrases: [
      'free estimate', 'get a quote', 'get started', 'book', 'schedule',
      'how do i start', 'next step',
    ],
    answer: `Estimates are free. Send your name, phone, city and what needs painting through the form and we'll get back to you — or call ${business.phone} and skip the typing. Photos help.`,
    link: { href: '/contact', label: 'Request a free estimate' },
  },

  {
    id: 'contact',
    keywords: ['contact', 'phone', 'call', 'number', 'email', 'text', 'reach'],
    phrases: ['phone number', 'get in touch', 'how do i contact'],
    answer: `Phone ${business.phone} (also ${business.phoneAlt}). Email ${business.email}. You can text the first number too.`,
    link: { href: '/contact', label: 'All contact details' },
  },

  {
    id: 'spanish',
    keywords: [
      'spanish', 'espanol', 'español', 'hablan', 'habla', 'hablamos',
      'idioma', 'castellano',
    ],
    phrases: ['do you speak spanish', 'se habla'],
    answer: `Sí — ${business.spanish}. Llama al ${business.phone} para un presupuesto gratis.`,
    link: { href: '/contact', label: 'Contacto' },
  },

  {
    id: 'work-proof',
    keywords: [
      'gallery', 'photos', 'pictures', 'portfolio', 'examples', 'before',
      'after', 'proof', 'previous',
    ],
    phrases: [
      'before and after', 'see your work', 'past work', 'examples of',
      'show me',
    ],
    answer:
      'There are three before/after pairs on the site — the same surface photographed before we started and after we finished: a deck restoration, a garage door repaint, and an interior room. Drag the handle on any of them to move between the two.',
    link: { href: '/gallery', label: 'See the work' },
  },

  {
    id: 'process',
    keywords: ['process', 'prep', 'steps', 'happens', 'expect', 'procedure'],
    phrases: [
      'how does it work', 'what happens', 'how do you work', 'your process',
      'step by step',
    ],
    answer:
      'Five steps: free estimate, then colours and a written scope, then prep (scraping, sanding, filling, caulking, priming, masking), then paint, then a walkthrough with you and cleanup. Most of the labour is in the prep — that is where a paint job is won or lost.',
    link: { href: '/about', label: 'How a job runs' },
  },

  {
    id: 'materials',
    keywords: ['materials', 'quality', 'brand', 'brands', 'products', 'premium'],
    phrases: ['what paint', 'which paint', 'kind of paint', 'what products'],
    answer:
      'Premium paints and finishes, chosen for the surface and for the Minnesota weather that is going to hit it. For the exact product on your job, ask during the estimate — it depends what is being coated.',
    link: { href: '/services', label: 'Services' },
  },

  {
    id: 'commercial',
    keywords: ['commercial', 'business', 'office', 'retail', 'rental'],
    phrases: ['commercial work', 'do you do commercial', 'my business'],
    answer:
      'Yes — residential and commercial both. Same process either way.',
    link: { href: '/services', label: 'Services' },
  },

  {
    id: 'cleanup',
    keywords: ['mess', 'clean', 'cleanup', 'furniture', 'protect', 'dust'],
    phrases: ['clean up', 'leave a mess', 'my furniture'],
    answer:
      'Furniture gets covered, floors get protected, and the site is cleaned at the end of each day. On-time completion with professional cleanup — the site gets put back together, not left for you.',
    link: { href: '/about', label: 'How we work' },
  },

  /* ---------- honest non-answers ----------
     These are as important as the rest. None of this is published anywhere in
     the client's own material, so the assistant says so instead of guessing. */

  {
    id: 'price',
    keywords: ['price', 'cost', 'costs', 'pricing', 'rate', 'rates', 'cheap',
      'expensive', 'budget', 'deposit', 'afford'],
    phrases: ['how much', 'what does it cost', 'price range', 'per square',
      'ballpark', 'do you charge'],
    answer: `Prices aren't published here — every job is priced off the actual surfaces, their condition, and the prep they need. The estimate is free, so the fastest way to a real number is to call ${business.phone} or send a few photos through the form.`,
    link: { href: '/contact', label: 'Get a free estimate' },
  },

  {
    id: 'timeline',
    keywords: ['long', 'timeline', 'duration', 'days', 'weeks', 'fast',
      'quick', 'when', 'availability', 'available', 'booked'],
    phrases: ['how long', 'how soon', 'turnaround', 'start date',
      'when can you', 'lead time'],
    answer: `Timelines aren't published here — they depend on the size of the job and what's already booked. Call ${business.phone} and ask about current availability.`,
    link: { href: '/contact', label: 'Contact' },
  },

  {
    id: 'licence',
    keywords: ['licensed', 'license', 'licence', 'insured', 'insurance',
      'bonded', 'bond', 'warranty', 'guarantee', 'guaranteed'],
    phrases: ['are you licensed', 'are you insured', 'do you guarantee'],
    answer: `Licensing, bonding, insurance and warranty terms aren't published on this site, so I won't guess at them. Ask directly at ${business.phone} or ${business.email} and you'll get a straight answer.`,
    link: { href: '/contact', label: 'Contact' },
  },

  {
    id: 'hours',
    keywords: ['hours', 'open', 'weekend', 'saturday', 'sunday', 'evening'],
    phrases: ['what hours', 'are you open', 'business hours'],
    answer: `Business hours aren't published here. Call or text ${business.phone} — that's the quickest way to reach someone.`,
    link: { href: '/contact', label: 'Contact' },
  },

  {
    id: 'reviews',
    keywords: ['reviews', 'testimonials', 'references', 'rating', 'ratings'],
    phrases: ['any reviews', 'customer reviews', 'what do customers say'],
    answer: `There are no testimonials on this site — rather than write filler ones, the work is shown as before/after photos of real jobs. The Facebook page is the place to look for public comments.`,
    link: { href: '/gallery', label: 'See the before/after work' },
  },
];

/** Greeting, shown when the panel opens and matched on "hi"/"hello". */
export const greeting =
  "Ask me anything about the work on this site — services, service area, how a job runs, or how to get an estimate. I only answer from what's actually published here.";

export const fallback = `I don't have that on the site. For anything not covered here, call or text ${business.phone}, or email ${business.email} — free estimates either way.`;

export const smsLink = smsHref;

/** Starter questions, tailored to the page the visitor is on. */
export const suggestionsByPath: Record<string, string[]> = {
  '/': [
    'What services do you offer?',
    'What areas do you cover?',
    'How much does it cost?',
  ],
  '/services': [
    'Do you paint kitchen cabinets?',
    'What about deck staining?',
    'What paint do you use?',
  ],
  '/gallery': [
    'Can I see before and after work?',
    'Do you do garage doors?',
    'How do I get an estimate?',
  ],
  '/about': [
    'How does the process work?',
    'Will you clean up afterwards?',
    'Are you licensed and insured?',
  ],
  '/contact': [
    'What areas do you cover?',
    '¿Hablan español?',
    'How long does a job take?',
  ],
};

export const defaultSuggestions = suggestionsByPath['/'];
