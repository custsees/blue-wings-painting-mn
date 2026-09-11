import type { Metadata, Viewport } from 'next';
import { Manrope, Sora } from 'next/font/google';
import Assistant from '@/components/Assistant';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import RevealController from '@/components/RevealController';
import { business, serviceArea, services } from '@/content/site';
import './globals.css';

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

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  // The live Systeme site ships the title as "Blue Wings Pinting MN". Fixed.
  title: {
    default: `${business.nameFull} — Interior & Exterior Painters, Twin Cities`,
    template: `%s — ${business.nameFull}`,
  },
  description:
    'Interior and exterior painting across the Twin Cities metro. Cabinets, trim, doors, decks, fences and epoxy floors. Free estimates. Hablamos Español.',
  keywords: [
    'painters Twin Cities',
    'interior painting Minneapolis',
    'exterior painting Minnesota',
    'cabinet painting',
    'deck staining',
    'Brooklyn Center painters',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: business.siteUrl,
    siteName: business.nameFull,
    title: `${business.nameFull} — Interior & Exterior Painters`,
    description:
      'Interior and exterior painting across the Twin Cities metro. Free estimates. Hablamos Español.',
    images: [
      {
        url: '/img/exterior-white-brick.jpg',
        width: 1009,
        height: 1500,
        alt: 'A Twin Cities home after an exterior repaint by Blue Wings Painting.',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#5170FF',
};

/**
 * LocalBusiness structured data.
 * Only fields backed by the fact-and-proof ledger are emitted. No aggregateRating (there are
 * no reviews), no openingHours (unconfirmed), no priceRange (never published).
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HousePainter',
  name: business.nameFull,
  url: business.siteUrl,
  telephone: '+1-612-205-5308',
  email: business.email,
  image: `${business.siteUrl}/img/blue-wings-logo.png`,
  logo: `${business.siteUrl}/img/blue-wings-logo.png`,
  description:
    'Interior and exterior painting company serving the Twin Cities metro in Minnesota.',
  address: { '@type': 'PostalAddress', addressRegion: 'MN', addressCountry: 'US' },
  areaServed: serviceArea.namedCities.map((city) => ({
    '@type': 'City',
    name: `${city}, MN`,
  })),
  knowsLanguage: ['en', 'es'],
  sameAs: [business.facebook],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Painting services',
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name, description: s.short },
    })),
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <RevealController />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Assistant />
      </body>
    </html>
  );
}
