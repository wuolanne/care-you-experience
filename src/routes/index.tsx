import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/dm-hero.png.asset.json";
import { useLang } from "@/i18n/LanguageProvider";
import { Video, FileText, ShoppingBag, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "D&M Services — Laadukasta hoivaa kotiin ja yrityksille" },
      {
        name: "description",
        content:
          "D&M Services tuottaa yksilöllistä ja luotettavaa hoivaa kotiin, yrityksille ja palvelusetelillä. Varaa videopalaveri, pyydä tarjous tai osta palvelu.",
      },
      { property: "og:title", content: "D&M Services — Laadukasta hoivaa" },
      {
        property: "og:description",
        content: "Yksilöllistä hoivaa kotiin, yrityksille ja palvelusetelillä.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { tr } = useLang();

  const actions = [
    { icon: Video, ...tr.actions.book, to: "/varaa" as const },
    { icon: FileText, ...tr.actions.quote, to: "/tarjouspyynto" as const },
    { icon: ShoppingBag, ...tr.actions.buy, to: "/osta" as const },
  ];

  const services = [
    { ...tr.services.kotiin, to: "/care-kotiin" as const },
    { ...tr.services.yrityksille, to: "/care-yrityksille" as const },
    { ...tr.services.palveluseteli, to: "/care-palveluseteli" as const },
  ];

  return (
    <>
      <section className="relative overflow-hidden">
        <img
          src={heroImage.url}
          alt="D&M Services -logo toimiston seinällä"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,oklch(0.3_0.14_292/0.92)_0%,oklch(0.36_0.13_300/0.82)_55%,oklch(0.44_0.1_305/0.7)_100%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
          <div className="max-w-2xl">
            <p className="eyebrow text-[oklch(0.85_0.06_95)]">{tr.hero.eyebrow}</p>
            <h1 className="mt-6 text-4xl leading-[1.1] text-primary-foreground md:text-5xl">
              {tr.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base text-primary-foreground/90">{tr.hero.lead}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#aloita"
                className="rounded-sm bg-[var(--color-gold)] px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-plum transition-opacity hover:opacity-90"
              >
                {tr.hero.cta}
              </a>
              <a
                href="#palvelut"
                className="rounded-sm border border-primary-foreground/40 px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                {tr.hero.secondary}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">{tr.about.eyebrow}</p>
            <h2 className="mt-4 text-3xl leading-tight md:text-4xl">{tr.about.title}</h2>
            <div className="hairline mt-6 w-24" />
          </div>
          <div>
            <p className="text-lg leading-relaxed text-muted-foreground">{tr.about.body}</p>
            <ul className="mt-8 space-y-3">
              {tr.about.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="aloita" className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center">
            <p className="eyebrow">{tr.actions.eyebrow}</p>
            <h2 className="mt-4 text-3xl md:text-4xl">{tr.actions.title}</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {actions.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group flex flex-col rounded-sm border border-border bg-card p-9 transition-shadow hover:shadow-[var(--shadow-elegant)]"
              >
                <a.icon className="size-6 text-accent" strokeWidth={1.25} />
                <h3 className="mt-6 text-2xl">{a.title}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{a.body}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-primary">
                  {a.cta}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="palvelut" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <p className="eyebrow">{tr.services.eyebrow}</p>
          <h2 className="mt-4 text-3xl md:text-4xl">{tr.services.title}</h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {services.map((s) => (
            <article key={s.to} className="border-t border-plum/30 pt-8">
              <h3 className="text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{s.body}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {s.items.map((i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                    {i}
                  </li>
                ))}
              </ul>
              <Link
                to={s.to}
                className="mt-7 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-primary hover:opacity-80"
              >
                {tr.services.more}
                <ArrowRight className="size-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
