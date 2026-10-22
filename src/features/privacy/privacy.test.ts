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
      expect(privacy.sections).toHaveLength(6);
      expect(
        privacy.sections.every((section) => section.title && section.paragraphs.length > 0),
      ).toBe(true);
      expect(t[code].footer.privacy).toBeTruthy();
    }
  });

  it("uses the confirmed basis and retention wording in every language", () => {
    const expectedBasisFragments = [
      "6 artiklan 1 kohdan b",
      "artikel 6.1 b",
      "artículo 6, apartado 1, letra b",
      "Article 6(1)(b) GDPR",
    ];
    const expectedRetentionFragments = [
      "Säilytämme henkilötietoja vain niin kauan",
      "Vi sparar personuppgifter endast så länge",
      "Conservamos los datos personales solo durante el tiempo necesario",
      "We retain personal data only for as long as it is needed",
    ];

    for (const [index, { code }] of LANGS.entries()) {
      const privacy = t[code].privacy;
      const basis = privacy.sections[2]!.paragraphs.join(" ");
      const retention = privacy.sections[4]!.paragraphs.join(" ");

      expect(basis).toContain(expectedBasisFragments[index]!);
      expect(retention).toContain(expectedRetentionFragments[index]!);
      expect(retention).toContain("info@tgnservices.fi");
    }
  });

  it("keeps the privacy page free of redundant action buttons and nested main elements", () => {
    expect(privacyRouteSource).not.toContain("<main");
    expect(privacyRouteSource).toContain("href={`mailto:${email}`}");
    expect(privacyRouteSource).not.toContain('to="/tarjouspyynto"');
  });

  it("keeps the privacy link as the only footer privacy action", () => {
    expect(footerSource).not.toContain('to="/tarjouspyynto"');
    expect(footerSource).toContain('to="/tietosuoja" className="hover:text-primary"');
    expect(footerSource).not.toContain("underline underline-offset-4 hover:text-primary");
  });

  it("uses purpose-specific notices for all personal-data forms", () => {
    expect(requestFormsSource).toContain("kind === 'start' ? 'serviceStart' : 'contact'");
    expect(bookingSource).toContain('<PrivacyNotice kind="booking" />');
  });
});
