'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Scroll-reveal, done as progressive enhancement.
 *
 * The CSS that hides `.reveal` elements is scoped to `[data-reveal-armed]`,
 * which only this component sets. So if JS never runs — or fails — every
 * section is visible with no transition rather than blank. Same reason the
 * observer is skipped entirely under prefers-reduced-motion.
 */
export default function RevealController() {
  // This component lives in the layout, so it survives client-side navigation.
  // Re-running on pathname change is what makes the next page's .reveal
  // elements get observed instead of staying hidden forever.
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    const root = document.documentElement;
    root.setAttribute('data-reveal-armed', '');

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          // Stagger siblings so a grid resolves as a wave, not a flash.
          const delay = Number(el.dataset.revealDelay ?? 0);
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('is-in');
          io.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    const els = document.querySelectorAll<HTMLElement>('.reveal');
    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      root.removeAttribute('data-reveal-armed');
    };
  }, [pathname]);

  return null;
}
