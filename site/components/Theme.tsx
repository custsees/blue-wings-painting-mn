'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const KEY = 'bw-theme';

/**
 * Runs before first paint, in <head>, so the page never flashes the wrong
 * theme. Deliberately does NOT read prefers-color-scheme: the client asked for
 * light on load, so light is the default and dark is an explicit opt-in that
 * we then remember.
 */
export const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('${KEY}');
    if (t === 'dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.setAttribute('data-theme','light');
  } catch (e) {
    document.documentElement.setAttribute('data-theme','light');
  }
})();
`;

/*
  The theme lives on <html>, written by the inline script above before React
  ever runs. That makes it an external store, so it is read with
  useSyncExternalStore rather than copied into state inside an effect: no
  cascading render, no hydration mismatch (the server snapshot is always
  'light'), and the button stays correct even if something else flips the
  attribute.
*/
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
}

const getServerSnapshot = (): Theme => 'light';

export function ThemeToggle({
  toLight,
  toDark,
}: {
  toLight: string;
  toDark: string;
}) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Theme =
      document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'light'
        : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode — the choice just won't persist */
    }
  }, []);

  const isDark = theme === 'dark';
  const label = isDark ? toLight : toDark;

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      title={label}
      aria-label={label}
    >
      <span aria-hidden="true">
        {isDark ? (
          /* currently dark → offer sun */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M12 2.5v2.2M12 19.3v2.2M4.2 12H2M22 12h-2.2M5.6 5.6 4.1 4.1M19.9 19.9l-1.5-1.5M18.4 5.6l1.5-1.5M4.1 19.9l1.5-1.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          /* currently light → offer moon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 13.4A8.2 8.2 0 0 1 10.6 4a8.4 8.4 0 1 0 9.4 9.4z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <style jsx>{`
        .theme-toggle {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          padding: 0;
          background: transparent;
          color: inherit;
          border: 1px solid var(--band-line);
          border-radius: var(--radius);
          cursor: pointer;
          transition:
            background-color 0.18s var(--ease),
            border-color 0.18s var(--ease);
        }

        .theme-toggle:hover {
          border-color: var(--band-fg-dim);
        }
      `}</style>
    </button>
  );
}
