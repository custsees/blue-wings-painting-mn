import { revalidatePath } from 'next/cache';
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload';

/**
 * Save in the admin -> new HTML on the public site, with no redeploy.
 *
 * Why `revalidatePath` and not `revalidateTag`: in Next 16 a cache tag is only
 * attachable through `fetch(url, { next: { tags } })` or `cacheTag()` inside a
 * `'use cache'` function. We read content through Payload's Local API, which is
 * a direct database call and never a fetch, and `'use cache'` requires the
 * `cacheComponents` flag that Payload does not yet fully support.
 * `revalidatePath` invalidates the *route* cache instead, so where the data
 * came from is irrelevant. It also sidesteps `revalidateTag(tag)`'s
 * single-argument form being deprecated in 16.
 *
 * Paths are the dynamic route patterns, not resolved URLs. `'/[locale]/gallery'`
 * clears English and Spanish in one call, and — the reason it matters here —
 * it avoids having to reason about middleware.ts rewriting `/` onto `/en`.
 * Revalidating `'/'` would miss, because the cache entry is keyed by the
 * resolved route.
 */

const HOME = '/[locale]';
const GALLERY = '/[locale]/gallery';
const SERVICES = '/[locale]/services';
const ABOUT = '/[locale]/about';
const CONTACT = '/[locale]/contact';

/**
 * Which pages each collection actually appears on. Five pages in two
 * languages is small enough that precision buys nothing — but "revalidate
 * everything" would still be wrong, because it hides which page a given
 * collection is really for.
 */
const PATHS: Record<string, string[]> = {
  // Pairs headline the gallery and the home page's proof strip.
  projects: [GALLERY, HOME],
  finishedWork: [GALLERY],
  // Services list the services page, the home overview, and the quote form's
  // dropdown on contact.
  services: [SERVICES, HOME, CONTACT],
};

/** Phone, email and cities are in the header and footer of every page. */
const ALL_PAGES = [HOME, SERVICES, GALLERY, ABOUT, CONTACT];

/**
 * True for the one failure that is not a failure: revalidatePath needs a Next
 * request context, and the seed script runs as a plain Node process where no
 * such context — and no server to serve a stale page — exists. Logging it
 * would print a stack trace per path per run and teach us to ignore this
 * channel, which is where the real failures will appear.
 */
function isOutsideRequestContext(error: unknown): boolean {
  return (
    error instanceof Error && error.message.includes('static generation store missing')
  );
}

function attempt(run: () => void, what: string): void {
  try {
    run();
  } catch (error) {
    /*
      A failed purge must never fail the save. The row is already committed by
      the time this runs, so throwing here would show the editor an error for a
      write that actually succeeded. Worst case the page serves stale until the
      next deploy.
    */
    if (isOutsideRequestContext(error)) return;
    console.error(`[payload] could not revalidate ${what}:`, error);
  }
}

function purge(paths: string[], label: string): void {
  for (const path of paths) {
    attempt(() => revalidatePath(path, 'page'), `${path} after ${label}`);
  }
}

export const revalidateCollection =
  (collection: keyof typeof PATHS): CollectionAfterChangeHook =>
  ({ doc }) => {
    purge(PATHS[collection] ?? [], `${collection} change`);
    return doc;
  };

export const revalidateCollectionOnDelete =
  (collection: keyof typeof PATHS): CollectionAfterDeleteHook =>
  ({ doc }) => {
    purge(PATHS[collection] ?? [], `${collection} delete`);
    return doc;
  };

/** Business facts touch every page, plus the sitemap and robots. */
export const revalidateBusinessInfo: GlobalAfterChangeHook = ({ doc }) => {
  purge(ALL_PAGES, 'business info change');
  for (const route of ['/sitemap.xml', '/robots.txt']) {
    attempt(() => revalidatePath(route), route);
  }
  return doc;
};
