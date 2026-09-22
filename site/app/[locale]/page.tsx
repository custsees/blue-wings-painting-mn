import Image from 'next/image';
import Link from 'next/link';
import BeforeAfter from '@/components/BeforeAfter';
import WingRule from '@/components/WingRule';
import {
  getBusiness,
  getFinishedWork,
  getHomeCopy,
  getProjects,
  getServices,
} from '@/cms/content';
import { getDict, locales, type Locale } from '@/content/i18n';
import { pathFor } from '@/content/site';
import styles from './home.module.css';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = ((locales as readonly string[]).includes(raw) ? raw : 'en') as Locale;
  const t = getDict(locale);

  const [projects, services, finished, business, home] = await Promise.all([
    getProjects(locale),
    getServices(locale),
    getFinishedWork(locale),
    getBusiness(),
    getHomeCopy(locale),
  ]);

  /*
    The hero is whichever pair the client has put first, and the proof strip is
    the rest. Chosen by position rather than by slug so reordering in the CMS
    just works — the strongest before/after should be able to lead without a
    code change.
  */
  const [hero, ...rest] = projects;

  /*
    Same fix as the gallery and the about page: this photo used to be a
    hardcoded /img path paired with t.gallery.finished[0].alt, two files joined
    by index. Image and alt now come from one record.
  */
  const areaPhoto = finished[0] ?? null;

  return (
    <>
      {/* ---------- hero: the wet edge ---------- */}
      <section className={`on-ink ${styles.hero}`}>
        <div className={`wide ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">{home.eyebrow}</p>
            <h1 className="display">
              {home.h1a}
              <br />
              {home.h1b}
              <br />
              <span className={styles.heroAccent}>{home.h1accent}</span>
            </h1>
            <p className="lede">{home.lede}</p>
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
              before={hero.before}
              after={hero.after}
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
            {home.valueProps.map((p, i) => (
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
              <p className="eyebrow">{home.servicesEyebrow}</p>
              <h2 className="h2">{home.servicesTitle}</h2>
            </div>
            <Link className={styles.headLink} href={pathFor('services', locale)}>
              {t.common.seeAllServices}
            </Link>
          </div>

          <ul className={styles.svcGrid}>
            {services.map((service, i) => (
              /*
                No scroll-reveal on these. The grid fakes its cell borders with
                1px gaps over a tinted background, so a card sitting at
                opacity 0 shows that tint as a solid rectangle and the whole
                table looks broken mid-animation.
              */
              <li key={service.slug} className={styles.svcCard}>
                <Link href={`${pathFor('services', locale)}#${service.slug}`}>
                  <span className={styles.svcNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={styles.svcName}>{service.name}</h3>
                  <p className={styles.svcShort}>{service.short}</p>
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
              <p className="eyebrow">{home.proofEyebrow}</p>
              <h2 className="h2">{home.proofTitle}</h2>
              <p className="lede" style={{ marginTop: '1rem', maxWidth: '54ch' }}>
                {home.proofLede}
              </p>
            </div>
            <Link className={styles.headLink} href={pathFor('gallery', locale)}>
              {t.common.seeAllWork}
            </Link>
          </div>

          <div className={styles.proofGrid}>
            {rest.map((p, i) => {
              return (
                <figure
                  key={p.slug}
                  className={`reveal ${styles.proofItem}`}
                  data-reveal-delay={i * 110}
                >
                  <BeforeAfter
                    before={p.before}
                    after={p.after}
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
          <p className="eyebrow">{home.processEyebrow}</p>
          <h2 className="h2" style={{ maxWidth: '18ch' }}>
            {home.processTitle}
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
            <p className="eyebrow">{home.areaEyebrow}</p>
            <h2 className="h2">{home.areaTitle}</h2>
            <p className="lede" style={{ marginTop: '1rem' }}>
              {t.common.areaIncluding(business.cities.join(', '))}. {home.areaLede}
            </p>
            <div className={styles.heroActions}>
              <Link className="btn" href={pathFor('contact', locale)}>
                {t.common.getFreeEstimate}
              </Link>
            </div>
          </div>
          {areaPhoto ? (
            <div className={styles.areaMedia}>
              <Image
                src={areaPhoto.image.src}
                alt={areaPhoto.image.alt}
                width={1500}
                height={1280}
                sizes="(max-width: 900px) 92vw, 620px"
                style={{ objectPosition: areaPhoto.image.focus }}
              />
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
