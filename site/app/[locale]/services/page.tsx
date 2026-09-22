import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import WingRule from '@/components/WingRule';
import { getBusiness, getServices } from '@/cms/content';
import { getDict, locales, type Locale } from '@/content/i18n';
import { pathFor } from '@/content/site';
import { alternatesFor } from '../layout';
import styles from './services.module.css';

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
    title: t.services.meta.title,
    description: t.services.meta.description,
    alternates: alternatesFor('/services'),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  const t = getDict(locale);
  const [services, business] = await Promise.all([getServices(locale), getBusiness()]);

  return (
    <>
      <section className={`on-ink ${styles.head}`}>
        <div className="container">
          <p className="eyebrow">{t.services.eyebrow}</p>
          <h1 className="display" style={{ maxWidth: '14ch' }}>
            {t.services.h1}
          </h1>
          <p className="lede" style={{ marginTop: '1.5rem', maxWidth: '52ch' }}>
            {t.services.lede}
          </p>
        </div>
      </section>

      <div className="container">
        <WingRule />
      </div>

      <section className="section" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
        <div className="container">
          <ol className={styles.list}>
            {services.map((s, i) => {
              const img = s.image;
              return (
                /*
                  No scroll-reveal here: these <li>s are the anchor targets for
                  /services#<slug> links in the footer, and the reveal's 22px
                  translate is applied while the browser is computing where to
                  scroll — so the heading lands under the sticky header once the
                  transform resolves.
                */
                <li key={s.slug} id={s.slug} className={styles.item}>
                  <div className={styles.itemHead}>
                    <span className={styles.num}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h2
                        className="h2"
                        style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}
                      >
                        {s.name}
                      </h2>
                      <p className={styles.short}>{s.short}</p>
                    </div>
                  </div>

                  <div className={styles.itemBody}>
                    <div className={styles.itemText}>
                      <p className={styles.para}>{s.body}</p>
                      <ul className={styles.detail}>
                        {s.detail.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                      <Link className="btn" href={pathFor('contact', locale)}>
                        {t.common.getFreeEstimate}
                      </Link>
                    </div>

                    {img && (
                      <div className={styles.itemMedia}>
                        <Image
                          src={img.src}
                          alt={img.alt}
                          width={900}
                          height={1200}
                          sizes="(max-width: 900px) 92vw, 420px"
                          style={{ objectPosition: img.focus }}
                        />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className={`on-ink section ${styles.processBlock}`}>
        <div className="container">
          <p className="eyebrow">{t.services.processEyebrow}</p>
          <h2 className="h2" style={{ maxWidth: '18ch' }}>
            {t.services.processTitle}
          </h2>
          <ol className={styles.steps}>
            {t.process.map((step) => (
              // Same 1px-gap-over-tinted-background grid as the home page's
              // service list — a cell at opacity 0 shows the gap colour as a
              // solid block, so no reveal here either.
              <li key={step.step}>
                <span className={styles.stepNum}>{step.step}</span>
                <h3 className="h3">{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <h2 className="h2">{t.services.ctaTitle}</h2>
          <p className="lede" style={{ marginTop: '0.9rem' }}>
            {t.services.ctaLede}
          </p>
          <div className={styles.ctaActions}>
            <Link className="btn" href={pathFor('contact', locale)}>
              {t.common.getFreeEstimate}
            </Link>
            <a className="btn btn-ghost" href={business.phoneHref}>
              {t.common.callPhone(business.phone)}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
