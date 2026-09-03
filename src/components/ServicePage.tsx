"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Clock3,
  Award,
  GlassWater,
  Umbrella,
  DoorOpen,
  Bug,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import QuoteForm from "@/components/QuoteForm";
import {
  type ServiceSlug,
  getRelatedServices,
  SERVICES,
} from "@/lib/services";

const badgeIcons = [ShieldCheck, Clock3, Award];

const serviceIcons: Record<ServiceSlug, typeof GlassWater> = {
  "cam-balkon": GlassWater,
  pergole: Umbrella,
  pimapen: DoorOpen,
  sineklik: Bug,
};

type ServicePageProps = {
  slug: ServiceSlug;
};

export default function ServicePage({ slug }: ServicePageProps) {
  const { t } = useLanguage();
  const contentRef = useRef(null);
  const relatedRef = useRef(null);
  const contentInView = useInView(contentRef, { once: true, margin: "-80px" });
  const relatedInView = useInView(relatedRef, { once: true, margin: "-80px" });

  const page = t(`servicePages.${slug}`) as {
    sectionTag: string;
    h1: string;
    intro: string;
    body: string[];
    featuresTitle: string;
    features: string[];
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
    relatedTitle: string;
    relatedSubtitle: string;
  };

  const badges = t("servicePages.badges") as string[];
  const related = getRelatedServices(slug);
  const current = SERVICES.find((service) => service.slug === slug)!;
  const Icon = serviceIcons[slug];

  useEffect(() => {
    if (window.location.hash === "#teklif-formu") {
      const timer = window.setTimeout(() => {
        document
          .querySelector("#teklif-formu")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const scrollToQuote = () => {
    document
      .querySelector("#teklif-formu")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <section className="relative min-h-[68vh] flex items-end overflow-hidden bg-ink-950 pt-[5.75rem] lg:pt-[6.25rem]">
        <Image
          src={current.image}
          alt={current.imageAlt}
          fill
          priority
          className="object-cover object-center opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-ink-950/75 to-ink-950/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-transparent to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 bg-primary-900/40 text-primary-300 rounded-full text-sm font-medium mb-5 backdrop-blur-sm ring-1 ring-primary-700/40">
              {page.sectionTag}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.15] tracking-tight mb-6">
              {page.h1}
            </h1>
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
              {page.intro}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-[var(--bg-secondary)] border-y border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {badges.map((badge, index) => {
              const BadgeIcon = badgeIcons[index] ?? ShieldCheck;
              return (
                <div
                  key={badge}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3.5 shadow-sm shadow-black/20"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-900/35 text-primary-400">
                    <BadgeIcon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                    {badge}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[var(--bg-primary)]" ref={contentRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 28 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-lg shadow-black/20"
          >
            <div className="relative lg:col-span-5 min-h-[240px] lg:min-h-[420px]">
              <Image
                src={current.image}
                alt={current.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent" />
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-xl bg-primary-900/35 flex items-center justify-center mb-5">
                <Icon className="w-6 h-6 text-primary-400" />
              </div>
              <div className="space-y-4 mb-8">
                {page.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
                {page.featuresTitle}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {page.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-[var(--text-primary)]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-900/35">
                      <Check className="h-3.5 w-3.5 text-primary-400" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        </div>
      </section>

      <section
        className="py-20 lg:py-28 bg-[var(--bg-secondary)]"
        ref={relatedRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={relatedInView ? { opacity: 1, y: 0 } : {}}
            className="mb-12 max-w-2xl"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
              {page.relatedTitle}
            </h2>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
              {page.relatedSubtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
            {related.map((service, index) => {
              const relatedCopy = t(`servicePages.${service.slug}`) as {
                h1: string;
                intro: string;
              };
              const RelatedIcon = serviceIcons[service.slug];
              return (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={relatedInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Link
                    href={`/hizmetlerimiz/${service.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-md shadow-black/20 hover:border-primary-700/80 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={service.image}
                        alt={service.imageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col p-5 lg:p-6">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-900/35 text-primary-400">
                        <RelatedIcon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 tracking-tight">
                        {relatedCopy.h1}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3 flex-1">
                        {relatedCopy.intro}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-primary-400 text-sm font-semibold uppercase tracking-wide">
                        {t("servicePages.learnMore") as string}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 lg:py-24 bg-ink-950">
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute -top-16 left-1/4 w-72 h-72 bg-primary-300 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 right-1/4 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/50 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5 leading-tight">
              {page.ctaTitle}
            </h2>
            <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              {page.ctaDescription}
            </p>
            <button
              type="button"
              onClick={scrollToQuote}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-primary-500 text-white text-sm font-semibold uppercase tracking-wide rounded-md hover:bg-primary-400 transition-all shadow-lg shadow-black/30 hover:shadow-xl"
            >
              {page.ctaButton}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      <QuoteForm />
    </div>
  );
}
