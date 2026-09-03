export { SITE_URL } from "@/lib/site";

export const SERVICE_SLUGS = [
  "cam-balkon",
  "pergole",
  "pimapen",
  "sineklik",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export type ServiceDefinition = {
  slug: ServiceSlug;
  localeKey: "camBalkon" | "pergole" | "pimapen" | "sineklik";
  title: string;
  description: string;
  schemaDescription: string;
  image: string;
  imageAlt: string;
};

export const SERVICES: ServiceDefinition[] = [
  {
    slug: "cam-balkon",
    localeKey: "camBalkon",
    title: "Cam Balkon Fiyatları ve Modelleri (2026) | Efe İnşaat",
    description:
      "Sürme ve katlanır cam balkon sistemlerinde uzman çözümler. Cam balkon fiyatları ve modelleri için Ataşehir'de ücretsiz keşif alın.",
    schemaDescription:
      "Sürme ve katlanır cam balkon sistemleri. Rüzgar, yağmur ve toza karşı koruma sağlayan cam balkon çözümleri.",
    image: "/images/gallery/cam-balkon-1.jpg",
    imageAlt: "Efe İnşaat cam balkon uygulama örneği",
  },
  {
    slug: "pergole",
    localeKey: "pergole",
    title: "Pergole Fiyatları ve Modelleri (2026) | Efe İnşaat",
    description:
      "Alüminyum, ahşap ve bioklimatik pergole sistemleri. Teras ve bahçeleriniz için pergole fiyatları, modelleri ve ücretsiz keşif.",
    schemaDescription:
      "Alüminyum, ahşap ve bioklimatik pergole sistemleri. Teras ve bahçe alanları için gölgeleme çözümleri.",
    image: "/images/gallery/pergole-1.jpg",
    imageAlt: "Efe İnşaat alüminyum pergole projesi",
  },
  {
    slug: "pimapen",
    localeKey: "pimapen",
    title: "Pimapen Fiyatları ve Modelleri (2026) | Efe İnşaat",
    description:
      "Isı yalıtımlı PVC pencere ve kapı sistemleri. Pimapen fiyatları, modelleri ve montaj için Ataşehir'de Efe İnşaat'a ulaşın.",
    schemaDescription:
      "Isı yalıtımlı PVC pencere ve kapı (pimapen) sistemleri. Enerji verimli doğrama çözümleri.",
    image: "/images/gallery/pimapen-1.jpg",
    imageAlt: "Efe İnşaat pimapen PVC pencere uygulaması",
  },
  {
    slug: "sineklik",
    localeKey: "sineklik",
    title: "Sineklik Fiyatları ve Modelleri (2026) | Efe İnşaat",
    description:
      "Pileli, sürme ve menteşeli sineklik sistemleri. Sineklik fiyatları, modelleri ve montajı hakkında Efe İnşaat'tan bilgi alın.",
    schemaDescription:
      "Pileli, sürme ve menteşeli sineklik sistemleri. Pencere ve kapı sinekliği montajı.",
    image: "/images/gallery/sineklik-1.jpg",
    imageAlt: "Efe İnşaat sineklik sistemi uygulama örneği",
  },
];

export function getService(slug: string): ServiceDefinition | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

export function getRelatedServices(slug: ServiceSlug): ServiceDefinition[] {
  return SERVICES.filter((service) => service.slug !== slug);
}
