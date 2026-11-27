const fs = require("fs");
const path = require("path");
const { test, expect, CNPJ_NAO_CADASTRADO, abrirBusca, buscar, selecionar } = require("./apoio");

const PASTA_DAS_TELAS = path.join(__dirname, "..", "src");
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;
const PAGINAS = ["/index.html", "/cadastro.html?modo=novo", "/cadastro.html?modo=alterar&codigo=FOR-000001"];

function coletarErrosDaPagina(page) {
  const erros = [];
  page.on("pageerror", (erro) => erros.push(erro.message));
  page.on("console", (mensagem) => {
    if (mensagem.type() === "error") erros.push(mensagem.text());
  });
  return erros;
}

function linhasComEmoji(pasta) {
  const arquivos = fs.readdirSync(pasta, { recursive: true }).filter((arquivo) => /\.(html|js|css)$/.test(arquivo));
  const ocorrencias = [];
  for (const arquivo of arquivos) {
    const linhas = fs.readFileSync(path.join(pasta, arquivo), "utf8").split("\n");
    linhas.forEach((linha, indice) => {
      if (EMOJI.test(linha)) ocorrencias.push(`${arquivo}:${indice + 1}`);
    });
  }
  return ocorrencias;
}

test.describe("Navegação da busca para o cadastro (contrato de integração, seção 5)", () => {
  test.beforeEach(async ({ page }) => abrirBusca(page));

  test("Novo leva o CNPJ usado como parâmetro (P1.3)", async ({ page }) => {
    await page.locator("#txtCnpj").fill(CNPJ_NAO_CADASTRADO);
    await buscar(page);

    await page.locator("#btnNovo").click();

    await expect(page).toHaveURL(/cadastro\.html\?modo=novo&cnpj=98\.765\.432%2F0001-10/);
    await expect(page.locator("#txtCnpj")).toHaveValue(CNPJ_NAO_CADASTRADO);
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

test.describe("Qualidade (regras gerais do projeto)", () => {
  for (const url of PAGINAS) {
    test(`sem erros no console em ${url}`, async ({ page }) => {
      const erros = coletarErrosDaPagina(page);

      await page.goto(url);
      await page.waitForLoadState("networkidle");

      expect(erros).toEqual([]);
    });
  }

  test("ícones são Lucide renderizados como SVG", async ({ page }) => {
    await abrirBusca(page);

    await expect(page.locator("i[data-lucide]")).toHaveCount(0);
    expect(await page.locator("svg.lucide").count()).toBeGreaterThan(0);
  });

  test("nenhum emoji no código-fonte (padrão: ícones Lucide)", () => {
    expect(linhasComEmoji(PASTA_DAS_TELAS)).toEqual([]);
  });
});
