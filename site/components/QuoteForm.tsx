'use client';

import { useEffect, useRef, useState } from 'react';
import { business, services } from '@/content/site';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function QuoteForm() {
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
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? 'Something went wrong.');
      }
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="qf-done" role="status" tabIndex={-1} ref={doneRef}>
        <h3 className="h3">Thanks — we have your request.</h3>
        <p>
          We&apos;ll be in touch about your estimate. If it&apos;s urgent, call{' '}
          <a href={business.phoneHref}>{business.phone}</a>.
        </p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setStatus('idle')}
        >
          Send another
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
            color: var(--blue-deep);
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
          <span>Name</span>
          <input name="name" type="text" required autoComplete="name" />
        </label>
        <label className="qf-field">
          <span>Phone</span>
          <input name="phone" type="tel" required autoComplete="tel" />
        </label>
      </div>

      <label className="qf-field">
        <span>
          Email <em>optional</em>
        </span>
        <input name="email" type="email" autoComplete="email" />
      </label>

      <div className="qf-row">
        <label className="qf-field">
          <span>City</span>
          <input
            name="city"
            type="text"
            required
            autoComplete="address-level2"
            placeholder="Brooklyn Center"
          />
        </label>
        <label className="qf-field">
          <span>What needs painting?</span>
          <select name="service" required defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Something else">Something else</option>
          </select>
        </label>
      </div>

      <label className="qf-field">
        <span>
          Tell us about the job <em>optional</em>
        </span>
        <textarea
          name="details"
          rows={4}
          placeholder="Rooms, square footage, current condition, when you'd like it done."
        />
      </label>

      {/* Honeypot — visually hidden, not display:none, so bots still see it. */}
      <div className="qf-hp" aria-hidden="true">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="qf-actions">
        <button className="btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Request my free estimate'}
        </button>
        <a className="btn btn-ghost" href={business.phoneHref}>
          Or call {business.phone}
        </a>
      </div>

      {status === 'error' && (
        <p className="qf-error" role="alert">
          {error} You can also call{' '}
          <a href={business.phoneHref}>{business.phone}</a> or email{' '}
          <a href={business.emailHref}>{business.email}</a>.
        </p>
      )}

      <p className="qf-note">
        Free estimates. {business.spanish}.
      </p>

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
          background: #fff;
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
          border-color: #b4aea1;
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
          background: #fdf0ef;
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
