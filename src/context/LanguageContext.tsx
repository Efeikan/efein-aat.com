"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import tr from "@/locales/tr.json";
import en from "@/locales/en.json";

type Language = "tr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string) => any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translations: Record<Language, any> = { tr, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("tr");

  useEffect(() => {
    const saved = localStorage.getItem("efe-lang") as Language;
    if (saved && (saved === "tr" || saved === "en")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("efe-lang", lang);
  }, []);

  const t = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (key: string): any => {
      const keys = key.split(".");
      let value: unknown = translations[language];
      for (const k of keys) {
        if (value && typeof value === "object" && k in (value as Record<string, unknown>)) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      return value;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
