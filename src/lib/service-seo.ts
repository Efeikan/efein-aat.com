import type { Metadata } from "next";
import {
  SITE_URL,
  type ServiceDefinition,
  getService,
} from "@/lib/services";

export function buildServiceMetadata(service: ServiceDefinition): Metadata {
  const path = `/hizmetlerimiz/${service.slug}`;
  return {
    title: { absolute: service.title },
    description: service.description,
    alternates: {
      canonical: path,
      languages: {
        tr: path,
        en: path,
        "x-default": path,
      },
    },
    openGraph: {
      title: service.title,
      description: service.description,
      url: `${SITE_URL}${path}`,
      siteName: "Efe İnşaat",
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: service.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: service.description,
      images: [service.image],
    },
  };
}

export function buildServiceJsonLd(service: ServiceDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title.split(" | ")[0],
    description: service.schemaDescription,
    url: `${SITE_URL}/hizmetlerimiz/${service.slug}`,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: "Efe İnşaat",
      url: SITE_URL,
      email: "info@efeinşaat.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ataşehir",
        addressRegion: "İstanbul",
        addressCountry: "TR",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "TR",
    },
    image: `${SITE_URL}${service.image}`,
  };
}

export function requireService(slug: string): ServiceDefinition {
  const service = getService(slug);
  if (!service) {
    throw new Error(`Unknown service slug: ${slug}`);
  }
  return service;
}
