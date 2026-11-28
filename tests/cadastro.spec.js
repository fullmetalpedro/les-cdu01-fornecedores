const {
  test, expect, abrirInclusao, abrirAlteracao, abrirVisualizacao, buscarPorCodigo, statusNaTabela, salvar,
  usarPermissoes, preencherFornecedorValido, esperarTamanhosMaximos,
} = require("./apoio");

const CAMPOS_OBRIGATORIOS = [
  "txtRazaoSocial", "txtNomeFantasia", "txtCnpj", "txtEmail", "cboTipoTelefone", "txtDdd",
  "txtNumeroTelefone", "cboTipoLogradouro", "txtLogradouro", "txtNumero", "txtBairro", "txtCep",
  "txtCidade", "cboEstado", "cboPais",
];

const COMBOBOX_DE_DOMINIO = ["cboTipoTelefone", "cboTipoLogradouro", "cboEstado", "cboPais"];

async function colar(campo, texto) {
  await campo.evaluate((elemento, textoColado) => {
    const dados = new DataTransfer();
    dados.setData("text", textoColado);
    elemento.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dados, bubbles: true, cancelable: true }));
  }, texto);
}

test.describe("11.3 Inclusão (P4, P5, P6)", () => {
  test("RN0081 / RN0082: campos com os tamanhos da tabela 11.3 e obrigatórios marcados", async ({ page }) => {
    await abrirInclusao(page);

    await esperarTamanhosMaximos(page, {
      txtCodigo: 10, txtRazaoSocial: 100, txtNomeFantasia: 60, txtCnpj: 18, txtEmail: 100, txtDdd: 2,
      txtNumeroTelefone: 9, txtLogradouro: 100, txtNumero: 10, txtComplemento: 60, txtBairro: 60,
      txtCep: 8, txtCidade: 60,
    });
    for (const id of CAMPOS_OBRIGATORIOS) {
      await expect(page.locator(`label[for=${id}]`), id).toContainText("*");
    }
    await expect(page.locator("label[for=txtComplemento]")).not.toContainText("*");
  });

  test("RNF0081 / P4.1: Código vazio e não editável", async ({ page }) => {
    await abrirInclusao(page);

    await expect(page.locator("#txtCodigo")).toHaveValue("");
    await expect(page.locator("#txtCodigo")).not.toBeEditable();
  });

  test("P1.3 / P4.1: CNPJ da consulta é recuperado no novo cadastro", async ({ page }) => {
    await page.goto("/cadastro.html?modo=novo&cnpj=98.765.432%2F0001-10");

    await expect(page.locator("#txtCnpj")).toHaveValue("98.765.432/0001-10");
  });

  test("RNF0013: combobox carregados dos domínios", async ({ page }) => {
    await abrirInclusao(page);

    for (const id of COMBOBOX_DE_DOMINIO) {
      expect(await page.locator(`#${id} option`).count(), id).toBeGreaterThan(1);
    }
  });

  test("E1 / CA02: obrigatórios vazios são destacados e os dados digitados são mantidos", async ({ page }) => {
    await abrirInclusao(page);
    await page.locator("#txtRazaoSocial").fill("Editora Teste");
    const obrigatoriosVazios = CAMPOS_OBRIGATORIOS.filter((id) => id !== "txtRazaoSocial");

    await salvar(page);

    await expect(page).toHaveURL(/cadastro\.html/);
    await expect(page.locator("#formAlert")).toBeVisible();
    await expect(page.locator(".has-error")).toHaveCount(obrigatoriosVazios.length);
    await expect(page.locator("#txtRazaoSocial")).toHaveValue("Editora Teste");
    await expect(page.locator("#formAlertDetail")).not.toContainText("Razão Social");
    await expect(page.locator("#formAlertDetail")).not.toContainText("Complemento");
  });

  test("P8: salvar sem complemento gera o código, volta para a busca e exibe a mensagem", async ({ page }) => {
    await abrirInclusao(page);
    await preencherFornecedorValido(page);

    await salvar(page);

    await expect(page).toHaveURL(/index\.html/);
    await expect(page.locator(".toast--sucesso")).toContainText("Fornecedor FOR-000007 cadastrado com sucesso.");
    await buscarPorCodigo(page, "FOR-000007");
    await expect(statusNaTabela(page, "FOR-000007")).toHaveText("ATIVO");
  });

  test("E2 / CA03: CNPJ de outro fornecedor, mesmo sem máscara, mostra o código existente e mantém os dados", async ({ page }) => {
    await abrirInclusao(page);
    await preencherFornecedorValido(page, "67890123000145");

    await salvar(page);

    await expect(page.locator("#formAlert")).toContainText("CNPJ já cadastrado para o fornecedor FOR-000006");
    await expect(page).toHaveURL(/cadastro\.html/);
    await expect(page.locator("#txtRazaoSocial")).toHaveValue("Editora Nova Página Ltda");
  });

  test("Cancelar descarta e volta para a busca", async ({ page }) => {
    await abrirInclusao(page);
    await page.locator("#txtRazaoSocial").fill("Descartar");

    await page.locator("#btnCancelar").click();

    await expect(page).toHaveURL(/index\.html/);
  });

  test("DDD, número do telefone e CEP aceitam só dígitos", async ({ page }) => {
    await abrirInclusao(page);

    await page.locator("#txtDdd").pressSequentially("1a1");
    await page.locator("#txtNumeroTelefone").pressSequentially("4002-8922");
    await page.locator("#txtCep").pressSequentially("01a31-0100");

    await expect(page.locator("#txtDdd")).toHaveValue("11");
    await expect(page.locator("#txtNumeroTelefone")).toHaveValue("40028922");
    await expect(page.locator("#txtCep")).toHaveValue("01310100");
  });

  test("colar um CEP com pontuação mantém os 8 dígitos", async ({ page }) => {
    await abrirInclusao(page);

    await colar(page.locator("#txtCep"), "13.083-970");

    await expect(page.locator("#txtCep")).toHaveValue("13083970");
  });

  test("RNF0013: os itens de domínio aparecem em ordem alfabética", async ({ page }) => {
    await abrirInclusao(page);

    const estados = await page.locator("#cboEstado option:not([value=''])").allTextContents();

    expect(estados).toEqual([...estados].sort((a, b) => a.localeCompare(b, "pt-BR")));
  });
});

test.describe("11.3 Alteração (A3)", () => {
  test("carrega os dados do fornecedor, inclusive os combobox de domínio", async ({ page }) => {
    await abrirAlteracao(page, "FOR-000003");

    await expect(page.locator("#txtCodigo")).toHaveValue("FOR-000003");
    await expect(page.locator("#txtRazaoSocial")).toHaveValue("Páginas & Cia Comércio de Livros Ltda");
    await expect(page.locator("#cboTipoTelefone")).toHaveValue("CELULAR");
    await expect(page.locator("#cboTipoLogradouro")).toHaveValue("RUA");
    await expect(page.locator("#cboEstado")).toHaveValue("RJ");
    await expect(page.locator("#cboPais")).toHaveValue("BR");
  });

  test("A3.1: Código continua não editável e os demais campos são editáveis", async ({ page }) => {
    await abrirAlteracao(page, "FOR-000001");

    await expect(page.locator("#txtCodigo")).not.toBeEditable();
    await expect(page.locator("#txtRazaoSocial")).toBeEditable();
  });

  test("salvar sem alterações volta para a busca", async ({ page }) => {
    await abrirAlteracao(page, "FOR-000001");

    await salvar(page);

    await expect(page).toHaveURL(/index\.html/);
  });

  test("A3 / P8.2: a alteração é gravada e o status atual é mantido", async ({ page }) => {
    await abrirAlteracao(page, "FOR-000003");
    await page.locator("#txtNomeFantasia").fill("Páginas & Companhia");

    await salvar(page);

    await expect(page.locator(".toast--sucesso")).toContainText("Fornecedor FOR-000003 alterado com sucesso.");
    await abrirVisualizacao(page, "FOR-000003");
    await expect(page.locator("#txtNomeFantasia")).toHaveValue("Páginas & Companhia");
    await expect(page.locator("#statusBadge")).toHaveText("INATIVO");
  });

  test("A3 / E2: não aceita o CNPJ de outro fornecedor", async ({ page }) => {
    await abrirAlteracao(page, "FOR-000001");
    await page.locator("#txtCnpj").fill("23.456.789/0001-01");

    await salvar(page);

    await expect(page.locator("#formAlert")).toContainText("FOR-000002");
    await expect(page).toHaveURL(/modo=alterar/);
  });
});

test.describe("11.3 Visualização (A1)", () => {
  test("A1.1: todos os campos em somente leitura e status exibido", async ({ page }) => {
    await abrirVisualizacao(page, "FOR-000003");

    for (const campo of await page.locator("#formCadastro input, #formCadastro select").all()) {
      await expect(campo).not.toBeEditable();
    }
    await expect(page.locator("#statusBadge")).toHaveText("INATIVO");
    await expect(page.locator("#btnSalvar")).toBeHidden();
  });

  test("A1.2: Cancelar volta para a busca", async ({ page }) => {
    await abrirVisualizacao(page, "FOR-000001");

    await page.locator("#btnCancelar").click();

    await expect(page).toHaveURL(/index\.html/);
  });
});

test.describe("Permissões de acesso (tabela 11.3)", () => {
  test("Salvar desabilitado na inclusão sem FORNECEDOR_INCLUIR", async ({ page }) => {
    await usarPermissoes(page, ["FORNECEDOR_CONSULTAR", "FORNECEDOR_ALTERAR"]);

    await abrirInclusao(page);

    await expect(page.locator("#btnSalvar")).toBeDisabled();
  });

  test("Salvar desabilitado na alteração sem FORNECEDOR_ALTERAR", async ({ page }) => {
    await usarPermissoes(page, ["FORNECEDOR_CONSULTAR", "FORNECEDOR_INCLUIR"]);

    await abrirAlteracao(page, "FOR-000001");

    await expect(page.locator("#btnSalvar")).toBeDisabled();
  });
});
