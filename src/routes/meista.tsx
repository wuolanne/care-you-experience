import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Image as ImageIcon, Mail, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLang } from "@/i18n/LanguageProvider";
import { homeCopy } from "@/features/home-service/copy";
import { RequestForm } from "@/features/home-service/RequestForms";

export const Route = createFileRoute("/meista")({
  head: () => ({
    meta: [
      { title: "Meistä lyhyesti | TGN Services" },
      { name: "description", content: "Tutustu TGN Servicesiin: ensiluokkaista siivousta, tuttua huolenpitoa, joustavaa hinnoittelua ja luotettavaa kumppanuutta koteihin ja toimitiloihin." },
      { property: "og:title", content: "Meistä lyhyesti | TGN Services" },
      { property: "og:description", content: "TGN Services – ensiluokkaista siivousta ja tuttua huolenpitoa. Tutustu palveluumme, hinnoitteluumme ja laatutakuuseemme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

// Kampanjakuva: importtaa kuva tähän ja aseta se muuttujaan,
// esim. import kampanja from "@/assets/kampanja.jpg"; const campaignImage = kampanja;
const campaignImage: string | null = null;

function AboutPage() {
  const { tr, lang } = useLang();
  const t = homeCopy[lang];
  const [form, setForm] = useState<'contact' | 'start' | null>(null);

  const fallbackAction = { kind: 'contact' as const, label: t.contact, Icon: Mail };
  const startActions = [
    { kind: 'contact' as const, label: t.contact, Icon: Mail },
    { kind: 'video' as const, label: t.video, Icon: Video },
    { kind: 'start' as const, label: t.start, Icon: ArrowRight },
  ];

  return (
    <>
    <section aria-labelledby="about-title" className="border-b border-border/60 bg-[image:var(--gradient-lilac)]">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-x-12 gap-y-8 md:grid-cols-[0.9fr_1.1fr] md:grid-rows-[auto_1fr]">
          <div>
            <p className="eyebrow">{tr.about.eyebrow}</p>
            <h1 id="about-title" className="mt-4 text-3xl leading-tight md:text-4xl">{tr.about.title}</h1>
            <div className="hairline mt-6 w-24" />
          </div>
          <div className="md:col-start-1 md:row-start-2">
              {campaignImage ? (
                <img
                  src={campaignImage}
                  alt={tr.about.title}
                  className="w-full rounded-sm border border-border object-cover shadow-[var(--shadow-soft)]"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex aspect-[4/5] w-full items-center justify-center rounded-sm border border-dashed border-gold/70 bg-card"
                >
                  <ImageIcon className="size-8 text-gold/70" strokeWidth={1.2} />
                </div>
              )}
          </div>
          <div className="min-w-0 md:col-start-2 md:row-start-2">
            <h2 className="text-2xl leading-tight md:text-3xl">{tr.about.headline}</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
              {tr.about.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {tr.about.sections.map((section) => (
              <div key={section.title} className="mt-8">
                <h2 className="text-2xl leading-tight">{section.title}</h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{section.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl leading-tight md:text-4xl">{tr.about.start.title}</h2>
          <div className="hairline mt-6 w-24" />
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {tr.about.start.items.map((item, index) => {
              const action = startActions[index] ?? fallbackAction;
              const { Icon } = action;
              return (
                <div key={item.title} className="flex flex-col rounded-sm border border-border bg-background p-8">
                  <h3 className="text-xl leading-snug">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  <div className="mt-6 pt-2">
                    {action.kind === 'video' ? (
                      <Button asChild size="lg" className="h-auto min-h-12 w-full whitespace-normal py-3">
                        <Link to="/varaa"><Icon aria-hidden="true" />{action.label}</Link>
                      </Button>
                    ) : (
                      <Button size="lg" className="h-auto min-h-12 w-full whitespace-normal py-3" onClick={() => setForm(action.kind === 'start' ? 'start' : 'contact')}>
                        <Icon aria-hidden="true" />{action.label}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={form !== null} onOpenChange={open => { if (!open) setForm(null); }}><DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-md"><DialogTitle className="pr-6 text-2xl font-normal">{form === 'start' ? t.start : t.contact}</DialogTitle><DialogDescription className="sr-only">{form === 'start' ? t.startNote : t.message}</DialogDescription>{form && <RequestForm key={form} kind={form} audience="home" />}</DialogContent></Dialog>
    </section>
    <section aria-labelledby="partnership-title" className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <h2 id="partnership-title" className="text-3xl leading-tight text-primary md:text-4xl">{tr.about.closing}</h2>
        <div className="hairline mt-6 w-24" />
        <div className="mt-10">
          <h3 className="text-2xl leading-tight">{tr.about.billing}</h3>
          <div aria-label={tr.about.billing} className="mt-6 min-h-56 border-y border-dashed border-gold/70" />
          <h3 className="mt-12 text-2xl leading-tight">{tr.about.team}</h3>
          <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-5">
            {[1, 2, 3].map(person => (
              <div key={person} className="min-w-0">
                <div role="img" aria-label={`${tr.about.staffPhoto} ${person}`} className="flex aspect-[3/4] items-center justify-center rounded-sm border border-dashed border-gold/70 bg-card">
                  <ImageIcon aria-hidden="true" className="size-8 text-gold/70" strokeWidth={1.2} />
                </div>
                <p className="mt-4 break-words text-center text-base text-muted-foreground">{tr.about.firstName}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
    </>
  );
}
