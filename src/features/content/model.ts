import { z } from "zod";
import type { Tables } from "@/integrations/supabase/types";
import { businessCopy } from "@/features/business-service/copy";
import { homeCopy } from "@/features/home-service/copy";
import { t } from "@/i18n/translations";

export const contentLanguages = ["fi", "sv", "es", "en"] as const;
export type ContentLanguage = (typeof contentLanguages)[number];

export const contentPages = [
  { key: "home", label: "Etusivu", fields: ["title", "body", "cta", "secondary"] },
  { key: "home-service", label: "TGN kotiin", fields: ["title", "body", "cta"] },
  { key: "business-service", label: "TGN yrityksille", fields: ["title", "body", "cta"] },
  { key: "voucher", label: "TGN palveluseteli", fields: ["title", "body"] },
  { key: "pricing", label: "Hinnoittelu", fields: ["title", "body", "note"] },
  { key: "about", label: "Lyhyesti meistä", fields: ["title", "body", "headline", "closing"] },
  {
    key: "forms",
    label: "Lomakkeet",
    fields: ["contactHelp", "contactSuccessMessage", "startHelp", "startSuccessMessage"],
  },
] as const;

export type ContentPageKey = (typeof contentPages)[number]["key"];
export type ContentField =
  | "title"
  | "body"
  | "cta"
  | "secondary"
  | "note"
  | "headline"
  | "closing"
  | "contactHelp"
  | "contactSuccessMessage"
  | "successMessage"
  | "startHelp"
  | "startSuccessMessage";
export type ContentValues = Partial<Record<ContentField, string>>;

export type SiteContent = Tables<"site_content">;
export type SiteImage = Tables<"site_images">;
export type CustomerReview = Tables<"customer_reviews">;
export type SocialLink = Tables<"social_links">;
export type SiteContactDetails = Tables<"site_contact_details">;

export const contentValueSchema = z.record(z.string().max(20_000));

export function asContentValues(value: unknown): ContentValues {
  const parsed = contentValueSchema.safeParse(value);
  return parsed.success ? parsed.data : {};
}

export function contentFieldLabel(field: ContentField): string {
  return {
    title: "Otsikko",
    body: "Esittelyteksti",
    cta: "Painikkeen teksti",
    secondary: "Toissijaisen painikkeen teksti",
    note: "Lisätieto / hinnastoteksti",
    headline: "Väliotsikko",
    closing: "Lopetusteksti",
    contactHelp: "Yhteydenottolomakkeen ohjeteksti",
    contactSuccessMessage: "Yhteydenoton onnistumisviesti",
    successMessage: "Vanha yhteinen onnistumisviesti",
    startHelp: "Palvelun aloituslomakkeen ohjeteksti",
    startSuccessMessage: "Palvelun aloituksen onnistumisviesti",
  }[field];
}

export function sourceContentValues(pageKey: ContentPageKey, lang: ContentLanguage): ContentValues {
  const translations = t[lang];
  const home = homeCopy[lang];

  switch (pageKey) {
    case "home":
      return {
        title: translations.hero.title,
        body: translations.hero.lead,
        cta: home.contact,
        secondary: home.video,
      };
    case "home-service":
      return { title: home.banner, body: home.intro, cta: home.contact };
    case "business-service":
      return {
        title: businessCopy[lang].banner,
        body: businessCopy[lang].intro,
        cta: home.contact,
      };
    case "voucher":
      return {
        title: translations.services.palveluseteli.title,
        body: translations.services.palveluseteli.body,
      };
    case "pricing":
      return {
        title: translations.pricing.title,
        body: translations.pricing.lead,
        note: translations.pricing.note,
      };
    case "about":
      return {
        title: translations.about.title,
        body: translations.about.intro.join("\n\n"),
        headline: translations.about.headline,
        closing: translations.about.closing,
      };
    case "forms":
      return {
        contactSuccessMessage: home.contactThanks,
        startSuccessMessage: home.startThanks,
      };
  }
}

export function contentEditorValues(
  pageKey: ContentPageKey,
  lang: ContentLanguage,
  record?: Pick<SiteContent, "draft_content" | "published_content"> | null,
): ContentValues {
  return {
    ...sourceContentValues(pageKey, lang),
    ...asContentValues(record?.published_content),
    ...asContentValues(record?.draft_content),
  };
}

export function isSafeExternalUrl(value: string): boolean {
  if (!value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function makeWhatsAppUrl(value: string): string | null {
  const digits = value.replace(/[^0-9+]/g, "").replace(/^\+/, "");
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

export function publicImageUrl(path: string | null): string | null {
  if (!path) return null;
  const base = import.meta.env["VITE_SUPABASE_URL"];
  return base ? `${base.replace(/\/+$/, "")}/storage/v1/object/public/site-images/${path}` : null;
}

export const customerTypeLabels: Record<string, string> = {
  private: "Yksityisasiakas",
  business: "Yritysasiakas",
  relative: "Omainen",
  other: "Muu",
};

export const socialServiceLabels = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
} as const;
