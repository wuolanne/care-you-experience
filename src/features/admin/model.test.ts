import { describe, expect, it } from "vitest";
import {
  formatEmailStatus,
  formatFinnishDate,
  formatFinnishDateTime,
  formatServiceType,
} from "./model";

describe("admin display helpers", () => {
  it("formats dates in Finnish time", () => {
    expect(formatFinnishDateTime("2026-01-15T14:30:00.000Z")).toContain("15.1.2026");
    expect(formatFinnishDate("2026-01-15")).toContain("15.1.2026");
  });

  it("labels service and email states without claiming delivery", () => {
    expect(formatServiceType("monthly")).toBe("Kuukausiasiakkuus");
    expect(formatServiceType("once")).toBe("Kertakäynti");
    expect(formatEmailStatus("accepted")).toBe("Resend hyväksyi");
    expect(formatEmailStatus("delivered")).toBe("Tuntematon");
  });
});
