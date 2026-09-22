'use client';

import { useEffect, useRef, useState } from 'react';
import type { BusinessView } from '@/cms/content';
import { fill, getDict, type Locale } from '@/content/i18n';

type Status = 'idle' | 'sending' | 'sent';

type Props = {
  locale: Locale;
  /* Plain data: this is a client component, so no helper functions. */
  business: BusinessView;
  /* Service names in this locale, in display order, for the dropdown. */
  serviceNames: string[];
  /**
   * True when the server can send the estimate itself (RESEND_API_KEY is set).
   * It changes what the visitor is asked to do, so it is decided on the server
   * at render time rather than guessed in the browser.
   */
  serverSend?: boolean;
};

export default function QuoteForm({
  locale,
  business,
  serviceNames,
  serverSend = false,
}: Props) {
  const t = getDict(locale);
  const f = t.form;
  const [status, setStatus] = useState<Status>('idle');
  const [delivered, setDelivered] = useState(false);
  const [mailHref, setMailHref] = useState('');
  const [gmailHref, setGmailHref] = useState('');
  const doneRef = useRef<HTMLDivElement>(null);

  /**
   * The estimate as a labelled plain-text message: one line per field, em dash
   * for anything left blank.
   *
   * The visitor's language goes in the body on purpose — it tells Jessica
   * which language to reply in, which matters on a site that advertises
   * "Hablamos Español".
   */
  function buildMessage(data: Record<string, FormDataEntryValue>) {
    const L = f.emailLabels;
    const val = (k: string) => {
      const v = String(data[k] ?? '').trim();
      return v || '—';
    };
    const body = [
      `${L.name}: ${val('name')}`,
      `${L.phone}: ${val('phone')}`,
      `${L.email}: ${val('email')}`,
      `${L.city}: ${val('city')}`,
      `${L.service}: ${val('service')}`,
      '',
      `${L.details}:`,
      val('details'),
      '',
      `${L.language}: ${f.emailLanguageValue}`,
    ].join('\n');

    return { subject: f.emailSubject(val('service'), val('city')), body };
  }

  function mailtoHref(subject: string, body: string) {
    return `mailto:${business.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  /**
   * Gmail's web compose window. The reason it is offered at all: mailto: opens
   * nothing whatsoever on a machine with no mail app configured, which is most
   * desktops now. This is just a web page, so it always opens.
   */
  function gmailComposeHref(subject: string, body: string) {
    const q = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: business.email,
      su: subject,
      body,
    });
    return `https://mail.google.com/mail/?${q.toString()}`;
  }

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
      setDelivered(true);
      setStatus('sent');
      return;
    }

    setStatus('sending');

    const { subject, body } = buildMessage(data);
    setMailHref(mailtoHref(subject, body));
    setGmailHref(gmailComposeHref(subject, body));

    /*
      Nothing here tries to open the visitor's mail app on their behalf.
      A mailto: launched from script is refused the moment the click's
      transient activation is gone, and opens nothing at all on a machine
      with no mail app configured — in both cases silently, which reads as a
      button that does nothing. The confirmation hands them two real links
      instead, and their own click on one of those always counts.
    */
    let emailed = false;
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });
      const json: unknown = await res.json().catch(() => null);
      emailed =
        res.ok &&
        typeof json === 'object' &&
        json !== null &&
        (json as { emailed?: boolean }).emailed === true;
    } catch {
      // Offline, blocked, server down. The hand-off below still delivers it.
      emailed = false;
    }

    setDelivered(emailed);
    setStatus('sent');
    form.reset();
  }

  if (status === 'sent') {
    return (
      <div className="qf-done" role="status" tabIndex={-1} ref={doneRef}>
        <h3 className="h3">{delivered ? f.deliveredTitle : f.sentTitle}</h3>
        <p>{delivered ? f.deliveredBody : f.sentBody}</p>

        <div className="qf-done-actions">
          {!delivered && (
            <>
              <a className="btn" href={mailHref}>
                {f.openEmail}
              </a>
              <a
                className="btn btn-ghost"
                href={gmailHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {f.openGmail}
              </a>
            </>
          )}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setStatus('idle')}
          >
            {f.sendAnother}
          </button>
        </div>

        {!delivered && (
          <p className="qf-done-fallback">
            {fill(f.sentFallback, {
              phone: business.phone,
              email: business.email,
            })}
          </p>
        )}

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
          .qf-done-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          /* Scoped away from .btn, which lives in .qf-done-actions. */
          .qf-done-fallback {
            font-size: 0.88rem;
            color: var(--text-dim);
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
            {serviceNames.map((name) => (
              <option key={name} value={name}>
                {name}
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

      <p className="qf-note">{f.note}</p>
      {!serverSend && <p className="qf-note">{f.mailNote}</p>}

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
