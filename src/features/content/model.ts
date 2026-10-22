import { z } from "zod";
import type { Tables } from "@/integrations/supabase/types";

export const contentLanguages = ["fi", "sv", "es", "en"] as const;
export type ContentLanguage = (typeof contentLanguages)[number];

export const contentPages = [
  { key: "home", label: "Etusivu", fields: ["title", "body", "cta", "secondary"] },
  { key: "home-service", label: "TGN kotiin", fields: ["title", "body", "cta"] },
  { key: "business-service", label: "TGN yrityksille", fields: ["title", "body", "cta"] },
  { key: "voucher", label: "TGN palveluseteli", fields: ["title", "body"] },
  { key: "pricing", label: "Hinnoittelu", fields: ["title", "body", "note"] },
  { key: "about", label: "Lyhyesti meistä", fields: ["title", "body", "headline", "closing"] },
  { key: "forms", label: "Lomakkeet", fields: ["contactHelp", "successMessage", "startHelp"] },
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
  | "successMessage"
  | "startHelp";
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
    successMessage: "Onnistumisviesti",
    startHelp: "Palvelun aloituslomakkeen ohjeteksti",
  }[field];
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
