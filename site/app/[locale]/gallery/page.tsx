import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BeforeAfter from '@/components/BeforeAfter';
import WingRule from '@/components/WingRule';
import { getDict, locales, type Locale } from '@/content/i18n';
import {
  business,
  finishedWorkImages,
  pathFor,
  projectImages,
  projectSlugs,
} from '@/content/site';
import { alternatesFor } from '../layout';
import styles from './gallery.module.css';

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
    title: t.gallery.meta.title,
    description: t.gallery.meta.description,
    alternates: alternatesFor('/gallery'),
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  const t = getDict(locale);

  return (
    <>
      <section className={`on-ink ${styles.head}`}>
        <div className="container">
          <p className="eyebrow">{t.gallery.eyebrow}</p>
          <h1 className="display" style={{ maxWidth: '13ch' }}>
            {t.gallery.h1}
          </h1>
          <p className="lede" style={{ marginTop: '1.5rem', maxWidth: '54ch' }}>
            {t.gallery.lede}
          </p>
        </div>
      </section>

      <div className="container">
        <WingRule />
      </div>

      <section className="section" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
        <div className="container">
          <div className={styles.pairs}>
            {projectSlugs.map((slug, i) => {
              const p = t.gallery.items[slug];
              const img = projectImages[slug];
              return (
                <figure
                  key={slug}
                  className={`reveal ${styles.pair}`}
                  data-reveal-delay={(i % 2) * 100}
                >
                  <BeforeAfter
                    before={{ ...img.before, alt: p.beforeAlt }}
                    after={{ ...img.after, alt: p.afterAlt }}
                    label={t.common.dragToCompare(p.title.toLowerCase())}
                    beforeLabel={t.common.before}
                    afterLabel={t.common.after}
                  />
                  <figcaption>
                    <span className={styles.kind}>{p.kind}</span>
                    <h2 className="h3">{p.title}</h2>
                    <p>{p.summary}</p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`section ${styles.finished}`}>
        <div className="container">
          <p className="eyebrow">{t.gallery.finishedEyebrow}</p>
          <h2 className="h2" style={{ maxWidth: '20ch' }}>
            {t.gallery.finishedTitle}
          </h2>
          <p className="lede" style={{ marginTop: '1rem', maxWidth: '50ch' }}>
            {t.gallery.finishedLede}
          </p>

          <ul className={styles.grid}>
            {finishedWorkImages.map((src, i) => (
              <li
                key={src}
                className={`reveal ${styles.gridItem}`}
                data-reveal-delay={i * 90}
              >
                <Image
                  src={src}
                  alt={t.gallery.finished[i].alt}
                  width={1200}
                  height={1400}
                  sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 400px"
                />
                <span>{t.gallery.finished[i].caption}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`on-ink ${styles.cta}`}>
        <div className="container">
          <h2 className="h2">{t.gallery.ctaTitle}</h2>
          <p className="lede" style={{ marginTop: '0.9rem' }}>
            {t.gallery.ctaLede}
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
