import { createFileRoute } from "@tanstack/react-router";
import { NewsEditor } from "@/features/news/NewsEditor";
import { newsEditorQuery } from "@/features/news/NewsEditor.query";
import { pageHead } from "@/features/seo/head";

export const Route = createFileRoute("/_authenticated/admin/uutiset")({
  head: () =>
    pageHead({
      path: "/admin/uutiset",
      title: "Uutisten ylläpito | TGN Services",
      description: "Lisää ja muokkaa TGN Services -uutisia.",
      indexable: false,
    }),
  loader: ({ context }) => context.queryClient.ensureQueryData(newsEditorQuery),
  component: NewsEditor,
  errorComponent: () => (
    <p className="p-12">Uutisia ei voitu ladata. Päivitä sivu ja yritä uudelleen.</p>
  ),
});
