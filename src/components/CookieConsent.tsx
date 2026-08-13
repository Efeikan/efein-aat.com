"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const STORAGE_KEY = "efe-cookie-consent";

export type CookieConsentValue = "accepted" | "rejected";

export function getCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STORAGE_KEY);
  if (value === "accepted" || value === "rejected") return value;
  return null;
}

export function CookieConsent() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) {
      setVisible(true);
    }
  }, []);

  const save = (value: CookieConsentValue) => {
    localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(
      new CustomEvent("efe-cookie-consent", { detail: value })
    );
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 inset-x-0 z-[100] p-4 sm:p-6"
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
        >
          <div className="max-w-4xl mx-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]/95 backdrop-blur-xl shadow-2xl shadow-black/40 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-900/40 text-primary-300">
                <Cookie className="h-5 w-5" aria-hidden />
              </div>

              <div className="flex-1 min-w-0">
                <h2
                  id="cookie-consent-title"
                  className="text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-1.5"
                >
                  {t("cookies.title") as string}
                </h2>
                <p
                  id="cookie-consent-desc"
                  className="text-sm text-[var(--text-secondary)] leading-relaxed"
                >
                  {t("cookies.description") as string}
                </p>
              </div>

              <div className="flex flex-col gap-2 shrink-0 sm:min-w-[140px]">
                <button
                  type="button"
                  onClick={() => save("accepted")}
                  className="px-4 py-2.5 rounded-md bg-primary-600 text-white text-xs font-semibold uppercase tracking-wide hover:bg-primary-500 transition-colors"
                >
                  {t("cookies.accept") as string}
                </button>
                <button
                  type="button"
                  onClick={() => save("rejected")}
                  className="px-4 py-2.5 rounded-md border border-[var(--border-color)] text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wide hover:border-primary-700 hover:text-primary-300 transition-colors"
                >
                  {t("cookies.reject") as string}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
