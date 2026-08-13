"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  getCookieConsent,
  type CookieConsentValue,
} from "@/components/CookieConsent";

const GA_MEASUREMENT_ID = "G-YFQ2JYM85M";

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const apply = (value: CookieConsentValue | null) => {
      setEnabled(value === "accepted");
    };

    apply(getCookieConsent());

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<CookieConsentValue>).detail;
      apply(detail);
    };

    window.addEventListener("efe-cookie-consent", onConsent);
    return () => window.removeEventListener("efe-cookie-consent", onConsent);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
