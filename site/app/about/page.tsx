import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BeforeAfter from '@/components/BeforeAfter';
import WingRule from '@/components/WingRule';
import {
  business,
  process,
  projects,
  serviceArea,
  valueProps,
} from '@/content/site';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Blue Wings Painting MN is an interior and exterior painting company serving the Twin Cities metro. Free estimates. Hablamos Español.',
  alternates: { canonical: '/about' },
};

const pair = projects[1];

export default function AboutPage() {
  return (
    <>
      <section className={`on-ink ${styles.head}`}>
        <div className="container">
          <p className="eyebrow">About</p>
          <h1 className="display" style={{ maxWidth: '15ch' }}>
            A painting company, not a marketing company.
          </h1>
          <p className="lede" style={{ marginTop: '1.5rem', maxWidth: '54ch' }}>
            Blue Wings Painting MN does interior and exterior work across the{' '}
            {serviceArea.headline}. The photographs on this site are our jobs —
            not stock, not someone else&apos;s portfolio.
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
              What we&apos;d rather be judged on
            </h2>
            <p className={styles.para}>
              Painting is a trade where the marketing all sounds the same. Every
              company says quality, reliability and care. The difference only
              shows up on the wall.
            </p>
            <p className={styles.para}>
              So the argument we&apos;d rather make is the one on the right: a
              garage whose factory finish had failed down to bare wood, and the
              same garage after. Drag it. That&apos;s the standard.
            </p>
            <div className={styles.actions}>
              <Link className="btn" href="/gallery">
                See all our work
              </Link>
            </div>
          </div>
          <div className={styles.splitMedia}>
            <BeforeAfter
              before={pair.before}
              after={pair.after}
              focus={pair.focus}
              label="Drag to compare the garage doors before and after"
            />
          </div>
        </div>
      </section>

      <section className={`${styles.values}`}>
        <div className="container">
          <p className="eyebrow">How we work</p>
          <div className={styles.valuesGrid}>
            {valueProps.map((v, i) => (
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
          <p className="eyebrow">Every job, same order</p>
          <h2 className="h2" style={{ maxWidth: '18ch' }}>
            The parts you don&apos;t see are the parts that last
          </h2>
          <ol className={styles.steps}>
            {process.map((step) => (
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
            <p className="eyebrow">Service area</p>
            <h2 className="h2">The {serviceArea.headline}</h2>
            <p className="lede" style={{ marginTop: '1rem' }}>
              Including {serviceArea.namedCities.join(', ')} {serviceArea.note}.
            </p>
            <p className={styles.esBlock}>
              <strong>{business.spanish}</strong> — llámanos al{' '}
              <a href={business.phoneHref}>{business.phone}</a> para un
              presupuesto gratis.
            </p>
            <div className={styles.actions}>
              <Link className="btn" href="/contact">
                Get a free estimate
              </Link>
              <a className="btn btn-ghost" href={business.phoneHref}>
                {business.phone}
              </a>
            </div>
          </div>
          <div className={styles.areaMedia}>
            <Image
              src="/img/exterior-addition-lattice.jpg"
              alt="A painted addition in cream board-and-batten with black window trim and white lattice skirting."
              width={736}
              height={1005}
              sizes="(max-width: 900px) 92vw, 480px"
            />
          </div>
        </div>
      </section>
    </>
  );
}
