"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const galleryItems = [
  { id: 1, category: "pimapen", image: "/images/gallery/pimapen-1.jpg" },
  { id: 2, category: "cam-balkon", image: "/images/gallery/cam-balkon-1.jpg" },
  { id: 3, category: "pergole", image: "/images/gallery/pergole-1.jpg" },
  { id: 4, category: "sineklik", image: "/images/gallery/sineklik-1.jpg" },
  { id: 5, category: "pimapen", image: "/images/gallery/pimapen-2.jpg" },
  { id: 6, category: "cam-balkon", image: "/images/gallery/cam-balkon-2.jpg" },
  { id: 7, category: "pergole", image: "/images/gallery/pergole-2.jpg" },
  { id: 8, category: "sineklik", image: "/images/gallery/sineklik-2.jpg" },
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
            <span className="inline-block px-4 py-1.5 bg-primary-900/30 text-primary-300 rounded-full text-sm font-medium mb-4">
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
                <Image
                  src={item.image}
                  alt={categoryLabels[item.category][language]}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
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
            className="relative max-w-2xl w-full aspect-square rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryItems[lightbox].image}
              alt={categoryLabels[galleryItems[lightbox].category][language]}
              fill
              sizes="(min-width: 768px) 640px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <span className="text-white text-lg font-semibold">
                {categoryLabels[galleryItems[lightbox].category][language]}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
