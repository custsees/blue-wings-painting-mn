'use client';

import { useEffect, useRef, useState } from 'react';
import { getDict, type Locale } from '@/content/i18n';
import { business, serviceSlugs } from '@/content/site';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function QuoteForm({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const f = t.form;
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  /*
    The confirmation replaces a tall form with a short box, so the page
    collapses upward and the "thanks" can end up above the viewport — the
    customer sees their form vanish with no acknowledgement. Move focus to the
    confirmation (which also announces it) and scroll it into view.
  */
  useEffect(() => {
    if (status !== 'sent') return;
    const el = doneRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot: real people leave this empty. Bots fill it.
    if (data.company) {
      setStatus('sent');
      return;
    }

    setStatus('sending');
    setError(null);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? f.genericError);
      }
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : f.genericError);
    }
  }

  if (status === 'sent') {
    return (
      <div className="qf-done" role="status" tabIndex={-1} ref={doneRef}>
        <h3 className="h3">{f.sentTitle}</h3>
        <p>
          {f.sentBody} <a href={business.phoneHref}>{business.phone}</a>.
        </p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setStatus('idle')}
        >
          {f.sendAnother}
        </button>
        <style jsx>{`
          .qf-done {
            display: grid;
            gap: 1rem;
            justify-items: start;
            padding: 2rem;
            border: 2px solid var(--blue);
            border-radius: var(--radius);
            background: var(--blue-wash);
          }
          .qf-done a {
            font-weight: 700;
            color: var(--eyebrow);
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }

  return (
    <form className="qf" onSubmit={onSubmit} noValidate={false}>
      <div className="qf-row">
        <label className="qf-field">
          <span>{f.name}</span>
          <input name="name" type="text" required autoComplete="name" />
        </label>
        <label className="qf-field">
          <span>{f.phone}</span>
          <input name="phone" type="tel" required autoComplete="tel" />
        </label>
      </div>

      <label className="qf-field">
        <span>
          {f.email} <em>{f.optional}</em>
        </span>
        <input name="email" type="email" autoComplete="email" />
      </label>

      <div className="qf-row">
        <label className="qf-field">
          <span>{f.city}</span>
          <input
            name="city"
            type="text"
            required
            autoComplete="address-level2"
            placeholder={f.cityPlaceholder}
          />
        </label>
        <label className="qf-field">
          <span>{f.service}</span>
          <select name="service" required defaultValue="">
            <option value="" disabled>
              {f.chooseOne}
            </option>
            {serviceSlugs.map((slug) => (
              <option key={slug} value={t.services.items[slug].name}>
                {t.services.items[slug].name}
              </option>
            ))}
            <option value={f.somethingElse}>{f.somethingElse}</option>
          </select>
        </label>
      </div>

      <label className="qf-field">
        <span>
          {f.details} <em>{f.optional}</em>
        </span>
        <textarea
          name="details"
          rows={4}
          placeholder={f.detailsPlaceholder}
        />
      </label>

      {/* Honeypot — visually hidden, not display:none, so bots still see it. */}
      <div className="qf-hp" aria-hidden="true">
        <label>
          {f.company}
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="qf-actions">
        <button className="btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? f.sending : f.submit}
        </button>
        <a className="btn btn-ghost" href={business.phoneHref}>
          {f.orCall(business.phone)}
        </a>
      </div>

      {status === 'error' && (
        <p className="qf-error" role="alert">
          {error}
          {f.errorSuffix(business.phone, business.email)}
        </p>
      )}

      <p className="qf-note">{f.note}</p>

      <style jsx>{`
        .qf {
          display: grid;
          gap: 1.1rem;
        }

        .qf-row {
          display: grid;
          gap: 1.1rem;
        }

        .qf-field {
          display: grid;
          gap: 0.4rem;
        }

        .qf-field span {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .qf-field em {
          font-style: normal;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: none;
          opacity: 0.55;
        }

        .qf-field input,
        .qf-field select,
        .qf-field textarea {
          width: 100%;
          padding: 0.85rem 0.9rem;
          min-height: 50px;
          background: var(--input-bg);
          border: 1.5px solid var(--paper-dim);
          border-radius: var(--radius);
          transition: border-color 0.18s var(--ease);
        }

        .qf-field textarea {
          resize: vertical;
          min-height: 120px;
        }

        .qf-field input:hover,
        .qf-field select:hover,
        .qf-field textarea:hover {
          border-color: var(--text-dim);
        }

        .qf-field input:focus,
        .qf-field select:focus,
        .qf-field textarea:focus {
          border-color: var(--blue);
        }

        .qf-hp {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }

        .qf-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 0.35rem;
        }

        .qf-actions :global(.btn:disabled) {
          opacity: 0.6;
          cursor: progress;
        }

        .qf-error {
          padding: 0.9rem 1rem;
          border-left: 3px solid #b3261e;
          background: color-mix(in srgb, #b3261e 8%, var(--paper));
          font-size: 0.92rem;
        }

        .qf-error a {
          font-weight: 700;
          text-decoration: underline;
        }

        .qf-note {
          font-size: 0.85rem;
          color: var(--text-dim);
        }

        @media (min-width: 640px) {
          .qf-row {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </form>
  );
}
