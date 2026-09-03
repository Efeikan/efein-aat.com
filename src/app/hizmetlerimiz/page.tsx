import { permanentRedirect } from "next/navigation";

/** Legacy single services URL → cam-balkon (also configured as 301 in next.config). */
export default function HizmetlerimizIndexPage() {
  permanentRedirect("/hizmetlerimiz/cam-balkon");
}
