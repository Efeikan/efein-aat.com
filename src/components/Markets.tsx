"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Home, Building2, Hammer, Sparkles, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const marketItems = [
  { key: "residential", icon: Home, image: "/images/markets/residential.jpg" },
  { key: "commercial", icon: Building2, image: "/images/markets/commercial.jpg" },
  { key: "renovation", icon: Hammer, image: "/images/markets/renovation.jpg" },
  { key: "custom", icon: Sparkles, image: "/images/markets/custom.jpg" },
];

export default function Markets() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="markets" className="py-20 lg:py-32 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-900/30 text-primary-300 rounded-full text-sm font-medium mb-4">
            {t("markets.sectionTag") as string}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6">
            {t("markets.title") as string}
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            {t("markets.subtitle") as string}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {marketItems.map(({ key, icon: Icon, image }, index) => {
            const item = t(`markets.items.${key}`) as { title: string; description: string };
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

                <div className="absolute top-5 left-5 w-11 h-11 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-primary-300 text-sm font-semibold uppercase tracking-wide opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {t("markets.explore") as string}
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
