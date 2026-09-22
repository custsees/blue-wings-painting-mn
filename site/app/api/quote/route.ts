import { NextResponse } from 'next/server';
import { getDict, locales, type Locale } from '@/content/i18n';
import { getBusiness } from '@/cms/content';

export const runtime = 'nodejs';

type QuoteBody = {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  service?: string;
  details?: string;
  company?: string;
  locale?: string;
};

type Lead = {
  name: string;
  phone: string;
  email: string;
  city: string;
  service: string;
  details: string;
  locale: Locale;
  submittedAt: string;
};

const MAX = { name: 120, phone: 40, email: 200, city: 120, service: 120, details: 4000 };

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Sends the lead to Jessica's inbox.
 *
 * Returns true only when the provider actually accepted it. Without
 * RESEND_API_KEY this does nothing and returns false, and the form falls back
 * to handing the visitor a pre-filled email to send themselves — so the site
 * works before the key exists and gets better the moment it does.
 */
async function emailLead(lead: Lead): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  /*
    Falls back to whatever address is in the CMS, so changing it there also
    changes where estimates land. QUOTE_TO_EMAIL still wins, for routing leads
    somewhere else without touching the site's published address.
  */
  const to = process.env.QUOTE_TO_EMAIL || (await getBusiness()).email;
  /*
    onboarding@resend.dev is Resend's shared sender: it works the minute the
    key exists, with no DNS. Once bluewingspaintingmn.com is verified, set
    QUOTE_FROM_EMAIL to an address on it so the mail is signed as hers and
    stops landing in spam.
  */
  const from = process.env.QUOTE_FROM_EMAIL || 'Blue Wings Website <onboarding@resend.dev>';

  const t = getDict(lead.locale).form;
  const L = t.emailLabels;
  const rows: [string, string][] = [
    [L.name, lead.name],
    [L.phone, lead.phone],
    [L.email, lead.email || '—'],
    [L.city, lead.city],
    [L.service, lead.service],
    [L.details, lead.details || '—'],
    [L.language, t.emailLanguageValue],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  const html = `<table style="font:15px/1.6 system-ui,sans-serif;border-collapse:collapse">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 14px 4px 0;color:#555;white-space:nowrap;vertical-align:top"><strong>${escapeHtml(
          label,
        )}</strong></td><td style="padding:4px 0">${escapeHtml(value).replace(
          /\n/g,
          '<br>',
        )}</td></tr>`,
    )
    .join('')}</table>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: t.emailSubject(lead.service, lead.city),
        text,
        html,
        // So hitting reply in her inbox writes to the customer, not to us.
        ...(lead.email ? { reply_to: lead.email } : {}),
      }),
    });

    if (!res.ok) {
      console.error('[quote] email send failed', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('[quote] email send threw', err);
    return false;
  }
}

/**
 * Quote submissions.
 *
 * Both side effects are optional and independent. Storage needs DATABASE_URL
 * (Jessica's Neon), delivery needs RESEND_API_KEY, and the route accepts and
 * logs the lead either way rather than 500-ing at a customer — a painting lead
 * is worth more than a clean schema.
 *
 * The response tells the form which of the two happened, because that decides
 * whether the visitor still has to press send in their own mail app.
 */
export async function POST(request: Request) {
  let body: QuoteBody;
  try {
    body = (await request.json()) as QuoteBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot. Accept silently so bots do not learn they were caught.
  if (clean(body.company, 100)) {
    return NextResponse.json({ ok: true, emailed: true });
  }

  // Answer validation errors in whatever language the visitor is reading.
  const locale: Locale = locales.includes(body.locale as Locale)
    ? (body.locale as Locale)
    : 'en';

  const lead: Lead = {
    name: clean(body.name, MAX.name),
    phone: clean(body.phone, MAX.phone),
    email: clean(body.email, MAX.email),
    city: clean(body.city, MAX.city),
    service: clean(body.service, MAX.service),
    details: clean(body.details, MAX.details),
    locale,
    submittedAt: new Date().toISOString(),
  };

  if (!lead.name || !lead.phone || !lead.city || !lead.service) {
    return NextResponse.json(
      { error: getDict(locale).form.validationError },
      { status: 400 },
    );
  }

  const databaseUrl = process.env.DATABASE_URL;
  let persisted = false;

  if (databaseUrl) {
    try {
      // Imported lazily so the package is only required once Neon is wired up.
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(databaseUrl);
      await sql`
        insert into quote_requests (name, phone, email, city, service, details, locale, submitted_at)
        values (${lead.name}, ${lead.phone}, ${lead.email}, ${lead.city},
                ${lead.service}, ${lead.details}, ${lead.locale}, ${lead.submittedAt})
      `;
      persisted = true;
    } catch (err) {
      // Never lose the lead to a database problem.
      console.error('[quote] database write failed', err);
    }
  }

  const emailed = await emailLead(lead);

  if (!persisted && !emailed) {
    // The log is the last copy of the lead. Vercel keeps it either way.
    console.info('[quote] lead received (not stored, not emailed)', lead);
  }

  return NextResponse.json({ ok: true, persisted, emailed });
}
