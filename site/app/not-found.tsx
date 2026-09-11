import Link from 'next/link';
import { business } from '@/content/site';

export default function NotFound() {
  return (
    <section className="section container" style={{ textAlign: 'center' }}>
      <p className="eyebrow">404</p>
      <h1 className="h2" style={{ marginTop: '0.75rem' }}>
        That page isn&apos;t here.
      </h1>
      <p className="lede" style={{ marginTop: '1rem' }}>
        The work is, though.
      </p>
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Link className="btn" href="/gallery">
          See our work
        </Link>
        <a className="btn btn-ghost" href={business.phoneHref}>
          Call {business.phone}
        </a>
      </div>
    </section>
  );
}
