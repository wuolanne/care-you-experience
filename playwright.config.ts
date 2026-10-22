import { defineConfig, devices } from "@playwright/test";

const adminStorageState = process.env["E2E_ADMIN_STORAGE_STATE"];
const externalBaseUrl = process.env["E2E_BASE_URL"];

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env["CI"]),
  retries: process.env["CI"] ? 2 : 0,
  ...(process.env["CI"] ? { workers: 1 } : {}),
  reporter: process.env["CI"]
    ? [["dot"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: externalBaseUrl ?? "http://127.0.0.1:8080",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "desktop",
      testIgnore: "**/admin-readonly.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      testIgnore: "**/admin-readonly.spec.ts",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "admin-desktop",
      testMatch: "**/admin-readonly.spec.ts",
      use: { ...devices["Desktop Chrome"], storageState: adminStorageState },
    },
    {
      name: "admin-mobile",
      testMatch: "**/admin-readonly.spec.ts",
      use: { ...devices["Pixel 5"], storageState: adminStorageState },
    },
  ],
  ...(externalBaseUrl
    ? {}
    : {
        webServer: {
          command: "node e2e/test-server.mjs",
          url: "http://127.0.0.1:8080",
          reuseExistingServer: !process.env["CI"],
          timeout: 120_000,
        },
      }),
  metadata: {
    adminStorageStateConfigured: adminStorageState ? "true" : "false",
  },
});
