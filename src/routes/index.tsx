import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/i18n/LanguageProvider";
import { ArrowRight, ShieldCheck, MessagesSquare, HeartHandshake, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsSection } from '@/features/news/NewsSection';
import { newsQuery } from '@/features/news/queries';

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(newsQuery),
  head: () => ({
    meta: [
      { title: "TGN Services — Laadukasta siivousta koteihin ja toimitiloihin" },
      {
        name: "description",
        content:
          "TGN Services hoitaa kotisi tai toimitilasi siivouksen huolella ja kantaa kokonaisvaltaisen vastuun. Avoin viestintä, tuttu henkilöstö ja selkeä hinnoittelu ilman piilokuluja.",
      },
      {
        property: "og:title",
        content: "TGN Services — Laadukasta siivousta koteihin ja toimitiloihin",
      },
      {
        property: "og:description",
        content: "Laadukasta siivousta koteihin ja toimitiloihin – pidämme huolta asiakkaistamme. Luotettava kumppanuus ja tasalaatuinen siivous ilman piilokuluja.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
      <section className="relative overflow-hidden border-b border-border/60 bg-[image:var(--gradient-lilac)]">
        <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-12">
          <div>
            <p className="eyebrow text-primary/70">{tr.hero.eyebrow}</p>
            <h1 className="mt-4 text-4xl leading-[1.1] text-plum md:text-5xl">
              {tr.hero.title}
            </h1>
            <div className="mt-5 space-y-3 text-base leading-relaxed text-plum/80">
              {tr.hero.lead.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="h-auto min-h-12 whitespace-normal px-8 py-3 text-base">
                <a href="#aloita">{tr.hero.cta}</a>
              </Button>
              <Button asChild size="lg" className="h-auto min-h-12 whitespace-normal px-8 py-3 text-base">
                <a href="#palvelut">{tr.hero.secondary}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="hinnoittelu" aria-labelledby="pricing-banner-title" className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center md:py-16">
          <h2 id="pricing-banner-title" className="text-4xl leading-tight text-primary md:text-5xl">{tr.pricingBanner.title}</h2>
          <div className="mx-auto mt-6 max-w-4xl space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {tr.pricingBanner.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <p className="mt-6 text-base font-medium text-foreground">{tr.pricingBanner.languages}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="h-auto min-h-12 whitespace-normal px-8 py-3 text-base">
              <Link to="/care-kotiin">{tr.pricingBanner.home}<ArrowRight className="size-4 shrink-0" aria-hidden="true" /></Link>
            </Button>
            <Button asChild size="lg" className="h-auto min-h-12 whitespace-normal px-8 py-3 text-base">
              <Link to="/care-yrityksille">{tr.pricingBanner.business}<ArrowRight className="size-4 shrink-0" aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="arvot" aria-labelledby="values-title" className="border-b border-border/60 bg-section-grey">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <p className="eyebrow">{tr.values.eyebrow}</p>
            <h2 id="values-title" className="mt-4 text-3xl md:text-4xl">{tr.values.title}</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tr.values.items.map((value, index) => {
              const Icon = [ShieldCheck, MessagesSquare, HeartHandshake, Wallet][index] ?? ShieldCheck;
              return (
                <div key={value.title} className="rounded-sm border border-border bg-card p-8">
                  <Icon className="size-6 text-accent" strokeWidth={1.25} />
                  <h3 className="mt-5 text-xl leading-snug">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <NewsSection />

      <section aria-labelledby="about-title" className="bg-section-grey">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">{tr.about.eyebrow}</p>
            <h2 id="about-title" className="mt-4 text-3xl leading-tight md:text-4xl">{tr.about.title}</h2>
            <div className="hairline mt-6 w-24" />
          </div>
          <div className="min-w-0">
            <h3 className="text-2xl leading-tight md:text-3xl">{tr.about.headline}</h3>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
              {tr.about.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {tr.about.sections.map((section) => (
              <div key={section.title} className="mt-8">
                <h3 className="text-2xl leading-tight">{section.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{section.body}</p>
              </div>
            ))}
            <div className="mt-8">
              <h3 className="text-2xl leading-tight">{tr.about.start.title}</h3>
              <ul className="mt-4 space-y-4">
                {tr.about.start.items.map((item) => (
                  <li key={item.title} className="flex items-start gap-3 text-base leading-relaxed">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    <p className="text-muted-foreground"><strong className="font-medium text-foreground">{item.title}</strong> {item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-8 border-t border-border pt-6 text-lg font-medium leading-relaxed text-primary">{tr.about.closing}</p>
          </div>
        </div>
      </div>
      </section>

      <section id="aloita" className="border-y border-border/60 bg-background">
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

      <section id="palvelut" className="bg-section-grey">
      <div className="mx-auto max-w-6xl px-6 py-24">
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
      </div>
      </section>
    </>
  );
}
