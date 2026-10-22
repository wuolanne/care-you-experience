import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { HomePricing } from "@/features/home-service/HomePricing";
import { RequestForm } from "@/features/home-service/RequestForms";
import {
  kotiinPackages,
  kotiinHourly,
  yrityksillePackages,
  yrityksilleHourly,
  palveluseteliHourly,
  type Pkg,
} from "@/data/pricing";


export type PricingService = "kotiin" | "yrityksille" | "palveluseteli";

export function ServicePricing({ tab, note }: { tab: PricingService; note: string | undefined }) {
  const { tr, lang } = useLang();
  const [contactOpen, setContactOpen] = useState(false);
  const packages: Pkg[] =
    tab === "kotiin" ? kotiinPackages : tab === "yrityksille" ? yrityksillePackages : [];

  const hourly =
    tab === "kotiin" ? kotiinHourly : tab === "yrityksille" ? yrityksilleHourly : palveluseteliHourly;

  const fmt = (n: number) =>
    new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 2 }).format(n);

  if (tab === "kotiin") return <HomePricing />;
  if (tab === "yrityksille") return <HomePricing audience="business" />;

  return (
      <section className="mx-auto max-w-6xl px-6 py-16" aria-label={tr.nav.hinnoittelu}>
        <h2 className="text-3xl md:text-4xl">{tr.nav.hinnoittelu}</h2>
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
          {tr.pricing.vat} {note || tr.pricing.note}
        </p>

        <Button size="lg" className="mt-10" onClick={() => setContactOpen(true)}>
          {tr.pricing.cta}
        </Button>
        <Dialog open={contactOpen} onOpenChange={setContactOpen}>
          <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-md">
            <DialogTitle className="pr-6 text-2xl font-normal">{tr.quote.title}</DialogTitle>
            <DialogDescription className="sr-only">{tr.quote.lead}</DialogDescription>
            <RequestForm kind="contact" />
          </DialogContent>
        </Dialog>
      </section>
  );
}
