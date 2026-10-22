// Company facts supplied by Marianne (T & G Nordic Services / TGN Services).
// Keep the business ID here so the footer and the about page always agree.
export const BUSINESS_ID = "3664346-2";
export const PUBLIC_EMAIL = "info@tgnservices.fi";
export const PUBLIC_PHONE = "+358 45 78359301";
export const PUBLIC_ADDRESS = "";

// Marianne's own list of the networks TGN uses: LinkedIn, Facebook, Instagram, TikTok, WhatsApp.
export type SocialKey = "linkedin" | "facebook" | "instagram" | "tiktok" | "whatsapp";

// Marianne will supply the company's own social profile addresses.
// Fill a URL in here and the matching footer icon becomes a live link.
export const SOCIAL_LINKS: Record<SocialKey, string | null> = {
  linkedin: null,
  facebook: null,
  instagram: null,
  tiktok: null,
  whatsapp: null,
};
