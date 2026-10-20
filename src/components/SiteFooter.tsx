import { Link } from "@tanstack/react-router";
import logo from "@/assets/tgs-logo-g.png";
import { useLang } from "@/i18n/LanguageProvider";
import { NewsAdminLink } from '@/features/news/NewsAdminLink';

export function SiteFooter() {
  const { tr } = useLang();
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.1fr_1fr_1fr] md:items-center">
        <div>
          <img src={logo} alt="TGN Services" className="h-36 w-auto md:h-44" />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">{tr.footer.tagline}</p>
        </div>
        <div className="space-y-3">
          <p className="eyebrow">{tr.services.eyebrow}</p>
          <div className="flex flex-col gap-3 text-lg text-foreground/80">
            <Link to="/care-kotiin" className="hover:text-primary">{tr.nav.kotiin}</Link>
            <Link to="/care-yrityksille" className="hover:text-primary">{tr.nav.yrityksille}</Link>
            <Link to="/care-palveluseteli" className="hover:text-primary">{tr.nav.palveluseteli}</Link>
          </div>
        </div>
        <div className="space-y-3">
          <p className="eyebrow">{tr.footer.contact}</p>
          <div className="flex flex-col gap-2 text-sm text-foreground/80">
            <a href="mailto:info@tgnservices.fi" className="hover:text-primary">info@tgnservices.fi</a>
            <a href="tel:+358401234567" className="hover:text-primary">+358 40 123 4567</a>
            <Link to="/tarjouspyynto" className="hover:text-primary">{tr.actions.quote.title}</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TGN Services · {tr.footer.rights}
        <NewsAdminLink />
      </div>
    </footer>
  );
}
