import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsent } from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ScrollToTop from "@/components/ScrollToTop";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/services";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "Efe İnşaat";
const TITLE =
  "Efe İnşaat | Cam Balkon, Pergole, Pimapen ve Sineklik Sistemleri";
const DESCRIPTION =
  "Cam balkon, pergole, pimapen ve sineklik sistemlerinde uzman çözümler. Ataşehir & İstanbul'da ücretsiz keşif ve montaj için Efe İnşaat'ı arayın.";

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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    telephone: false,
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

const testimonials = [
  {
    name: "Ahmet Yılmaz",
    role: "Ev Sahibi",
    text: "Pimapen değişimi için Efe İnşaat'ı tercih ettik. Hem kaliteli malzeme hem de profesyonel işçilik. Çok memnunuz.",
    rating: 5,
  },
  {
    name: "Fatma Demir",
    role: "İşletme Sahibi",
    text: "Cam balkon sistemimiz harika oldu. Kışın bile balkonumuzu rahatlıkla kullanabiliyoruz. Teşekkürler Efe İnşaat!",
    rating: 5,
  },
  {
    name: "Mehmet Kaya",
    role: "Villa Sahibi",
    text: "Pergole sistemimiz tam istediğimiz gibi oldu. Biyoklimatik pergole sayesinde terasımız yaşam alanına dönüştü.",
    rating: 5,
  },
  {
    name: "Ayşe Çelik",
    role: "Apartman Yöneticisi",
    text: "Tüm daire pencerelerine sineklik taktırdık. Ölçü alma ve montaj sürecinde çok titiz çalıştılar.",
    rating: 4,
  },
];

const averageRating =
  testimonials.reduce((sum, item) => sum + item.rating, 0) /
  testimonials.length;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ["Efe İnşaat", "EfeInsaat", "Efe İnşaat Ataşehir"],
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
      image: `${SITE_URL}/opengraph-image`,
      description: DESCRIPTION,
      email: "info@efeinşaat.com",
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
      areaServed: "TR",
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
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating.toFixed(2),
        bestRating: "5",
        worstRating: "1",
        reviewCount: String(testimonials.length),
      },
      review: testimonials.map((item) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: item.name,
        },
        reviewBody: item.text,
        reviewRating: {
          "@type": "Rating",
          ratingValue: String(item.rating),
          bestRating: "5",
          worstRating: "1",
        },
      })),
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Cam Balkon" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Pergole" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Pimapen" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Sineklik" },
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
            text: "Evet, tüm hizmetlerimiz için ücretsiz keşif ve fiyat teklifi sunuyoruz. Bize iletişim formu veya e-posta üzerinden ulaşabilirsiniz.",
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
    <html lang="tr" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--bg-primary)] text-[var(--text-primary)]`}
      >
        <JsonLd data={jsonLd} />
        <LanguageProvider>
          <ScrollToTop />
          <GoogleAnalytics />
          {children}
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
