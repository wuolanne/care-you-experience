import { expect, test } from "@playwright/test";

const protectedRoutes = [
  "/admin",
  "/admin/palvelut",
  "/admin/asiakasedut",
  "/admin/hinnoittelu",
  "/admin/henkilosto",
  "/admin/kuvat",
  "/admin/sisallot",
];

for (const route of protectedRoutes) {
  test(`anonymous access to ${route} is protected`, async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("navigation", { name: /hallintapaneelin navigaatio/i }),
    ).toHaveCount(0);
    await expect(page.getByRole("button", { name: /kirjaudu ulos/i })).toHaveCount(0);
  });
}
