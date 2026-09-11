import Image from 'next/image';
import Link from 'next/link';
import { getDict, type Locale } from '@/content/i18n';
import { business, namedCities, navKeys, pathFor, serviceSlugs } from '@/content/site';

export default function Footer({ locale }: { locale: Locale }) {
  const t = getDict(locale);

  return (
    <footer className="on-ink ft">
      <div className="container ft-grid">
        <div className="ft-brand">
          <Image
            src="/img/blue-wings-logo.jpg"
            alt=""
            width={1123}
            height={1123}
            sizes="150px"
          />
          <p className="ft-name">{business.nameFull}</p>
          <p className="ft-line">{t.common.tagline}</p>
          <p className="ft-es">{business.spanish}</p>
        </div>

        <nav className="ft-col" aria-label={t.footer.pages}>
          <h2 className="ft-head">{t.footer.pages}</h2>
          {navKeys.map((key) => (
            <Link key={key} href={pathFor(key, locale)}>
              {t.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="ft-col">
          <h2 className="ft-head">{t.footer.services}</h2>
          {serviceSlugs.map((slug) => (
            <Link key={slug} href={`${pathFor('services', locale)}#${slug}`}>
              {t.services.items[slug].name}
            </Link>
          ))}
        </div>

        <div className="ft-col">
          <h2 className="ft-head">{t.footer.getInTouch}</h2>
          <a href={business.phoneHref} className="ft-strong">
            {business.phone}
          </a>
          <a href={business.phoneAltHref}>{business.phoneAlt}</a>
          <a href={business.emailHref}>{business.email}</a>
          <a href={business.facebook} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <p className="ft-area">
            {t.common.areaName} — {t.common.areaIncluding(namedCities.join(', '))}.
          </p>
        </div>
      </div>

      <div className="container ft-base">
        <p>
          © {new Date().getFullYear()} {business.nameFull}. {t.footer.rights}
        </p>
        <p>{t.footer.freeEstimates}</p>
      </div>
    </footer>
  );
}
