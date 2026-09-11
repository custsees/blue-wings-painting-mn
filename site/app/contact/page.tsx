import type { Metadata } from 'next';
import QuoteForm from '@/components/QuoteForm';
import WingRule from '@/components/WingRule';
import { business, serviceArea, smsHref } from '@/content/site';
import styles from './contact.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get a free painting estimate from Blue Wings Painting MN. Call (612) 205-5308, text, or send details through the form. Serving the Twin Cities metro. Hablamos Español.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <section className={`on-ink ${styles.head}`}>
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1 className="display" style={{ maxWidth: '13ch' }}>
            Free estimate, no pressure.
          </h1>
          <p className="lede" style={{ marginTop: '1.5rem', maxWidth: '52ch' }}>
            Tell us what needs painting and where. If it&apos;s easier to talk,
            call or text — both reach the same place.
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
              Request an estimate
            </h2>
            <QuoteForm />
          </div>

          <aside className={styles.aside}>
            <div className={styles.card}>
              <h2 className={styles.cardHead}>Call or text</h2>
              <a className={styles.big} href={business.phoneHref}>
                {business.phone}
              </a>
              <a className={styles.sub} href={business.phoneAltHref}>
                {business.phoneAlt}
              </a>
              <a className={styles.textLink} href={smsHref}>
                Send a text →
              </a>
              <p className={styles.es}>{business.spanish}</p>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardHead}>Email</h2>
              <a className={styles.mid} href={business.emailHref}>
                {business.email}
              </a>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardHead}>Service area</h2>
              <p className={styles.areaText}>
                The {serviceArea.headline} — including{' '}
                {serviceArea.namedCities.join(', ')} {serviceArea.note}.
              </p>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardHead}>Follow the work</h2>
              <a
                className={styles.mid}
                href={business.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook →
              </a>
              {/*
                RESERVED — Facebook page-feed embed.
                Blocked on Facebook page access / app review (see the private project brief).
                A direct link ships instead of a faked feed. Drop the embed in
                here once access is confirmed; the card is already sized for it.
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
