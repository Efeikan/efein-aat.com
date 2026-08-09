import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Efe İnşaat - Pimapen, Cam Balkon, Pergole ve Sineklik",
    short_name: "Efe İnşaat",
    description:
      "Efe İnşaat, Ataşehir ve İstanbul genelinde pimapen, cam balkon, pergole ve sineklik sistemlerinde uzman çözümler sunar.",
    start_url: "/",
    display: "standalone",
    background_color: "#121816",
    theme_color: "#557f72",
    lang: "tr",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
