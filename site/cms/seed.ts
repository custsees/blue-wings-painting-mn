/**
 * One-time migration of the hand-written content into Payload.
 *
 * Nothing is retyped. Everything is read out of content/i18n.ts and
 * content/site.ts and written into both locales, so the Spanish that was
 * already written for the Twin Cities Latino homeowner survives verbatim
 * rather than being re-translated into something blander.
 *
 * Safe to re-run: every write is keyed on a natural identifier (slug, or the
 * image filename) and updates in place rather than duplicating.
 *
 *   npm run cms:seed
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { getPayload } from 'payload';
import config from '@payload-config';

import { getDict, locales } from '../content/i18n';
import {
  business,
  finishedWorkImages,
  namedCities,
  projectImages,
  projectSlugs,
  serviceImages,
  serviceSlugs,
} from '../content/site';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(dirname, '../public');

const en = getDict('en');
const es = getDict('es');

/**
 * `object-position` -> Payload focal point.
 *
 * The old values were CSS written by hand for each photo ('center 68%',
 * '38% 55%'). They encode a real judgement — these are phone photos taken
 * months apart, so each half of a pair is nudged independently to make the
 * same surface line up across the reveal — so they are carried over rather
 * than reset to centre.
 */
function focalOf(focus?: string): { focalX: number; focalY: number } {
  if (!focus) return { focalX: 50, focalY: 50 };
  const [rawX, rawY] = focus.trim().split(/\s+/);
  const axis = (token: string | undefined): number => {
    if (!token) return 50;
    if (token === 'center') return 50;
    if (token === 'left' || token === 'top') return 0;
    if (token === 'right' || token === 'bottom') return 100;
    const n = Number.parseFloat(token);
    return Number.isFinite(n) ? n : 50;
  };
  return { focalX: axis(rawX), focalY: axis(rawY) };
}

const payload = await getPayload({ config });

/** Upload a /public image once, reusing it if the seed has already run. */
const mediaCache = new Map<string, number>();

async function mediaFor(src: string, focus?: string): Promise<number> {
  const cached = mediaCache.get(src);
  if (cached) return cached;

  const filename = src.replace(/^\/img\//, '');
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  });

  const focal = focalOf(focus);
  const id =
    existing.docs[0]?.id ??
    (
      await payload.create({
        collection: 'media',
        data: { caption: filename },
        filePath: path.join(publicDir, 'img', filename),
      })
    ).id;

  // Focal point is set separately: it is metadata about the stored file, and
  // on a re-run we want to correct it without re-uploading the image.
  await payload.update({ collection: 'media', id, data: focal });

  mediaCache.set(src, id);
  return id;
}

/** Create-or-update by slug, then write the Spanish over the top. */
async function upsert(
  collection: 'projects' | 'services',
  slug: string,
  english: Record<string, unknown>,
  spanish: Record<string, unknown>,
): Promise<void> {
  const found = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'en',
  });

  const existing = found.docs[0];

  const id = existing
    ? existing.id
    : (
        await payload.create({
          collection,
          locale: 'en',
          data: { ...english, slug, _status: 'published' } as never,
        })
      ).id;

  if (existing) {
    await payload.update({
      collection,
      id,
      locale: 'en',
      data: { ...english, _status: 'published' } as never,
    });
  }

  await payload.update({
    collection,
    id,
    locale: 'es',
    data: { ...spanish, _status: 'published' } as never,
  });
}

/* ---------------------------------------------------------------- projects */

for (const [i, slug] of projectSlugs.entries()) {
  const img = projectImages[slug];
  const before = await mediaFor(img.before.src, img.before.focus);
  const after = await mediaFor(img.after.src, img.after.focus);
  const e = en.gallery.items[slug];
  const s = es.gallery.items[slug];

  await upsert(
    'projects',
    slug,
    {
      sortOrder: i,
      before,
      after,
      title: e.title,
      kind: e.kind,
      summary: e.summary,
      beforeAlt: e.beforeAlt,
      afterAlt: e.afterAlt,
    },
    {
      title: s.title,
      kind: s.kind,
      summary: s.summary,
      beforeAlt: s.beforeAlt,
      afterAlt: s.afterAlt,
    },
  );
  payload.logger.info(`project: ${slug}`);
}

/* ---------------------------------------------------------- finished work */

/*
  Keyed on the image rather than a slug, because these never had one — they
  were an array in site.ts zipped by index against an array in i18n.ts. That
  index-coupling is exactly the bug this collection removes, so the seed reads
  both arrays one last time and never again.
*/
for (const [i, src] of finishedWorkImages.entries()) {
  const image = await mediaFor(src);
  const e = en.gallery.finished[i];
  const s = es.gallery.finished[i];

  const found = await payload.find({
    collection: 'finishedWork',
    where: { image: { equals: image } },
    limit: 1,
  });

  const existing = found.docs[0];
  const data = {
    image,
    sortOrder: i,
    caption: e.caption,
    alt: e.alt,
    _status: 'published',
  };

  const id = existing
    ? existing.id
    : (await payload.create({ collection: 'finishedWork', locale: 'en', data: data as never })).id;

  if (existing) {
    await payload.update({ collection: 'finishedWork', id, locale: 'en', data: data as never });
  }

  await payload.update({
    collection: 'finishedWork',
    id,
    locale: 'es',
    data: { caption: s.caption, alt: s.alt, _status: 'published' } as never,
  });
  payload.logger.info(`finished work: ${src}`);
}

/* ---------------------------------------------------------------- services */

for (const [i, slug] of serviceSlugs.entries()) {
  const e = en.services.items[slug];
  const s = es.services.items[slug];
  const src = serviceImages[slug];
  const image = src ? await mediaFor(src) : undefined;

  await upsert(
    'services',
    slug,
    {
      sortOrder: i,
      ...(image ? { image } : {}),
      name: e.name,
      short: e.short,
      body: e.body,
      detail: e.detail.map((text) => ({ text })),
      ...(e.imageAlt ? { imageAlt: e.imageAlt } : {}),
    },
    {
      name: s.name,
      short: s.short,
      body: s.body,
      detail: s.detail.map((text) => ({ text })),
      ...(s.imageAlt ? { imageAlt: s.imageAlt } : {}),
    },
  );
  payload.logger.info(`service: ${slug}`);
}

/* ----------------------------------------------------------- business info */

/*
  Not localized, matching what content/site.ts already established: a phone
  number reads the same in every language, and city names are proper nouns.
*/
await payload.updateGlobal({
  slug: 'businessInfo',
  data: {
    name: business.name,
    nameFull: business.nameFull,
    phone: business.phone,
    email: business.email,
    facebook: business.facebook,
    spanish: business.spanish,
    domain: business.domain,
    siteUrl: business.siteUrl,
    namedCities: namedCities.map((name) => ({ name })),
  },
});
payload.logger.info('business info set');

/* ------------------------------------------------------------- home page */

/*
  The one piece of page copy the client owns. Seeded per locale so the Spanish
  headline survives as written rather than being re-translated.
*/
for (const [code, dict] of [['en', en], ['es', es]] as const) {
  await payload.updateGlobal({
    slug: 'homePage',
    locale: code,
    data: {
      metaTitle: dict.home.meta.title,
      metaDescription: dict.home.meta.description,
      eyebrow: dict.home.eyebrow,
      h1a: dict.home.h1a,
      h1b: dict.home.h1b,
      h1accent: dict.home.h1accent,
      lede: dict.home.lede,
      valueProps: dict.home.valueProps.map((p) => ({ title: p.title, body: p.body })),
      servicesEyebrow: dict.home.servicesEyebrow,
      servicesTitle: dict.home.servicesTitle,
      proofEyebrow: dict.home.proofEyebrow,
      proofTitle: dict.home.proofTitle,
      proofLede: dict.home.proofLede,
      processEyebrow: dict.home.processEyebrow,
      processTitle: dict.home.processTitle,
      areaEyebrow: dict.home.areaEyebrow,
      areaTitle: dict.home.areaTitle,
      areaLede: dict.home.areaLede,
    },
  });
  payload.logger.info(`home page text set (${code})`);
}

payload.logger.info(`seed complete for locales: ${locales.join(', ')}`);
process.exit(0);
