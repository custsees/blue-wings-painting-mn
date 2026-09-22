'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import type { BusinessView, ServiceView } from '@/cms/content';
import { getDict, type Locale } from '@/content/i18n';
import { navKeys, pathFor } from '@/content/site';
import { match } from './assistant-match';

type Message = {
  id: number;
  role: 'user' | 'bot';
  text: string;
  link?: { href: string; label: string };
};

let nextId = 0;

export default function Assistant({
  locale,
  business,
  services,
}: {
  locale: Locale;
  business: BusinessView;
  services: ServiceView[];
}) {
  const pathname = usePathname();
  const t = getDict(locale);
  const a = t.assistant;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');

  const panelId = useId();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Starter questions follow the page the visitor is actually on.
  const navKey = navKeys.find((k) => pathFor(k, locale) === pathname) ?? 'home';
  const suggestions = a.suggestions[navKey];

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Keep the newest message in view as the thread grows.
  useEffect(() => {
    if (!open) return;
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  function ask(question: string) {
    const text = question.trim();
    if (!text) return;
    const result = match(text, locale, { services, business });
    setMessages((prev) => [
      ...prev,
      { id: nextId++, role: 'user', text },
      { id: nextId++, role: 'bot', text: result.answer, link: result.link },
    ]);
    setDraft('');
  }

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className={`launcher${open ? ' is-open' : ''}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="launcher-icon" aria-hidden="true">
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="m5 5 10 10M15 5 5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 5.5A1.5 1.5 0 0 1 4.5 4h11A1.5 1.5 0 0 1 17 5.5v7a1.5 1.5 0 0 1-1.5 1.5H9l-4 3v-3h-.5A1.5 1.5 0 0 1 3 12.5z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span className="launcher-label">
          {open ? a.close : a.launcher}
        </span>
      </button>

      <div
        id={panelId}
        className={`panel${open ? ' is-open' : ''}`}
        role="dialog"
        aria-label={a.panelTitle}
        hidden={!open}
      >
        <header className="panel-head">
          <div>
            <p className="panel-title">{a.panelTitle}</p>
            <p className="panel-sub">{a.panelSub}</p>
          </div>
          <button
            type="button"
            className="panel-close"
            onClick={() => {
              setOpen(false);
              launcherRef.current?.focus();
            }}
          >
            <span className="sr">{a.close}</span>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="m5 5 10 10M15 5 5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="log" ref={logRef} aria-live="polite">
          <p className="bubble bot">{a.greeting}</p>

          {messages.map((m) => (
            <div key={m.id} className={`row ${m.role}`}>
              <p className={`bubble ${m.role}`}>{m.text}</p>
              {m.link && (
                <Link
                  className="bubble-link"
                  href={m.link.href}
                  onClick={() => setOpen(false)}
                >
                  {m.link.label} →
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="chips">
          {suggestions.map((s) => (
            <button key={s} type="button" className="chip" onClick={() => ask(s)}>
              {s}
            </button>
          ))}
        </div>

        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault();
            ask(draft);
          }}
        >
          <label className="sr" htmlFor={`${panelId}-input`}>
            {a.inputLabel}
          </label>
          <input
            id={`${panelId}-input`}
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={a.placeholder}
            autoComplete="off"
          />
          <button type="submit" className="send" disabled={!draft.trim()}>
            <span className="sr">{a.send}</span>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M3 10h12M10 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>

        <p className="panel-foot">
          {a.ratherTalk}{' '}
          <a href={business.phoneHref}>{business.phone}</a>
        </p>
      </div>

      <style jsx>{`
        .launcher {
          position: fixed;
          right: max(1rem, 3vw);
          bottom: max(1rem, 3vw);
          z-index: 60;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.15rem;
          min-height: 50px;
          background: var(--blue);
          color: #fff;
          border: 2px solid var(--blue);
          border-radius: 999px;
          font-family: var(--font-display), system-ui, sans-serif;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          box-shadow: 0 6px 22px rgb(10 11 16 / 22%);
          transition:
            background-color 0.18s var(--ease),
            transform 0.18s var(--ease);
        }

        .launcher:hover {
          background: var(--blue-deep);
          border-color: var(--blue-deep);
          transform: translateY(-2px);
        }

        .launcher-icon {
          display: grid;
          place-items: center;
        }

        .panel {
          position: fixed;
          right: max(1rem, 3vw);
          bottom: calc(max(1rem, 3vw) + 62px);
          z-index: 60;
          width: min(380px, calc(100vw - 2rem));
          max-height: min(620px, calc(100vh - 8rem));
          display: flex;
          flex-direction: column;
          background: var(--paper);
          border: 1px solid var(--paper-dim);
          border-radius: 6px;
          box-shadow: 0 18px 50px rgb(10 11 16 / 26%);
          overflow: hidden;
        }

        .panel-head {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem 1.1rem;
          background: var(--band);
          color: var(--band-fg);
          border-bottom: 1px solid var(--band-line);
        }

        .panel-title {
          font-family: var(--font-display), system-ui, sans-serif;
          font-weight: 700;
          font-size: 0.98rem;
        }

        .panel-sub {
          margin-top: 0.2rem;
          font-size: 0.76rem;
          color: var(--band-fg-dim);
        }

        .panel-close {
          margin-left: auto;
          display: grid;
          place-items: center;
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          background: transparent;
          color: inherit;
          border: 1px solid var(--band-line);
          border-radius: 4px;
          cursor: pointer;
        }

        .panel-close:hover {
          border-color: var(--band-fg-dim);
        }

        .log {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.1rem;
          display: grid;
          gap: 0.7rem;
          align-content: start;
        }

        .row {
          display: grid;
          gap: 0.35rem;
          justify-items: start;
        }

        .row.user {
          justify-items: end;
        }

        .bubble {
          max-width: 92%;
          padding: 0.65rem 0.85rem;
          border-radius: 10px;
          font-size: 0.9rem;
          line-height: 1.5;
          white-space: pre-line;
        }

        .bubble.bot {
          background: var(--paper-warm);
          border-bottom-left-radius: 2px;
        }

        .bubble.user {
          background: var(--blue);
          color: #fff;
          border-bottom-right-radius: 2px;
        }

        .row :global(.bubble-link) {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--eyebrow);
          border-bottom: 2px solid currentColor;
          padding-bottom: 1px;
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding: 0 1.1rem 0.75rem;
        }

        .chip {
          padding: 0.4rem 0.7rem;
          background: transparent;
          border: 1px solid var(--paper-dim);
          border-radius: 999px;
          font-size: 0.78rem;
          cursor: pointer;
          transition:
            border-color 0.18s var(--ease),
            background-color 0.18s var(--ease);
        }

        .chip:hover {
          border-color: var(--blue);
          background: var(--blue-wash);
        }

        .composer {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem 1.1rem;
          border-top: 1px solid var(--paper-dim);
        }

        .composer input {
          flex: 1;
          min-width: 0;
          padding: 0.6rem 0.7rem;
          min-height: 42px;
          background: var(--input-bg);
          border: 1.5px solid var(--paper-dim);
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .composer input:focus {
          border-color: var(--blue);
        }

        .send {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          background: var(--blue);
          color: #fff;
          border: 0;
          border-radius: 4px;
          cursor: pointer;
        }

        .send:disabled {
          opacity: 0.45;
          cursor: default;
        }

        .panel-foot {
          padding: 0 1.1rem 0.9rem;
          font-size: 0.78rem;
          color: var(--text-dim);
        }

        .panel-foot a {
          font-weight: 700;
          color: var(--eyebrow);
          text-decoration: underline;
        }

        .sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }

        /* On a phone the label eats the screen; the icon carries it instead. */
        @media (max-width: 560px) {
          .launcher-label {
            display: none;
          }

          .launcher {
            width: 52px;
            height: 52px;
            padding: 0;
            justify-content: center;
            border-radius: 50%;
          }

          .panel {
            left: 1rem;
            right: 1rem;
            width: auto;
            bottom: calc(max(1rem, 3vw) + 64px);
          }
        }
      `}</style>
    </>
  );
}
