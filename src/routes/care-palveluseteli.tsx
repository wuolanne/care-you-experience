import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site-pieces";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/care-palveluseteli")({
  head: () => ({
    meta: [
      { title: "TGN Palveluseteli — Tulossa pian | TGN Services" },
      { name: "description", content: "TGN Palveluseteli -palvelut ovat tulossa pian." },
      { property: "og:title", content: "TGN PALVELUSETELI | TGN Services" },
      { property: "og:description", content: "TGN Palveluseteli – tulossa pian!" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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
