import { createFileRoute } from "@tanstack/react-router";
import { HomeService } from "@/features/home-service/HomeService";

export const Route = createFileRoute("/care-kotiin")({
  head: () => ({
    meta: [
      { title: "TGN Kotiin — Kodinhoitoa ja siivousta sisälle ja ulos | TGN Services" },
      { name: "description", content: "Kotisiivous, kodinhoito ja pihatyöt Uudellamaalla. Kiinteät kuukausipaketit, nimetyt vastuuhenkilöt ja TGN-laatutakuu." },
      { property: "og:title", content: "TGN Kotiin | TGN Services" },
      { property: "og:description", content: "Huolellista kodinhoitoa ja siivousta sisä- ja ulkotiloihin. Kuukausipaketit tai erillistunnit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <HomeService />;
}
