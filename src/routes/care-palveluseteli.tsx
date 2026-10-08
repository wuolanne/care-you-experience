import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, ServiceDetail } from "@/components/site-pieces";
import { useLang } from "@/i18n/LanguageProvider";
import { ServicePricing } from "@/components/ServicePricing";

export const Route = createFileRoute("/care-palveluseteli")({
  head: () => ({
    meta: [
      { title: "TSG PALVELUSETELI — Hyväksytty palveluntuottaja | T & G Services" },
      { name: "description", content: "Käytä kuntasi palveluseteli helposti meillä. Neuvonta, hakemusapu ja selkeä hinnoittelu." },
      { property: "og:title", content: "TSG PALVELUSETELI | T & G Services" },
      { property: "og:description", content: "Hyväksytty palveluntuottaja – palveluseteli käyttöön helposti." },
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
      <PageHero eyebrow={tr.services.eyebrow} title={tr.services.palveluseteli.title} lead={tr.services.palveluseteli.body} />
      <ServiceDetail title={tr.services.palveluseteli.title} body={tr.about.body} items={tr.services.palveluseteli.items}>
        <Link
          to="/varaa"
          className="mt-10 inline-block rounded-sm bg-primary px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground"
        >
          {tr.actions.book.cta}
        </Link>
      </ServiceDetail>
      <ServicePricing tab="palveluseteli" />
    </>
  );
}
