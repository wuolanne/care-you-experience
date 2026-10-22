import { describe, expect, it } from "vitest";
import {
  editorPricingValues,
  mergePublicPricing,
  publishedPricingValues,
  sourcePricing,
  type AdminPricingSnapshot,
} from "./model";

function snapshotWithOverrides(): AdminPricingSnapshot {
  const source = sourcePricing("home", "fi");
  const firstPackage = source.packages[0]!;
  const texts = source.settings.texts;

  return {
    packages: [
      {
        package_key: firstPackage.packageKey,
        service_type: "home",
        display_order: firstPackage.displayOrder,
        draft_name: "Luonnos Mini",
        published_name: firstPackage.name,
        draft_monthly_price: 199.99,
        published_monthly_price: firstPackage.monthlyPrice,
        draft_hours: 4,
        published_hours: firstPackage.hours,
      },
    ],
    packageTexts: [
      {
        package_key: firstPackage.packageKey,
        lang: "fi",
        draft_description: "Luonnoksen kuvaus",
        published_description: "Julkaistu kuvaus",
      },
    ],
    settings: [
      {
        service_type: "home",
        draft_hourly_price: 70.5,
        published_hourly_price: source.settings.hourlyPrice,
      },
    ],
    texts: [
      {
        service_type: "home",
        lang: "fi",
        draft_pricing_heading: "Luonnoksen hinnoittelu",
        published_pricing_heading: texts.pricingHeading,
        draft_pricing_note: "Luonnoksen esittely",
        published_pricing_note: texts.pricingNote,
        draft_monthly_heading: "Luonnoksen paketit",
        published_monthly_heading: texts.monthlyHeading,
        draft_vat_notice: "Luonnoksen ALV",
        published_vat_notice: texts.vatNotice,
        draft_package_description: texts.packageDescription,
        published_package_description: texts.packageDescription,
        draft_hourly_heading: "Luonnoksen tuntihinta",
        published_hourly_heading: texts.hourlyHeading,
        draft_hourly_description: "Luonnoksen tuntikuvaus",
        published_hourly_description: texts.hourlyDescription,
        draft_deduction_title: texts.deductionTitle,
        published_deduction_title: texts.deductionTitle,
        draft_deduction_body: texts.deductionBody,
        published_deduction_body: texts.deductionBody,
        draft_deduction_link_label: texts.deductionLinkLabel,
        published_deduction_link_label: texts.deductionLinkLabel,
      },
    ],
  };
}

describe("Admin v2 pricing model", () => {
  it("loads the current home and business prices as the source fallback", () => {
    expect(sourcePricing("home", "fi").packages.map((item) => item.monthlyPrice)).toEqual([
      158.13, 308.73, 602.4, 1174.68,
    ]);
    expect(sourcePricing("business", "fi").packages.map((item) => item.monthlyPrice)).toEqual([
      180, 350, 680, 1312,
    ]);
  });

  it("keeps drafts separate from published pricing", () => {
    const snapshot = snapshotWithOverrides();
    expect(editorPricingValues(snapshot, "home", "fi").packages[0]).toMatchObject({
      name: "Luonnos Mini",
      monthlyPrice: 199.99,
      hours: 4,
      description: "Luonnoksen kuvaus",
    });
    expect(publishedPricingValues(snapshot, "home", "fi").packages[0]).toMatchObject({
      name: "TGN Mini",
      monthlyPrice: 158.13,
      hours: 3,
      description: "Julkaistu kuvaus",
    });
    expect(publishedPricingValues(snapshot, "home", "fi").settings.hourlyPrice).toBe(65.26);
  });

  it("uses source values when public pricing is not available", () => {
    const fallback = mergePublicPricing("home", "fi", [], [], [], []);
    expect(fallback.packages[0]).toMatchObject({
      name: "TGN Mini",
      monthlyPrice: 158.13,
      hours: 3,
    });
    expect(fallback.settings.hourlyPrice).toBe(65.26);
  });

  it("uses published public values and keeps numeric prices equal between languages", () => {
    const fi = mergePublicPricing(
      "home",
      "fi",
      [{ package_key: "home-mini", name: "TGN Mini", monthly_price: 201.5, hours: 5 }],
      [{ package_key: "home-mini", lang: "fi", description: "Suomen kuvaus" }],
      [{ service_type: "home", hourly_price: 72.25 }],
      [{ service_type: "home", lang: "fi", pricing_heading: "Hinnoittelu" }],
    );
    const sv = mergePublicPricing(
      "home",
      "sv",
      [{ package_key: "home-mini", name: "TGN Mini", monthly_price: 201.5, hours: 5 }],
      [{ package_key: "home-mini", lang: "sv", description: "Svensk beskrivning" }],
      [{ service_type: "home", hourly_price: 72.25 }],
      [{ service_type: "home", lang: "sv", pricing_heading: "Priser" }],
    );
    expect(fi.packages[0]).toMatchObject({
      monthlyPrice: 201.5,
      hours: 5,
      description: "Suomen kuvaus",
    });
    expect(sv.packages[0]).toMatchObject({
      monthlyPrice: 201.5,
      hours: 5,
      description: "Svensk beskrivning",
    });
    expect(fi.settings.hourlyPrice).toBe(sv.settings.hourlyPrice);
  });
});
