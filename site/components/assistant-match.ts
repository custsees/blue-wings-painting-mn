import type { BusinessView, ServiceView } from '@/cms/content';
import { fill, getDict, type Locale } from '@/content/i18n';

/**
 * The facts the assistant answers from. Passed in rather than imported so the
 * answers track what the client last saved: she can correct the phone number
 * or add a service and the bot stops contradicting her own site.
 */
export type Knowledge = { services: ServiceView[]; business: BusinessView };

/**
 * Retrieval for the site assistant, in either language.
 *
 * Scores the question against a knowledge base built from the same dictionary
 * that renders the pages, and returns the best entry — or a fallback that
 * hands over the phone number. No model, no network, no chance of inventing a
 * price.
 *
 * Structural terms (keywords, phrases) are shared where a word is spelled the
 * same in both languages — "epoxy", "deck", "Facebook" — and extended per
 * locale from `dict.assistant.extraKeywords` / `extraPhrases`.
 */

const STOP: Record<Locale, Set<string>> = {
  en: new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'do', 'does', 'did',
    'you', 'your', 'yours', 'i', 'me', 'my', 'we', 'our', 'us', 'they', 'them',
    'can', 'could', 'would', 'should', 'will', 'what', 'which', 'who', 'whom',
    'that', 'this', 'these', 'those', 'of', 'for', 'to', 'in', 'on', 'at', 'by',
    'and', 'or', 'but', 'if', 'with', 'about', 'it', 'its', 'please', 'there',
    'any', 'have', 'has', 'had', 'get', 'got', 'need', 'want', 'like', 'also',
    'some', 'from', 'as', 'so', 'just', 'tell', 'know', 'guys', 'hey',
  ]),
  es: new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
    'y', 'o', 'que', 'qué', 'en', 'con', 'por', 'para', 'es', 'son', 'era',
    'ser', 'estar', 'esta', 'este', 'esto', 'eso', 'ese', 'esa', 'se', 'su',
    'sus', 'mi', 'mis', 'me', 'te', 'lo', 'le', 'les', 'nos', 'yo', 'tu', 'tus',
    'usted', 'ustedes', 'hay', 'muy', 'mas', 'pero', 'si', 'no', 'ya', 'tambien',
    'como', 'cual', 'cuales', 'quien', 'todo', 'toda', 'algo', 'porfavor',
    'favor', 'puedo', 'puede', 'pueden', 'quiero', 'necesito', 'tengo', 'hola',
  ]),
};

const GREETINGS = new Set([
  'hi', 'hello', 'hey', 'yo', 'hola', 'howdy', 'greetings', 'sup', 'buenas',
  'saludos', 'ola',
]);

/** Terms that work in both languages, keyed by entry id. */
const sharedKeywords: Record<string, string[]> = {
  'service-interior-exterior': ['interior', 'exterior', 'siding', 'stucco'],
  'service-cabinets': ['cabinet', 'cabinets'],
  'service-doors': ['door', 'doors', 'garage'],
  'service-fence': ['fence', 'fences'],
  'service-deck': ['deck', 'decks'],
  'service-epoxy-floors': ['epoxy', 'epoxi', 'epoxico'],
  spanish: ['spanish', 'espanol', 'ingles', 'english'],
  area: ['minneapolis', 'minnesota', 'brooklyn', 'maple', 'plymouth', 'twin', 'metro'],
  reviews: ['facebook', 'google'],
};

export type Entry = {
  id: string;
  keywords: string[];
  phrases: string[];
  answer: string;
  link?: { href: string; label: string };
};

/** English keyword sets. Spanish adds its own via extraKeywords. */
const enKeywords: Record<string, string[]> = {
  'service-interior-exterior': [
    'inside', 'outside', 'house', 'home', 'wall', 'walls', 'ceiling', 'ceilings',
    'brick', 'repaint', 'room', 'rooms', 'bedroom', 'living',
  ],
  'service-baseboard-trim': [
    'baseboard', 'baseboards', 'trim', 'casing', 'crown', 'moulding', 'molding',
    'skirting',
  ],
  'service-cabinets': ['kitchen', 'cupboard', 'cupboards', 'refinish', 'refinishing', 'drawer', 'drawers'],
  'service-doors': ['entry', 'entryway'],
  'service-fence': ['fencing'],
  'service-deck': ['stain', 'staining', 'porch', 'railing', 'railings'],
  'service-epoxy-floors': ['floor', 'floors', 'flooring', 'basement', 'concrete', 'slab', 'shop'],
  'services-overview': ['services', 'offer', 'paint', 'painting', 'work', 'jobs'],
  area: ['area', 'where', 'located', 'location', 'city', 'cities', 'near', 'travel', 'serve'],
  estimate: ['estimate', 'quote', 'quotes', 'estimates', 'consultation'],
  contact: ['contact', 'phone', 'call', 'number', 'email', 'text', 'reach'],
  spanish: ['hablan', 'habla', 'hablamos', 'idioma'],
  'work-proof': ['gallery', 'photos', 'pictures', 'portfolio', 'examples', 'before', 'after', 'proof', 'previous'],
  process: ['process', 'prep', 'steps', 'happens', 'expect', 'procedure'],
  materials: ['materials', 'quality', 'brand', 'brands', 'products', 'premium'],
  commercial: ['commercial', 'business', 'office', 'retail', 'rental'],
  cleanup: ['mess', 'clean', 'cleanup', 'furniture', 'protect', 'dust'],
  price: ['price', 'cost', 'costs', 'pricing', 'rate', 'rates', 'cheap', 'expensive', 'budget', 'deposit', 'afford'],
  timeline: ['long', 'timeline', 'duration', 'days', 'weeks', 'fast', 'quick', 'when', 'availability', 'available', 'booked'],
  licence: ['licensed', 'license', 'licence', 'insured', 'insurance', 'bonded', 'bond', 'warranty', 'guarantee', 'guaranteed'],
  hours: ['hours', 'open', 'weekend', 'saturday', 'sunday', 'evening'],
  reviews: ['reviews', 'testimonials', 'references', 'rating', 'ratings'],
  scope: ['roof', 'roofs', 'roofing', 'roofer', 'plumbing', 'electrical', 'hvac', 'landscaping', 'masonry'],
};

const enPhrases: Record<string, string[]> = {
  'services-overview': ['what do you do', 'what do you offer', 'what services', 'kind of work', 'types of work'],
  area: ['service area', 'where are you', 'do you work in', 'how far', 'do you cover', 'what areas'],
  estimate: ['free estimate', 'get a quote', 'get started', 'book', 'schedule', 'how do i start', 'next step'],
  contact: ['phone number', 'get in touch', 'how do i contact'],
  spanish: ['do you speak spanish', 'se habla'],
  'work-proof': ['before and after', 'see your work', 'past work', 'examples of', 'show me'],
  process: ['how does it work', 'what happens', 'how do you work', 'your process', 'step by step'],
  materials: ['what paint', 'which paint', 'kind of paint', 'what products'],
  commercial: ['commercial work', 'do you do commercial', 'my business'],
  cleanup: ['clean up', 'leave a mess', 'my furniture'],
  price: ['how much', 'what does it cost', 'price range', 'per square', 'ballpark', 'do you charge'],
  timeline: ['how long', 'how soon', 'turnaround', 'start date', 'when can you', 'lead time'],
  licence: ['are you licensed', 'are you insured', 'do you guarantee'],
  hours: ['what hours', 'are you open', 'business hours'],
  reviews: ['any reviews', 'customer reviews', 'what do customers say'],
  scope: ['fix roofs', 'repair the roof', 'do you do roofing', 'replace the roof'],
};

function values({ business }: Knowledge) {
  return {
    phone: business.phone,
    email: business.email,
    cities: business.cities.join(', '),
  };
}

export function buildEntries(locale: Locale, knowledge: Knowledge): Entry[] {
  const t = getDict(locale);
  const a = t.assistant;
  const prefix = locale === 'es' ? '/es' : '';
  const v = values(knowledge);
  const { services } = knowledge;

  const merge = (id: string, base: Record<string, string[]>) => [
    ...(sharedKeywords[id] ?? []),
    ...(locale === 'en' ? (base[id] ?? []) : (a.extraKeywords[id] ?? [])),
  ];

  const mergePhrases = (id: string) =>
    locale === 'en' ? (enPhrases[id] ?? []) : (a.extraPhrases[id] ?? []);

  // One entry per service, built from the same copy the Services page renders.
  const serviceEntries: Entry[] = services.map((s) => {
    const id = `service-${s.slug}`;
    return {
      id,
      /*
        The service's own name is always a phrase, so a service added in the
        CMS is findable straight away without anyone editing the keyword tables
        above. extraKeywords only adds synonyms the name does not contain.
      */
      keywords: [...merge(id, enKeywords), ...s.extraKeywords],
      phrases: [s.name.toLowerCase(), ...mergePhrases(id)],
      answer: `${s.body}\n\n${a.coversPrefix}: ${s.detail.join('; ')}.`,
      link: {
        href: `${prefix}/services#${s.slug}`,
        label: a.moreOn(s.name.toLowerCase()),
      },
    };
  });

  const linkFor = (id: string, path: string): Entry['link'] => ({
    href: `${prefix}${path}` || '/',
    label: a.linkLabels[id],
  });

  /** id -> the page the answer should link to. */
  const generalRoutes: [string, string][] = [
    ['area', '/contact'],
    ['estimate', '/contact'],
    ['contact', '/contact'],
    ['spanish', '/contact'],
    ['work-proof', '/gallery'],
    ['process', '/about'],
    ['materials', '/services'],
    ['commercial', '/services'],
    ['cleanup', '/about'],
    ['price', '/contact'],
    ['timeline', '/contact'],
    ['licence', '/contact'],
    ['hours', '/contact'],
    ['reviews', '/gallery'],
    ['scope', '/services'],
  ];

  const overview: Entry = {
    id: 'services-overview',
    keywords: merge('services-overview', enKeywords),
    phrases: mergePhrases('services-overview'),
    answer: a.sevenThings(services.map((s) => s.name.toLowerCase()).join(', ')),
    link: linkFor('services-overview', '/services'),
  };

  const general: Entry[] = generalRoutes.map(([id, path]) => ({
    id,
    keywords: merge(id, enKeywords),
    phrases: mergePhrases(id),
    answer: fill(a.answers[id], v),
    link: linkFor(id, path),
  }));

  return [...serviceEntries, overview, ...general];
}

function normalize(input: string): string {
  return input
    .toLowerCase()
    /* Strip accents so "¿cuánto?" matches "cuanto". */
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Crude singulariser — enough to make "cabinets"/"gabinetes" match. */
function singular(word: string): string {
  if (word.length > 3 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && word.endsWith('es') && !word.endsWith('ses')) {
    return word.slice(0, -2);
  }
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) {
    return word.slice(0, -1);
  }
  return word;
}

function tokenize(normalized: string, locale: Locale): Set<string> {
  const stop = STOP[locale];
  const out = new Set<string>();
  for (const raw of normalized.split(' ')) {
    if (!raw || stop.has(raw)) continue;
    out.add(raw);
    out.add(singular(raw));
  }
  return out;
}

export type MatchResult = {
  answer: string;
  link?: Entry['link'];
  id: string | null;
};

export function match(
  question: string,
  locale: Locale,
  knowledge: Knowledge,
): MatchResult {
  const t = getDict(locale);
  const a = t.assistant;
  const normalized = normalize(question);

  if (!normalized) return { answer: a.greeting, id: 'greeting' };

  const words = normalized.split(' ');
  if (words.length <= 2 && words.every((w) => GREETINGS.has(w))) {
    return { answer: a.greeting, id: 'greeting' };
  }

  const tokens = tokenize(normalized, locale);
  const entries = buildEntries(locale, knowledge);

  let best: Entry | null = null;
  let bestScore = 0;

  for (const entry of entries) {
    let score = 0;
    for (const phrase of entry.phrases) {
      if (phrase && normalized.includes(normalize(phrase))) score += 3;
    }
    for (const keyword of entry.keywords) {
      const k = normalize(keyword);
      if (tokens.has(k) || tokens.has(singular(k))) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (!best || bestScore < 1) {
    return { answer: fill(a.fallback, values(knowledge)), id: null };
  }

  return { answer: best.answer, link: best.link, id: best.id };
}
