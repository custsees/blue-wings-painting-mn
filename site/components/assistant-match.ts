import { entries, fallback, greeting, type AssistantEntry } from '@/content/assistant';

/**
 * Retrieval for the site assistant.
 *
 * Scores the question against each knowledge-base entry and returns the best
 * one, or a fallback that hands over the phone number. No model, no network,
 * no chance of inventing a price.
 */

const STOP = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'do', 'does', 'did',
  'you', 'your', 'yours', 'i', 'me', 'my', 'we', 'our', 'us', 'they', 'them',
  'can', 'could', 'would', 'should', 'will', 'what', 'which', 'who', 'whom',
  'that', 'this', 'these', 'those', 'of', 'for', 'to', 'in', 'on', 'at', 'by',
  'and', 'or', 'but', 'if', 'with', 'about', 'it', 'its', 'please', 'there',
  'any', 'have', 'has', 'had', 'get', 'got', 'need', 'want', 'like', 'also',
  'some', 'from', 'as', 'so', 'just', 'tell', 'know', 'guys', 'hey',
]);

const GREETINGS = new Set([
  'hi', 'hello', 'hey', 'yo', 'hola', 'howdy', 'greetings', 'sup',
]);

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Crude singulariser — enough to make "cabinets" match "cabinet". */
function singular(word: string): string {
  if (word.length > 3 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 3 && word.endsWith('es') && !word.endsWith('ses')) {
    return word.slice(0, -2);
  }
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) {
    return word.slice(0, -1);
  }
  return word;
}

function tokenize(normalized: string): Set<string> {
  const out = new Set<string>();
  for (const raw of normalized.split(' ')) {
    if (!raw || STOP.has(raw)) continue;
    out.add(raw);
    out.add(singular(raw));
  }
  return out;
}

export type MatchResult = {
  answer: string;
  link?: AssistantEntry['link'];
  /** Matched entry id, or null when the fallback was used. */
  id: string | null;
};

export function match(question: string): MatchResult {
  const normalized = normalize(question);

  if (!normalized) return { answer: greeting, id: 'greeting' };

  // A bare greeting gets the intro rather than a keyword match on "hi".
  const words = normalized.split(' ');
  if (words.length <= 2 && words.every((w) => GREETINGS.has(w))) {
    return { answer: greeting, id: 'greeting' };
  }

  const tokens = tokenize(normalized);

  let best: AssistantEntry | null = null;
  let bestScore = 0;

  for (const entry of entries) {
    let score = 0;

    for (const phrase of entry.phrases ?? []) {
      if (normalized.includes(phrase)) score += 3;
    }

    for (const keyword of entry.keywords) {
      if (tokens.has(keyword) || tokens.has(singular(keyword))) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (!best || bestScore < 1) return { answer: fallback, id: null };

  return { answer: best.answer, link: best.link, id: best.id };
}
