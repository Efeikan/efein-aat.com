"use client";

import { usePathname, useRouter } from "next/navigation";
import { Building2, ArrowUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const navLinks = [
  { key: "home", href: "/#hero" },
  { key: "about", href: "/hakkimizda" },
  { key: "services", href: "/hizmetlerimiz" },
  { key: "gallery", href: "/#gallery" },
  { key: "contact", href: "/#contact" },
];

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = (href: string) => {
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
    <footer className="bg-ink-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Efe İnşaat
              </span>
            </div>
            <p className="text-white/50 leading-relaxed max-w-md">
              {t("footer.description") as string}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-primary-300 uppercase tracking-widest mb-4">
              {t("footer.quickLinks") as string}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.href);
                    }}
                    className="text-white/50 hover:text-primary-300 transition-colors text-sm"
                  >
                    {t(`nav.${link.key}`) as string}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-primary-300 uppercase tracking-widest mb-4">
              {t("footer.contactInfo") as string}
            </h3>
            <ul className="space-y-3 text-sm text-white/50">
              <li>{t("contact.info.addressValue") as string}</li>
              <li>
                <a href="mailto:info@efeinşaat.com" className="hover:text-primary-300 transition-colors">
                  {t("contact.info.emailValue") as string}
                </a>
              </li>
              <li>{t("contact.info.hoursValue") as string}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Efe İnşaat. {t("footer.rights") as string}
          </p>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-md bg-white/5 border border-white/10 text-white/60 hover:text-primary-300 hover:border-primary-400/40 transition-all duration-200"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
