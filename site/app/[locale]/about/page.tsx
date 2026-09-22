import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BeforeAfter from '@/components/BeforeAfter';
import WingRule from '@/components/WingRule';
import { getBusiness, getFinishedWork, getProjects } from '@/cms/content';
import { getDict, locales, type Locale } from '@/content/i18n';
import { pathFor } from '@/content/site';
import { alternatesFor } from '../layout';
import styles from './about.module.css';

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
    title: t.about.meta.title,
    description: t.about.meta.description,
    alternates: alternatesFor('/about'),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  const t = getDict(locale);

  const [projects, finished, business] = await Promise.all([
    getProjects(locale),
    getFinishedWork(locale),
    getBusiness(),
  ]);

  /*
    The second pair, falling back to the first. Both are chosen by position
    rather than by slug so the client can reorder or replace pairs in the CMS
    without this page 404-ing on a slug that no longer exists.
  */
  const pair = projects[1] ?? projects[0] ?? null;

  /*
    The closing photo used to be a hardcoded /img path paired with
    t.gallery.finished[2].alt — a second copy of the index-coupling the gallery
    had, and a quieter one: reordering the finished work in the CMS would leave
    this image described by another photo's alt text, which only a screen
    reader user would ever notice. Taking the image and its alt from the same
    record makes that impossible.
  */
  const areaPhoto = finished[2] ?? finished[finished.length - 1] ?? null;

  return (
    <>
      <section className={`on-ink ${styles.head}`}>
        <div className="container">
          <p className="eyebrow">{t.about.eyebrow}</p>
          <h1 className="display" style={{ maxWidth: '15ch' }}>
            {t.about.h1}
          </h1>
          <p className="lede" style={{ marginTop: '1.5rem', maxWidth: '54ch' }}>
            {t.about.lede}
          </p>
        </div>
      </section>

      <div className="container">
        <WingRule />
      </div>

      {/*
        NOTE FOR LAUNCH.
        Years in business, founding story, team names, and licence/bond/insurance
        status are all still to be confirmed with the client.
        Until then this page stands on what IS verifiable — the work, the
        process, the service area, the language. Do not fill these sections with
        invented history.
      */}

      <section className="section" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
        <div className={`container ${styles.split}`}>
          <div className={styles.splitText}>
            <h2 className="h2" style={{ maxWidth: '16ch' }}>
              {t.about.judgedTitle}
            </h2>
            <p className={styles.para}>{t.about.judgedP1}</p>
            <p className={styles.para}>{t.about.judgedP2}</p>
            <div className={styles.actions}>
              <Link className="btn" href={pathFor('gallery', locale)}>
                {t.common.seeOurWork}
              </Link>
            </div>
          </div>
          {pair ? (
            <div className={styles.splitMedia}>
              <BeforeAfter
                before={pair.before}
                after={pair.after}
                label={t.common.dragToCompare(pair.title.toLowerCase())}
                beforeLabel={t.common.before}
                afterLabel={t.common.after}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className={styles.values}>
        <div className="container">
          <p className="eyebrow">{t.about.valuesEyebrow}</p>
          <div className={styles.valuesGrid}>
            {t.home.valueProps.map((v, i) => (
              <div key={v.title} className="reveal" data-reveal-delay={i * 90}>
                <h2 className="h3">{v.title}</h2>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">{t.about.processEyebrow}</p>
          <h2 className="h2" style={{ maxWidth: '18ch' }}>
            {t.about.processTitle}
          </h2>
          <ol className={styles.steps}>
            {t.process.map((step) => (
              <li key={step.step} className="reveal">
                <span className={styles.stepNum}>{step.step}</span>
                <div>
                  <h3 className="h3">{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`on-ink section ${styles.area}`}>
        <div className={`container ${styles.areaInner}`}>
          <div>
            <p className="eyebrow">{t.about.areaEyebrow}</p>
            <h2 className="h2">{t.home.areaTitle}</h2>
            <p className="lede" style={{ marginTop: '1rem' }}>
              {t.common.areaIncluding(business.cities.join(', '))}.
            </p>
            <p className={styles.esBlock}>
              <strong>{business.spanish}</strong> —{' '}
              <a href={business.phoneHref}>{business.phone}</a>,{' '}
              {t.about.spanishNote}
            </p>
            <div className={styles.actions}>
              <Link className="btn" href={pathFor('contact', locale)}>
                {t.common.getFreeEstimate}
              </Link>
              <a className="btn btn-ghost" href={business.phoneHref}>
                {business.phone}
              </a>
            </div>
          </div>
          {areaPhoto ? (
            <div className={styles.areaMedia}>
              <Image
                src={areaPhoto.image.src}
                alt={areaPhoto.image.alt}
                width={736}
                height={1005}
                sizes="(max-width: 900px) 92vw, 480px"
                style={{ objectPosition: areaPhoto.image.focus }}
              />
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
