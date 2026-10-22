import { describe, expect, it } from "vitest";
import { LANGS, t } from "@/i18n/translations";

describe("privacy translations", () => {
  it("contains a complete, linked privacy notice in every supported language", () => {
    for (const { code } of LANGS) {
      const privacy = t[code].privacy;

      expect(privacy.title).toBeTruthy();
      expect(privacy.intro).toBeTruthy();
      expect(privacy.formNotice).toBeTruthy();
      expect(privacy.readMore).toBeTruthy();
      expect(privacy.sections).toHaveLength(14);
      expect(
        privacy.sections.every((section) => section.title && section.paragraphs.length > 0),
      ).toBe(true);
      expect(t[code].footer.contactRequest).toBeTruthy();
      expect(t[code].footer.privacy).toBeTruthy();
    }
  });
});
