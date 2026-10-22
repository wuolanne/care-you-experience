import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site-pieces";
import { RequestForm } from "@/features/home-service/RequestForms";
import { useLang } from "@/i18n/LanguageProvider";
import { pageHead } from "@/features/seo/head";

export const Route = createFileRoute("/tarjouspyynto")({
  head: () => pageHead({
    path: "/tarjouspyynto",
    title: "Jätä yhteydenottopyyntö | TGN Services",
    description: "Jätä yhteystietosi ja kerro kodin tai yrityksen palvelutarpeista.",
  }),
  component: Page,
});

function Page() {
  const { tr } = useLang();
  return (
    <>
      <PageHero eyebrow={tr.actions.eyebrow} title={tr.quote.title} lead={tr.quote.lead} />
      <div className="mx-auto max-w-xl px-6 py-20">
        <RequestForm kind="contact" />
      </div>
    </>
  );
}
