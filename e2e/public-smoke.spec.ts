import { expect, test } from "@playwright/test";

const publicRoutes = ["/", "/care-kotiin", "/care-yrityksille", "/care-palveluseteli", "/meista"];

for (const route of publicRoutes) {
  test(`public route ${route} renders on desktop and mobile`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });

    expect(response, `No response received for ${route}`).toBeTruthy();
    expect(response?.status(), `Server error on ${route}`).toBeLessThan(500);
    await expect(page.locator("body")).toBeVisible();
  });
}

const billingTranslations = {
  fi: { heading: "Laskutustiedot", businessId: "Y-tunnus" },
  sv: { heading: "Faktureringsuppgifter", businessId: "Y-tunnus" },
  es: { heading: "Datos de facturación", businessId: "NIF" },
  en: { heading: "Billing details", businessId: "Business ID" },
} as const;

test("about page shows ordered billing details in every language", async ({ page }) => {
  for (const [lang, copy] of Object.entries(billingTranslations)) {
    await page.goto("/meista", { waitUntil: "domcontentloaded" });
    await page.evaluate((language) => window.localStorage.setItem("cys-lang", language), lang);
    await page.reload({ waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: copy.heading, level: 3 })).toBeVisible();
    const billingDetails = page.getByTestId("billing-details");
    await expect(billingDetails.locator("p")).toHaveText([
      "T&G Nordic Services",
      "Alisa-pankki FI20 7140 1420 0611 43",
      `${copy.businessId}: 3664346-2`,
    ]);
    expect(
      await billingDetails.evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBe(true);
  }
});
