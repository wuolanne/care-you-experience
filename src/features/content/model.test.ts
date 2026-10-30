import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { t } from "@/i18n/translations";
import {
  asContentValues,
  contentEditorValues,
  isSafeExternalUrl,
  makeWhatsAppUrl,
  sourceContentValues,
  contentPages,
  customerReviewFlags,
  customerReviewVisibility,
  homeContentValues,
  parseLegacyHomeContent,
} from "./model";

describe("Admin v2 content safety helpers", () => {
  it("keeps pricing out of the generic content editor", () => {
    expect(contentPages.some((page) => (page.key as string) === "pricing")).toBe(false);
  });
  it("keeps only string content values for safe text rendering", () => {
    expect(asContentValues({ title: "Otsikko", body: 123, cta: "Lue lisää" })).toEqual({});
    expect(asContentValues({ title: "Otsikko", body: "Teksti" })).toEqual({
      title: "Otsikko",
      body: "Teksti",
    });
  });

  it("loads source translations on the first edit when no database record exists", () => {
    expect(contentEditorValues("home", "fi")).toMatchObject({
      title: t.fi.hero.title,
      body: t.fi.hero.lead,
      intro: t.fi.hero.lead,
      pricingTitle: t.fi.pricingBanner.title,
      pricingMonthlyDescription: t.fi.pricingBanner.paragraphs[0],
      valuesTitle: t.fi.values.title,
      value4Body: t.fi.values.items[3]?.body,
    });
  });

  it("splits a clearly numbered legacy homepage body without using indentation", () => {
    const legacy = [
      "Aina tutulla vastuuhenkilöllä, joustavilla ehdoilla ja 100 % laatutakuulla!",
      "",
      "1. Sisältä ja ulkoa",
      "Hoidamme sovitut sisä- ja ulkotilat samalla huolellisuudella.",
      "",
      "2. Oma nimetty tiimi",
      "Saat tutun tiimin ja vastuuhenkilön, joka tuntee kokonaisuuden.",
      "",
      "3. Avoin hinnoittelu & Jousto",
      "Sovitamme palvelun tarpeisiisi ilman piilokuluja.",
      "",
      "Luotettavaa siivouspalvelua ilman turhaa säätöä ja räätälöity juuri teille.",
    ].join("\n");

    expect(parseLegacyHomeContent(legacy)).toEqual({
      intro: "Aina tutulla vastuuhenkilöllä, joustavilla ehdoilla ja 100 % laatutakuulla!",
      card1Title: "Sisältä ja ulkoa",
      card1Body: "Hoidamme sovitut sisä- ja ulkotilat samalla huolellisuudella.",
      card2Title: "Oma nimetty tiimi",
      card2Body: "Saat tutun tiimin ja vastuuhenkilön, joka tuntee kokonaisuuden.",
      card3Title: "Avoin hinnoittelu & Jousto",
      card3Body: "Sovitamme palvelun tarpeisiisi ilman piilokuluja.",
      closing: "Luotettavaa siivouspalvelua ilman turhaa säätöä ja räätälöity juuri teille.",
    });
  });

  it("keeps an ambiguous legacy body intact instead of inventing card values", () => {
    const body = "Aloitusteksti\n\n1. Kohta yksi\nKuvaus ilman turvallista lopetusrakennetta";
    const values = homeContentValues("fi", {
      published_content: { body },
      draft_content: null,
    });

    expect(values.intro).toBe(body);
    expect(values.card1Title).toBe("");
    expect(values.card2Title).toBe("");
    expect(values.card3Title).toBe("");
    expect(values.closing).toBe("");
  });

  it("keeps structured homepage content isolated per language", () => {
    const fi = contentEditorValues("home", "fi", {
      published_content: { card1Title: "FI-kortti" },
      draft_content: null,
    });
    const sv = contentEditorValues("home", "sv");

    expect(fi.card1Title).toBe("FI-kortti");
    expect(sv.card1Title).not.toBe("FI-kortti");
  });

  it("keeps line breaks in managed home content values", () => {
    const values = contentEditorValues("home", "fi", {
      published_content: null,
      draft_content: {
        pricingMonthlyDescription: "Ensimmäinen rivi\nToinen rivi\n\nUusi kappale.",
        value1Body: "Arvo yksi\nkuvaus jatkuu.",
      },
    });

    expect(values.pricingMonthlyDescription).toBe("Ensimmäinen rivi\nToinen rivi\n\nUusi kappale.");
    expect(values.value1Body).toBe("Arvo yksi\nkuvaus jatkuu.");
  });

  it("prioritizes a draft over published content and source translations", () => {
    expect(
      contentEditorValues("pricing", "fi", {
        published_content: { title: "Julkaistu otsikko", body: "Julkaistu teksti" },
        draft_content: { title: "Luonnoksen otsikko" },
      }),
    ).toMatchObject({
      title: "Luonnoksen otsikko",
      body: "Julkaistu teksti",
      note: t.fi.pricing.note,
    });
  });

  it("uses the selected language's translations", () => {
    expect(sourceContentValues("home-service", "sv").title).toBe("Våra tjänster TGN Kotiin");
    expect(sourceContentValues("home-service", "en").title).toBe("Our services TGN Kotiin");
  });

  it("provides the localized service-voucher coming-soon fallback", () => {
    expect(sourceContentValues("voucher", "fi").comingSoon).toBe("TULOSSA PIAN!");
    expect(sourceContentValues("voucher", "sv").comingSoon).toBe("KOMMER SNART!");
    expect(sourceContentValues("voucher", "es").comingSoon).toBe("¡PRÓXIMAMENTE!");
    expect(sourceContentValues("voucher", "en").comingSoon).toBe("COMING SOON!");
  });

  it("keeps the form success fallbacks separate for each form", () => {
    expect(sourceContentValues("forms", "fi")).toEqual({
      contactSuccessMessage: "Kiitos viestistäsi! Palaamme sinulle asiaan tämän päivän aikana.",
      startSuccessMessage:
        "Kiitos palvelupyynnöstäsi! Saavumme paikalle sovittuna ajankohtana ja tarkennamme palvelun sisällön ennen saapumista. Vahvistamme aloitusajan kanssasi erikseen.",
    });
  });

  it("accepts only http(s) social URLs", () => {
    expect(isSafeExternalUrl("https://www.linkedin.com/company/tgn")).toBe(true);
    expect(isSafeExternalUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeExternalUrl("//example.com")).toBe(false);
  });

  it("normalizes a WhatsApp phone number", () => {
    expect(makeWhatsAppUrl("+358 45 783 9301")).toBe("https://wa.me/358457839301");
    expect(makeWhatsAppUrl("12")).toBeNull();
  });

  it("maps review visibility to one explicit UI state", () => {
    expect(customerReviewVisibility({ published: true, hidden: false })).toBe("public");
    expect(customerReviewVisibility({ published: false, hidden: true })).toBe("hidden");
    expect(customerReviewVisibility({ published: false, hidden: false })).toBe("hidden");
    expect(customerReviewVisibility({ published: true, hidden: true })).toBe("conflict");
    expect(customerReviewFlags("public")).toEqual({ published: true, hidden: false });
    expect(customerReviewFlags("hidden")).toEqual({ published: false, hidden: true });
  });

  it("keeps drafts behind admin functions and a private image bucket", () => {
    const migration = readFileSync(
      new URL("../../../drizzle/migrations/0010_admin_content_management.sql", import.meta.url),
      "utf8",
    );

    expect(migration).toContain("site-images-drafts");
    expect(migration).toContain("public_site_content");
    expect(migration).toContain("public_site_images");
    expect(migration).toContain(
      "REVOKE ALL ON public.site_content FROM PUBLIC, anon, authenticated",
    );
    expect(migration).toContain(
      "REVOKE ALL ON public.site_images FROM PUBLIC, anon, authenticated",
    );
    expect(migration).toContain("public.admin_site_content");
    expect(migration).toContain("public.admin_site_images");
  });

  it("defines shared about image and staff public boundaries in migration 0012", () => {
    const migration = readFileSync(
      new URL("../../../drizzle/migrations/0012_admin_staff_management.sql", import.meta.url),
      "utf8",
    );

    expect(migration).toContain("public_shared_about_image");
    expect(migration).toContain("public_staff_members");
    expect(migration).toContain("public_staff_member_texts");
    expect(migration).toContain("admin_upsert_staff_member");
    expect(migration).toContain(
      "REVOKE ALL ON public.staff_members FROM PUBLIC, anon, authenticated",
    );
    expect(migration).toContain("cannot publish an empty staff member");
  });

  it("keeps public RLS policies independent from admin role checks", () => {
    const migration = readFileSync(
      new URL("../../../drizzle/migrations/0014_public_content_rls_fix.sql", import.meta.url),
      "utf8",
    );
    const publicReviewsPolicy =
      migration.match(/CREATE POLICY customer_reviews_public_read[\s\S]*?;/)?.[0] ?? "";
    const adminReviewsPolicy =
      migration.match(/CREATE POLICY customer_reviews_admin_read[\s\S]*?;/)?.[0] ?? "";
    const publicSocialLinksPolicy =
      migration.match(/CREATE POLICY social_links_public_read[\s\S]*?;/)?.[0] ?? "";
    const adminSocialLinksPolicy =
      migration.match(/CREATE POLICY social_links_admin_read[\s\S]*?;/)?.[0] ?? "";

    expect(publicReviewsPolicy).toContain(
      "published = true AND consent_granted = true AND hidden = false",
    );
    expect(publicReviewsPolicy).not.toContain("has_role");
    expect(publicSocialLinksPolicy).toContain("visible = true");
    expect(publicSocialLinksPolicy).not.toContain("has_role");
    expect(adminReviewsPolicy).toContain("public.has_role(auth.uid(), 'admin')");
    expect(adminSocialLinksPolicy).toContain("public.has_role(auth.uid(), 'admin')");
    expect(migration).not.toMatch(/GRANT EXECUTE[\s\S]*\banon\b/i);
  });
});
