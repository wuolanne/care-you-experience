// ============= Full file contents =============

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
          "TGN Services hoitaa kotisi ja toimitilasi niin sisältä kuin ulkoa ja kantaa kokonaisvaltaisen vastuun. Avoin viestintä, tuttu henkilöstö ja selkeä hinnoittelu ilman piilokuluja.",
      },
      {
        property: "og:title",
        content: "TGN Services — Laadukasta siivousta koteihin ja toimitiloihin",
      },
      {
        property: "og:description",
        content: "Laadukasta siivousta koteihin ja toimitiloihin – sisältä ja ulkoa. Pidämme huolta asiakkaistamme: luotettava kumppanuus ja tasalaatuinen siivous ilman piilokuluja.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { tr } = useLang();

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60 bg-[image:var(--gradient-lilac)]">
        <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-12">
          <div>
            <p className="eyebrow text-primary/70">{tr.hero.eyebrow}</p>
            <h1 className="mt-4 text-4xl leading-[1.1] text-plum md:text-5xl">
              {tr.hero.title}
            </h1>
            <div className="mt-5 space-y-3 text-base leading-relaxed text-plum">
              {tr.hero.lead.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="h-auto min-h-12 whitespace-normal px-8 py-3 text-base uppercase tracking-wide">
              <Link to="/meista">{tr.values.more}</Link>
            </Button>
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

      <section id="arvot" aria-labelledby="values-title" className="border-b border-border/60 bg-[image:var(--gradient-lilac)]">
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

    </>
  );
}
