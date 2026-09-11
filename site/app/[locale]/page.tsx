import Image from 'next/image';
import Link from 'next/link';
import BeforeAfter from '@/components/BeforeAfter';
import WingRule from '@/components/WingRule';
import { getDict, locales, type Locale } from '@/content/i18n';
import {
  business,
  namedCities,
  pathFor,
  projectImages,
  projectSlugs,
  serviceSlugs,
} from '@/content/site';
import styles from './home.module.css';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = ((locales as readonly string[]).includes(raw) ? raw : 'en') as Locale;
  const t = getDict(locale);

  const heroSlug = projectSlugs[0];
  const hero = t.gallery.items[heroSlug];
  const heroImg = projectImages[heroSlug];

  return (
    <>
      {/* ---------- hero: the wet edge ---------- */}
      <section className={`on-ink ${styles.hero}`}>
        <div className={`wide ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">{t.home.eyebrow}</p>
            <h1 className="display">
              {t.home.h1a}
              <br />
              {t.home.h1b}
              <br />
              <span className={styles.heroAccent}>{t.home.h1accent}</span>
            </h1>
            <p className="lede">{t.home.lede}</p>
            <div className={styles.heroActions}>
              <Link className="btn" href={pathFor('contact', locale)}>
                {t.common.getFreeEstimate}
              </Link>
              <a className="btn btn-ghost" href={business.phoneHref}>
                {business.phone}
              </a>
            </div>
            <p className={styles.heroEs}>{business.spanish}</p>
          </div>

          <div className={styles.heroMedia}>
            <BeforeAfter
              before={{ ...heroImg.before, alt: hero.beforeAlt }}
              after={{ ...heroImg.after, alt: hero.afterAlt }}
              priority
              label={t.common.dragToCompare(hero.title.toLowerCase())}
              beforeLabel={t.common.before}
              afterLabel={t.common.after}
            />
            <p className={styles.heroCaption}>
              <strong>{hero.title}</strong> — {hero.kind}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- value props ---------- */}
      <section className={`section ${styles.props}`}>
        <div className="container">
          <WingRule />
          <div className={styles.propsGrid}>
            {t.home.valueProps.map((p, i) => (
              <div key={p.title} className="reveal" data-reveal-delay={i * 90}>
                <h2 className="h3">{p.title}</h2>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- services ---------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.headRow}>
            <div>
              <p className="eyebrow">{t.home.servicesEyebrow}</p>
              <h2 className="h2">{t.home.servicesTitle}</h2>
            </div>
            <Link className={styles.headLink} href={pathFor('services', locale)}>
              {t.common.seeAllServices}
            </Link>
          </div>

          <ul className={styles.svcGrid}>
            {serviceSlugs.map((slug, i) => (
              /*
                No scroll-reveal on these. The grid fakes its cell borders with
                1px gaps over a tinted background, so a card sitting at
                opacity 0 shows that tint as a solid rectangle and the whole
                table looks broken mid-animation.
              */
              <li key={slug} className={styles.svcCard}>
                <Link href={`${pathFor('services', locale)}#${slug}`}>
                  <span className={styles.svcNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={styles.svcName}>{t.services.items[slug].name}</h3>
                  <p className={styles.svcShort}>{t.services.items[slug].short}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- proof ---------- */}
      <section className={`on-ink section ${styles.proof}`}>
        <div className="container">
          <div className={styles.headRow}>
            <div>
              <p className="eyebrow">{t.home.proofEyebrow}</p>
              <h2 className="h2">{t.home.proofTitle}</h2>
              <p className="lede" style={{ marginTop: '1rem', maxWidth: '54ch' }}>
                {t.home.proofLede}
              </p>
            </div>
            <Link className={styles.headLink} href={pathFor('gallery', locale)}>
              {t.common.seeAllWork}
            </Link>
          </div>

          <div className={styles.proofGrid}>
            {projectSlugs.slice(1).map((slug, i) => {
              const p = t.gallery.items[slug];
              const img = projectImages[slug];
              return (
                <figure
                  key={slug}
                  className={`reveal ${styles.proofItem}`}
                  data-reveal-delay={i * 110}
                >
                  <BeforeAfter
                    before={{ ...img.before, alt: p.beforeAlt }}
                    after={{ ...img.after, alt: p.afterAlt }}
                    label={t.common.dragToCompare(p.title.toLowerCase())}
                    beforeLabel={t.common.before}
                    afterLabel={t.common.after}
                  />
                  <figcaption>
                    <span className={styles.proofKind}>{p.kind}</span>
                    <strong>{p.title}</strong>
                    <span className={styles.proofSummary}>{p.summary}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- process ---------- */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">{t.home.processEyebrow}</p>
          <h2 className="h2" style={{ maxWidth: '18ch' }}>
            {t.home.processTitle}
          </h2>

          <ol className={styles.steps}>
            {t.process.map((step, i) => (
              <li
                key={step.step}
                className={`reveal ${styles.step}`}
                data-reveal-delay={i * 70}
              >
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

      {/* ---------- service area ---------- */}
      <section className={styles.area}>
        <div className={`container ${styles.areaInner}`}>
          <div>
            <p className="eyebrow">{t.home.areaEyebrow}</p>
            <h2 className="h2">{t.home.areaTitle}</h2>
            <p className="lede" style={{ marginTop: '1rem' }}>
              {t.common.areaIncluding(namedCities.join(', '))}. {t.home.areaLede}
            </p>
            <div className={styles.heroActions}>
              <Link className="btn" href={pathFor('contact', locale)}>
                {t.common.getFreeEstimate}
              </Link>
            </div>
          </div>
          <div className={styles.areaMedia}>
            <Image
              src="/img/exterior-board-batten-gables.jpg"
              alt={t.gallery.finished[0].alt}
              width={1500}
              height={1280}
              sizes="(max-width: 900px) 92vw, 620px"
            />
          </div>
        </div>
      </section>
    </>
  );
}
