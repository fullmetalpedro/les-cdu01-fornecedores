// @ts-check
const { defineConfig, devices } = require("@playwright/test");

const PORTA = 4173;

module.exports = defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORTA}`,
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      // PW_CHANNEL=msedge ou chrome usa o navegador instalado no lugar do Chromium do Playwright
      use: { ...devices["Desktop Chrome"], channel: process.env.PW_CHANNEL || undefined }
    }
  ],
  webServer: {
    command: "node tests/servidor.js",
    url: `http://localhost:${PORTA}/index.html`,
    reuseExistingServer: !process.env.CI
  }
});
