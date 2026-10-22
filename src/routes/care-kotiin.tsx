import { createFileRoute } from "@tanstack/react-router";
import { HomeService } from "@/features/home-service/HomeService";
import { pageHead } from "@/features/seo/head";
import { publicContentQuery } from "@/features/content/queries";

export const Route = createFileRoute("/care-kotiin")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publicContentQuery("home-service", "fi")),
  head: () => pageHead({
    path: "/care-kotiin",
    title: "TGN Kotiin — Kodinhoitoa ja siivousta sisälle ja ulos | TGN Services",
    description: "Kotisiivous, kodinhoito ja pihatyöt Uudellamaalla. Kiinteät kuukausipaketit, nimetyt vastuuhenkilöt ja TGN-laatutakuu.",
  }),
  component: Page,
});

function Page() {
  return <HomeService />;
}
