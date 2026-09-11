import Image from 'next/image';
import Link from 'next/link';
import BeforeAfter from '@/components/BeforeAfter';
import WingRule from '@/components/WingRule';
import {
  business,
  process,
  projects,
  serviceArea,
  services,
  valueProps,
} from '@/content/site';
import styles from './home.module.css';

const hero = projects[0];

export default function HomePage() {
  return (
    <>
      {/* ---------- hero: the wet edge ---------- */}
      <section className={`on-ink ${styles.hero}`}>
        <div className={`wide ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">{serviceArea.headline} · Since the first coat</p>
            <h1 className="display">
              Minnesota
              <br />
              wrecks paint.
              <br />
              <span className={styles.heroAccent}>We fix that.</span>
            </h1>
            <p className="lede">
              Interior and exterior painting across the Twin Cities. Every job on
              this page is one of ours, photographed before and after. Drag the
              handle and see for yourself.
            </p>
            <div className={styles.heroActions}>
              <Link className="btn" href="/contact">
                Get a free estimate
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
              focus={hero.focus}
              priority
              label="Drag to compare the deck before and after staining"
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
            {valueProps.map((p, i) => (
              <div
                key={p.title}
                className="reveal"
                data-reveal-delay={i * 90}
              >
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
              <p className="eyebrow">What we do</p>
              <h2 className="h2">Seven things, done properly</h2>
            </div>
            <Link className={styles.headLink} href="/services">
              All services →
            </Link>
          </div>

          <ul className={styles.svcGrid}>
            {services.map((s, i) => (
              /*
                No scroll-reveal on these. The grid fakes its cell borders with
                1px gaps over a tinted background, so a card sitting at
                opacity 0 shows that tint as a solid beige rectangle and the
                whole table looks broken mid-animation.
              */
              <li key={s.slug} className={styles.svcCard}>
                <Link href={`/services#${s.slug}`}>
                  <span className={styles.svcNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={styles.svcName}>{s.name}</h3>
                  <p className={styles.svcShort}>{s.short}</p>
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
              <p className="eyebrow">The receipts</p>
              <h2 className="h2">Same house. Same angle.</h2>
              <p className="lede" style={{ marginTop: '1rem', maxWidth: '54ch' }}>
                Anyone can post a photo of a finished wall. These are the same
                surfaces before we touched them and after we left.
              </p>
            </div>
            <Link className={styles.headLink} href="/gallery">
              See all work →
            </Link>
          </div>

          <div className={styles.proofGrid}>
            {projects.slice(1).map((p, i) => (
              <figure
                key={p.slug}
                className={`reveal ${styles.proofItem}`}
                data-reveal-delay={i * 110}
              >
                <BeforeAfter
                  before={p.before}
                  after={p.after}
                  focus={p.focus}
                  label={`Drag to compare ${p.title.toLowerCase()} before and after`}
                />
                <figcaption>
                  <span className={styles.proofKind}>{p.kind}</span>
                  <strong>{p.title}</strong>
                  <span className={styles.proofSummary}>{p.summary}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- process ---------- */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">How a job runs</p>
          <h2 className="h2" style={{ maxWidth: '18ch' }}>
            Most of the work happens before the colour goes on
          </h2>

          <ol className={styles.steps}>
            {process.map((step, i) => (
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
            <p className="eyebrow">Where we work</p>
            <h2 className="h2">The {serviceArea.headline}</h2>
            <p className="lede" style={{ marginTop: '1rem' }}>
              Including {serviceArea.namedCities.join(', ')} {serviceArea.note}.
              Not sure if you&apos;re in range? Call and ask — it&apos;s a short
              conversation.
            </p>
            <div className={styles.heroActions}>
              <Link className="btn" href="/contact">
                Get a free estimate
              </Link>
            </div>
          </div>
          <div className={styles.areaMedia}>
            <Image
              src="/img/exterior-board-batten-gables.jpg"
              alt="Cream board-and-batten gables with black window frames after an exterior repaint."
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
