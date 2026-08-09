"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface CounterProps {
  end: number;
  suffix?: string;
  isInView: boolean;
}

function Counter({ end, suffix = "", isInView }: CounterProps) {
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

const statsData = [
  { key: "projects", value: 850, suffix: "+" },
  { key: "customers", value: 1200, suffix: "+" },
  { key: "experience", value: 15, suffix: "+" },
  { key: "cities", value: 25, suffix: "+" },
];

export default function Stats() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative overflow-hidden bg-ink-950 border-y border-white/5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/50 to-transparent" />
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-300 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-300 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-20" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 lg:divide-x divide-white/10">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center px-4 py-6 lg:py-0"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
                <Counter
                  end={stat.value}
                  suffix={stat.suffix}
                  isInView={isInView}
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
  );
}
