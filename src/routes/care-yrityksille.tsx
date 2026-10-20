import { createFileRoute } from "@tanstack/react-router";
import { BusinessService } from "@/features/business-service/BusinessService";

export const Route = createFileRoute("/care-yrityksille")({
  head: () => ({
    meta: [
      { title: "TGN Yrityksille — Toimitilojen siivous ja ulkoalueiden hoito | TGN Services" },
      { name: "description", content: "Toimitilojen siivous sovitulla rytmillä, ulkoalueiden hoito ja käsin tehtävät lumityöt. Joustavat kuukausipalvelut ja nimetty vastuuhenkilö." },
      { property: "og:title", content: "TGN YRITYKSILLE | TGN Services" },
      { property: "og:description", content: "Toimitilojen huolenpito niin sisällä kuin ulkona: siivous, käsin tehtävät lumityöt ja luotettava kumppanuus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <BusinessService />;
}
