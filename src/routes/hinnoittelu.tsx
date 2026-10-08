import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site-pieces";
import { useLang } from "@/i18n/LanguageProvider";
import {
  kotiinPackages,
  kotiinHourly,
  yrityksillePackages,
  yrityksilleHourly,
  palveluseteliHourly,
  type Pkg,
} from "@/data/pricing";

export const Route = createFileRoute("/hinnoittelu")({
  validateSearch: (search: Record<string, unknown>): { tab: "kotiin" | "yrityksille" | "palveluseteli" } => ({
    tab: search.tab === "yrityksille" || search.tab === "palveluseteli" ? search.tab : "kotiin",
  }),
  head: () => ({
    meta: [
      { title: "Hinnoittelu — läpinäkyvät hinnat | T & G Services" },
      {
        name: "description",
        content:
          "Läpinäkyvä hinnoittelu kodin ja toimiston hoitoon: valitse kuukausipaketti tai tuntiveloitus. Kaikki hinnat näkyvissä ilman piilokuluja.",
      },
      { property: "og:title", content: "Hinnoittelu | T & G Services" },
      {
        property: "og:description",
        content: "Kuukausipaketit ja tuntiveloitus – kaikki hinnat läpinäkyvästi esillä.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

type TabKey = "kotiin" | "yrityksille" | "palveluseteli";

function Page() {
  const { tr, lang } = useLang();
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const setTab = (tab: TabKey) => { void navigate({ search: { tab }, replace: true }); };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "kotiin", label: tr.services.kotiin.title },
    { key: "yrityksille", label: tr.services.yrityksille.title },
    { key: "palveluseteli", label: tr.services.palveluseteli.title },
  ];

  const packages: Pkg[] =
    tab === "kotiin" ? kotiinPackages : tab === "yrityksille" ? yrityksillePackages : [];

  const hourly =
    tab === "kotiin" ? kotiinHourly : tab === "yrityksille" ? yrityksilleHourly : palveluseteliHourly;

  const fmt = (n: number) =>
    new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <PageHero eyebrow={tr.pricing.eyebrow} title={tr.pricing.title} lead={tr.pricing.lead} />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap justify-center gap-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-sm border px-6 py-3.5 text-[0.72rem] uppercase tracking-[0.18em] transition-colors ${
                tab === t.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/80 hover:border-primary/50 hover:text-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {packages.length > 0 && (
          <>
            <h2 className="mt-16 text-2xl">{tr.pricing.monthly}</h2>
            <div className="hairline mt-4 w-24" />
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {packages.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col rounded-sm border border-border bg-card p-7 shadow-[var(--shadow-soft)]"
                >
                  <h3 className="text-xl">{p.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc[lang]}</p>
                  <p className="mt-6 font-[family-name:var(--font-display)] text-4xl text-primary">
                    {fmt(p.monthly ?? 0)}
                    <span className="ml-1 text-base text-muted-foreground">{tr.pricing.perMonth}</span>
                  </p>
                  <dl className="mt-6 space-y-2 border-t border-border/70 pt-5 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{tr.pricing.hoursPerMonth}</dt>
                      <dd>{p.hours}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{tr.pricing.perHour}</dt>
                      <dd>{fmt(p.hourly)}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </>
        )}

        <h2 className="mt-16 text-2xl">{tr.pricing.hourly}</h2>
        <div className="hairline mt-4 w-24" />
        <div className="mt-8 flex flex-col items-start gap-6 rounded-sm border border-border bg-secondary/30 p-9 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
              {tr.pricing.single}
            </p>
            <p className="mt-2 text-base">{hourly.desc[lang]}</p>
          </div>
          <p className="font-[family-name:var(--font-display)] text-4xl text-primary">
            {fmt(hourly.hourly)}
            <span className="ml-1 text-base text-muted-foreground">{tr.pricing.perHour}</span>
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          {tr.pricing.vat} {tr.pricing.note}
        </p>

        <Link
          to="/tarjouspyynto"
          className="mt-10 inline-block rounded-sm bg-primary px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
        >
          {tr.pricing.cta}
        </Link>
      </section>
    </>
  );
}
