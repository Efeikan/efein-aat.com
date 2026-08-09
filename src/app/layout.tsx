import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://efeinsaat.com";
const SITE_NAME = "Efe İnşaat";
const TITLE =
  "Efe İnşaat | Ataşehir Pimapen, Cam Balkon, Pergole ve Sineklik Firması";
const DESCRIPTION =
  "Efe İnşaat, Ataşehir ve İstanbul genelinde pimapen (PVC pencere), cam balkon, pergole ve sineklik sistemlerinde 15+ yıllık deneyimiyle hizmet veren güvenilir inşaat firmasıdır. Ücretsiz keşif için hemen arayın: +90 535 747 77 63.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Construction",
  keywords: [
    "efe inşaat",
    "efeinşaat",
    "efeinsaat",
    "efe inşaat com",
    "efe inşaat ataşehir",
    "efe inşaat istanbul",
    "efe insaat",
    "pimapen",
    "pimapen fiyatları",
    "cam balkon",
    "cam balkon fiyatları",
    "pergole",
    "biyoklimatik pergole",
    "sineklik",
    "plise sineklik",
    "pvc pencere",
    "ataşehir pimapen",
    "ataşehir cam balkon",
    "istanbul pergole",
    "ataşehir inşaat firması",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  alternates: {
    canonical: "/",
    languages: {
      tr: "/",
      en: "/",
      "x-default": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Efe İnşaat - Pimapen, Cam Balkon, Pergole ve Sineklik",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  other: {
    "geo.region": "TR-34",
    "geo.placename": "Ataşehir, İstanbul",
    "geo.position": "40.9923;29.1244",
    ICBM: "40.9923, 29.1244",
  },
  // Google Search Console doğrulama kodunuzu buraya ekleyin:
  // verification: { google: "GOOGLE_SITE_VERIFICATION_KODU" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "GeneralContractor"],
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ["Efe İnşaat", "EfeInsaat", "Efe İnşaat Ataşehir"],
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.ico`,
      image: `${SITE_URL}/opengraph-image`,
      description: DESCRIPTION,
      telephone: "+905357477763",
      email: "efe.ikan2005@gmail.com",
      priceRange: "₺₺",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ataşehir",
        addressRegion: "İstanbul",
        addressCountry: "TR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 40.9923,
        longitude: 29.1244,
      },
      areaServed: [
        { "@type": "City", name: "İstanbul" },
        { "@type": "Place", name: "Ataşehir" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "08:00",
          closes: "18:00",
        },
      ],
      sameAs: [],
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Pimapen (PVC Pencere) Sistemleri" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Cam Balkon Sistemleri" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Pergole Sistemleri" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Sineklik Sistemleri" },
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "tr-TR",
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Pimapen pencerelerin ömrü ne kadardır?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kaliteli PVC pencere sistemleri, doğru bakım ve kullanım koşullarında 25-30 yıl sorunsuz hizmet verebilir. Düzenli bakım yapıldığında bu süre daha da uzayabilir.",
          },
        },
        {
          "@type": "Question",
          name: "Cam balkon sistemleri kışın yeterli koruma sağlar mı?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cam balkon sistemleri rüzgar, yağmur ve toza karşı etkili koruma sağlar. Isıcamlı seçeneklerle kış aylarında da balkonunuzu konforlu şekilde kullanabilirsiniz.",
          },
        },
        {
          "@type": "Question",
          name: "Biyoklimatik pergole nedir?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Biyoklimatik pergole, hareketli lamel yapısıyla güneş ışığı ve hava sirkülasyonunu kontrol etmenizi sağlayan akıllı bir gölgeleme sistemidir. Motorlu versiyonları uzaktan kumanda ile kontrol edilebilir.",
          },
        },
        {
          "@type": "Question",
          name: "Sineklik montajı ne kadar sürer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Standart pencere sineklikleri için ölçü alma ve montaj genellikle aynı gün içinde tamamlanır. Kapı sineklikleri ve özel sistemler için süre değişebilir.",
          },
        },
        {
          "@type": "Question",
          name: "Ücretsiz keşif yapıyor musunuz?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Evet, tüm hizmetlerimiz için ücretsiz keşif ve fiyat teklifi sunuyoruz. Bize telefonla veya iletişim formu üzerinden ulaşabilirsiniz.",
          },
        },
        {
          "@type": "Question",
          name: "Garanti süresi ne kadardır?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tüm ürün ve hizmetlerimizde minimum 2 yıl işçilik garantisi veriyoruz. Ürün garantileri markaya göre 5-10 yıl arasında değişmektedir.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--bg-primary)] text-[var(--text-primary)]`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
