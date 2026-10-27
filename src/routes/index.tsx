// ============= Full file contents =============

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/i18n/LanguageProvider";
import { ArrowRight, ShieldCheck, MessagesSquare, HeartHandshake, Wallet, Mail, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { NewsSection } from '@/features/news/NewsSection';
import { newsQuery } from '@/features/news/queries';
import { homeCopy } from '@/features/home-service/copy';
import { RequestForm } from '@/features/home-service/RequestForms';
import { pageHead, SITE_URL, SOCIAL_IMAGE_URL } from "@/features/seo/head";
import { publicContentQuery } from "@/features/content/queries";

export const Route = createFileRoute("/")({
  loader: ({ context }) => Promise.all([
    context.queryClient.ensureQueryData(newsQuery),
    context.queryClient.ensureQueryData(publicContentQuery("home", "fi")),
  ]),
  head: () => pageHead({
    path: "/",
    title: "TGN Services — Laadukasta siivousta koteihin ja toimitiloihin",
    description:
      "TGN Services hoitaa kotisi ja toimitilasi niin sisältä kuin ulkoa ja kantaa kokonaisvaltaisen vastuun. Avoin viestintä, tuttu henkilöstö ja selkeä hinnoittelu ilman piilokuluja.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "TGN Services",
      url: SITE_URL,
      logo: SOCIAL_IMAGE_URL,
    },
  }),
  component: Index,
});

function Index() {
  const { tr, lang } = useLang();
  const t = homeCopy[lang];
  const { data: managed = {} } = useQuery(publicContentQuery("home", lang));
  const heroTitle = managed.title || tr.hero.title;
  const heroLead = managed.body || tr.hero.lead;
  const heroContact = managed.cta || t.contact;
  const heroSecondary = managed.secondary || t.video;
  const pricingTitle = managed.pricingTitle || tr.pricingBanner.title;
  const pricingParagraphs = [
    managed.pricingMonthlyDescription || tr.pricingBanner.paragraphs[0],
    managed.pricingServiceDescription || tr.pricingBanner.paragraphs[1],
  ];
  const pricingLanguages = managed.pricingLanguages || tr.pricingBanner.languages;
  const pricingHomeButton = managed.pricingHomeButton || tr.pricingBanner.home;
  const pricingBusinessButton = managed.pricingBusinessButton || tr.pricingBanner.business;
  const valuesEyebrow = managed.valuesEyebrow || tr.values.eyebrow;
  const valuesTitle = managed.valuesTitle || tr.values.title;
  const values = tr.values.items.map((value, index) => ({
    title: managed[`value${index + 1}Title` as keyof typeof managed] || value.title,
    body: managed[`value${index + 1}Body` as keyof typeof managed] || value.body,
  }));
  const [form, setForm] = useState<'contact' | 'start' | null>(null);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60 bg-[image:var(--gradient-lilac)]">
        <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-12">
          <div>
            <p className="eyebrow text-primary/70">{tr.hero.eyebrow}</p>
            <h1 className="mt-4 text-4xl leading-[1.1] text-plum md:text-5xl">
              {heroTitle}
            </h1>
            <div className="mt-5 space-y-3 text-base leading-relaxed text-plum">
              <p className="managed-copy break-words">{heroLead}</p>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Button size="lg" className="h-auto min-h-12 whitespace-normal py-3" onClick={() => setForm('contact')}><Mail aria-hidden="true" />{heroContact}</Button>
            <Button asChild size="lg" className="h-auto min-h-12 whitespace-normal py-3"><Link to="/varaa"><Video aria-hidden="true" />{heroSecondary}</Link></Button>
            <Button size="lg" className="h-auto min-h-12 whitespace-normal py-3" onClick={() => setForm('start')}><ArrowRight aria-hidden="true" />{t.start}</Button>
          </div>
        </div>
      </section>


      <section id="hinnoittelu" aria-labelledby="pricing-banner-title" className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center md:py-16">
          <h2 id="pricing-banner-title" className="text-4xl leading-tight text-primary md:text-5xl">{pricingTitle}</h2>
          <div className="mx-auto mt-6 max-w-4xl space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {pricingParagraphs.map((paragraph, index) => (
              <p key={index} className="managed-copy break-words">{paragraph}</p>
            ))}
          </div>
          <p className="managed-copy mt-6 break-words text-base font-medium text-foreground">{pricingLanguages}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="h-auto min-h-12 whitespace-normal px-8 py-3 text-base">
              <Link to="/care-kotiin">{pricingHomeButton}<ArrowRight className="size-4 shrink-0" aria-hidden="true" /></Link>
            </Button>
            <Button asChild size="lg" className="h-auto min-h-12 whitespace-normal px-8 py-3 text-base">
              <Link to="/care-yrityksille">{pricingBusinessButton}<ArrowRight className="size-4 shrink-0" aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="arvot" aria-labelledby="values-title" className="border-b border-border/60 bg-[image:var(--gradient-lilac)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <p className="managed-copy eyebrow break-words">{valuesEyebrow}</p>
            <h2 id="values-title" className="managed-copy mt-4 break-words text-3xl md:text-4xl">{valuesTitle}</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = [ShieldCheck, MessagesSquare, HeartHandshake, Wallet][index] ?? ShieldCheck;
              return (
                <div key={value.title} className="rounded-sm border border-border bg-card p-8">
                  <Icon className="size-6 text-accent" strokeWidth={1.25} />
                  <h3 className="managed-copy mt-5 break-words text-xl leading-snug">{value.title}</h3>
                  <p className="managed-copy mt-3 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      <NewsSection />

      <Dialog open={form !== null} onOpenChange={open => { if (!open) setForm(null); }}><DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-md"><DialogTitle className="pr-6 text-2xl font-normal">{form === 'start' ? t.start : t.contact}</DialogTitle><DialogDescription className="sr-only">{form === 'start' ? t.startNote : t.message}</DialogDescription>{form && <RequestForm key={form} kind={form} audience="home" />}</DialogContent></Dialog>
    </>
  );
}
