import { createFileRoute } from "@tanstack/react-router";
import { BookingCalendar } from "@/features/booking/BookingCalendar";

export const Route = createFileRoute("/varaa")({
  head: () => ({
    meta: [
      { title: "Varaa videopalaveri | TGN Services" },
      { name: "description", content: "Varaa 30 minuutin videopalaveri ja aloitetaan yhteistyö rauhassa suunnitellen." },
      { property: "og:title", content: "Varaa videopalaveri | TGN Services" },
      { property: "og:description", content: "Sovitaan etätapaaminen ja käydään tarpeesi läpi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <BookingCalendar />;
}
