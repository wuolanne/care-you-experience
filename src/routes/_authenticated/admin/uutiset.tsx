import { createFileRoute } from "@tanstack/react-router";
import { NewsEditor } from "@/features/news/NewsEditor";
import { newsEditorQuery } from "@/features/news/NewsEditor.query";
import { pageHead } from "@/features/news/head";

export const Route = createFileRoute("/_authenticated/admin/uutiset")({
  head: () => pageHead("Uutisten ylläpito", "Lisää ja muokkaa TGN Services -uutisia."),
  loader: ({ context }) => context.queryClient.ensureQueryData(newsEditorQuery),
  component: NewsEditor,
  errorComponent: () => (
    <p className="p-12">Uutisia ei voitu ladata. Päivitä sivu ja yritä uudelleen.</p>
  ),
});
