import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site-pieces";
import { useLang } from "@/i18n/LanguageProvider";
import { pageHead } from "@/features/seo/head";

export const Route = createFileRoute("/care-palveluseteli")({
  head: () => pageHead({
    path: "/care-palveluseteli",
    title: "TGN Palveluseteli — Tulossa pian | TGN Services",
    description: "TGN Palveluseteli -palvelut ovat tulossa pian.",
    indexable: false,
  }),
  component: Page,
});

function Page() {
  const { tr, lang } = useLang();
  const comingSoon = { fi: "TULOSSA PIAN!", sv: "KOMMER SNART!", es: "¡PRÓXIMAMENTE!", en: "COMING SOON!" };
  return (
    <>
      <PageHero eyebrow={tr.services.eyebrow} title={tr.services.palveluseteli.title} tone="lilac" />

      <section className="mx-auto max-w-6xl px-6 py-20 text-center md:py-24">
        <h2 className="break-words text-4xl text-primary md:text-6xl">{comingSoon[lang]}</h2>
      </section>
    </>
  );
}
