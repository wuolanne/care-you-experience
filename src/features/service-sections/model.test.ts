import { describe, expect, it } from "vitest";
import {
  adminServiceSectionValues,
  parseAdminServiceSections,
  publicServiceSectionValues,
  serviceSectionPayload,
  sourceServiceSection,
} from "./model";

describe("Admin v2 service sections", () => {
  it("uses source translations for a first edit and keeps stable fallback ids", () => {
    const fi = sourceServiceSection("home", "services", "fi");
    const again = sourceServiceSection("home", "services", "fi");
    expect(fi.items.length).toBeGreaterThan(0);
    expect(fi.items[0]?.title).toBe("Kotisiivous ja suursiivous");
    expect(fi.items[0]?.id).toBe(again.items[0]?.id);
  });

  it("prefers a draft and does not use another language as fallback", () => {
    const snapshot = parseAdminServiceSections({
      sectionTexts: [
        {
          service_type: "home",
          section_type: "services",
          lang: "fi",
          draft_title: "Luonnos",
          draft_body: "",
        },
      ],
      items: [
        {
          id: "item-1",
          service_type: "home",
          section_type: "services",
          draft_display_order: 0,
          draft_icon: "house",
          draft_visible: true,
        },
      ],
      itemTexts: [
        {
          item_id: "item-1",
          lang: "fi",
          draft_title: "Suomen kortti",
          draft_description: "Kuvaus",
        },
      ],
    });
    const fi = adminServiceSectionValues(snapshot, "home", "services", "fi");
    const sv = adminServiceSectionValues(snapshot, "home", "services", "sv");
    expect(fi.title).toBe("Luonnos");
    expect(fi.items[0]).toMatchObject({ id: "item-1", title: "Suomen kortti" });
    expect(sv.items.find((item) => item.id === "item-1")?.title).toBe("");
  });

  it("uses published content only when it exists and hides empty cards", () => {
    const result = publicServiceSectionValues(
      "business",
      "services",
      "fi",
      [
        {
          service_type: "business",
          section_type: "services",
          lang: "fi",
          title: "Yrityspalvelut",
          body: "",
        },
      ],
      [
        {
          id: "published-1",
          service_type: "business",
          section_type: "services",
          display_order: 1,
          icon: "building",
        },
      ],
      [{ item_id: "published-1", lang: "fi", title: "", description: "" }],
    );
    expect(result.title).toBe("Yrityspalvelut");
    expect(result.items).toHaveLength(0);
  });

  it("stages source fallback deletion in the payload without deleting it immediately", () => {
    const section = sourceServiceSection("home", "services", "fi");
    const first = section.items[0]!;
    const payload = serviceSectionPayload({
      ...section,
      items: [{ ...first, deleted: true }, ...section.items.slice(1)],
    });

    expect(payload.p_deleted_item_ids).toEqual([first.id]);
    expect(payload.p_items).not.toContainEqual(expect.objectContaining({ id: first.id }));
  });

  it("keeps deletions scoped to the selected service section", () => {
    const snapshot = parseAdminServiceSections({
      items: [
        {
          id: "home-item",
          service_type: "home",
          section_type: "services",
          draft_icon: "house",
          draft_visible: true,
        },
        {
          id: "business-item",
          service_type: "business",
          section_type: "services",
          draft_icon: "building",
          draft_visible: true,
        },
      ],
      deletedItemIds: ["home-item"],
    });
    const home = adminServiceSectionValues(snapshot, "home", "services", "fi");
    const business = adminServiceSectionValues(snapshot, "business", "services", "fi");

    expect(home.items.find((item) => item.id === "home-item")?.deleted).toBe(true);
    expect(business.items.find((item) => item.id === "business-item")?.deleted).toBe(false);
  });

  it("does not let a draft deletion change published public values", () => {
    const published = publicServiceSectionValues(
      "home",
      "services",
      "fi",
      [{ service_type: "home", section_type: "services", lang: "fi", title: "Palvelut", body: "" }],
      [
        {
          id: "published-1",
          service_type: "home",
          section_type: "services",
          display_order: 0,
          icon: "house",
        },
      ],
      [{ item_id: "published-1", lang: "fi", title: "Julkaistu kortti", description: "Kuvaus" }],
    );

    expect(published.items[0]?.title).toBe("Julkaistu kortti");
  });
});
