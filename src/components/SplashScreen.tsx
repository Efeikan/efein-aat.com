"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2 } from "lucide-react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const hideTimer = setTimeout(() => setVisible(false), 2200);
    const unlockTimer = setTimeout(() => {
      document.body.style.overflow = "";
    }, 2800);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(unlockTimer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--bg-primary)] via-[#0e1a17] to-[var(--bg-secondary)]"
          aria-hidden={!visible}
        >
          <motion.div
            aria-hidden
            initial={{ backgroundPosition: "0px 0px" }}
            animate={{ backgroundPosition: ["0px 0px", "48px 48px"] }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage:
                "linear-gradient(rgba(155,188,176,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(155,188,176,0.10) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
            className="absolute inset-0"
          />
          {/* Vignette fade so the grid softens toward the edges without relying on CSS masks */}
          <div
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, var(--bg-primary) 85%)",
            }}
            className="absolute inset-0"
          />

          <motion.div
            animate={{
              x: [0, 20, 0],
              y: [0, 15, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-primary-600/25 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -20, 0],
              y: [0, -15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-primary-700/30 blur-3xl"
          />

          {[...Array(8)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-primary-400/60"
              style={{
                left: `${12 + i * 10}%`,
                top: `${20 + ((i * 37) % 60)}%`,
              }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.9, 0], y: [-10, -60] }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.35,
                ease: "easeOut",
              }}
            />
          ))}

          <div className="relative flex flex-col items-center px-6 text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-6 flex h-20 w-20 items-center justify-center"
            >
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0%, #6f9a8c 20%, transparent 45%, transparent 55%, #9bbcb0 75%, transparent 100%)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="absolute inset-[3px] rounded-full bg-[var(--bg-primary)]"
              />
              <motion.span
                className="absolute inset-0 rounded-full bg-primary-500/40"
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-card)] shadow-lg shadow-black/40 ring-1 ring-primary-700/60"
              >
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Building2 className="h-8 w-8 text-primary-400" />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{
                opacity: 1,
                y: 0,
                textShadow: [
                  "0 0 0px rgba(155,188,176,0)",
                  "0 0 18px rgba(155,188,176,0.55)",
                  "0 0 0px rgba(155,188,176,0)",
                ],
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
                textShadow: { duration: 2.6, repeat: Infinity, delay: 1, ease: "easeInOut" },
              }}
              className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl"
            >
              Efe İnşaat
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 h-px w-28 origin-center bg-gradient-to-r from-transparent via-primary-400 to-transparent"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              className="mt-4 text-sm font-medium tracking-[0.2em] text-primary-300/80 uppercase"
            >
              Kaliteli Çözümler
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-primary-900/50"
            >
              <motion.div
                className="h-full w-1/3 rounded-full bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400"
                animate={{ x: ["-100%", "220%"] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
