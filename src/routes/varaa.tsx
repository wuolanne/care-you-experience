import { createFileRoute } from "@tanstack/react-router";
import { BookingCalendar } from "@/features/booking/BookingCalendar";
import { pageHead } from "@/features/seo/head";

export const Route = createFileRoute("/varaa")({
  head: () => pageHead({
    path: "/varaa",
    title: "Varaa videopalaveri | TGN Services",
    description: "Varaa 30 minuutin videopalaveri ja aloitetaan yhteistyö rauhassa suunnitellen.",
  }),
  component: Page,
});

function Page() {
  return <BookingCalendar />;
}
