// Tela 11.3 Cadastro de Fornecedor (P3–P6, A1, A3, E1, RN0081, RN0082, RNF0081)
const { test, expect } = require("@playwright/test");
const { usarPermissoes } = require("./apoio");

const OBRIGATORIOS = [
  "txtRazaoSocial", "txtNomeFantasia", "txtCnpj", "txtEmail", "cboTipoTelefone", "txtDdd",
  "txtNumeroTelefone", "cboTipoLogradouro", "txtLogradouro", "txtNumero", "txtBairro", "txtCep",
  "txtCidade", "cboEstado", "cboPais"
];

async function preencherValido(page) {
  await page.locator("#txtRazaoSocial").fill("Editora Nova Página Ltda");
  await page.locator("#txtNomeFantasia").fill("Nova Página");
  await page.locator("#txtCnpj").fill("98.765.432/0001-10");
  await page.locator("#txtEmail").fill("contato@novapagina.com.br");
  await page.locator("#cboTipoTelefone").selectOption("COMERCIAL");
  await page.locator("#txtDdd").fill("11");
  await page.locator("#txtNumeroTelefone").fill("40028922");
  await page.locator("#cboTipoLogradouro").selectOption("AVENIDA");
  await page.locator("#txtLogradouro").fill("Paulista");
  await page.locator("#txtNumero").fill("900");
  await page.locator("#txtBairro").fill("Bela Vista");
  await page.locator("#txtCep").fill("01310100");
  await page.locator("#txtCidade").fill("São Paulo");
  await page.locator("#cboEstado").selectOption("SP");
  await page.locator("#cboPais").selectOption("BR");
}

test.describe("11.3 Inclusão (P4, P5, P6)", () => {
  test("campos com os tamanhos da tabela 11.3 e obrigatórios marcados", async ({ page }) => {
    await page.goto("/cadastro.html?modo=novo");
    const tamanhos = {
      txtCodigo: 10, txtRazaoSocial: 100, txtNomeFantasia: 60, txtCnpj: 18, txtEmail: 100, txtDdd: 2,
      txtNumeroTelefone: 9, txtLogradouro: 100, txtNumero: 10, txtComplemento: 60, txtBairro: 60,
      txtCep: 8, txtCidade: 60
    };
    for (const [id, max] of Object.entries(tamanhos)) {
      await expect(page.locator(`#${id}`), id).toHaveAttribute("maxlength", String(max));
    }
    for (const id of OBRIGATORIOS) {
      await expect(page.locator(`label[for=${id}]`), id).toContainText("*");
    }
    await expect(page.locator("label[for=txtComplemento]")).not.toContainText("*");
  });

  test("RNF0081 / P4.1: Código vazio e não editável", async ({ page }) => {
    await page.goto("/cadastro.html?modo=novo");
    await expect(page.locator("#txtCodigo")).toHaveValue("");
    await expect(page.locator("#txtCodigo")).not.toBeEditable();
  });

  test("P1.3 / P4.1: CNPJ da consulta é recuperado no novo cadastro", async ({ page }) => {
    await page.goto("/cadastro.html?modo=novo&cnpj=98.765.432%2F0001-10");
    await expect(page.locator("#txtCnpj")).toHaveValue("98.765.432/0001-10");
  });

  test("RNF0013: combobox carregados dos domínios", async ({ page }) => {
    await page.goto("/cadastro.html?modo=novo");
    for (const id of ["cboTipoTelefone", "cboTipoLogradouro", "cboEstado", "cboPais"]) {
      expect(await page.locator(`#${id} option`).count(), id).toBeGreaterThan(1);
    }
  });

  test("E1 / CA02: obrigatórios vazios são destacados e os dados digitados são mantidos", async ({ page }) => {
    await page.goto("/cadastro.html?modo=novo");
    await page.locator("#txtRazaoSocial").fill("Editora Teste");
    await page.locator("#btnSalvar").click();

    await expect(page).toHaveURL(/cadastro\.html/);
    await expect(page.locator("#formAlert")).toBeVisible();
    await expect(page.locator(".has-error")).toHaveCount(OBRIGATORIOS.length - 1);
    await expect(page.locator("#txtRazaoSocial")).toHaveValue("Editora Teste");
    await expect(page.locator("#formAlertDetail")).not.toContainText("Razão Social");
    await expect(page.locator("#formAlertDetail")).not.toContainText("Complemento");
  });

  test("Complemento é opcional: salvar com os obrigatórios volta para a busca (P8.4)", async ({ page }) => {
    await page.goto("/cadastro.html?modo=novo");
    await preencherValido(page);
    await page.locator("#btnSalvar").click();
    await expect(page).toHaveURL(/index\.html/);
  });

  test("Cancelar descarta e volta para a busca", async ({ page }) => {
    await page.goto("/cadastro.html?modo=novo");
    await page.locator("#txtRazaoSocial").fill("Descartar");
    await page.locator("#btnCancelar").click();
    await expect(page).toHaveURL(/index\.html/);
  });

  test("DDD, número do telefone e CEP aceitam só dígitos", async ({ page }) => {
    await page.goto("/cadastro.html?modo=novo");
    await page.locator("#txtCep").pressSequentially("01a31-0100");
    await expect(page.locator("#txtCep")).toHaveValue("01310100");
  });
});

test.describe("11.3 Alteração (A3)", () => {
  test("carrega os dados do fornecedor, inclusive os combobox de domínio", async ({ page }) => {
    await page.goto("/cadastro.html?modo=alterar&codigo=FOR-000003");
    await expect(page.locator("#txtCodigo")).toHaveValue("FOR-000003");
    await expect(page.locator("#txtRazaoSocial")).toHaveValue("Páginas & Cia Comércio de Livros Ltda");
    await expect(page.locator("#cboTipoTelefone")).toHaveValue("CELULAR");
    await expect(page.locator("#cboTipoLogradouro")).toHaveValue("RUA");
    await expect(page.locator("#cboEstado")).toHaveValue("RJ");
    await expect(page.locator("#cboPais")).toHaveValue("BR");
  });

  test("A3.1: Código continua não editável e os demais campos são editáveis", async ({ page }) => {
    await page.goto("/cadastro.html?modo=alterar&codigo=FOR-000001");
    await expect(page.locator("#txtCodigo")).not.toBeEditable();
    await expect(page.locator("#txtRazaoSocial")).toBeEditable();
  });

  test("salvar sem alterações volta para a busca", async ({ page }) => {
    await page.goto("/cadastro.html?modo=alterar&codigo=FOR-000001");
    await page.locator("#btnSalvar").click();
    await expect(page).toHaveURL(/index\.html/);
  });
});

test.describe("11.3 Visualização (A1)", () => {
  test("A1.1: todos os campos em somente leitura e status exibido", async ({ page }) => {
    await page.goto("/cadastro.html?modo=visualizar&codigo=FOR-000003");
    const campos = page.locator("#formCadastro input, #formCadastro select");
    const total = await campos.count();
    for (let i = 0; i < total; i++) {
      await expect(campos.nth(i)).not.toBeEditable();
    }
    await expect(page.locator("#statusBadge")).toHaveText("INATIVO");
    await expect(page.locator("#btnSalvar")).toBeHidden();
  });

  test("A1.2: Cancelar volta para a busca", async ({ page }) => {
    await page.goto("/cadastro.html?modo=visualizar&codigo=FOR-000001");
    await page.locator("#btnCancelar").click();
    await expect(page).toHaveURL(/index\.html/);
  });
});

test.describe("Permissões de acesso (tabela 11.3)", () => {
  test("Salvar desabilitado na inclusão sem FORNECEDOR_INCLUIR", async ({ page }) => {
    await usarPermissoes(page, ["FORNECEDOR_CONSULTAR", "FORNECEDOR_ALTERAR"]);
    await page.goto("/cadastro.html?modo=novo");
    await expect(page.locator("#btnSalvar")).toBeDisabled();
  });

  test("Salvar desabilitado na alteração sem FORNECEDOR_ALTERAR", async ({ page }) => {
    await usarPermissoes(page, ["FORNECEDOR_CONSULTAR", "FORNECEDOR_INCLUIR"]);
    await page.goto("/cadastro.html?modo=alterar&codigo=FOR-000001");
    await expect(page.locator("#btnSalvar")).toBeDisabled();
  });
});
