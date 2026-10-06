// Telas 11.1 Busca e 11.2 Resultado da Busca (P1.1–P1.3, P2, P3, E3, RF0085)
const { test, expect } = require("@playwright/test");
const { abrirBusca, buscar, selecionar, esperarBotoesHabilitados, usarPermissoes } = require("./apoio");

test.describe("11.1 Busca", () => {
  test.beforeEach(async ({ page }) => abrirBusca(page));

  test("exibe os campos da tabela 11.1 com os tamanhos da especificação", async ({ page }) => {
    const tamanhos = { txtCodigo: 10, txtRazaoSocial: 100, txtNomeFantasia: 60, txtCnpj: 18, txtCidade: 60 };
    for (const [id, max] of Object.entries(tamanhos)) {
      await expect(page.locator(`#${id}`)).toHaveAttribute("maxlength", String(max));
    }
    await expect(page.locator("#cboEstado option")).toHaveCount(28); // "Selecione" + 27 UFs
    await expect(page.locator("#cboStatus")).toHaveValue("TODOS");
    await expect(page.locator("#cboStatus option")).toHaveText(["Ativo", "Inativo", "Todos"]);
    await expect(page.locator("label[for=cboStatus] .obrigatorio")).toBeVisible();
  });

  test("P3: mostra o usuário autenticado na topbar", async ({ page }) => {
    await expect(page.locator("#lblNomeUsuario")).toHaveText("Ana Souza");
    await expect(page.locator("#lblPerfilUsuario")).toHaveText("Administrador");
  });

  test("antes da consulta todas as ações ficam desabilitadas e não há resultado", async ({ page }) => {
    await esperarBotoesHabilitados(page, []);
    await expect(page.locator("#tblResultado")).toBeHidden();
    await expect(page.locator("#msgNenhumEncontrado")).toBeHidden();
  });

  test("RF0085: busca sem filtros lista todos os fornecedores", async ({ page }) => {
    await buscar(page);
    await expect(page.locator("#tblResultado tbody tr")).toHaveCount(6);
    await expect(page.locator("#tblResultado thead th")).toHaveText([
      "Selecionar", "Código", "Razão Social", "Nome Fantasia", "CNPJ", "Cidade", "Estado", "Status"
    ]);
  });

  test("RF0085: filtros combinados", async ({ page }) => {
    await page.locator("#txtRazaoSocial").fill("editora");
    await page.locator("#cboStatus").selectOption("INATIVO");
    await buscar(page);
    await expect(page.locator("#tblResultado tbody tr")).toHaveCount(1);
    await expect(page.locator("#tblResultado tbody tr")).toHaveAttribute("data-codigo", "FOR-000006");
  });

  test("RF0085: filtro isolado por estado e por cidade sem acento", async ({ page }) => {
    await page.locator("#cboEstado").selectOption("SP");
    await buscar(page);
    await expect(page.locator("#tblResultado tbody tr")).toHaveCount(2);

    await page.locator("#cboEstado").selectOption("");
    await page.locator("#txtCidade").fill("sao paulo");
    await buscar(page);
    await expect(page.locator("#tblResultado tbody tr")).toHaveCount(1);
  });

  test("aplica a máscara de CNPJ", async ({ page }) => {
    await page.locator("#txtCnpj").pressSequentially("12345678000190");
    await expect(page.locator("#txtCnpj")).toHaveValue("12.345.678/0001-90");
  });

  test("E3: nenhum fornecedor encontrado aparece na tela de pesquisa e mantém Novo", async ({ page }) => {
    await page.locator("#txtCnpj").fill("98.765.432/0001-10");
    await buscar(page);
    await expect(page.locator("#msgNenhumEncontrado")).toBeVisible();
    await expect(page.locator("#tblResultado")).toBeHidden();
    await esperarBotoesHabilitados(page, ["Novo"]);
  });

  test("permite restaurar os parâmetros ao voltar para a busca", async ({ page }) => {
    await page.locator("#txtRazaoSocial").fill("Horizonte");
    await buscar(page);
    await page.reload();
    await expect(page.locator("#txtRazaoSocial")).toHaveValue("Horizonte");
    await esperarBotoesHabilitados(page, []);
  });
});

test.describe("11.2 Resultado – regras de habilitação (P1.3, P2)", () => {
  test.beforeEach(async ({ page }) => {
    await abrirBusca(page);
    await buscar(page);
  });

  test("após a consulta só Novo é habilitado", async ({ page }) => {
    await esperarBotoesHabilitados(page, ["Novo"]);
  });

  test("fornecedor ATIVO selecionado habilita Visualizar, Alterar e Inativar", async ({ page }) => {
    await selecionar(page, "FOR-000001");
    await esperarBotoesHabilitados(page, ["Novo", "Visualizar", "Alterar", "Inativar"]);
  });

  test("fornecedor INATIVO selecionado habilita Ativar e não Inativar", async ({ page }) => {
    await selecionar(page, "FOR-000003");
    await esperarBotoesHabilitados(page, ["Novo", "Visualizar", "Alterar", "Ativar"]);
  });

  test("seleção única: selecionar outra linha desmarca a anterior", async ({ page }) => {
    await selecionar(page, "FOR-000001");
    await selecionar(page, "FOR-000002");
    await expect(page.locator("#tblResultado tbody tr.selecionado")).toHaveCount(1);
    await expect(page.locator("input[name=fornecedorSelecionado]:checked")).toHaveValue("FOR-000002");
  });

  test("CA05: alterar um parâmetro desabilita Novo até nova busca", async ({ page }) => {
    await page.locator("#txtCodigo").fill("FOR");
    await expect(page.locator("#btnNovo")).toBeDisabled();
    await buscar(page);
    await expect(page.locator("#btnNovo")).toBeEnabled();
  });
});

test.describe("Permissões de acesso (tabelas 11.1 e 11.2)", () => {
  test("sem FORNECEDOR_INCLUIR e FORNECEDOR_INATIVAR os botões ficam desabilitados", async ({ page }) => {
    await usarPermissoes(page, ["FORNECEDOR_CONSULTAR", "FORNECEDOR_ALTERAR", "FORNECEDOR_ATIVAR"]);
    await abrirBusca(page);
    await buscar(page);
    await selecionar(page, "FOR-000001");
    await esperarBotoesHabilitados(page, ["Visualizar", "Alterar"]);
  });

  test("sem FORNECEDOR_CONSULTAR não é possível buscar", async ({ page }) => {
    await usarPermissoes(page, ["FORNECEDOR_INCLUIR"]);
    await abrirBusca(page);
    await expect(page.locator("#btnBuscar")).toBeDisabled();
  });
});
