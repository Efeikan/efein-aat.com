import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicePage from "@/components/ServicePage";
import JsonLd from "@/components/JsonLd";
import {
  buildServiceJsonLd,
  buildServiceMetadata,
  requireService,
} from "@/lib/service-seo";

const service = requireService("cam-balkon");

export const metadata = buildServiceMetadata(service);

export default function CamBalkonPage() {
  return (
    <>
      <JsonLd data={buildServiceJsonLd(service)} />
      <Navbar />
      <main>
        <ServicePage slug="cam-balkon" />
      </main>
      <Footer />
    </>
  );
}
