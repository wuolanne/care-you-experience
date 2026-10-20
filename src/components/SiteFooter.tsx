import { Link } from "@tanstack/react-router";
import logo from "@/assets/tgs-logo-g.png";
import { useLang } from "@/i18n/LanguageProvider";
import { NewsAdminLink } from '@/features/news/NewsAdminLink';
import { BUSINESS_ID } from '@/data/company';

export function SiteFooter() {
  const { tr } = useLang();
  return (
    <footer className="border-t border-border/60 bg-section-grey">
      <div className="mx-auto grid max-w-7xl gap-5 px-6 py-6 md:grid-cols-[1.1fr_1fr_1fr] md:items-center md:gap-8 md:py-7">
        <div>
          <img src={logo} alt="TGN Services" className="h-14 w-auto md:h-24" />
          <p className="mt-2 max-w-xs text-sm text-muted-foreground md:mt-3">{tr.footer.tagline}</p>
        </div>
        <div className="space-y-2 md:space-y-3">
          <p className="eyebrow">{tr.services.eyebrow}</p>
          <div className="flex flex-col gap-1 text-base text-foreground/80 md:gap-3 md:text-lg">
            <Link to="/care-kotiin" className="hover:text-primary">{tr.nav.kotiin}</Link>
            <Link to="/care-yrityksille" className="hover:text-primary">{tr.nav.yrityksille}</Link>
            <Link to="/care-palveluseteli" className="hover:text-primary">{tr.nav.palveluseteli}</Link>
          </div>
        </div>
        <div className="space-y-2 md:space-y-3">
          <p className="eyebrow">{tr.footer.contact}</p>
          <div className="flex flex-col gap-1 text-sm text-foreground/80 md:gap-2">
            <a href="mailto:info@tgnservices.fi" className="hover:text-primary">info@tgnservices.fi</a>
            <a href="tel:+3584578359301" className="hover:text-primary">+358 45 78359301</a>
            <p className="text-foreground/70">{tr.footer.businessId}: {BUSINESS_ID}</p>
          </div>


        </div>
      </div>
      <div className="border-t border-border/60 py-3 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TGN Services · {tr.footer.rights}
        <NewsAdminLink />
      </div>
    </footer>
  );
}
