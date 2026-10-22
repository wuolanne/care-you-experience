import type { ContentLanguage } from "@/features/content/model";

export const staffLanguages = ["fi", "sv", "es", "en"] as const;
export type StaffLanguage = (typeof staffLanguages)[number];

export type StaffMember = {
  id: string;
  displayName: string;
  displayOrder: number;
  visible: boolean;
  draftImagePath: string | null;
  publishedImagePath: string | null;
};

export type StaffText = {
  staffId: string;
  lang: ContentLanguage;
  jobTitle: string;
  bio: string;
  altText: string;
};

export type StaffAdminMember = StaffMember & {
  draftDisplayName: string;
  draftDisplayOrder: number;
  draftVisible: boolean;
};

export type StaffAdminText = StaffText & {
  draftJobTitle: string;
  draftBio: string;
  draftAltText: string;
};

export type StaffAdminSnapshot = {
  members: StaffAdminMember[];
  texts: StaffAdminText[];
};

export type PublicStaffMember = {
  id: string;
  displayName: string;
  displayOrder: number;
  imagePath: string | null;
  jobTitle: string;
  bio: string;
  altText: string;
};

function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function nullableString(value: unknown): string | null {
  const result = stringValue(value).trim();
  return result || null;
}

function numberValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function languageValue(value: unknown): ContentLanguage | null {
  return typeof value === "string" && staffLanguages.includes(value as ContentLanguage)
    ? (value as ContentLanguage)
    : null;
}

export function parseAdminStaff(value: unknown): StaffAdminSnapshot {
  const data = record(value);
  const members = Array.isArray(data["members"]) ? data["members"] : [];
  const texts = Array.isArray(data["texts"]) ? data["texts"] : [];

  return {
    members: members.flatMap((item) => {
      const row = record(item);
      const displayOrder = numberValue(row["draft_display_order"]);
      const publishedOrder = numberValue(row["published_display_order"]);
      if (typeof row["id"] !== "string" || displayOrder === null || publishedOrder === null)
        return [];
      return [
        {
          id: row["id"],
          displayName: stringValue(row["published_display_name"]),
          displayOrder: publishedOrder,
          visible: row["published_visible"] === true,
          draftDisplayName: stringValue(row["draft_display_name"]),
          draftDisplayOrder: displayOrder,
          draftVisible: row["draft_visible"] === true,
          draftImagePath: nullableString(row["draft_image_path"]),
          publishedImagePath: nullableString(row["published_image_path"]),
        },
      ];
    }),
    texts: texts.flatMap((item) => {
      const row = record(item);
      const lang = languageValue(row["lang"]);
      if (typeof row["staff_id"] !== "string" || !lang) return [];
      return [
        {
          staffId: row["staff_id"],
          lang,
          jobTitle: stringValue(row["published_job_title"]),
          bio: stringValue(row["published_bio"]),
          altText: stringValue(row["published_alt_text"]),
          draftJobTitle: stringValue(row["draft_job_title"]),
          draftBio: stringValue(row["draft_bio"]),
          draftAltText: stringValue(row["draft_alt_text"]),
        },
      ];
    }),
  };
}

export function publicStaffValues(
  members: unknown,
  texts: unknown,
  lang: ContentLanguage,
): PublicStaffMember[] {
  const memberRows = Array.isArray(members) ? members : [];
  const textRows = Array.isArray(texts) ? texts : [];

  return memberRows
    .flatMap((item) => {
      const row = record(item);
      if (typeof row["id"] !== "string") return [];
      const text = textRows
        .map(record)
        .find((candidate) => candidate["staff_id"] === row["id"] && candidate["lang"] === lang);
      const member = {
        id: row["id"],
        displayName: stringValue(row["display_name"]),
        displayOrder: numberValue(row["display_order"]) ?? 0,
        imagePath: nullableString(row["image_path"]),
        jobTitle: stringValue(text?.["job_title"]),
        bio: stringValue(text?.["bio"]),
        altText: stringValue(text?.["alt_text"]),
      };
      if (!member.displayName && !member.imagePath && !member.jobTitle && !member.bio) return [];
      return [member];
    })
    .sort((left, right) => left.displayOrder - right.displayOrder);
}
