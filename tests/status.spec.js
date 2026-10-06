// Tela 11.4 Inativação e Ativação (A4, A5, E4, RN0084, RN0085)
const { test, expect } = require("@playwright/test");
const { abrirBusca, buscar, selecionar, usarPermissoes } = require("./apoio");

async function abrirModal(page, codigo, operacao) {
  await abrirBusca(page);
  await buscar(page);
  await selecionar(page, codigo);
  await page.locator(operacao === "inativar" ? "#btnInativar" : "#btnAtivar").click();
  await expect(page.locator(".modal-overlay")).toBeVisible();
}

test.describe("11.4 Inativar (A4)", () => {
  test.beforeEach(async ({ page }) => abrirModal(page, "FOR-000001", "inativar"));

  test("abre sobre a busca com estilo, título e categorias de inativação", async ({ page }) => {
    await expect(page.locator(".modal-overlay")).toHaveCSS("position", "fixed");
    await expect(page.locator(".modal-title")).toHaveText("Inativar Fornecedor");
    await expect(page.locator(".modal-subtitle")).toContainText("FOR-000001");
    await expect(page.locator("#cboCategoria option", { hasText: "Encerramento de contrato" })).toHaveCount(1);
    await expect(page.locator("#txtJustificativa")).toHaveAttribute("maxlength", "255");
  });

  test("E4 / CA06: confirmar sem categoria e justificativa mostra o campo não informado", async ({ page }) => {
    await page.locator("#btnConfirmarStatus").click();
    await expect(page.locator("#modalStatusAlert")).toBeVisible();
    await expect(page.locator("#modalStatusAlertText")).toContainText("categoria");
    await expect(page.locator(".modal-overlay")).toBeVisible();
  });

  test("E4: só a justificativa faltando", async ({ page }) => {
    await page.locator("#cboCategoria").selectOption({ index: 1 });
    await page.locator("#btnConfirmarStatus").click();
    await expect(page.locator("#modalStatusAlertText")).toContainText("justificativa");
  });

  test("confirmar com categoria e justificativa fecha o modal e volta à busca (A4.5)", async ({ page }) => {
    await page.locator("#cboCategoria").selectOption({ index: 1 });
    await page.locator("#txtJustificativa").fill("Contrato encerrado em 30/09/2026.");
    await page.locator("#btnConfirmarStatus").click();
    await expect(page.locator(".modal-overlay")).toHaveCount(0);
    await expect(page.locator("#tblResultado")).toBeVisible();
  });

  test("Cancelar fecha o modal", async ({ page }) => {
    await page.locator("#btnCancelarStatus").click();
    await expect(page.locator(".modal-overlay")).toHaveCount(0);
  });
});

test.describe("Atualização do status (A4.4 / A5.4)", () => {
  async function confirmar(page) {
    await page.locator("#cboCategoria").selectOption({ index: 1 });
    await page.locator("#txtJustificativa").fill("Justificativa de teste.");
    await page.locator("#btnConfirmarStatus").click();
  }
  const badge = (page, codigo) => page.locator(`#tblResultado tr[data-codigo="${codigo}"] .badge`);

  test("inativar muda o status na tabela e passa a habilitar Ativar", async ({ page }) => {
    await abrirModal(page, "FOR-000001", "inativar");
    await confirmar(page);
    await expect(badge(page, "FOR-000001")).toHaveText("INATIVO");
    await selecionar(page, "FOR-000001");
    await expect(page.locator("#btnAtivar")).toBeEnabled();
    await expect(page.locator("#btnInativar")).toBeDisabled();
  });

  test("ativar muda o status na tabela", async ({ page }) => {
    await abrirModal(page, "FOR-000003", "ativar");
    await confirmar(page);
    await expect(badge(page, "FOR-000003")).toHaveText("ATIVO");
  });

  test("o novo status vale na visualização e após recarregar a busca", async ({ page }) => {
    await abrirModal(page, "FOR-000002", "inativar");
    await confirmar(page);
    await page.goto("/cadastro.html?modo=visualizar&codigo=FOR-000002");
    await expect(page.locator("#statusBadge")).toHaveText("INATIVO");
    await page.goto("/index.html");
    await buscar(page);
    await expect(badge(page, "FOR-000002")).toHaveText("INATIVO");
  });

  test("filtro por status considera o status atualizado", async ({ page }) => {
    await abrirModal(page, "FOR-000001", "inativar");
    await confirmar(page);
    await page.locator("#cboStatus").selectOption("INATIVO");
    await buscar(page);
    await expect(badge(page, "FOR-000001")).toHaveText("INATIVO");
    await expect(page.locator("#tblResultado tbody tr")).toHaveCount(3);
  });

  test("Cancelar não altera o status", async ({ page }) => {
    await abrirModal(page, "FOR-000001", "inativar");
    await page.locator("#btnCancelarStatus").click();
    await buscar(page);
    await expect(badge(page, "FOR-000001")).toHaveText("ATIVO");
  });
});

test.describe("11.4 Ativar (A5)", () => {
  test("usa o título e as categorias de ativação", async ({ page }) => {
    await abrirModal(page, "FOR-000003", "ativar");
    await expect(page.locator(".modal-title")).toHaveText("Ativar Fornecedor");
    await expect(page.locator("#cboCategoria option", { hasText: "Renovação de contrato" })).toHaveCount(1);
    await expect(page.locator("#cboCategoria option", { hasText: "Encerramento de contrato" })).toHaveCount(0);
  });
});

test.describe("Permissões de acesso (tabela 11.4)", () => {
  // O botão Ativar da busca já fica desabilitado sem a permissão, então o modal é aberto direto.
  for (const [operacao, permissao] of [["ativar", "FORNECEDOR_ATIVAR"], ["inativar", "FORNECEDOR_INATIVAR"]]) {
    test(`Confirmar desabilitado sem ${permissao}`, async ({ page }) => {
      await usarPermissoes(page, ["FORNECEDOR_CONSULTAR"]);
      await abrirBusca(page);
      await page.evaluate((op) => abrirModalStatus(fornecedores[0], op), operacao);
      await expect(page.locator("#btnConfirmarStatus")).toBeDisabled();
    });
  }
});
