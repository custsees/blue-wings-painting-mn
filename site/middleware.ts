import { NextResponse, type NextRequest } from 'next/server';

/**
 * English is the primary language and is served at the site root — no /en
 * prefix and no redirect hop on the homepage the client will be sharing.
 * Routes live under app/[locale]/ so the layout can set <html lang> correctly
 * and the pages stay statically generated; this maps the bare paths onto the
 * English locale internally. Spanish keeps its visible /es prefix.
 *
 * Why this is middleware and not a rewrite in next.config.ts, where it started:
 * on Vercel, a client-side navigation to "/" asks for the React payload of the
 * page (an RSC request) and got back the full HTML document instead — the
 * rewrite resolved to the prerendered /en HTML without honouring the RSC
 * negotiation. The router cannot read HTML as a payload, so it gave up and
 * rendered not-found. Clicking "EN" on a Spanish page, or "Home" from an
 * English page, landed on a 404 while typing the same URL worked perfectly.
 * Middleware rewrites before that resolution happens, so the RSC variant is
 * served. The other four paths never broke, but they run through the same
 * mechanism to keep this in one place.
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? '/en' : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

/*
  Next reads this matcher at build time by static analysis, so it has to be a
  literal — a shared constant here is silently ignored and the middleware then
  runs on every request in the site.
*/
export const config = {
  matcher: ['/', '/services', '/gallery', '/about', '/contact'],
};
