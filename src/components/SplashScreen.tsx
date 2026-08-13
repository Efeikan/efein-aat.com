"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Building2 } from "lucide-react";

const BRAND = "Efe İnşaat";
const TAGLINE = "Kaliteli Çözümler";

/** Silk easing — slow start, long soft settle */
const silk: [number, number, number, number] = [0.22, 1, 0.36, 1];
const silkDeep: [number, number, number, number] = [0.05, 0.8, 0.1, 1];
const silkOut: [number, number, number, number] = [0.4, 0, 0.2, 1];

const HOLD_MS = 2800;
const EXIT_MS = 2000;
const TOTAL_MS = HOLD_MS + EXIT_MS;

const springEnter = {
  type: "spring" as const,
  stiffness: 52,
  damping: 16,
  mass: 1.05,
};

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const reduceMotion = useReducedMotion();
  const letters = useMemo(() => Array.from(BRAND), []);

  const dust = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: `${8 + ((i * 23) % 84)}%`,
        y: `${12 + ((i * 31) % 76)}%`,
        s: 1.2 + (i % 3) * 0.6,
        d: 5 + (i % 4) * 1.4,
        delay: i * 0.35,
      })),
    []
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const exitTimer = setTimeout(() => setExiting(true), HOLD_MS);
    const hideTimer = setTimeout(() => setVisible(false), TOTAL_MS);
    const unlockTimer = setTimeout(() => {
      document.body.style.overflow = "";
    }, TOTAL_MS + 200);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
      clearTimeout(unlockTimer);
      document.body.style.overflow = "";
    };
  }, []);

  const shellVariants: Variants = {
    show: { opacity: 1 },
    leave: {
      opacity: 0,
      transition: { duration: 0.9, ease: silkOut, delay: 0.85 },
    },
  };

  const stageVariants: Variants = {
    rest: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
    },
    away: {
      opacity: 0,
      scale: 0.68,
      y: 40,
      rotateX: 12,
      filter: "blur(20px)",
      transition: {
        duration: 1.85,
        ease: silkDeep,
        opacity: { duration: 1.55, ease: silkOut },
        filter: { duration: 1.7, ease: silk },
      },
    },
  };

  const letterContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.048,
        delayChildren: 0.38,
      },
    },
  };

  const letterItem: Variants = {
    hidden: {
      opacity: 0,
      y: 42,
      rotateX: -55,
    },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: springEnter,
    },
  };

  if (reduceMotion) {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            key="splash-reduced"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1210]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center">
              <p className="text-3xl font-semibold text-[#eef3f0]">{BRAND}</p>
              <p className="mt-3 text-xs tracking-[0.35em] text-primary-300/70 uppercase">
                {TAGLINE}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] overflow-hidden bg-[#070c0a]"
          variants={shellVariants}
          initial="show"
          animate={exiting ? "leave" : "show"}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          aria-hidden
        >
          {/* Base atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,#14201c_0%,#0a1210_55%,#050807_100%)]" />

          {/* Slow drifting haze — GPU friendly transforms only */}
          <motion.div
            className="absolute -left-1/4 top-[-10%] h-[70vh] w-[70vh] rounded-full bg-primary-600/20 blur-[90px]"
            animate={{ x: [0, 60, 20, 0], y: [0, 30, -10, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-1/4 bottom-[-15%] h-[75vh] w-[75vh] rounded-full bg-primary-800/25 blur-[100px]"
            animate={{ x: [0, -50, -15, 0], y: [0, -35, 10, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
          <motion.div
            className="absolute left-1/2 top-[42%] h-[36vmin] w-[56vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400/10 blur-[60px]"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.55] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Soft construction grid, fades with exit */}
          <motion.div
            className="absolute inset-0 opacity-[0.11]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(155,188,176,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(155,188,176,0.5) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage:
                "radial-gradient(ellipse 55% 45% at 50% 46%, #000 0%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 55% 45% at 50% 46%, #000 0%, transparent 75%)",
            }}
            animate={
              exiting
                ? { opacity: 0, scale: 1.15 }
                : { opacity: 0.11, scale: [1, 1.03, 1] }
            }
            transition={
              exiting
                ? { duration: 1.6, ease: silkDeep }
                : { duration: 12, repeat: Infinity, ease: "easeInOut" }
            }
          />

          {/* Horizontal light pass */}
          <motion.div
            className="pointer-events-none absolute inset-y-[-10%] w-[40%] bg-gradient-to-r from-transparent via-white/[0.055] to-transparent"
            style={{ skewX: "-18deg" }}
            initial={{ x: "-60%", opacity: 0 }}
            animate={{ x: ["-60%", "160%"], opacity: [0, 1, 0] }}
            transition={{ duration: 2.6, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Floating dust */}
          {dust.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-primary-200/50"
              style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
              animate={{
                y: [0, -36, -70],
                opacity: [0, 0.65, 0],
                x: [0, (p.id % 2 ? 14 : -12)],
              }}
              transition={{
                duration: p.d,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Perspective stage */}
          <div
            className="relative flex h-full w-full items-center justify-center"
            style={{ perspective: "1400px", perspectiveOrigin: "50% 42%" }}
          >
            <motion.div
              className="relative flex flex-col items-center px-6 text-center will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
              variants={stageVariants}
              initial="rest"
              animate={exiting ? "away" : "rest"}
            >
              {/* Emblem */}
              <motion.div
                className="relative mb-9"
                initial={{ opacity: 0, y: 36, scale: 0.88 }}
                animate={
                  exiting
                    ? { opacity: 0, y: 20, scale: 0.9 }
                    : { opacity: 1, y: 0, scale: 1 }
                }
                transition={
                  exiting
                    ? { duration: 1.2, ease: silkDeep }
                    : { ...springEnter, delay: 0.12 }
                }
              >
                <motion.span
                  className="absolute -inset-8 rounded-full bg-primary-500/20 blur-2xl"
                  animate={{ opacity: [0.25, 0.55, 0.3], scale: [0.92, 1.08, 1] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-[1.4rem] bg-[linear-gradient(160deg,#2a3631_0%,#141c19_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-primary-300/20">
                  <Building2
                    className="h-8 w-8 text-primary-300"
                    strokeWidth={1.4}
                  />
                </div>
              </motion.div>

              {/* Brand letters — spring cascade, 3D flip-in */}
              <motion.h1
                className="flex flex-wrap justify-center text-[clamp(2.5rem,7.5vw,4rem)] font-semibold tracking-[-0.035em] text-[#f2f6f4]"
                style={{ transformStyle: "preserve-3d" }}
                variants={letterContainer}
                initial="hidden"
                animate="show"
                aria-label={BRAND}
              >
                {letters.map((char, i) => (
                  <motion.span
                    key={`${char}-${i}`}
                    className="inline-block origin-bottom will-change-transform"
                    style={{ transformStyle: "preserve-3d" }}
                    variants={letterItem}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Divider */}
              <motion.div
                className="mt-7 h-px w-36 origin-center bg-gradient-to-r from-transparent via-primary-300/70 to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.15, delay: 1.05, ease: silk }}
              />

              {/* Tagline — tracking breathes in */}
              <motion.p
                className="mt-5 text-[0.68rem] font-medium uppercase text-primary-300/80"
                initial={{ opacity: 0, y: 14, letterSpacing: "0.62em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "0.4em" }}
                transition={{ duration: 1.35, delay: 1.2, ease: silk }}
              >
                {TAGLINE}
              </motion.p>

              {/* Progress — single continuous fill */}
              <motion.div
                className="mt-11 h-[1.5px] w-40 overflow-hidden rounded-full bg-white/[0.06]"
                initial={{ opacity: 0 }}
                animate={{ opacity: exiting ? 0 : 1 }}
                transition={{ duration: 0.55, delay: exiting ? 0 : 1.45 }}
              >
                <motion.div
                  className="h-full origin-left rounded-full bg-gradient-to-r from-primary-600 via-primary-300 to-primary-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: HOLD_MS / 1000,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Soft vignette + exit veil */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,transparent_30%,rgba(5,8,7,0.55)_100%)]" />
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[#070c0a]"
            initial={{ opacity: 0 }}
            animate={{ opacity: exiting ? 0.35 : 0 }}
            transition={{ duration: 1.6, ease: silkDeep }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
