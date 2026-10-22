import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { asContentValues, isSafeExternalUrl, publicImageUrl } from "./model";
import type { ContentLanguage } from "./model";
import {
  mergePublicPricing,
  parseAdminPricing,
  type PricingService,
} from "@/features/pricing/model";

export const publicContentQuery = (pageKey: string, lang: string) =>
  queryOptions({
    queryKey: ["public-content", pageKey, lang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_site_content")
        .select("published_content")
        .eq("page_key", pageKey)
        .eq("lang", lang)
        .maybeSingle();
      if (error) return {};
      return asContentValues(data?.published_content);
    },
    staleTime: 30_000,
    retry: false,
  });

export const publicSiteContactQuery = queryOptions({
  queryKey: ["public-site-contact"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("site_contact_details")
      .select("*")
      .eq("id", "default")
      .maybeSingle();
    return error ? null : data;
  },
  staleTime: 60_000,
  retry: false,
});

export const publicImageQuery = (pageKey: string, slotKey: string, lang: string) =>
  queryOptions({
    queryKey: ["public-site-image", pageKey, slotKey, lang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_site_images")
        .select("published_path,published_alt_text")
        .eq("page_key", pageKey)
        .eq("slot_key", slotKey)
        .eq("lang", lang)
        .maybeSingle();
      return error || !data?.published_path
        ? null
        : { url: publicImageUrl(data.published_path), alt: data.published_alt_text };
    },
    staleTime: 60_000,
    retry: false,
  });

export const publicSocialLinksQuery = queryOptions({
  queryKey: ["public-social-links"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("visible", true)
      .order("display_order");
    return error
      ? []
      : (data ?? []).filter((link) => link.url.trim() && isSafeExternalUrl(link.url));
  },
  staleTime: 60_000,
  retry: false,
});

export const publicReviewsQuery = queryOptions({
  queryKey: ["public-reviews"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("customer_reviews")
      .select("*")
      .eq("published", true)
      .eq("consent_granted", true)
      .eq("hidden", false)
      .order("display_order")
      .order("published_at", { ascending: false });
    return error ? [] : (data ?? []);
  },
  staleTime: 60_000,
  retry: false,
});

export const adminContentQuery = queryOptions({
  queryKey: ["admin-site-content"],
  queryFn: async () => {
    const { data, error } = await supabase.rpc("admin_site_content");
    if (error) throw new Error("Sisältöjä ei voitu ladata.");
    return data ?? [];
  },
});

export const adminContactQuery = queryOptions({
  queryKey: ["admin-site-contact"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("site_contact_details")
      .select("*")
      .eq("id", "default")
      .maybeSingle();
    if (error) throw new Error("Yhteystietoja ei voitu ladata.");
    return data;
  },
});

export const adminImagesQuery = queryOptions({
  queryKey: ["admin-site-images"],
  queryFn: async () => {
    const { data, error } = await supabase.rpc("admin_site_images");
    if (error) throw new Error("Kuvia ei voitu ladata.");
    return data ?? [];
  },
});

export const adminPricingQuery = queryOptions({
  queryKey: ["admin-pricing"],
  queryFn: async () => {
    const { data, error } = await supabase.rpc("admin_service_pricing");
    if (error) throw new Error("Hinnoittelua ei voitu ladata.");
    return parseAdminPricing(data);
  },
});

export const publicPricingQuery = (serviceType: PricingService, lang: ContentLanguage) =>
  queryOptions({
    queryKey: ["public-pricing", serviceType, lang],
    queryFn: async () => {
      const [packages, packageTexts, settings, texts] = await Promise.all([
        supabase
          .from("public_service_pricing_packages")
          .select("*")
          .eq("service_type", serviceType)
          .order("display_order"),
        supabase.from("public_service_pricing_package_texts").select("*").eq("lang", lang),
        supabase
          .from("public_service_pricing_settings")
          .select("*")
          .eq("service_type", serviceType),
        supabase
          .from("public_service_pricing_texts")
          .select("*")
          .eq("service_type", serviceType)
          .eq("lang", lang),
      ]);
      return mergePublicPricing(
        serviceType,
        lang,
        packages.error ? [] : packages.data,
        packageTexts.error ? [] : packageTexts.data,
        settings.error ? [] : settings.data,
        texts.error ? [] : texts.data,
      );
    },
    staleTime: 30_000,
    retry: false,
  });

export const adminReviewsQuery = queryOptions({
  queryKey: ["admin-customer-reviews"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("customer_reviews")
      .select("*")
      .order("display_order")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Asiakaspalautteita ei voitu ladata.");
    return data ?? [];
  },
});

export const adminSocialLinksQuery = queryOptions({
  queryKey: ["admin-social-links"],
  queryFn: async () => {
    const { data, error } = await supabase.from("social_links").select("*").order("display_order");
    if (error) throw new Error("Sosiaalisen median asetuksia ei voitu ladata.");
    return data ?? [];
  },
});

export function imageUrlForPath(path: string | null): string | null {
  return publicImageUrl(path);
}
