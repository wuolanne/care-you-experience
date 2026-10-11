import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, ServiceDetail } from "@/components/site-pieces";
import { useLang } from "@/i18n/LanguageProvider";
import { ServicePricing } from "@/components/ServicePricing";

export const Route = createFileRoute("/care-yrityksille")({
  head: () => ({
    meta: [
      { title: "TGN YRITYKSILLE — Hyvinvointi- ja tukipalvelut | T & G Nordic Services" },
      { name: "description", content: "Henkilöstön hyvinvointi, toimitilapalvelut ja hoiva-alan sijaisuudet yrityksille." },
      { property: "og:title", content: "TGN YRITYKSILLE | T & G Nordic Services" },
      { property: "og:description", content: "Hyvinvointi- ja tukipalvelut yrityksille." },
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
      <PageHero eyebrow={tr.services.eyebrow} title={tr.services.yrityksille.title} lead={tr.services.yrityksille.body} />
      <ServiceDetail title={tr.services.yrityksille.title} body={tr.about.body} items={tr.services.yrityksille.items}>
        <Link
          to="/tarjouspyynto"
          className="mt-10 inline-block rounded-sm bg-primary px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground"
        >
          {tr.actions.quote.cta}
        </Link>
      </ServiceDetail>
      <ServicePricing tab="yrityksille" />
    </>
  );
}
