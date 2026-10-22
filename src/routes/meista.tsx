import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Image as ImageIcon, Mail, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLang } from "@/i18n/LanguageProvider";
import { homeCopy } from "@/features/home-service/copy";
import { RequestForm } from "@/features/home-service/RequestForms";
import { BUSINESS_ID } from "@/data/company";
import { pageHead } from "@/features/seo/head";
import { publicContentQuery, publicImageQuery, publicStaffQuery } from "@/features/content/queries";
import { publicImageUrl } from "@/features/content/model";

export const Route = createFileRoute("/meista")({
  loader: ({ context }) => Promise.all([
    context.queryClient.ensureQueryData(publicContentQuery("about", "fi")),
    context.queryClient.ensureQueryData(publicImageQuery("about", "main", "fi")),
  ]),
  head: () => pageHead({
    path: "/meista",
    title: "Meistä lyhyesti | TGN Services",
    description: "Tutustu TGN Servicesiin: ensiluokkaista siivousta, tuttua huolenpitoa, joustavaa hinnoittelua ja luotettavaa kumppanuutta koteihin ja toimitiloihin.",
  }),
  component: AboutPage,
});

function AboutPage() {
  const { tr, lang } = useLang();
  const t = homeCopy[lang];
  const { data: managed = {} } = useQuery(publicContentQuery("about", lang));
  const { data: managedImage } = useQuery(publicImageQuery("about", "main", lang));
  const { data: staff = [] } = useQuery(publicStaffQuery(lang));
  const campaignImage = managedImage?.url ?? null;
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
            <h1 id="about-title" className="mt-4 text-3xl leading-tight md:text-4xl">{managed.title || tr.about.title}</h1>
            <div className="hairline mt-6 w-24" />
          </div>
          <div className="md:col-start-1 md:row-start-2">
              {campaignImage ? (
                <img
                  src={campaignImage}
                  alt={managedImage?.alt || tr.about.title}
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
            <h2 className="text-2xl leading-tight md:text-3xl">{managed.headline || tr.about.headline}</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
              {(managed.body ? managed.body.split("\n\n") : tr.about.intro).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
        <h2 id="partnership-title" className="text-3xl leading-tight text-primary md:text-4xl">{managed.closing || tr.about.closing}</h2>
        <div className="hairline mt-6 w-24" />
        <div className="mt-10">
          {staff.length > 0 && (
            <>
              <h3 className="text-2xl leading-tight">{tr.about.team}</h3>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {staff.map((person) => {
                  const imageUrl = publicImageUrl(person.imagePath);
                  return (
                    <article key={person.id} className="min-w-0 rounded-sm border border-border bg-card p-5">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={person.altText || person.displayName || tr.about.staffPhoto}
                          className="aspect-[3/4] w-full object-cover"
                          loading="lazy"
                        />
                      )}
                      {person.displayName && (
                        <h4 className={`${imageUrl ? "mt-4" : ""} break-words text-xl text-primary`}>
                          {person.displayName}
                        </h4>
                      )}
                      {person.jobTitle && (
                        <p className={`${person.displayName || imageUrl ? "mt-2" : ""} break-words text-sm font-medium`}>
                          {person.jobTitle}
                        </p>
                      )}
                      {person.bio && (
                        <p className={`${person.displayName || person.jobTitle || imageUrl ? "mt-3" : ""} whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground`}>
                          {person.bio}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}
          <h3 className="mt-10 text-2xl leading-tight">{tr.about.billing}</h3>
          <div aria-label={tr.about.billing} className="mt-5 min-h-32 rounded-sm border border-dashed border-gold/60 px-5 py-4">
            <p className="text-sm text-muted-foreground">{tr.footer.businessId}: <span className="text-foreground">{BUSINESS_ID}</span></p>
          </div>
        </div>

      </div>
    </section>
    </>
  );
}
