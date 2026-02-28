"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
      className="flex items-center gap-1 px-2 py-1 rounded text-slate-300 hover:text-primary-400 transition-colors text-xs font-medium"
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5" />
      <span className="uppercase">{language === "tr" ? "EN" : "TR"}</span>
    </button>
  );
}
