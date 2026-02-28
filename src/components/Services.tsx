"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  DoorOpen,
  GlassWater,
  Umbrella,
  Bug,
  Check,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const serviceIcons = [DoorOpen, GlassWater, Umbrella, Bug];

export default function Services() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeModal, setActiveModal] = useState<number | null>(null);

  const items = t("services.items") as Array<{
    title: string;
    description: string;
    features: string[];
  }>;

  return (
    <>
      <section id="services" className="py-20 lg:py-32 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
              {t("services.sectionTag") as string}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6">
              {t("services.title") as string}
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              {t("services.subtitle") as string}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {items.map((item, index) => {
              const Icon = serviceIcons[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group relative p-6 lg:p-8 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/50 dark:bg-primary-900/20 rounded-bl-full transition-all duration-300 group-hover:w-40 group-hover:h-40" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                    </div>

                    <h3 className="text-xl lg:text-2xl font-bold text-[var(--text-primary)] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.features.map((feature, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full"
                        >
                          <Check className="w-3 h-3" />
                          {feature}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveModal(index)}
                      className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium text-sm hover:text-primary-800 dark:hover:text-primary-300 transition-colors group/btn"
                    >
                      {t("services.learnMore") as string}
                      <svg
                        className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {activeModal !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setActiveModal(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[var(--bg-card)] rounded-2xl max-w-lg w-full p-8 relative shadow-2xl border border-[var(--border-color)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const Icon = serviceIcons[activeModal];
              const item = items[activeModal];
              return (
                <>
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                    {item.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="space-y-3">
                    {item.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="text-[var(--text-primary)]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
