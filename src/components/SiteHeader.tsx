import { Link } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/tgs-logo-g.png";
import { useLang } from "@/i18n/LanguageProvider";
import { LANGS } from "@/i18n/translations";
import { Menu, X, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { lang, setLang, tr } = useLang();
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/care-kotiin", label: tr.nav.kotiin, tab: "kotiin" },
    { to: "/care-yrityksille", label: tr.nav.yrityksille, tab: "yrityksille" },
    { to: "/care-palveluseteli", label: tr.nav.palveluseteli, tab: "palveluseteli" },
  ] as const;

  const languages = (
    <div className="flex items-center gap-1" aria-label="Language">
      {LANGS.map((l) => (
        <Button key={l.code} variant="ghost" size="icon" onClick={() => setLang(l.code)}
          aria-label={l.label} title={l.label} aria-pressed={lang === l.code}
          className={`size-10 text-2xl hover:bg-secondary ${lang === l.code ? "bg-secondary ring-1 ring-primary/40" : "opacity-65 hover:opacity-100"}`}>
          <span aria-hidden="true">{l.flag}</span>
        </Button>
      ))}
    </div>
  );

  return (
    <header className="relative z-50 border-b border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex justify-center pt-5 md:pt-7">
          <Link to="/" aria-label="T & G Services"><img src={logo} alt="T & G Services" className="h-40 w-auto md:h-52" /></Link>
        </div>
        <nav className="hidden grid-cols-3 gap-6 pb-5 pt-3 md:grid" aria-label={tr.services.eyebrow}>
          {links.map((l) => (
            <div key={l.to} className="flex min-w-0 flex-col items-center gap-2 text-center">
              <Link to={l.to} className="text-xl font-medium text-foreground transition-colors hover:text-primary lg:text-2xl" activeProps={{ className: "text-primary" }}>{l.label}</Link>
              <Link to="/hinnoittelu" search={{ tab: l.tab }} className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{tr.nav.hinnoittelu}</Link>
            </div>
          ))}
        </nav>
        <div className="flex flex-wrap items-center justify-center gap-4 border-t border-border/60 py-4 md:gap-8">
          {languages}
          <Button asChild size="lg" className="h-auto min-h-12 whitespace-normal px-7 py-3 text-base">
            <Link to="/varaa"><Video aria-hidden="true" />{tr.actions.book.title}</Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} className="md:hidden">
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border/60 bg-background px-6 py-5 md:hidden" aria-label={tr.services.eyebrow}>
          <div className="flex flex-col gap-5">
            {links.map((l) => (
              <div key={l.to} className="flex flex-col gap-1">
                <Link to={l.to} onClick={() => setOpen(false)} className="text-xl font-medium text-foreground">{l.label}</Link>
                <Link to="/hinnoittelu" search={{ tab: l.tab }} onClick={() => setOpen(false)} className="text-sm text-muted-foreground">{tr.nav.hinnoittelu}</Link>
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
