import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ComponentType } from "react";
import logo from "@/assets/tgs-logo-g.png";
import { useLang } from "@/i18n/LanguageProvider";
import { NewsAdminLink } from '@/features/news/NewsAdminLink';
import { BUSINESS_ID, PUBLIC_ADDRESS, PUBLIC_EMAIL, PUBLIC_PHONE, SOCIAL_LINKS, type SocialKey } from '@/data/company';
import { publicSiteContactQuery, publicSocialLinksQuery } from "@/features/content/queries";
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { siTiktok, siWhatsapp } from 'simple-icons';

// TikTok and WhatsApp are not in the icon library, so their official glyphs are drawn here.
function GlyphIcon({ path, className }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={path} />
    </svg>
  );
}

const SOCIAL: { key: SocialKey; name: string; Icon: ComponentType<{ className?: string }> }[] = [
  { key: "linkedin", name: "LinkedIn", Icon: Linkedin },
  { key: "facebook", name: "Facebook", Icon: Facebook },
  { key: "instagram", name: "Instagram", Icon: Instagram },
  { key: "tiktok", name: "TikTok", Icon: (p) => <GlyphIcon path={siTiktok.path} {...p} /> },
  { key: "whatsapp", name: "WhatsApp", Icon: (p) => <GlyphIcon path={siWhatsapp.path} {...p} /> },
];

export function SiteFooter() {
  const { tr } = useLang();
  const { data: contact } = useQuery(publicSiteContactQuery);
  const { data: managedLinks = [] } = useQuery(publicSocialLinksQuery);
  const linkByKey = new Map(managedLinks.map((link) => [link.service_key, link.url]));
  const visibleSocial = SOCIAL.filter(({ key }) => {
    const url = managedLinks.length ? linkByKey.get(key) : SOCIAL_LINKS[key];
    return Boolean(url);
  });
  const socialRows = [visibleSocial.slice(0, 3), visibleSocial.slice(3)].filter((row) => row.length);
  const publicEmail = contact?.public_email || PUBLIC_EMAIL;
  const publicPhone = contact?.public_phone || PUBLIC_PHONE;
  const iconBase =
    "inline-flex size-10 items-center justify-center rounded-sm border-2 border-primary/60 bg-background text-primary shadow-[var(--shadow-soft)] transition-colors hover:border-gold";
  return (
    <footer className="border-t border-border/60 bg-section-grey">
      <div className="mx-auto grid max-w-7xl gap-5 px-6 py-6 md:grid-cols-[auto_auto_auto_auto] md:items-center md:justify-center md:gap-8 md:py-7">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="TGN Services" className="h-14 w-auto md:h-24" />
          <p className="mt-2 max-w-xs text-sm text-muted-foreground md:mt-3">{tr.footer.tagline}</p>
        </div>

        <div className="flex flex-col items-center space-y-2 text-center md:items-start md:space-y-3 md:text-left">
          <p className="eyebrow">{tr.services.eyebrow}</p>
          <div className="flex flex-col gap-1 text-base text-foreground/80 md:gap-2 lg:gap-3 lg:text-lg">
            <Link to="/care-kotiin" className="hover:text-primary">{tr.nav.kotiin}</Link>
            <Link to="/care-yrityksille" className="hover:text-primary">{tr.nav.yrityksille}</Link>
            <Link to="/care-palveluseteli" className="hover:text-primary">{tr.nav.palveluseteli}</Link>
          </div>
        </div>
        <div className="space-y-2 text-center md:space-y-3">
          <p className="eyebrow">{tr.footer.contact}</p>
          <div className="flex flex-col gap-1 text-sm text-foreground/80 md:gap-2">
            <a href={`mailto:${publicEmail}`} className="hover:text-primary">{publicEmail}</a>
            <a href={`tel:${publicPhone.replace(/\s/g, "")}`} className="hover:text-primary">{publicPhone}</a>
            {(contact?.public_address || PUBLIC_ADDRESS) && <p className="text-foreground/70">{contact?.public_address || PUBLIC_ADDRESS}</p>}
            <p className="text-foreground/70">{tr.footer.businessId}: {contact?.business_id || BUSINESS_ID}</p>
            <Link to="/tietosuoja" className="hover:text-primary">
                {tr.footer.privacy}
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2 text-center md:space-y-3">
          <p className="eyebrow">{tr.footer.follow}</p>
          <div className="flex flex-col items-center gap-2.5">
            {socialRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-2.5">
                {row.map(({ key, name, Icon }) => {
                  const url = managedLinks.length ? linkByKey.get(key) : SOCIAL_LINKS[key];
                  return url ? (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      title={name}
                      className={iconBase}
                    >
                      <Icon className="size-[18px]" />
                    </a>
                  ) : null;
                })}
              </div>
            ))}
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
