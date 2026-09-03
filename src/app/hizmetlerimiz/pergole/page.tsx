import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicePage from "@/components/ServicePage";
import JsonLd from "@/components/JsonLd";
import {
  buildServiceJsonLd,
  buildServiceMetadata,
  requireService,
} from "@/lib/service-seo";

const service = requireService("pergole");

export const metadata = buildServiceMetadata(service);

export default function PergolePage() {
  return (
    <>
      <JsonLd data={buildServiceJsonLd(service)} />
      <Navbar />
      <main>
        <ServicePage slug="pergole" />
      </main>
      <Footer />
    </>
  );
}
