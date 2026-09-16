import type { Metadata, Viewport } from 'next';
import { Manrope, Sora } from 'next/font/google';
import { notFound } from 'next/navigation';
import Assistant from '@/components/Assistant';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import RevealController from '@/components/RevealController';
import { themeScript } from '@/components/Theme';
import { getDict, locales, type Locale } from '@/content/i18n';
import { business, namedCities, serviceSlugs } from '@/content/site';
import '../globals.css';

/*
  Type: a geometric display face with real weight contrast for headlines, and a
  humanist sans for body. No script, no luxury serif — this is a trade, and the
  confidence should read as competence.
*/
const display = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const body = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * English is served at the site root via rewrites in next.config.ts, so the
 * canonical for English drops the /en prefix. Spanish keeps /es.
 */
export function canonicalPath(locale: Locale, path = ''): string {
  return locale === 'es' ? `/es${path}` : path || '/';
}

/** hreflang set for a page, shared by every route. */
export function alternatesFor(path = '') {
  return {
    canonical: canonicalPath('en', path),
    languages: {
      'en-US': canonicalPath('en', path),
      'es-US': canonicalPath('es', path),
      'x-default': canonicalPath('en', path),
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (locales as readonly string[]).includes(raw)
    ? (raw as Locale)
    : 'en';
  const t = getDict(locale);

  return {
    metadataBase: new URL(business.siteUrl),
    // The live Systeme site ships the title as "Blue Wings Pinting MN". Fixed.
    title: {
      default: t.home.meta.title,
      template: `%s — ${business.nameFull}`,
    },
    description: t.home.meta.description,
    alternates: {
      canonical: canonicalPath(locale),
      languages: {
        'en-US': '/',
        'es-US': '/es',
        'x-default': '/',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'es' ? 'es_US' : 'en_US',
      alternateLocale: locale === 'es' ? 'en_US' : 'es_US',
      url: `${business.siteUrl}${canonicalPath(locale)}`,
      siteName: business.nameFull,
      title: t.home.meta.title,
      description: t.home.meta.description,
      images: [
        {
          url: '/img/exterior-white-brick.jpg',
          width: 1009,
          height: 1500,
          alt: t.services.items['interior-exterior'].imageAlt ?? business.nameFull,
        },
      ],
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: '#0062FB',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!(locales as readonly string[]).includes(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);

  /**
   * LocalBusiness structured data.
   * Only fields backed by the ledger are emitted. No aggregateRating (there are
   * no reviews), no openingHours (unconfirmed), no priceRange (never published).
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HousePainter',
    name: business.nameFull,
    url: `${business.siteUrl}${canonicalPath(locale)}`,
    telephone: '+1-612-636-5194',
    email: business.email,
    image: `${business.siteUrl}/img/blue-wings-logo.jpg`,
    logo: `${business.siteUrl}/img/blue-wings-logo.jpg`,
    description: t.home.meta.description,
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'MN',
      addressCountry: 'US',
    },
    areaServed: namedCities.map((city) => ({
      '@type': 'City',
      name: `${city}, MN`,
    })),
    knowsLanguage: ['en', 'es'],
    sameAs: [business.facebook],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t.footer.services,
      itemListElement: serviceSlugs.map((slug) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: t.services.items[slug].name,
          description: t.services.items[slug].short,
        },
      })),
    },
  };

  return (
    <html
      lang={t.htmlLang}
      className={`${display.variable} ${body.variable}`}
      data-scroll-behavior="smooth"
      /* The inline theme script sets data-theme on <html> before hydration.
         React owns this element, so without this it reconciles the attribute
         away and the remembered theme is lost on every reload. */
      suppressHydrationWarning
    >
      <body>
        {/*
          Theme first, before anything in <body> paints, so a dark-theme
          visitor never sees a light flash. Not wrapped in a manual <head>:
          App Router owns that element, and React logs an error for script
          tags rendered inside it.
        */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a className="skip-link" href="#main">
          {t.common.skipToContent}
        </a>
        <RevealController />
        <Header locale={locale} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
        <Assistant locale={locale} />
      </body>
    </html>
  );
}
