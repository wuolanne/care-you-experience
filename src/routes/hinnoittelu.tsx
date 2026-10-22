import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/site-pieces";
import { useLang } from "@/i18n/LanguageProvider";
import { ServicePricing } from "@/components/ServicePricing";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/features/seo/head";
import { publicContentQuery } from "@/features/content/queries";

export const Route = createFileRoute("/hinnoittelu")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publicContentQuery("pricing", "fi")),
  validateSearch: (search: Record<string, unknown>): { tab: "kotiin" | "yrityksille" | "palveluseteli" } => ({
    tab: search['tab'] === "yrityksille" || search['tab'] === "palveluseteli" ? search['tab'] : "kotiin",
  }),
  head: () => pageHead({
    path: "/hinnoittelu",
    title: "Hinnoittelu — läpinäkyvät hinnat | TGN Services",
    description: "Läpinäkyvä hinnoittelu kodin ja toimitilojen hoitoon: valitse kuukausipaketti tai tuntiveloitus. Kaikki hinnat näkyvissä ilman piilokuluja.",
  }),
  component: Page,
});

type TabKey = "kotiin" | "yrityksille" | "palveluseteli";

function Page() {
  const { tr } = useLang();
  const { lang } = useLang();
  const { data: managed = {} } = useQuery(publicContentQuery("pricing", lang));
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const setTab = (tab: TabKey) => { void navigate({ search: { tab }, replace: true }); };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "kotiin", label: tr.services.kotiin.title },
    { key: "yrityksille", label: tr.services.yrityksille.title },
    { key: "palveluseteli", label: tr.services.palveluseteli.title },
  ];

  return (
    <>
      <PageHero eyebrow={tr.pricing.eyebrow} title={managed.title || tr.pricing.title} lead={managed.body || tr.pricing.lead} />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap justify-center gap-3">
          {tabs.map((t) => (
            <Button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-sm border px-6 py-3.5 text-[0.72rem] uppercase tracking-[0.18em] transition-colors ${
                tab === t.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/80 hover:border-primary/50 hover:text-primary"
              }`}
            >
              {t.label}
            </Button>
          ))}
        </div>

      </section>
      <ServicePricing tab={tab} />
    </>
  );
}
