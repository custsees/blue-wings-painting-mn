import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BeforeAfter from '@/components/BeforeAfter';
import WingRule from '@/components/WingRule';
import { getBusiness, getFinishedWork, getProjects } from '@/cms/content';
import { getDict, locales, type Locale } from '@/content/i18n';
import { pathFor } from '@/content/site';
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

  /*
    Three reads, one per thing on the page. The pairs and the finished shots
    each arrive as a list of whole objects carrying their own photo, alt text
    and caption in this locale.

    This used to be assembled here from `projectSlugs`, `projectImages` and
    `t.gallery.items` — and, worse, the finished grid read
    `finishedWorkImages[i]` against `t.gallery.finished[i]`, two arrays in two
    different files joined by position. Adding a photo to one without adding a
    matching entry to both language dictionaries threw at render. That is the
    first thing a client with an "add a photo" button would have done.
  */
  const [projects, finished, business] = await Promise.all([
    getProjects(locale),
    getFinishedWork(locale),
    getBusiness(),
  ]);

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
            {projects.map((p, i) => (
              <figure
                key={p.slug}
                className={`reveal ${styles.pair}`}
                data-reveal-delay={(i % 2) * 100}
              >
                <BeforeAfter
                  before={p.before}
                  after={p.after}
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
            ))}
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
            {finished.map((item, i) => (
              <li
                key={item.id}
                className={`reveal ${styles.gridItem}`}
                data-reveal-delay={i * 90}
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={1200}
                  height={1400}
                  sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 400px"
                  /*
                    The CSS crops these with object-fit: cover and no
                    object-position, i.e. dead centre. That is still the default
                    here, so untouched photos look exactly as they did — but a
                    photo whose subject sits off-centre can now be nudged from
                    the admin panel instead of needing a CSS edit.
                  */
                  style={{ objectPosition: item.image.focus }}
                />
                <span>{item.caption}</span>
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
