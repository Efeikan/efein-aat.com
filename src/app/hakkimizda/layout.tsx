import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Efe İnşaat: Geleceği güvenle inşa eden bir başarı hikayesi. Kalite, zamanında teslimat ve sürdürülebilir çözümlerle Ataşehir & İstanbul.",
};

export default function HakkimizdaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
