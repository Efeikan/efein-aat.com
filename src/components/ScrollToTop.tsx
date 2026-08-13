"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Sayfa değişince viewport'u üste alır (navbar linklerinde alta kaymayı önler). */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;

    // CSS scroll-behavior: smooth, programmatic scrollTo'yu da kaydırabilir —
    // kısa süre auto yapıp üste zorla alıyoruz.
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const jump = () => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      html.scrollTop = 0;
    };

    jump();
    const t1 = window.setTimeout(jump, 0);
    const t2 = window.setTimeout(() => {
      jump();
      html.style.scrollBehavior = previous;
    }, 50);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      html.style.scrollBehavior = previous;
    };
  }, [pathname]);

  return null;
}
