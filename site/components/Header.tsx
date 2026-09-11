'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { business, nav } from '@/content/site';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
    // setOpenedOn (the state setter) rather than the setOpen wrapper, which is
    // recreated every render and would have to be a dependency.
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

  return (
    <header className={`hdr${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wide hdr-bar">
        <Link href="/" className="brand" aria-label={`${business.nameFull} — home`}>
          <Image
            src="/img/blue-wings-logo.png"
            alt=""
            width={44}
            height={44}
            priority
          />
          <span className="brand-text">
            <span className="brand-name">Blue Wings</span>
            <span className="brand-sub">Painting MN</span>
          </span>
        </Link>

        <nav className="nav-desktop" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'is-current' : undefined}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hdr-cta">
          <a className="hdr-phone" href={business.phoneHref}>
            {business.phone}
          </a>
          <Link className="btn hdr-quote" href="/contact">
            Free estimate
          </Link>
          <button
            type="button"
            className="burger"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            <span className="sr">{open ? 'Close menu' : 'Open menu'}</span>
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
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'is-current' : undefined}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sheet-foot">
          <a className="btn" href={business.phoneHref}>
            Call {business.phone}
          </a>
          <p className="sheet-es">{business.spanish}</p>
        </div>
      </div>

      <style jsx>{`
        .hdr {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgb(251 250 247 / 82%);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid transparent;
          transition:
            border-color 0.25s var(--ease),
            background-color 0.25s var(--ease);
        }

        .hdr.is-scrolled {
          border-bottom-color: var(--paper-dim);
          background: rgb(251 250 247 / 94%);
        }

        .hdr-bar {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          min-height: 82px;
          /* Without this the brand's second line ("PAINTING MN") gets clipped
             by the header's bottom edge. */
          padding-block: 0.7rem;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-right: auto;
        }

        /* The supplied logo is a circular badge on an opaque white square (no
           alpha channel). Clipping to a circle drops the corners without
           resampling or keying, so it sits on any background. Replace with a
           transparent source if Jessica sends one. */
        .brand :global(img) {
          border-radius: 50%;
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
          color: var(--text-dim);
        }

        .nav-desktop {
          display: none;
          gap: 1.75rem;
        }

        .nav-desktop a {
          position: relative;
          font-size: 0.94rem;
          font-weight: 600;
          padding-block: 0.4rem;
          color: var(--text-dim);
          transition: color 0.18s var(--ease);
        }

        .nav-desktop a::after {
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

        .nav-desktop a:hover,
        .nav-desktop a.is-current {
          color: var(--text);
        }

        .nav-desktop a:hover::after,
        .nav-desktop a.is-current::after {
          transform: scaleX(1);
        }

        .hdr-cta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .hdr-phone {
          display: none;
          font-family: var(--font-display), system-ui, sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .hdr-phone:hover {
          color: var(--blue-deep);
        }

        .hdr-quote {
          display: none;
          padding: 0.7rem 1.2rem;
          min-height: 44px;
          font-size: 0.875rem;
        }

        .burger {
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          padding: 0;
          background: transparent;
          border: 1px solid var(--paper-dim);
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
          background: var(--text);
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
          border-top: 1px solid var(--paper-dim);
          background: var(--paper);
          padding: 1.25rem 4vw 2rem;
        }

        .sheet nav {
          display: grid;
        }

        .sheet nav a {
          padding: 0.95rem 0;
          border-bottom: 1px solid var(--paper-warm);
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 1.45rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .sheet nav a.is-current {
          color: var(--blue-deep);
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
          color: var(--text-dim);
        }

        .sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }

        @media (min-width: 900px) {
          .nav-desktop,
          .hdr-phone,
          .hdr-quote {
            display: flex;
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
