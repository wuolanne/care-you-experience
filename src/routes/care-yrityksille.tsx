import { createFileRoute } from "@tanstack/react-router";
import { BusinessService } from "@/features/business-service/BusinessService";
import { pageHead } from "@/features/seo/head";

export const Route = createFileRoute("/care-yrityksille")({
  head: () => pageHead({
    path: "/care-yrityksille",
    title: "TGN Yrityksille — Toimitilojen siivous ja ulkoalueiden hoito | TGN Services",
    description: "Toimitilojen siivous sovitulla rytmillä, ulkoalueiden hoito ja käsin tehtävät lumityöt. Joustavat kuukausipalvelut ja nimetty vastuuhenkilö.",
  }),
  component: Page,
});

function Page() {
  return <BusinessService />;
}
