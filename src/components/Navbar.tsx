"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Building2, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "./LanguageToggle";

const navLinks = [
  { key: "home", href: "/#hero" },
  { key: "about", href: "/hakkimizda" },
  { key: "services", href: "/hizmetlerimiz" },
  { key: "gallery", href: "/#gallery" },
  { key: "testimonials", href: "/#testimonials" },
  { key: "faq", href: "/#faq" },
  { key: "contact", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = (href: string) => {
    setIsOpen(false);

    if (href.startsWith("/#") || href.startsWith("#")) {
      const hash = href.includes("#") ? `#${href.split("#")[1]}` : href;
      if (pathname !== "/") {
        window.location.assign(`/${hash}`);
        return;
      }
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    router.push(href);
    // Sayfa değişiminde üste al (hash'li iç linkler hariç)
    if (!href.includes("#")) {
      const html = document.documentElement;
      const previous = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      const jump = () => {
        window.scrollTo(0, 0);
        html.scrollTop = 0;
      };
      jump();
      requestAnimationFrame(jump);
      window.setTimeout(() => {
        jump();
        html.style.scrollBehavior = previous;
      }, 50);
    }
  };

  return (
    <>
      {/* Top info bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-ink-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-xs">
            <div className="flex items-center gap-4">
              <a href="mailto:info@efeinşaat.com" className="flex items-center gap-1.5 hover:text-primary-300 transition-colors">
                <Mail className="w-3 h-3" />
                <span className="hidden sm:inline">info@efeinşaat.com</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-9 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--bg-primary)]/95 backdrop-blur-xl shadow-lg border-b border-[var(--border-color)]"
            : "bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)]/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            <a
              href="/#hero"
              onClick={(e) => {
                e.preventDefault();
                navigate("/#hero");
              }}
              className="flex items-center gap-2.5 group"
            >
              <motion.div
                whileHover={{ scale: 1.06, rotate: 3 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative flex h-10 w-10 items-center justify-center"
              >
                <span className="absolute inset-0 rounded-2xl bg-primary-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-300/90 via-primary-400/90 to-primary-500/90 shadow-[0_4px_14px_-4px_rgba(85,127,114,0.55)] ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 group-hover:from-primary-400/90 group-hover:to-primary-600/90">
                  <Building2 className="h-[18px] w-[18px] text-white/95" strokeWidth={2.25} />
                </div>
              </motion.div>
              <span className="text-lg font-bold text-[var(--text-primary)] leading-tight">
                Efe İnşaat
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.href);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] hover:text-primary-400 transition-colors rounded-md hover:bg-primary-900/10"
                >
                  {t(`nav.${link.key}`) as string}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/#contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/#contact");
                }}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-xs font-semibold uppercase tracking-wide rounded-md hover:bg-primary-700 transition-all shadow-sm hover:shadow-md"
              >
                {t("nav.contact") as string}
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-[var(--bg-primary)]/98 backdrop-blur-xl border-b border-[var(--border-color)] overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.href);
                    }}
                    className="block px-4 py-2.5 text-base font-medium text-[var(--text-secondary)] hover:text-primary-400 hover:bg-primary-900/10 rounded-lg transition-colors"
                  >
                    {t(`nav.${link.key}`) as string}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
