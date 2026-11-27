const { defineConfig, devices } = require("@playwright/test");
const { conexaoParaDotnet } = require("./tests/banco");

const ENDERECO_DO_SERVIDOR = "http://localhost:4173";

module.exports = defineConfig({
  testDir: "tests",
  globalSetup: "./tests/preparar-banco.js",
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: ENDERECO_DO_SERVIDOR,
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: process.env.PW_CHANNEL || undefined },
    },
  ],
  webServer: {
    command: `dotnet run --project backend/Fornecedores.Web --urls ${ENDERECO_DO_SERVIDOR}`,
    url: `${ENDERECO_DO_SERVIDOR}/index.html`,
    env: { ConnectionStrings__Fornecedores: conexaoParaDotnet() },
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
