import { createFileRoute } from "@tanstack/react-router";
import { BusinessService } from "@/features/business-service/BusinessService";
import { pageHead } from "@/features/seo/head";
import { publicContentQuery } from "@/features/content/queries";

export const Route = createFileRoute("/care-yrityksille")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publicContentQuery("business-service", "fi")),
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
