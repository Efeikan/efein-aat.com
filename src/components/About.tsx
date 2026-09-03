"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  Compass,
  Clock3,
  Leaf,
  ArrowRight,
  Quote,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

const valueIcons = [Compass, Clock3, Leaf];

const storyStats = [
  { key: "projects", value: 850, suffix: "+" },
  { key: "experience", value: 15, suffix: "+" },
  { key: "customers", value: 1200, suffix: "+" },
];

function Counter({
  end,
  suffix = "",
  isInView,
}: {
  end: number;
  suffix?: string;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, isInView]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function About() {
  const { t } = useLanguage();
  const router = useRouter();
  const valuesRef = useRef(null);
  const storyRef = useRef(null);
  const statsRef = useRef(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-80px" });
  const storyInView = useInView(storyRef, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  const values = t("about.values") as Array<{
    title: string;
    description: string;
  }>;
  const paragraphs = t("about.storyParagraphs") as string[];

  const goToQuoteForm = () => {
    router.push("/hizmetlerimiz/cam-balkon#teklif-formu");
  };

  return (
    <div id="about">
      {/* Hero */}
      <section className="relative min-h-[72vh] flex items-end overflow-hidden bg-ink-950 pt-[5.75rem] lg:pt-[6.25rem]">
        <Image
          src="/images/markets/residential.jpg"
          alt={t("about.heroImageAlt") as string}
          fill
          priority
          className="object-cover object-center opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-ink-950/75 to-ink-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-transparent to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 bg-primary-900/40 text-primary-300 rounded-full text-sm font-medium mb-5 backdrop-blur-sm ring-1 ring-primary-700/40">
              {t("about.sectionTag") as string}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.15] tracking-tight mb-6">
              {t("about.title") as string}
            </h1>
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mb-8">
              {t("about.intro") as string}
            </p>
            <button
              type="button"
              onClick={goToQuoteForm}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-primary-500 text-white text-sm font-semibold uppercase tracking-wide rounded-md hover:bg-primary-400 transition-all shadow-lg shadow-black/30"
            >
              {t("about.ctaButton") as string}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-[var(--bg-secondary)]" ref={valuesRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="mb-12 lg:mb-16 max-w-2xl"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
              {t("about.valuesTitle") as string}
            </h2>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
              {t("about.valuesSubtitle") as string}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {values.map((value, index) => {
              const Icon = valueIcons[index] ?? Compass;
              return (
                <motion.article
                  key={value.title}
                  initial={{ opacity: 0, y: 28 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: index * 0.12 }}
                  className="group relative p-7 lg:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-primary-700/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-900/35 flex items-center justify-center mb-5 group-hover:bg-primary-600 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-primary-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3 tracking-tight">
                    {value.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
                    {value.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story / blog body */}
      <section className="py-20 lg:py-28 bg-[var(--bg-primary)]" ref={storyRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400 mb-4">
                {t("about.storyLabel") as string}
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-8 leading-snug">
                {t("about.storyTitle") as string}
              </h2>

              <div className="space-y-6 text-[var(--text-secondary)] text-base sm:text-lg leading-[1.8]">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>
                    {paragraph.split("**").map((part, i) =>
                      i % 2 === 1 ? (
                        <strong
                          key={i}
                          className="font-semibold text-[var(--text-primary)]"
                        >
                          {part}
                        </strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </p>
                ))}
              </div>

              <blockquote className="mt-10 relative pl-6 border-l-2 border-primary-500/70">
                <Quote className="absolute -left-3 -top-1 w-5 h-5 text-primary-400 bg-[var(--bg-primary)]" />
                <p className="text-lg sm:text-xl italic text-[var(--text-primary)]/90 leading-relaxed">
                  {t("about.quote") as string}
                </p>
              </blockquote>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 space-y-5"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--border-color)]">
                <Image
                  src="/images/markets/commercial.jpg"
                  alt={t("about.sideImageAlt1") as string}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent" />
              </div>
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--border-color)]">
                <Image
                  src="/images/gallery/pergole-1.jpg"
                  alt={t("about.sideImageAlt2") as string}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="relative overflow-hidden bg-ink-950 border-y border-white/5 py-16 lg:py-20"
        ref={statsRef}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/50 to-transparent" />
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-300 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-300 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            className="text-center text-primary-300/80 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-10"
          >
            {t("about.statsLabel") as string}
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-4">
            {storyStats.map((stat, index) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: index * 0.12 }}
                className="text-center px-4"
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
                  <Counter
                    end={stat.value}
                    suffix={stat.suffix}
                    isInView={statsInView}
                  />
                </div>
                <div className="text-primary-300/80 text-xs sm:text-sm font-semibold uppercase tracking-widest">
                  {t(`stats.${stat.key}`) as string}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-5 leading-tight">
              {t("about.ctaTitle") as string}
            </h2>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              {t("about.ctaDescription") as string}
            </p>
            <button
              type="button"
              onClick={goToQuoteForm}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-primary-600 text-white text-sm font-semibold uppercase tracking-wide rounded-md hover:bg-primary-500 transition-all shadow-lg shadow-black/25 hover:shadow-xl"
            >
              {t("about.ctaButton") as string}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
