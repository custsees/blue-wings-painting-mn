import { NextResponse } from 'next/server';
import { getDict, locales, type Locale } from '@/content/i18n';

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

const MAX = { name: 120, phone: 40, email: 200, city: 120, service: 120, details: 4000 };

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/**
 * Quote submissions.
 *
 * Storage is intentionally optional. Jessica owns the Neon account, and until
 * DATABASE_URL is set the route still accepts and logs the lead rather than
 * 500-ing at a customer — a painting lead is worth more than a clean schema.
 * Set DATABASE_URL in Vercel and this starts persisting with no code change.
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
    return NextResponse.json({ ok: true });
  }

  // Answer validation errors in whatever language the visitor is reading.
  const locale: Locale = locales.includes(body.locale as Locale)
    ? (body.locale as Locale)
    : 'en';

  const lead = {
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
    } catch (err) {
      // Never lose the lead to a database problem.
      console.error('[quote] database write failed', err);
      console.info('[quote] lead (unpersisted)', lead);
      return NextResponse.json({ ok: true, persisted: false });
    }
    return NextResponse.json({ ok: true, persisted: true });
  }

  console.info('[quote] lead received (no DATABASE_URL set)', lead);
  return NextResponse.json({ ok: true, persisted: false });
}
