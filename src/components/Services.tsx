"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Building2,
  RefreshCw,
  Landmark,
  PenTool,
  ClipboardCheck,
  Factory,
  Search,
  FileCheck,
  Hammer,
  KeyRound,
  ShieldCheck,
  Clock3,
  Award,
  ArrowRight,
  Check,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import QuoteForm from "@/components/QuoteForm";

const serviceIcons = [
  Building2,
  RefreshCw,
  Landmark,
  PenTool,
  ClipboardCheck,
  Factory,
];

const serviceImages = [
  "/images/markets/residential.jpg",
  "/images/markets/renovation.jpg",
  "/images/markets/custom.jpg",
  "/images/gallery/pergole-1.jpg",
  "/images/markets/commercial.jpg",
  "/images/gallery/pimapen-1.jpg",
];

const processIcons = [Search, FileCheck, Hammer, KeyRound];
const badgeIcons = [ShieldCheck, Clock3, Award];

export default function Services() {
  const { t } = useLanguage();
  const listRef = useRef(null);
  const processRef = useRef(null);
  const faqRef = useRef(null);
  const listInView = useInView(listRef, { once: true, margin: "-80px" });
  const processInView = useInView(processRef, { once: true, margin: "-80px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-80px" });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const items = t("services.items") as Array<{
    title: string;
    description: string;
    features: string[];
  }>;
  const process = t("services.process.steps") as Array<{
    title: string;
    description: string;
  }>;
  const faqItems = t("services.faq.items") as Array<{
    question: string;
    answer: string;
  }>;
  const badges = t("services.badges") as string[];

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
    <div id="services">
      <section className="relative min-h-[68vh] flex items-end overflow-hidden bg-ink-950 pt-[5.75rem] lg:pt-[6.25rem]">
        <Image
          src="/images/markets/commercial.jpg"
          alt={t("services.heroImageAlt") as string}
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
              {t("services.sectionTag") as string}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.15] tracking-tight mb-6">
              {t("services.title") as string}
            </h1>
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
              {t("services.subtitle") as string}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-[var(--bg-secondary)] border-y border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {badges.map((badge, index) => {
              const Icon = badgeIcons[index] ?? ShieldCheck;
              return (
                <div
                  key={badge}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3.5 shadow-sm shadow-black/20"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-900/35 text-primary-400">
                    <Icon className="h-5 w-5" />
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

      <section className="py-20 lg:py-28 bg-[var(--bg-primary)]" ref={listRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={listInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="mb-14 lg:mb-16 max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400 mb-3">
              {t("services.categoriesLabel") as string}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
              {t("services.categoriesTitle") as string}
            </h2>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
              {t("services.categoriesSubtitle") as string}
            </p>
          </motion.div>

          <div className="space-y-10 lg:space-y-14">
            {items.map((item, index) => {
              const Icon = serviceIcons[index] ?? Building2;
              const reversed = index % 2 === 1;
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  animate={listInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  className="group grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-lg shadow-black/20 hover:border-primary-700/80 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
                >
                  <div
                    className={`relative lg:col-span-5 min-h-[240px] lg:min-h-[340px] ${
                      reversed ? "lg:order-2" : ""
                    }`}
                  >
                    <Image
                      src={serviceImages[index]}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 1024px) 100vw, 42vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent" />
                  </div>

                  <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                    <div className="w-12 h-12 rounded-xl bg-primary-900/35 flex items-center justify-center mb-5 group-hover:bg-primary-600 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-primary-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight mb-3">
                      {item.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-6">
                      {item.description}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {item.features.map((feature) => (
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
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="py-20 lg:py-28 bg-[var(--bg-secondary)]"
        ref={processRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-14 lg:mb-16 max-w-2xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 bg-primary-900/30 text-primary-300 rounded-full text-sm font-medium mb-4">
              {t("services.process.sectionTag") as string}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
              {t("services.process.title") as string}
            </h2>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
              {t("services.process.subtitle") as string}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary-700/50 to-transparent" />
            {process.map((step, index) => {
              const Icon = processIcons[index] ?? Search;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={processInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-md shadow-black/20 hover:-translate-y-1 hover:border-primary-700/80 hover:shadow-xl transition-all duration-300"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900/35 text-primary-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-3xl font-bold text-primary-700/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[var(--bg-primary)]" ref={faqRef}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-primary-900/30 text-primary-300 rounded-full text-sm font-medium mb-4">
              {t("services.faq.sectionTag") as string}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              {t("services.faq.title") as string}
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 16 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left p-5 lg:p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] hover:border-primary-700 transition-all duration-200 shadow-sm shadow-black/10"
                  aria-expanded={openFaq === index}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-[var(--text-primary)] text-sm lg:text-base">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[var(--text-secondary)] transition-transform duration-300 flex-shrink-0 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-[var(--text-secondary)] text-sm leading-relaxed border-t border-[var(--border-color)] pt-4">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
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
              {t("services.ctaTitle") as string}
            </h2>
            <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              {t("services.ctaDescription") as string}
            </p>
            <button
              type="button"
              onClick={scrollToQuote}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-primary-500 text-white text-sm font-semibold uppercase tracking-wide rounded-md hover:bg-primary-400 transition-all shadow-lg shadow-black/30 hover:shadow-xl"
            >
              {t("services.ctaButton") as string}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      <QuoteForm />
    </div>
  );
}
