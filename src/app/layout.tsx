import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://efeinsaat.com"),
  title: "Efe İnşaat | Güvenilir Yapı, İnşaat ve Tadilat Hizmetleri",
  description:
    "Efe İnşaat olarak anahtar teslim inşaat, mimari proje ve tadilat hizmetleri sunuyoruz. Modern, sağlam ve güvenilir yapılar için doğru adres.",
  keywords: ["efe inşaat", "efeinsaat", "inşaat firması", "tadilat", "mimari proje", "anahtar teslim yapı"],
  openGraph: {
    title: "Efe İnşaat | Güvenilir Yapı, İnşaat ve Tadilat Hizmetleri",
    description:
      "Efe İnşaat olarak anahtar teslim inşaat, mimari proje ve tadilat hizmetleri sunuyoruz. Modern, sağlam ve güvenilir yapılar için doğru adres.",
    url: "https://efeinsaat.com",
    siteName: "Efe İnşaat",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
