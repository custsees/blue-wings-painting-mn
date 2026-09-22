import Link from 'next/link';
import { getBusiness } from '@/cms/content';
import { getDict } from '@/content/i18n';
import { pathFor } from '@/content/site';

/* Next renders not-found outside the locale params, so this falls back to
   English. The header and footer around it still come from the layout. */
export default async function NotFound() {
  const t = getDict('en');
  const business = await getBusiness();
  return (
    <section className="section container" style={{ textAlign: 'center' }}>
      <p className="eyebrow">404</p>
      <h1 className="h2" style={{ marginTop: '0.75rem' }}>
        {t.notFound.title}
      </h1>
      <p className="lede" style={{ marginTop: '1rem' }}>
        {t.notFound.lede}
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
        <Link className="btn" href={pathFor('gallery', 'en')}>
          {t.common.seeOurWork}
        </Link>
        <a className="btn btn-ghost" href={business.phoneHref}>
          {t.common.callPhone(business.phone)}
        </a>
      </div>
    </section>
  );
}
