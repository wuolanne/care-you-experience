import { describe, expect, it } from "vitest";
import { getSafeAdminReturnTo } from "./return-to";

describe("getSafeAdminReturnTo", () => {
  it("keeps known internal admin paths", () => {
    expect(getSafeAdminReturnTo("/admin/yhteydenotot")).toBe("/admin/yhteydenotot");
    expect(getSafeAdminReturnTo("/admin/uutiset?draft=1")).toBe("/admin/uutiset");
  });

  it("maps the legacy news path to the admin news page", () => {
    expect(getSafeAdminReturnTo("/uutisten-yllapito")).toBe("/admin/uutiset");
  });

  it("rejects external, protocol-relative, and unknown paths", () => {
    expect(getSafeAdminReturnTo("https://example.com/admin")).toBe("/admin");
    expect(getSafeAdminReturnTo("//example.com/admin")).toBe("/admin");
    expect(getSafeAdminReturnTo("/settings")).toBe("/admin");
    expect(getSafeAdminReturnTo(undefined)).toBe("/admin");
  });
});
