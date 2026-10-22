import { businessCopy } from "@/features/business-service/copy";
import { homeCopy } from "@/features/home-service/copy";
import type { ContentLanguage } from "@/features/content/model";

export const serviceTypes = ["home", "business"] as const;
export const sectionTypes = ["services", "benefits"] as const;
export const serviceIconKeys = [
  "house",
  "panels",
  "sparkles",
  "leaf",
  "footprints",
  "package",
  "building",
  "snowflake",
  "refresh",
  "contact",
  "shield",
  "calendar",
  "truck",
] as const;

export type ServiceType = (typeof serviceTypes)[number];
export type SectionType = (typeof sectionTypes)[number];
export type ServiceIconKey = (typeof serviceIconKeys)[number];

export type ServiceSectionItem = {
  id: string;
  icon: ServiceIconKey;
  displayOrder: number;
  visible: boolean;
  title: string;
  description: string;
};

export type ServiceSectionValues = {
  serviceType: ServiceType;
  sectionType: SectionType;
  lang: ContentLanguage;
  title: string;
  body: string;
  items: ServiceSectionItem[];
};

export type AdminServiceSnapshot = {
  sectionTexts: Record<string, unknown>[];
  items: Record<string, unknown>[];
  itemTexts: Record<string, unknown>[];
  deletedItemIds: string[];
};

const fallbackIds: Record<ServiceType, Record<SectionType, string[]>> = {
  home: {
    services: ["101", "102", "103", "104", "105", "106"],
    benefits: ["301", "302", "303", "304"],
  },
  business: {
    services: ["201", "202", "203"],
    benefits: ["401", "402", "403", "404"],
  },
};

const defaultIcons: Record<ServiceType, Record<SectionType, ServiceIconKey[]>> = {
  home: {
    services: ["house", "panels", "sparkles", "leaf", "footprints", "package"],
    benefits: ["refresh", "contact", "shield", "calendar"],
  },
  business: {
    services: ["building", "leaf", "snowflake"],
    benefits: ["refresh", "contact", "shield", "calendar"],
  },
};

function fallbackId(serviceType: ServiceType, sectionType: SectionType, index: number) {
  return `00000000-0000-4000-8000-000000000${fallbackIds[serviceType][sectionType][index]}`;
}

function copyFor(serviceType: ServiceType, lang: ContentLanguage) {
  return serviceType === "home" ? homeCopy[lang] : businessCopy[lang];
}

export function sourceServiceSection(
  serviceType: ServiceType,
  sectionType: SectionType,
  lang: ContentLanguage,
): ServiceSectionValues {
  const copy = copyFor(serviceType, lang);
  const sourceItems = sectionType === "services" ? copy.services : copy.benefits;
  const items = sourceItems.flatMap((item, index) => {
    if (!item) return [];
    return [
      {
        id: fallbackId(serviceType, sectionType, index),
        icon: defaultIcons[serviceType][sectionType][index] ?? "sparkles",
        displayOrder: index,
        visible: true,
        title: item[0] ?? "",
        description: item[1] ?? "",
      },
    ];
  });
  return {
    serviceType,
    sectionType,
    lang,
    title: sectionType === "services" ? copy.title : copy.partner,
    body: sectionType === "services" ? copy.body : "",
    items,
  };
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function boolValue(value: unknown, fallback = true) {
  return typeof value === "boolean" ? value : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function isServiceType(value: unknown): value is ServiceType {
  return serviceTypes.includes(value as ServiceType);
}

function isSectionType(value: unknown): value is SectionType {
  return sectionTypes.includes(value as SectionType);
}

function isLanguage(value: unknown): value is ContentLanguage {
  return ["fi", "sv", "es", "en"].includes(value as string);
}

function isIcon(value: unknown): value is ServiceIconKey {
  return serviceIconKeys.includes(value as ServiceIconKey);
}

export function parseAdminServiceSections(value: unknown): AdminServiceSnapshot {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const arrayOfRecords = (key: string) =>
    Array.isArray(source[key])
      ? source[key].filter((item): item is Record<string, unknown> =>
          Boolean(item && typeof item === "object"),
        )
      : [];
  const deletedItemIds = source["deletedItemIds"];
  return {
    sectionTexts: arrayOfRecords("sectionTexts"),
    items: arrayOfRecords("items"),
    itemTexts: arrayOfRecords("itemTexts"),
    deletedItemIds: Array.isArray(deletedItemIds)
      ? deletedItemIds.filter((id): id is string => typeof id === "string")
      : [],
  };
}

export function adminServiceSectionValues(
  snapshot: AdminServiceSnapshot | undefined,
  serviceType: ServiceType,
  sectionType: SectionType,
  lang: ContentLanguage,
): ServiceSectionValues {
  const fallback = sourceServiceSection(serviceType, sectionType, lang);
  const safe = snapshot ?? parseAdminServiceSections(undefined);
  const section = safe.sectionTexts.find(
    (row) =>
      row["service_type"] === serviceType &&
      row["section_type"] === sectionType &&
      row["lang"] === lang,
  );
  const managedItems = safe.items.filter(
    (row) => row["service_type"] === serviceType && row["section_type"] === sectionType,
  );
  const sourceById = new Map(fallback.items.map((item) => [item.id, item]));
  const items = managedItems.map((row) => {
    const text = safe.itemTexts.find(
      (item) => item["item_id"] === row["id"] && item["lang"] === lang,
    );
    const sourceItem = sourceById.get(stringValue(row["id"]));
    return {
      id: stringValue(row["id"]),
      icon: isIcon(row["draft_icon"]) ? row["draft_icon"] : "sparkles",
      displayOrder: numberValue(row["draft_display_order"]),
      visible: boolValue(row["draft_visible"]),
      title: text ? stringValue(text["draft_title"]) : (sourceItem?.title ?? ""),
      description: text ? stringValue(text["draft_description"]) : (sourceItem?.description ?? ""),
    };
  });
  const managedIds = new Set(managedItems.map((row) => stringValue(row["id"])));
  const deleted = new Set(safe.deletedItemIds);
  const sourceItems = fallback.items.filter(
    (item) => !managedIds.has(item.id) && !deleted.has(item.id),
  );
  return {
    ...fallback,
    title: section ? stringValue(section["draft_title"]) : fallback.title,
    body: section ? stringValue(section["draft_body"]) : fallback.body,
    items: [...items, ...sourceItems].sort((a, b) => a.displayOrder - b.displayOrder),
  };
}

export function publicServiceSectionValues(
  serviceType: ServiceType,
  sectionType: SectionType,
  lang: ContentLanguage,
  sections: Array<Record<string, unknown>>,
  items: Array<Record<string, unknown>>,
  texts: Array<Record<string, unknown>>,
): ServiceSectionValues {
  const fallback = sourceServiceSection(serviceType, sectionType, lang);
  const section = sections.find(
    (row) =>
      row["service_type"] === serviceType &&
      row["section_type"] === sectionType &&
      row["lang"] === lang,
  );
  const publicItems = items.filter(
    (row) => row["service_type"] === serviceType && row["section_type"] === sectionType,
  );
  const hasLanguageItems = publicItems.some((row) =>
    texts.some((item) => item["item_id"] === row["id"] && item["lang"] === lang),
  );
  if (!section && !hasLanguageItems) return fallback;
  return {
    ...fallback,
    title: section ? stringValue(section["title"]) : "",
    body: section ? stringValue(section["body"]) : "",
    items: publicItems
      .map((row) => {
        const text = texts.find((item) => item["item_id"] === row["id"] && item["lang"] === lang);
        const sourceItem = fallback.items.find((item) => item.id === row["id"]);
        return {
          id: stringValue(row["id"]),
          icon: isIcon(row["icon"]) ? row["icon"] : "sparkles",
          displayOrder: numberValue(row["display_order"]),
          visible: true,
          title: text ? stringValue(text["title"]) : (sourceItem?.title ?? ""),
          description: text ? stringValue(text["description"]) : (sourceItem?.description ?? ""),
        };
      })
      .filter((item) => item.title || item.description)
      .sort((a, b) => a.displayOrder - b.displayOrder),
  };
}

export function serviceSectionPayload(section: ServiceSectionValues) {
  return {
    p_service_type: section.serviceType,
    p_section_type: section.sectionType,
    p_lang: section.lang,
    p_title: section.title,
    p_body: section.body,
    p_items: section.items.map((item) => ({
      id: item.id,
      icon: item.icon,
      displayOrder: item.displayOrder,
      visible: item.visible,
      title: item.title,
      description: item.description,
    })),
  };
}

export function isContentLanguage(value: string): value is ContentLanguage {
  return isLanguage(value);
}
