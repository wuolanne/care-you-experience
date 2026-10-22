import { describe, expect, it } from "vitest";
import { shouldShowAdminDashboardLink } from "./admin-link";

describe("footer admin link visibility", () => {
  it("stays hidden while the role query is pending", () => {
    expect(shouldShowAdminDashboardLink(undefined, true)).toBe(false);
  });

  it("stays hidden for anonymous and non-admin users", () => {
    expect(shouldShowAdminDashboardLink(false, false)).toBe(false);
    expect(shouldShowAdminDashboardLink(undefined, false)).toBe(false);
  });

  it("is visible only after the admin role is confirmed", () => {
    expect(shouldShowAdminDashboardLink(true, false)).toBe(true);
  });
});
