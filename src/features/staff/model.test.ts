import { describe, expect, it } from "vitest";
import { parseAdminStaff, publicStaffValues } from "./model";

describe("Admin v2 staff model", () => {
  it("keeps drafts separate from published staff data", () => {
    const snapshot = parseAdminStaff({
      members: [
        {
          id: "member-1",
          draft_display_name: "Luonnosnimi",
          published_display_name: "Julkaistu nimi",
          draft_display_order: 2,
          published_display_order: 1,
          draft_visible: true,
          published_visible: false,
          draft_image_path: "staff/member-1/draft.png",
          published_image_path: null,
        },
      ],
      texts: [
        {
          staff_id: "member-1",
          lang: "fi",
          draft_job_title: "Luonnoksen tehtävä",
          published_job_title: "Julkaistu tehtävä",
          draft_bio: "Luonnoksen esittely",
          published_bio: "Julkaistu esittely",
          draft_alt_text: "Luonnoskuva",
          published_alt_text: "Julkaistu kuva",
        },
      ],
    });

    expect(snapshot.members[0]).toMatchObject({
      draftDisplayName: "Luonnosnimi",
      displayName: "Julkaistu nimi",
      draftVisible: true,
      visible: false,
    });
    expect(snapshot.texts[0]).toMatchObject({
      draftJobTitle: "Luonnoksen tehtävä",
      jobTitle: "Julkaistu tehtävä",
    });
  });

  it("does not invent missing language text or placeholder cards", () => {
    const members = [
      { id: "member-1", display_name: "Aino", display_order: 2, image_path: null },
      { id: "member-2", display_name: "", display_order: 1, image_path: null },
    ];
    const fi = publicStaffValues(
      members,
      [{ staff_id: "member-1", lang: "fi", job_title: "", bio: "", alt_text: "" }],
      "fi",
    );
    const sv = publicStaffValues(
      members,
      [{ staff_id: "member-1", lang: "sv", job_title: "Roll", bio: "", alt_text: "" }],
      "sv",
    );

    expect(fi).toEqual([
      {
        id: "member-1",
        displayName: "Aino",
        displayOrder: 2,
        imagePath: null,
        jobTitle: "",
        bio: "",
        altText: "",
      },
    ]);
    expect(sv[0]?.jobTitle).toBe("Roll");
    expect(sv[0]?.bio).toBe("");
  });
});
