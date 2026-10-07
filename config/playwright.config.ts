import { defineConfig, devices } from "@playwright/test";

const resendMockImport = JSON.stringify(
  new URL("./playwright-resend-mock.mjs", import.meta.url).href,
);
const nodeOptions = [process.env.NODE_OPTIONS, `--import=${resendMockImport}`]
  .filter(Boolean)
  .join(" ");

export default defineConfig({
  testDir: "../tests/e2e",
  outputDir: "../node_modules/.cache/playwright/test-results",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4318",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  workers: 1,
  webServer: {
    command: "npm.cmd run dev -- --hostname 127.0.0.1 --port 4318",
    url: "http://127.0.0.1:4318",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEUSTAND_RESEND_MOCK: "1",
      RESEND_API_KEY: "test-only-invalid",
      RESEND_FROM_EMAIL: "NEUSTAND Website <verified-sender@example.com>",
      RESEND_TO_EMAIL: "neustand.service@gmail.com",
      NODE_OPTIONS: nodeOptions,
    },
  },
});
