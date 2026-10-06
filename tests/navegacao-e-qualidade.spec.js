// Navegação entre as telas (contrato, seção 5) e regras gerais do projeto
const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const { abrirBusca, buscar, selecionar } = require("./apoio");

test.describe("Navegação da busca para o cadastro", () => {
  test.beforeEach(async ({ page }) => abrirBusca(page));

  test("Novo leva o CNPJ usado como parâmetro (P1.3)", async ({ page }) => {
    await page.locator("#txtCnpj").fill("98.765.432/0001-10");
    await buscar(page);
    await page.locator("#btnNovo").click();
    await expect(page).toHaveURL(/cadastro\.html\?modo=novo&cnpj=98\.765\.432%2F0001-10/);
    await expect(page.locator("#txtCnpj")).toHaveValue("98.765.432/0001-10");
  });

  test("Visualizar abre o fornecedor selecionado (A2 → A1)", async ({ page }) => {
    await buscar(page);
    await selecionar(page, "FOR-000002");
    await page.locator("#btnVisualizar").click();
    await expect(page).toHaveURL(/modo=visualizar&codigo=FOR-000002/);
    await expect(page.locator("#txtRazaoSocial")).toHaveValue("Distribuidora Letra Viva S.A.");
  });

  test("Alterar abre o fornecedor selecionado (A2 → A3) e Cancelar volta à busca", async ({ page }) => {
    await buscar(page);
    await selecionar(page, "FOR-000004");
    await page.locator("#btnAlterar").click();
    await expect(page).toHaveURL(/modo=alterar&codigo=FOR-000004/);
    await page.locator("#btnCancelar").click();
    await expect(page).toHaveURL(/index\.html/);
  });
});

test.describe("Qualidade", () => {
  for (const url of ["/index.html", "/cadastro.html?modo=novo", "/cadastro.html?modo=alterar&codigo=FOR-000001"]) {
    test(`sem erros no console em ${url}`, async ({ page }) => {
      const erros = [];
      page.on("pageerror", (e) => erros.push(e.message));
      page.on("console", (m) => m.type() === "error" && erros.push(m.text()));
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      expect(erros).toEqual([]);
    });
  }

  test("ícones são Lucide renderizados como SVG", async ({ page }) => {
    await page.goto("/index.html");
    await expect(page.locator("i[data-lucide]")).toHaveCount(0);
    expect(await page.locator("svg.lucide").count()).toBeGreaterThan(0);
  });

  test("nenhum emoji no código-fonte (padrão: ícones Lucide)", () => {
    const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;
    const pasta = process.env.SRC_DIR || path.join(__dirname, "..", "src");
    const arquivos = fs.readdirSync(pasta, { recursive: true })
      .filter((f) => /\.(html|js|css)$/.test(f));
    const ocorrencias = [];
    for (const arquivo of arquivos) {
      fs.readFileSync(path.join(pasta, arquivo), "utf8").split("\n").forEach((linha, i) => {
        if (emoji.test(linha)) ocorrencias.push(`${arquivo}:${i + 1}`);
      });
    }
    expect(ocorrencias).toEqual([]);
  });
});
