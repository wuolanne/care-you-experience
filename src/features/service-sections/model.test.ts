import { describe, expect, it } from "vitest";
import {
  adminServiceSectionValues,
  parseAdminServiceSections,
  publicServiceSectionValues,
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
});
