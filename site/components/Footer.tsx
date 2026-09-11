import Image from 'next/image';
import Link from 'next/link';
import { business, nav, serviceArea, services } from '@/content/site';

export default function Footer() {
  return (
    <footer className="on-ink ft">
      <div className="container ft-grid">
        <div className="ft-brand">
          <Image
            src="/img/blue-wings-logo.png"
            alt=""
            width={64}
            height={64}
          />
          <p className="ft-name">{business.nameFull}</p>
          <p className="ft-line">{business.tagline}</p>
          <p className="ft-es">{business.spanish}</p>
        </div>

        <nav className="ft-col" aria-label="Footer">
          <h2 className="ft-head">Pages</h2>
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ft-col">
          <h2 className="ft-head">Services</h2>
          {services.map((s) => (
            <Link key={s.slug} href={`/services#${s.slug}`}>
              {s.name}
            </Link>
          ))}
        </div>

        <div className="ft-col">
          <h2 className="ft-head">Get in touch</h2>
          <a href={business.phoneHref} className="ft-strong">
            {business.phone}
          </a>
          <a href={business.phoneAltHref}>{business.phoneAlt}</a>
          <a href={business.emailHref}>{business.email}</a>
          <a
            href={business.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <p className="ft-area">
            Serving the {serviceArea.headline} — including{' '}
            {serviceArea.namedCities.join(', ')} {serviceArea.note}.
          </p>
        </div>
      </div>

      <div className="container ft-base">
        <p>
          © {new Date().getFullYear()} {business.nameFull}. All rights reserved.
        </p>
        <p>Free estimates.</p>
      </div>
    </footer>
  );
}
