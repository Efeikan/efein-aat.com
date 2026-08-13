import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hizmetlerimiz",
  description:
    "Efe İnşaat uzmanlığı: anahtar teslim inşaat, kentsel dönüşüm, kat karşılığı arsa değerlendirme, mimari tasarım ve proje yönetimi.",
};

export default function HizmetlerimizLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
