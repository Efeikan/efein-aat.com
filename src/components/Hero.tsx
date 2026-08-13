"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowDown, Mail, DoorOpen, GlassWater, Umbrella, Bug } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const categories = [
  { key: "pimapen", icon: DoorOpen },
  { key: "camBalkon", icon: GlassWater },
  { key: "pergole", icon: Umbrella },
  { key: "sineklik", icon: Bug },
];

export default function Hero() {
  const { t } = useLanguage();
  const router = useRouter();

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink-950"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-900 to-primary-900" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[550px] h-[550px] bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-300/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
      }} />

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-400/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-9"
        >
          {categories.map(({ key, icon: Icon }) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md border border-white/15 bg-white/[0.03] text-primary-200 text-xs sm:text-sm font-semibold uppercase tracking-wider"
            >
              <Icon className="w-3.5 h-3.5" />
              {t(`hero.categories.${key}`) as string}
            </span>
          ))}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-7"
        >
          {t("hero.title") as string}
          <br className="hidden sm:block" />{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-500">
            {t("hero.titleHighlight") as string}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-light"
        >
          {t("hero.subtitle") as string}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => router.push("/hizmetlerimiz")}
            className="px-8 py-4 bg-primary-500 text-white font-semibold uppercase tracking-wide text-sm rounded-md hover:bg-primary-600 transition-all duration-200 shadow-lg shadow-black/30"
          >
            {t("hero.cta") as string}
          </button>
          <button
            onClick={() => scrollTo("#contact")}
            className="px-8 py-4 border border-white/25 text-white font-semibold uppercase tracking-wide text-sm rounded-md hover:bg-white/5 hover:border-white/40 transition-all duration-200 flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            {t("hero.ctaSecondary") as string}
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={() => scrollTo("#markets")}
          className="text-white/40 hover:text-primary-300 transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </motion.div>
    </section>
  );
}
