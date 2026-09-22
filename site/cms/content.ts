import { getPayload } from 'payload';
import config from '@payload-config';

import type { Locale } from '@/content/i18n';
import type { Media, Service } from './payload-types';
import { objectPositionOf } from './focal';
import { emailHrefOf, phoneHrefOf, smsHrefOf } from './contact';

/**
 * Reading CMS content for the public pages.
 *
 * These return the same shapes the pages already consumed from
 * content/site.ts and content/i18n.ts, so the page components barely change.
 * The difference is structural: a project now arrives as one object carrying
 * its photos AND its copy, instead of being assembled at render time from
 * three separate structures keyed by slug and array index. The old gallery did
 * `finishedWorkImages[i]` against `t.gallery.finished[i]`, which threw the
 * moment the two arrays disagreed on length — the exact failure a client
 * "add a photo" button would have caused.
 *
 * Everything here goes through Payload's Local API, which is a direct database
 * query inside the same process — no HTTP hop, so it costs about what reading
 * the old TypeScript files cost, and the pages stay statically prerendered.
 */

async function client() {
  return getPayload({ config });
}

/** Published only. Drafts are the client's work-in-progress, not the site. */
const PUBLISHED = { _status: { equals: 'published' } } as const;

type Img = { src: string; alt: string; focus: string };

/**
 * A media relation is `number | Media` depending on query depth. We always
 * query with depth 1, so this narrows it and fails loudly rather than
 * rendering a broken image if that ever changes.
 */
function imageOf(value: number | Media | null | undefined, alt: string): Img | null {
  if (!value || typeof value === 'number') return null;
  if (!value.url) return null;
  return { src: value.url, alt, focus: objectPositionOf(value) };
}

export type ProjectView = {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  before: Img;
  after: Img;
};

export async function getProjects(locale: Locale): Promise<ProjectView[]> {
  const payload = await client();
  const { docs } = await payload.find({
    collection: 'projects',
    locale,
    depth: 1,
    limit: 100,
    sort: 'sortOrder',
    where: PUBLISHED,
  });

  return docs.flatMap((doc) => {
    const before = imageOf(doc.before, doc.beforeAlt);
    const after = imageOf(doc.after, doc.afterAlt);
    // A pair with a missing half is not a pair. Skipping it keeps the promise
    // the gallery makes — every reveal is the same job photographed twice.
    if (!before || !after) return [];
    return [{
      slug: doc.slug,
      title: doc.title,
      kind: doc.kind,
      summary: doc.summary,
      before,
      after,
    }];
  });
}

export type FinishedWorkView = { id: number; image: Img; caption: string };

export async function getFinishedWork(locale: Locale): Promise<FinishedWorkView[]> {
  const payload = await client();
  const { docs } = await payload.find({
    collection: 'finishedWork',
    locale,
    depth: 1,
    limit: 100,
    sort: 'sortOrder',
    where: PUBLISHED,
  });

  return docs.flatMap((doc) => {
    const image = imageOf(doc.image, doc.alt);
    if (!image) return [];
    return [{ id: doc.id, image, caption: doc.caption }];
  });
}

export type ServiceView = {
  slug: string;
  name: string;
  short: string;
  body: string;
  detail: string[];
  image: Img | null;
  extraKeywords: string[];
};

function serviceView(doc: Service): ServiceView {
  return {
    slug: doc.slug,
    name: doc.name,
    short: doc.short,
    body: doc.body,
    detail: (doc.detail ?? []).map((d) => d.text),
    image: imageOf(doc.image, doc.imageAlt ?? doc.name),
    extraKeywords: (doc.extraKeywords ?? '')
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean),
  };
}

export async function getServices(locale: Locale): Promise<ServiceView[]> {
  const payload = await client();
  const { docs } = await payload.find({
    collection: 'services',
    locale,
    depth: 1,
    limit: 100,
    sort: 'sortOrder',
    where: PUBLISHED,
  });
  return docs.map(serviceView);
}

export type BusinessView = {
  name: string;
  nameFull: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  facebook: string | null;
  spanish: string;
  domain: string;
  siteUrl: string;
  cities: string[];
  smsHref: (body: string) => string;
};

/**
 * The facts, with every link derived rather than stored.
 *
 * `phoneHref` and `smsHref` are computed from `phone` on purpose. The number
 * previously appeared in four places — two of them invisible from any admin
 * panel — so storing the links would have reintroduced exactly the drift this
 * is meant to remove.
 */
export async function getBusiness(): Promise<BusinessView> {
  const payload = await client();
  const info = await payload.findGlobal({ slug: 'businessInfo' });

  return {
    name: info.name,
    nameFull: info.nameFull,
    phone: info.phone,
    phoneHref: phoneHrefOf(info.phone),
    email: info.email,
    emailHref: emailHrefOf(info.email),
    facebook: info.facebook ?? null,
    spanish: info.spanish,
    domain: info.domain,
    siteUrl: info.siteUrl,
    cities: (info.namedCities ?? []).map((c) => c.name),
    smsHref: (body: string) => smsHrefOf(info.phone, body),
  };
}
