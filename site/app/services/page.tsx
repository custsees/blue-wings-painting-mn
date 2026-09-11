import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import WingRule from '@/components/WingRule';
import { business, process, serviceArea, services } from '@/content/site';
import styles from './services.module.css';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Interior and exterior painting, baseboard and trim, kitchen cabinets, doors, fences, decks and epoxy floors across the Twin Cities metro. Free estimates.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <section className={`on-ink ${styles.head}`}>
        <div className="container">
          <p className="eyebrow">Services</p>
          <h1 className="display" style={{ maxWidth: '14ch' }}>
            Seven things, done properly
          </h1>
          <p className="lede" style={{ marginTop: '1.5rem', maxWidth: '52ch' }}>
            Interior and exterior work across the {serviceArea.headline}. If
            it&apos;s a surface that takes paint or stain, it&apos;s on this list.
          </p>
        </div>
      </section>

      <div className="container">
        <WingRule />
      </div>

      <section className="section" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
        <div className="container">
          <ol className={styles.list}>
            {services.map((s, i) => (
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
                    <h2 className="h2" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
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
                    <Link className="btn" href="/contact">
                      Get a free estimate
                    </Link>
                  </div>

                  {s.image && (
                    <div className={styles.itemMedia}>
                      <Image
                        src={s.image}
                        alt={s.imageAlt ?? ''}
                        width={900}
                        height={1200}
                        sizes="(max-width: 900px) 92vw, 420px"
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`on-ink section ${styles.processBlock}`}>
        <div className="container">
          <p className="eyebrow">Every job, same order</p>
          <h2 className="h2" style={{ maxWidth: '18ch' }}>
            Most of the work happens before the colour goes on
          </h2>
          <ol className={styles.steps}>
            {process.map((step) => (
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
          <h2 className="h2">Tell us what needs painting.</h2>
          <p className="lede" style={{ marginTop: '0.9rem' }}>
            Free estimates. {business.spanish}.
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
