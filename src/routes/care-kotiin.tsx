import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, ServiceDetail } from "@/components/site-pieces";
import { useLang } from "@/i18n/LanguageProvider";
import { ServicePricing } from "@/components/ServicePricing";

export const Route = createFileRoute("/care-kotiin")({
  head: () => ({
    meta: [
      { title: "TGN Kotiin — Kotihoiva ja arjen apu | T & G Nordic Services" },
      { name: "description", content: "Kotihoivaa, arjen apua ja seuraa yksilöllisesti – juuri niin usein kuin tarvitset." },
      { property: "og:title", content: "TGN Kotiin | T & G Nordic Services" },
      { property: "og:description", content: "Kotihoivaa, arjen apua ja seuraa yksilöllisesti." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const { tr } = useLang();
  return (
    <>
      <PageHero eyebrow={tr.services.eyebrow} title={tr.services.kotiin.title} lead={tr.services.kotiin.body} />
      <ServiceDetail title={tr.services.kotiin.title} body={tr.about.body} items={tr.services.kotiin.items}>
        <Link
          to="/varaa"
          className="mt-10 inline-block rounded-sm bg-primary px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground"
        >
          {tr.actions.book.cta}
        </Link>
      </ServiceDetail>
      <ServicePricing tab="kotiin" />
    </>
  );
}
