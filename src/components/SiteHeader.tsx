import { Link } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/tgs-logo-g.png";
import { useLang } from "@/i18n/LanguageProvider";
import { LANGS } from "@/i18n/translations";
import { Menu, X } from "lucide-react";

export function SiteHeader() {
  const { lang, setLang, tr } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/care-kotiin", label: tr.nav.kotiin },
    { to: "/care-yrityksille", label: tr.nav.yrityksille },
    { to: "/care-palveluseteli", label: tr.nav.palveluseteli },
    { to: "/hinnoittelu", label: tr.nav.hinnoittelu },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6">
        {/* Logo banner — large, centered */}
        <div className="flex justify-center pt-4 md:pt-5">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="T & G Services" className="h-32 w-auto md:h-40" />
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden items-center justify-center gap-8 pb-4 pt-2 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[0.74rem] uppercase tracking-[0.16em] text-foreground/75 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
          <span className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1">
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
          <Link
            to="/varaa"
            className="rounded-sm bg-primary px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            {tr.actions.book.title}
          </Link>
        </div>

        {/* Mobile bar */}
        <div className="flex items-center justify-between pb-3 pt-1 md:hidden">
          <div className="flex items-center gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`text-xs tracking-[0.15em] ${
                  lang === l.code ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {l.short}
              </button>
            ))}
          </div>
          <button onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background px-6 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.18em] text-foreground/80"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/varaa"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-sm bg-primary px-5 py-3 text-center text-[0.72rem] uppercase tracking-[0.18em] text-primary-foreground"
            >
              {tr.actions.book.title}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
