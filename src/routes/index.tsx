import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/tgs-logo-g.png";
import { useLang } from "@/i18n/LanguageProvider";
import { LANGS } from "@/i18n/translations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "T & G Services — Tervetuloa" },
      {
        name: "description",
        content:
          "Laadukasta kodin ja toimistonhoitoa. Valitse palvelu: TGS Kotiin tai TGS Yrityksille.",
      },
      { property: "og:title", content: "T & G Services" },
      {
        property: "og:description",
        content: "Laadukasta kodin ja toimistonhoitoa – ja pidämme huolta sinusta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Splash,
});

function Splash() {
  const { lang, setLang, tr } = useLang();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24">
      <img src={logo} alt="T & G Services — TGS" className="h-72 w-auto md:h-96" />
      <div className="hairline mt-10 w-28" />
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          to="/etusivu"
          className="rounded-sm bg-primary px-10 py-4 text-center text-[0.74rem] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
        >
          {tr.splash.kotiin}
        </Link>
        <Link
          to="/etusivu"
          className="rounded-sm border border-primary/40 px-10 py-4 text-center text-[0.74rem] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/5"
        >
          {tr.splash.yrityksille}
        </Link>
      </div>
      <div className="absolute bottom-8 flex items-center gap-1">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`px-1.5 text-[0.7rem] tracking-[0.15em] transition-colors ${
              lang === l.code ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.short}
          </button>
        ))}
      </div>
    </section>
  );
}
