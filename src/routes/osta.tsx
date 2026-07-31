import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site-pieces";
import { useLang } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/osta")({
  head: () => ({
    meta: [
      { title: "Osta palvelu | Care & You Services" },
      { name: "description", content: "Valmiit palvelupaketit kotihoivaan ja yrityksille – selkeä hinnoittelu, nopea aloitus." },
      { property: "og:title", content: "Osta palvelu | Care & You Services" },
      { property: "og:description", content: "Valmiit palvelupaketit, joilla pääset alkuun heti." },
    ],
  }),
  component: Page,
});

function Page() {
  const { tr } = useLang();

  const packages = [
    { name: tr.services.kotiin.title, price: "49 €/h", items: tr.services.kotiin.items.slice(0, 3) },
    { name: tr.services.yrityksille.title, price: "590 €/kk", items: tr.services.yrityksille.items.slice(0, 3) },
    { name: tr.services.palveluseteli.title, price: "0 €", items: tr.services.palveluseteli.items.slice(0, 3) },
  ];

  return (
    <>
      <PageHero eyebrow={tr.actions.eyebrow} title={tr.buy.title} lead={tr.buy.lead} />
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-20 md:grid-cols-3">
        {packages.map((p) => (
          <div
            key={p.name}
            className="flex flex-col rounded-sm border border-border bg-card p-9 shadow-[var(--shadow-soft)]"
          >
            <h2 className="text-2xl">{p.name}</h2>
            <p className="mt-4 text-sm text-muted-foreground">{tr.buy.from}</p>
            <p className="font-[family-name:var(--font-display)] text-4xl text-primary">{p.price}</p>
            <ul className="mt-7 flex-1 space-y-2 text-sm">
              {p.items.map((i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                  {i}
                </li>
              ))}
            </ul>
            <Link
              to="/tarjouspyynto"
              className="mt-8 rounded-sm bg-primary px-6 py-3.5 text-center text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              {tr.buy.select}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
