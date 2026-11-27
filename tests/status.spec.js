const {
  test, expect, abrirBusca, abrirVisualizacao, buscar, listarTodosOsFornecedores, linhasDoResultado, statusNaTabela,
  selecionar, abrirModalDeStatus, informarMotivoEConfirmar, mudarStatus,
} = require("./apoio");

test.describe("11.4 Inativar (A4, RN0084)", () => {
  test.beforeEach(async ({ page }) => {
    await listarTodosOsFornecedores(page);
    await abrirModalDeStatus(page, "FOR-000001", "Inativar");
  });

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
    await informarMotivoEConfirmar(page);

    await expect(page.locator(".modal-overlay")).toHaveCount(0);
    await expect(page.locator("#tblResultado")).toBeVisible();
    await expect(page.locator("#msgSucesso")).toContainText("FOR-000001 inativado com sucesso");
  });

  test("Cancelar fecha o modal", async ({ page }) => {
    await page.locator("#btnCancelarStatus").click();

    await expect(page.locator(".modal-overlay")).toHaveCount(0);
  });
});

test.describe("Atualização do status (A4.4 / A5.4)", () => {
  test.beforeEach(async ({ page }) => listarTodosOsFornecedores(page));

  test("inativar muda o status na tabela e passa a habilitar Ativar", async ({ page }) => {
    await mudarStatus(page, "FOR-000001", "Inativar");

    await expect(statusNaTabela(page, "FOR-000001")).toHaveText("INATIVO");
    await selecionar(page, "FOR-000001");
    await expect(page.locator("#btnAtivar")).toBeEnabled();
    await expect(page.locator("#btnInativar")).toBeDisabled();
  });

  test("ativar muda o status na tabela", async ({ page }) => {
    await mudarStatus(page, "FOR-000003", "Ativar");

    await expect(statusNaTabela(page, "FOR-000003")).toHaveText("ATIVO");
  });

  test("o novo status vale na visualização e após recarregar a busca", async ({ page }) => {
    await mudarStatus(page, "FOR-000002", "Inativar");

    await abrirVisualizacao(page, "FOR-000002");
    await expect(page.locator("#statusBadge")).toHaveText("INATIVO");
    await abrirBusca(page);
    await buscar(page);
    await expect(statusNaTabela(page, "FOR-000002")).toHaveText("INATIVO");
  });

  test("filtro por status considera o status atualizado", async ({ page }) => {
    await mudarStatus(page, "FOR-000001", "Inativar");

    await page.locator("#cboStatus").selectOption("INATIVO");
    await buscar(page);

    await expect(statusNaTabela(page, "FOR-000001")).toHaveText("INATIVO");
    await expect(linhasDoResultado(page)).toHaveCount(3);
  });

  test("a mensagem de sucesso some quando o usuário faz uma nova busca", async ({ page }) => {
    await mudarStatus(page, "FOR-000001", "Inativar");
    await expect(page.locator("#msgSucesso")).toBeVisible();

    await buscar(page);

    await expect(page.locator("#msgSucesso")).toBeHidden();
  });

  test("Cancelar não altera o status", async ({ page }) => {
    await abrirModalDeStatus(page, "FOR-000001", "Inativar");

    await page.locator("#btnCancelarStatus").click();
    await buscar(page);

    await expect(statusNaTabela(page, "FOR-000001")).toHaveText("ATIVO");
  });
});

test.describe("11.4 Ativar (A5, RN0085)", () => {
  test("usa o título e as categorias de ativação", async ({ page }) => {
    await listarTodosOsFornecedores(page);

    await abrirModalDeStatus(page, "FOR-000003", "Ativar");

    await expect(page.locator(".modal-title")).toHaveText("Ativar Fornecedor");
    await expect(page.locator("#cboCategoria option", { hasText: "Renovação de contrato" })).toHaveCount(1);
    await expect(page.locator("#cboCategoria option", { hasText: "Encerramento de contrato" })).toHaveCount(0);
  });
});
