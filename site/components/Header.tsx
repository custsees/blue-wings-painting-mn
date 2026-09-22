'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getDict, type Locale } from '@/content/i18n';
import type { BusinessView } from '@/cms/content';
import { navKeys, pathFor } from '@/content/site';
import { ThemeToggle } from './Theme';

/*
  This is a client component, so `business` has to be plain serializable data —
  which is why BusinessView carries no helper functions. The SMS link is built
  by callers from business.phone instead.
*/
export default function Header({
  locale,
  business,
}: {
  locale: Locale;
  business: BusinessView;
}) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const t = getDict(locale);

  /*
    The mobile sheet stores the route it was opened on rather than a bare
    boolean. Navigating changes `pathname`, so the sheet closes during render
    instead of via a setState-in-effect (which triggers a cascading render and
    is what react-hooks/set-state-in-effect flags).
  */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn !== null && openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenedOn(null);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const other: Locale = locale === 'en' ? 'es' : 'en';
  /* Same page, other language. Falls back to that language's home. */
  const otherHref =
    navKeys.find((k) => pathFor(k, locale) === pathname) !== undefined
      ? pathFor(
          navKeys.find((k) => pathFor(k, locale) === pathname)!,
          other,
        )
      : pathFor('home', other);

  return (
    <header className={`hdr${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wide hdr-bar">
        <Link
          href={pathFor('home', locale)}
          className="brand"
          aria-label={`${business.nameFull} — ${t.nav.home}`}
        >
          <span className="brand-mark" aria-hidden="true">
            <Image
              src="/img/blue-wings-logo.jpg"
              alt=""
              width={1123}
              height={1123}
              priority
              sizes="76px"
            />
          </span>
          <span className="brand-text">
            <span className="brand-name">Blue Wings</span>
            <span className="brand-sub">Painting MN</span>
          </span>
        </Link>

        <nav className="nav-desktop" aria-label="Primary">
          {navKeys.map((key) => {
            const href = pathFor(key, locale);
            const current = pathname === href;
            return (
              <Link
                key={key}
                href={href}
                className={current ? 'is-current' : undefined}
                aria-current={current ? 'page' : undefined}
              >
                {t.nav[key]}
              </Link>
            );
          })}
        </nav>

        <div className="hdr-cta">
          <a className="hdr-phone" href={business.phoneHref}>
            {business.phone}
          </a>

          <Link className="lang" href={otherHref} hrefLang={other} aria-label={t.switchTo.aria}>
            {t.switchTo.label}
          </Link>

          <ThemeToggle toLight={t.common.themeToLight} toDark={t.common.themeToDark} />

          <Link className="btn hdr-quote" href={pathFor('contact', locale)}>
            {t.common.freeEstimate}
          </Link>

          <button
            type="button"
            className="burger"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            <span className="sr">{open ? t.common.closeMenu : t.common.openMenu}</span>
            <span className={`burger-box${open ? ' is-open' : ''}`} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={`sheet${open ? ' is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile">
          {navKeys.map((key) => {
            const href = pathFor(key, locale);
            const current = pathname === href;
            return (
              <Link
                key={key}
                href={href}
                className={current ? 'is-current' : undefined}
                aria-current={current ? 'page' : undefined}
              >
                {t.nav[key]}
              </Link>
            );
          })}
        </nav>
        <div className="sheet-foot">
          <a className="btn" href={business.phoneHref}>
            {t.common.callPhone(business.phone)}
          </a>
          <p className="sheet-es">{business.spanish}</p>
        </div>
      </div>

      <style jsx>{`
        /*
          The header uses the band tokens, so it is dark in the dark theme and
          light in the light theme. It is opaque rather than translucent: at
          scroll 0 there is no content behind it, so a translucent bar samples
          the page background and washes out against the section below.
        */
        .hdr {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--band);
          color: var(--band-fg);
          border-bottom: 1px solid transparent;
          transition: border-color 0.25s var(--ease);
        }

        .hdr.is-scrolled {
          border-bottom-color: var(--band-line);
        }

        .hdr-bar {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          min-height: 82px;
          /* Without this the brand's second line gets clipped by the edge. */
          padding-block: 0.7rem;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-right: auto;
        }

        /*
          The source is a 1123x1123 square whose lower quarter is the wordmark.
          Rather than ship a second cropped file, the box is set to the wings'
          aspect ratio and object-position trims the wordmark off — lossless,
          and one asset to keep in sync.

          The artwork has a dark ground, so it is given that ground explicitly:
          invisible on the dark theme, a deliberate dark chip on the light one.
        */
        .brand-mark {
          display: block;
          width: 76px;
          height: 55px;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 4px;
          background: var(--logo-ground);
        }

        .brand-mark :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 26%;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .brand-name {
          font-family: var(--font-display), system-ui, sans-serif;
          font-weight: 800;
          font-size: 1.0625rem;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .brand-sub {
          font-size: 0.66rem;
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: 0.17em;
          text-transform: uppercase;
          color: var(--band-fg-dim);
        }

        .nav-desktop {
          display: none;
          gap: 1.75rem;
        }

        /* styled-jsx only scopes DOM elements in this component's own JSX.
           <Link> renders the <a> itself, so '.nav-desktop a' would compile to
           'a.jsx-xxx' and never match. :global() drops that requirement while
           the ancestor keeps the rule confined here. */
        .nav-desktop :global(a) {
          position: relative;
          font-size: 0.94rem;
          font-weight: 600;
          padding-block: 0.4rem;
          color: var(--band-fg-dim);
          transition: color 0.18s var(--ease);
        }

        .nav-desktop :global(a)::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          background: var(--blue);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s var(--ease);
        }

        .nav-desktop :global(a:hover),
        .nav-desktop :global(a.is-current) {
          color: var(--band-fg);
        }

        .nav-desktop :global(a:hover)::after,
        .nav-desktop :global(a.is-current)::after {
          transform: scaleX(1);
        }

        .hdr-cta {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .hdr-phone {
          display: none;
          font-family: var(--font-display), system-ui, sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          margin-right: 0.3rem;
        }

        .hdr-phone:hover {
          color: var(--band-eyebrow);
        }

        .hdr-cta :global(.lang) {
          display: grid;
          place-items: center;
          min-width: 42px;
          height: 42px;
          padding-inline: 0.5rem;
          border: 1px solid var(--band-line);
          border-radius: var(--radius);
          font-family: var(--font-display), system-ui, sans-serif;
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          transition:
            border-color 0.18s var(--ease),
            color 0.18s var(--ease);
        }

        .hdr-cta :global(.lang:hover) {
          border-color: var(--band-fg-dim);
          color: var(--band-eyebrow);
        }

        .hdr-cta :global(.hdr-quote) {
          display: none;
          padding: 0.7rem 1.2rem;
          min-height: 44px;
          font-size: 0.875rem;
        }

        .burger {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          padding: 0;
          background: transparent;
          color: inherit;
          border: 1px solid var(--band-line);
          border-radius: var(--radius);
          cursor: pointer;
        }

        .burger-box {
          display: grid;
          gap: 4px;
          width: 20px;
        }

        .burger-box i {
          display: block;
          height: 2px;
          background: currentColor;
          transition: transform 0.25s var(--ease), opacity 0.2s var(--ease);
        }

        .burger-box.is-open i:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }

        .burger-box.is-open i:nth-child(2) {
          opacity: 0;
        }

        .burger-box.is-open i:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        .sheet {
          border-top: 1px solid var(--band-line);
          background: var(--band);
          color: var(--band-fg);
          padding: 1.25rem 4vw 2rem;
        }

        .sheet nav {
          display: grid;
        }

        .sheet nav :global(a) {
          padding: 0.95rem 0;
          border-bottom: 1px solid var(--band-line);
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 1.45rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .sheet nav :global(a.is-current) {
          color: var(--band-eyebrow);
        }

        .sheet-foot {
          margin-top: 1.5rem;
          display: grid;
          gap: 0.75rem;
          justify-items: start;
        }

        .sheet-es {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--band-fg-dim);
        }

        .sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }

        @media (min-width: 980px) {
          .nav-desktop,
          .hdr-phone {
            display: flex;
          }
          .hdr-cta :global(.hdr-quote) {
            display: inline-flex;
          }
          .burger {
            display: none;
          }
          .sheet {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
