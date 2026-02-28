"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const galleryItems = [
  { id: 1, category: "pimapen", color: "from-blue-400 to-blue-600" },
  { id: 2, category: "cam-balkon", color: "from-cyan-400 to-cyan-600" },
  { id: 3, category: "pergole", color: "from-amber-400 to-amber-600" },
  { id: 4, category: "sineklik", color: "from-emerald-400 to-emerald-600" },
  { id: 5, category: "pimapen", color: "from-indigo-400 to-indigo-600" },
  { id: 6, category: "cam-balkon", color: "from-teal-400 to-teal-600" },
  { id: 7, category: "pergole", color: "from-orange-400 to-orange-600" },
  { id: 8, category: "sineklik", color: "from-green-400 to-green-600" },
];

const categoryLabels: Record<string, Record<string, string>> = {
  pimapen: { tr: "Pimapen", en: "PVC Windows" },
  "cam-balkon": { tr: "Cam Balkon", en: "Glass Balcony" },
  pergole: { tr: "Pergole", en: "Pergola" },
  sineklik: { tr: "Sineklik", en: "Insect Screen" },
};

export default function Gallery() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <section id="gallery" className="py-20 lg:py-32 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
              {t("gallery.sectionTag") as string}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6">
              {t("gallery.title") as string}
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              {t("gallery.subtitle") as string}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setLightbox(index)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} transition-transform duration-500 group-hover:scale-110`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/30 text-6xl font-bold">
                    {item.id}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 text-center">
                    <ZoomIn className="w-8 h-8 text-white mx-auto mb-2" />
                    <span className="text-white text-sm font-medium">
                      {categoryLabels[item.category][language]}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {lightbox !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl w-full aspect-square rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-full h-full bg-gradient-to-br ${galleryItems[lightbox].color} flex items-center justify-center`}
            >
              <div className="text-center text-white">
                <span className="text-8xl font-bold opacity-30 block mb-4">
                  {galleryItems[lightbox].id}
                </span>
                <span className="text-xl font-medium">
                  {categoryLabels[galleryItems[lightbox].category][language]}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
