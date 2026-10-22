import { describe, expect, it } from "vitest";
import { asContentValues, isSafeExternalUrl, makeWhatsAppUrl } from "./model";

describe("Admin v2 content safety helpers", () => {
  it("keeps only string content values for safe text rendering", () => {
    expect(asContentValues({ title: "Otsikko", body: 123, cta: "Lue lisää" })).toEqual({});
    expect(asContentValues({ title: "Otsikko", body: "Teksti" })).toEqual({
      title: "Otsikko",
      body: "Teksti",
    });
  });

  it("accepts only http(s) social URLs", () => {
    expect(isSafeExternalUrl("https://www.linkedin.com/company/tgn")).toBe(true);
    expect(isSafeExternalUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeExternalUrl("//example.com")).toBe(false);
  });

  it("normalizes a WhatsApp phone number", () => {
    expect(makeWhatsAppUrl("+358 45 783 9301")).toBe("https://wa.me/358457839301");
    expect(makeWhatsAppUrl("12")).toBeNull();
  });
});
