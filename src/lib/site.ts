/**
 * Kanonik site adresi: efeinşaat.com (IDN).
 * HTTPS / Resend / sitemap için Punycode formu kullanılır:
 * https://xn--efeinaat-rwb.com
 */

/** Tarayıcı ve e-posta imzasında görünen marka domain */
export const SITE_DISPLAY = "efeinşaat.com";

/** Teknik kanonik URL (HTTPS, schema, sitemap, e-posta linkleri) */
export const SITE_URL = "https://xn--efeinaat-rwb.com";

/** Punycode host — Resend API ASCII ister */
export const SITE_HOST_ASCII = "xn--efeinaat-rwb.com";

/** UI’da görünen e-posta */
export const DISPLAY_EMAIL = "info@efeinşaat.com";

/** Resend from/to/reply_to için ASCII (Punycode) adres */
export const RESEND_EMAIL = `info@${SITE_HOST_ASCII}`;
