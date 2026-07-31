import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, ServiceDetail } from "@/components/site-pieces";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/care-palveluseteli")({
  head: () => ({
    meta: [
      { title: "Care Palveluseteli — Hyväksytty palveluntuottaja | Care & You Services" },
      { name: "description", content: "Käytä kuntasi palveluseteli helposti meillä. Neuvonta, hakemusapu ja selkeä hinnoittelu." },
      { property: "og:title", content: "Care Palveluseteli | Care & You Services" },
      { property: "og:description", content: "Hyväksytty palveluntuottaja – palveluseteli käyttöön helposti." },
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
    </>
  );
}
