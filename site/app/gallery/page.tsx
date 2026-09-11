import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BeforeAfter from '@/components/BeforeAfter';
import WingRule from '@/components/WingRule';
import { business, finishedWork, projects } from '@/content/site';
import styles from './gallery.module.css';

export const metadata: Metadata = {
  title: 'Our work',
  description:
    'Before and after photos from real Blue Wings Painting jobs across the Twin Cities: deck staining, garage doors, exterior repaints and interior painting.',
  alternates: { canonical: '/gallery' },
};

export default function GalleryPage() {
  return (
    <>
      <section className={`on-ink ${styles.head}`}>
        <div className="container">
          <p className="eyebrow">Our work</p>
          <h1 className="display" style={{ maxWidth: '13ch' }}>
            Before, and after.
          </h1>
          <p className="lede" style={{ marginTop: '1.5rem', maxWidth: '54ch' }}>
            Every pair below is the same surface, photographed twice. Drag the
            handle to move between them — or use the arrow keys.
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
                  focus={p.focus}
                  label={`Drag to compare ${p.title.toLowerCase()} before and after`}
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
          <p className="eyebrow">Finished work</p>
          <h2 className="h2" style={{ maxWidth: '20ch' }}>
            More of what we&apos;ve left behind
          </h2>
          <p className="lede" style={{ marginTop: '1rem', maxWidth: '50ch' }}>
            No &ldquo;before&rdquo; on file for these, so they&apos;re shown as
            what they are: finished jobs.
          </p>

          <ul className={styles.grid}>
            {finishedWork.map((w, i) => (
              <li
                key={w.src}
                className={`reveal ${styles.gridItem}`}
                data-reveal-delay={i * 90}
              >
                <Image
                  src={w.src}
                  alt={w.alt}
                  width={1200}
                  height={1400}
                  sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 400px"
                />
                <span>{w.caption}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`on-ink ${styles.cta}`}>
        <div className="container">
          <h2 className="h2">Want yours on this page?</h2>
          <p className="lede" style={{ marginTop: '0.9rem' }}>
            Free estimates across the Twin Cities. {business.spanish}.
          </p>
          <div className={styles.ctaActions}>
            <Link className="btn" href="/contact">
              Get a free estimate
            </Link>
            <a className="btn btn-ghost" href={business.phoneHref}>
              Call {business.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
