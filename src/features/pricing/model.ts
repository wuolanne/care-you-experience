import { businessPackages, businessHourlyPrice } from "@/features/business-service/model";
import { businessCopy } from "@/features/business-service/copy";
import { homePackages, homeHourlyPrice } from "@/features/home-service/model";
import { homeCopy } from "@/features/home-service/copy";
import type { ContentLanguage } from "@/features/content/model";

export const pricingServices = ["home", "business"] as const;
export type PricingService = (typeof pricingServices)[number];

export type PricingPackage = {
  packageKey: string;
  serviceType: PricingService;
  displayOrder: number;
  name: string;
  monthlyPrice: number;
  hours: number;
  description: string;
};

export type PricingTexts = {
  pricingHeading: string;
  pricingNote: string;
  monthlyHeading: string;
  vatNotice: string;
  packageDescription: string;
  hourlyHeading: string;
  hourlyDescription: string;
  deductionTitle: string | null;
  deductionBody: string | null;
  deductionLinkLabel: string | null;
};

export type PricingSettings = {
  serviceType: PricingService;
  hourlyPrice: number;
  texts: PricingTexts;
};

export type PricingData = {
  packages: PricingPackage[];
  settings: PricingSettings;
};

type AdminPackageRow = {
  package_key: string;
  service_type: PricingService;
  display_order: number;
  draft_name: string;
  published_name: string;
  draft_monthly_price: number;
  published_monthly_price: number;
  draft_hours: number;
  published_hours: number;
};

type AdminPackageTextRow = {
  package_key: string;
  lang: ContentLanguage;
  draft_description: string;
  published_description: string | null;
};

type AdminSettingsRow = {
  service_type: PricingService;
  draft_hourly_price: number;
  published_hourly_price: number;
};

type AdminTextsRow = {
  service_type: PricingService;
  lang: ContentLanguage;
  draft_pricing_heading: string;
  published_pricing_heading: string | null;
  draft_pricing_note: string;
  published_pricing_note: string | null;
  draft_monthly_heading: string;
  published_monthly_heading: string | null;
  draft_vat_notice: string;
  published_vat_notice: string | null;
  draft_package_description: string;
  published_package_description: string | null;
  draft_hourly_heading: string;
  published_hourly_heading: string | null;
  draft_hourly_description: string;
  published_hourly_description: string | null;
  draft_deduction_title: string | null;
  published_deduction_title: string | null;
  draft_deduction_body: string | null;
  published_deduction_body: string | null;
  draft_deduction_link_label: string | null;
  published_deduction_link_label: string | null;
};

export type AdminPricingSnapshot = {
  packages: AdminPackageRow[];
  packageTexts: AdminPackageTextRow[];
  settings: AdminSettingsRow[];
  texts: AdminTextsRow[];
};

const sourcePackageKeys = {
  home: ["home-mini", "home-medium", "home-maxi", "home-premium"],
  business: ["business-mini", "business-medium", "business-maxi", "business-premium"],
} as const;

function sourceTexts(serviceType: PricingService, lang: ContentLanguage): PricingTexts {
  const home = homeCopy[lang];
  const business = businessCopy[lang];
  return {
    pricingHeading: home.pricing,
    pricingNote: home.pricingNote,
    monthlyHeading: home.monthly,
    vatNotice: serviceType === "home" ? home.vat : business.vat,
    packageDescription: home.packageBody,
    hourlyHeading: home.hourly,
    hourlyDescription: home.hourlyBody,
    deductionTitle: serviceType === "home" ? home.deduction : null,
    deductionBody: serviceType === "home" ? home.deductionBody : null,
    deductionLinkLabel: serviceType === "home" ? home.vero : null,
  };
}

export function sourcePricing(serviceType: PricingService, lang: ContentLanguage): PricingData {
  const sourcePackages = serviceType === "home" ? homePackages : businessPackages;
  const hourlyPrice = serviceType === "home" ? homeHourlyPrice : businessHourlyPrice;
  const texts = sourceTexts(serviceType, lang);

  return {
    packages: sourcePackages.map((item, index) => ({
      packageKey: sourcePackageKeys[serviceType][index]!,
      serviceType,
      displayOrder: index + 1,
      name: item.name,
      monthlyPrice: item.monthly,
      hours: item.hours,
      description: texts.packageDescription,
    })),
    settings: { serviceType, hourlyPrice, texts },
  };
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function numberValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function arrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function parseAdminPricing(value: unknown): AdminPricingSnapshot {
  const data = record(value);
  return {
    packages: arrayValue(data["packages"]).flatMap((item) => {
      const row = record(item);
      const serviceType = row["service_type"];
      const numericValues = [
        row["display_order"],
        row["draft_monthly_price"],
        row["published_monthly_price"],
        row["draft_hours"],
        row["published_hours"],
      ].map(numberValue);
      if (
        typeof row["package_key"] !== "string" ||
        !pricingServices.includes(serviceType as PricingService) ||
        typeof row["draft_name"] !== "string" ||
        typeof row["published_name"] !== "string" ||
        numericValues.some((item) => item === null)
      ) {
        return [];
      }
      return [
        {
          package_key: row["package_key"],
          service_type: serviceType as PricingService,
          display_order: numericValues[0]!,
          draft_name: row["draft_name"],
          published_name: row["published_name"],
          draft_monthly_price: numericValues[1]!,
          published_monthly_price: numericValues[2]!,
          draft_hours: numericValues[3]!,
          published_hours: numericValues[4]!,
        },
      ];
    }),
    packageTexts: arrayValue(data["packageTexts"]).flatMap((item) => {
      const row = record(item);
      if (
        typeof row["package_key"] !== "string" ||
        !["fi", "sv", "es", "en"].includes(String(row["lang"])) ||
        typeof row["draft_description"] !== "string"
      ) {
        return [];
      }
      return [
        {
          package_key: row["package_key"],
          lang: row["lang"] as ContentLanguage,
          draft_description: row["draft_description"],
          published_description: stringValue(row["published_description"]),
        },
      ];
    }),
    settings: arrayValue(data["settings"]).flatMap((item) => {
      const row = record(item);
      const draft = numberValue(row["draft_hourly_price"]);
      const published = numberValue(row["published_hourly_price"]);
      if (
        !pricingServices.includes(row["service_type"] as PricingService) ||
        draft === null ||
        published === null
      )
        return [];
      return [
        {
          service_type: row["service_type"] as PricingService,
          draft_hourly_price: draft,
          published_hourly_price: published,
        },
      ];
    }),
    texts: arrayValue(data["texts"]).flatMap((item) => {
      const row = record(item);
      const serviceType = row["service_type"];
      const lang = row["lang"];
      const required = [
        "draft_pricing_heading",
        "draft_pricing_note",
        "draft_monthly_heading",
        "draft_vat_notice",
        "draft_package_description",
        "draft_hourly_heading",
        "draft_hourly_description",
      ];
      if (
        !pricingServices.includes(serviceType as PricingService) ||
        !["fi", "sv", "es", "en"].includes(String(lang)) ||
        required.some((key) => typeof row[key] !== "string")
      ) {
        return [];
      }
      return [
        {
          service_type: serviceType as PricingService,
          lang: lang as ContentLanguage,
          draft_pricing_heading: row["draft_pricing_heading"] as string,
          published_pricing_heading: stringValue(row["published_pricing_heading"]),
          draft_pricing_note: row["draft_pricing_note"] as string,
          published_pricing_note: stringValue(row["published_pricing_note"]),
          draft_monthly_heading: row["draft_monthly_heading"] as string,
          published_monthly_heading: stringValue(row["published_monthly_heading"]),
          draft_vat_notice: row["draft_vat_notice"] as string,
          published_vat_notice: stringValue(row["published_vat_notice"]),
          draft_package_description: row["draft_package_description"] as string,
          published_package_description: stringValue(row["published_package_description"]),
          draft_hourly_heading: row["draft_hourly_heading"] as string,
          published_hourly_heading: stringValue(row["published_hourly_heading"]),
          draft_hourly_description: row["draft_hourly_description"] as string,
          published_hourly_description: stringValue(row["published_hourly_description"]),
          draft_deduction_title: stringValue(row["draft_deduction_title"]),
          published_deduction_title: stringValue(row["published_deduction_title"]),
          draft_deduction_body: stringValue(row["draft_deduction_body"]),
          published_deduction_body: stringValue(row["published_deduction_body"]),
          draft_deduction_link_label: stringValue(row["draft_deduction_link_label"]),
          published_deduction_link_label: stringValue(row["published_deduction_link_label"]),
        },
      ];
    }),
  };
}

function pricingValuesFromSnapshot(
  snapshot: AdminPricingSnapshot | undefined,
  serviceType: PricingService,
  lang: ContentLanguage,
  revision: "draft" | "published",
): PricingData {
  const source = sourcePricing(serviceType, lang);
  const draft = revision === "draft";
  const packageRows = snapshot?.packages.filter((item) => item.service_type === serviceType) ?? [];
  const settingsRow = snapshot?.settings.find((item) => item.service_type === serviceType);
  const textRow = snapshot?.texts.find(
    (item) => item.service_type === serviceType && item.lang === lang,
  );

  return {
    packages: source.packages.map((item) => {
      const row = packageRows.find((candidate) => candidate.package_key === item.packageKey);
      const text = snapshot?.packageTexts.find(
        (candidate) => candidate.package_key === item.packageKey && candidate.lang === lang,
      );
      return {
        ...item,
        name: (draft ? (row?.draft_name ?? row?.published_name) : row?.published_name) ?? item.name,
        monthlyPrice:
          (draft
            ? (row?.draft_monthly_price ?? row?.published_monthly_price)
            : row?.published_monthly_price) ?? item.monthlyPrice,
        hours:
          (draft ? (row?.draft_hours ?? row?.published_hours) : row?.published_hours) ?? item.hours,
        description:
          (draft
            ? (text?.draft_description ?? text?.published_description)
            : text?.published_description) ?? item.description,
      };
    }),
    settings: {
      serviceType,
      hourlyPrice:
        (draft
          ? (settingsRow?.draft_hourly_price ?? settingsRow?.published_hourly_price)
          : settingsRow?.published_hourly_price) ?? source.settings.hourlyPrice,
      texts: {
        ...source.settings.texts,
        pricingHeading:
          (draft
            ? (textRow?.draft_pricing_heading ?? textRow?.published_pricing_heading)
            : textRow?.published_pricing_heading) ?? source.settings.texts.pricingHeading,
        pricingNote:
          (draft
            ? (textRow?.draft_pricing_note ?? textRow?.published_pricing_note)
            : textRow?.published_pricing_note) ?? source.settings.texts.pricingNote,
        monthlyHeading:
          (draft
            ? (textRow?.draft_monthly_heading ?? textRow?.published_monthly_heading)
            : textRow?.published_monthly_heading) ?? source.settings.texts.monthlyHeading,
        vatNotice:
          (draft
            ? (textRow?.draft_vat_notice ?? textRow?.published_vat_notice)
            : textRow?.published_vat_notice) ?? source.settings.texts.vatNotice,
        packageDescription:
          (draft
            ? (textRow?.draft_package_description ?? textRow?.published_package_description)
            : textRow?.published_package_description) ?? source.settings.texts.packageDescription,
        hourlyHeading:
          (draft
            ? (textRow?.draft_hourly_heading ?? textRow?.published_hourly_heading)
            : textRow?.published_hourly_heading) ?? source.settings.texts.hourlyHeading,
        hourlyDescription:
          (draft
            ? (textRow?.draft_hourly_description ?? textRow?.published_hourly_description)
            : textRow?.published_hourly_description) ?? source.settings.texts.hourlyDescription,
        deductionTitle:
          (draft
            ? (textRow?.draft_deduction_title ?? textRow?.published_deduction_title)
            : textRow?.published_deduction_title) ?? source.settings.texts.deductionTitle,
        deductionBody:
          (draft
            ? (textRow?.draft_deduction_body ?? textRow?.published_deduction_body)
            : textRow?.published_deduction_body) ?? source.settings.texts.deductionBody,
        deductionLinkLabel:
          (draft
            ? (textRow?.draft_deduction_link_label ?? textRow?.published_deduction_link_label)
            : textRow?.published_deduction_link_label) ?? source.settings.texts.deductionLinkLabel,
      },
    },
  };
}

export function editorPricingValues(
  snapshot: AdminPricingSnapshot | undefined,
  serviceType: PricingService,
  lang: ContentLanguage,
): PricingData {
  return pricingValuesFromSnapshot(snapshot, serviceType, lang, "draft");
}

export function publishedPricingValues(
  snapshot: AdminPricingSnapshot | undefined,
  serviceType: PricingService,
  lang: ContentLanguage,
): PricingData {
  return pricingValuesFromSnapshot(snapshot, serviceType, lang, "published");
}

export function pricingPayload(data: PricingData) {
  return {
    packages: data.packages.map((item) => ({
      packageKey: item.packageKey,
      name: item.name,
      monthlyPrice: item.monthlyPrice,
      hours: item.hours,
      description: item.description,
    })),
    settings: { hourlyPrice: data.settings.hourlyPrice },
    texts: data.settings.texts,
  };
}

export function mergePublicPricing(
  serviceType: PricingService,
  lang: ContentLanguage,
  packages: unknown,
  packageTexts: unknown,
  settings: unknown,
  texts: unknown,
): PricingData {
  const source = sourcePricing(serviceType, lang);
  const packageRows = arrayValue(packages);
  const settingsRow = arrayValue(settings)
    .map(record)
    .find((item) => item["service_type"] === serviceType);
  const textRow = arrayValue(texts)
    .map(record)
    .find((item) => item["service_type"] === serviceType && item["lang"] === lang);
  const packageTextRows = arrayValue(packageTexts);

  return {
    packages: source.packages.map((item) => {
      const row = packageRows
        .map(record)
        .find((candidate) => candidate["package_key"] === item.packageKey);
      const text = packageTextRows
        .map(record)
        .find(
          (candidate) => candidate["package_key"] === item.packageKey && candidate["lang"] === lang,
        );
      return {
        ...item,
        name: stringValue(row?.["name"]) ?? item.name,
        monthlyPrice: numberValue(row?.["monthly_price"]) ?? item.monthlyPrice,
        hours: numberValue(row?.["hours"]) ?? item.hours,
        description: stringValue(text?.["description"]) ?? item.description,
      };
    }),
    settings: {
      serviceType,
      hourlyPrice: numberValue(settingsRow?.["hourly_price"]) ?? source.settings.hourlyPrice,
      texts: {
        ...source.settings.texts,
        pricingHeading:
          stringValue(textRow?.["pricing_heading"]) ?? source.settings.texts.pricingHeading,
        pricingNote: stringValue(textRow?.["pricing_note"]) ?? source.settings.texts.pricingNote,
        monthlyHeading:
          stringValue(textRow?.["monthly_heading"]) ?? source.settings.texts.monthlyHeading,
        vatNotice: stringValue(textRow?.["vat_notice"]) ?? source.settings.texts.vatNotice,
        packageDescription:
          stringValue(textRow?.["package_description"]) ?? source.settings.texts.packageDescription,
        hourlyHeading:
          stringValue(textRow?.["hourly_heading"]) ?? source.settings.texts.hourlyHeading,
        hourlyDescription:
          stringValue(textRow?.["hourly_description"]) ?? source.settings.texts.hourlyDescription,
        deductionTitle:
          stringValue(textRow?.["deduction_title"]) ?? source.settings.texts.deductionTitle,
        deductionBody:
          stringValue(textRow?.["deduction_body"]) ?? source.settings.texts.deductionBody,
        deductionLinkLabel:
          stringValue(textRow?.["deduction_link_label"]) ??
          source.settings.texts.deductionLinkLabel,
      },
    },
  };
}
