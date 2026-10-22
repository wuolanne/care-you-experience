import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { LANGS, t } from "@/i18n/translations";

const privacyRouteSource = readFileSync(
  new URL("../../routes/tietosuoja.tsx", import.meta.url),
  "utf8",
);
const footerSource = readFileSync(
  new URL("../../components/SiteFooter.tsx", import.meta.url),
  "utf8",
);
const requestFormsSource = readFileSync(
  new URL("../home-service/RequestForms.tsx", import.meta.url),
  "utf8",
);
const bookingSource = readFileSync(
  new URL("../booking/BookingCalendar.tsx", import.meta.url),
  "utf8",
);

describe("privacy translations", () => {
  it("contains a complete, linked privacy notice in every supported language", () => {
    for (const { code } of LANGS) {
      const privacy = t[code].privacy;

      expect(privacy.title).toBeTruthy();
      expect(privacy.intro).toBeTruthy();
      expect(privacy.contactNotice).toBeTruthy();
      expect(privacy.bookingNotice).toBeTruthy();
      expect(privacy.serviceStartNotice).toBeTruthy();
      expect(privacy.readMore).toBeTruthy();
      expect(privacy.sections).toHaveLength(14);
      expect(
        privacy.sections.every((section) => section.title && section.paragraphs.length > 0),
      ).toBe(true);
      expect(t[code].footer.contactRequest).toBeTruthy();
      expect(t[code].footer.privacy).toBeTruthy();
    }
  });

  it("keeps the privacy page free of redundant action buttons and nested main elements", () => {
    expect(privacyRouteSource).not.toContain("<main");
    expect(privacyRouteSource).not.toContain('href="mailto:');
    expect(privacyRouteSource).not.toContain('to="/tarjouspyynto"');
  });

  it("keeps footer contact and privacy links on separate, plain contact rows", () => {
    expect(footerSource).toContain('to="/tarjouspyynto" className="hover:text-primary"');
    expect(footerSource).toContain('to="/tietosuoja" className="hover:text-primary"');
    expect(footerSource).not.toContain("underline underline-offset-4 hover:text-primary");
  });

  it("uses purpose-specific notices for all personal-data forms", () => {
    expect(requestFormsSource).toContain("kind === 'start' ? 'serviceStart' : 'contact'");
    expect(bookingSource).toContain('<PrivacyNotice kind="booking" />');
  });
});
