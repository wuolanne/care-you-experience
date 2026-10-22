import { expect, test } from "@playwright/test";

const adminStorageState = process.env["E2E_ADMIN_STORAGE_STATE"];
const adminRoutes = [
  "/admin",
  "/admin/palvelut",
  "/admin/asiakasedut",
  "/admin/hinnoittelu",
  "/admin/henkilosto",
  "/admin/kuvat",
  "/admin/sisallot",
];

test.describe("authenticated Admin v2 read-only smoke", () => {
  test.skip(
    !adminStorageState,
    "Set E2E_ADMIN_STORAGE_STATE from an isolated test Supabase project to run authenticated checks.",
  );

  for (const route of adminRoutes) {
    test(`${route} opens without redirecting to auth`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page).not.toHaveURL(/\/auth(?:\?|$)/);
      await expect(page.locator("body")).toBeVisible();
    });
  }

  test("admin navigation is present on the content editor", async ({ page }) => {
    await page.goto("/admin/sisallot", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: /yhteenveto/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /palvelut/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /uutiset/i })).toBeVisible();
  });
});
