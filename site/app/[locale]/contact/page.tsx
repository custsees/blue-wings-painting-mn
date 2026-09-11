import type { Metadata } from 'next';
import QuoteForm from '@/components/QuoteForm';
import WingRule from '@/components/WingRule';
import { getDict, locales, type Locale } from '@/content/i18n';
import { business, namedCities, smsHrefFor } from '@/content/site';
import { alternatesFor } from '../layout';
import styles from './contact.module.css';

function toLocale(raw: string): Locale {
  return ((locales as readonly string[]).includes(raw) ? raw : 'en') as Locale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = getDict(toLocale((await params).locale));
  return {
    title: t.contact.meta.title,
    description: t.contact.meta.description,
    alternates: alternatesFor('/contact'),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  const t = getDict(locale);

  const smsHref = smsHrefFor(
    locale === 'es'
      ? 'Hola, quiero un presupuesto gratis para '
      : "Hi! I'd like a free estimate for ",
  );

  return (
    <>
      <section className={`on-ink ${styles.head}`}>
        <div className="container">
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <h1 className="display" style={{ maxWidth: '13ch' }}>
            {t.contact.h1}
          </h1>
          <p className="lede" style={{ marginTop: '1.5rem', maxWidth: '52ch' }}>
            {t.contact.lede}
          </p>
        </div>
      </section>

      <div className="container">
        <WingRule />
      </div>

      <section className="section" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.formCol}>
            <h2 className="h3" style={{ marginBottom: '1.25rem' }}>
              {t.contact.formTitle}
            </h2>
            <QuoteForm locale={locale} />
          </div>

          <aside className={styles.aside}>
            <div className={styles.card}>
              <h2 className={styles.cardHead}>{t.contact.callOrText}</h2>
              <a className={styles.big} href={business.phoneHref}>
                {business.phone}
              </a>
              <a className={styles.sub} href={business.phoneAltHref}>
                {business.phoneAlt}
              </a>
              <a className={styles.textLink} href={smsHref}>
                {t.contact.sendText}
              </a>
              <p className={styles.es}>{business.spanish}</p>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardHead}>{t.contact.emailLabel}</h2>
              <a className={styles.mid} href={business.emailHref}>
                {business.email}
              </a>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardHead}>{t.contact.areaLabel}</h2>
              <p className={styles.areaText}>
                {t.common.areaName} —{' '}
                {t.common.areaIncluding(namedCities.join(', '))}.
              </p>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardHead}>{t.contact.followLabel}</h2>
              <a
                className={styles.mid}
                href={business.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.contact.facebookLink}
              </a>
              {/*
                RESERVED — Facebook page-feed embed.
                Blocked on Facebook page access / app review (see the private
                project brief). A direct link ships instead of a faked feed.
                Drop the embed in here once access is confirmed; the card is
                already sized for it.
              */}
            </div>

            {/*
              RESERVED — availability / booking calendar.
              Blocked on Jessica choosing a scheduling system. The quote form
              ships first; the calendar drops into this column without a
              layout change.
            */}
          </aside>
        </div>
      </section>
    </>
  );
}
