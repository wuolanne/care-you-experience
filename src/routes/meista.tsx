import { createFileRoute } from "@tanstack/react-router";
import { Image as ImageIcon } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";

// Kampanjakuva: importtaa kuva tähän ja aseta se muuttujaan,
// esim. import kampanja from "@/assets/kampanja.jpg"; const campaignImage = kampanja;
const campaignImage: string | null = null;


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

function AboutPage() {
  const { tr } = useLang();

  return (
    <section aria-labelledby="about-title" className="border-b border-border/60 bg-[image:var(--gradient-lilac)]">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">{tr.about.eyebrow}</p>
            <h1 id="about-title" className="mt-4 text-3xl leading-tight md:text-4xl">{tr.about.title}</h1>
            <div className="hairline mt-6 w-24" />
          </div>
          <div className="min-w-0">
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
            <div className="mt-8">
              <h2 className="text-2xl leading-tight">{tr.about.start.title}</h2>
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
  );
}