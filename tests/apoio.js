const { test: testDoPlaywright, expect } = require("@playwright/test");
const { restaurarDadosDeTeste } = require("./banco");

const BOTOES_DE_ACAO = ["Novo", "Visualizar", "Alterar", "Inativar", "Ativar"];
const CNPJ_NAO_CADASTRADO = "98.765.432/0001-10";
const JUSTIFICATIVA_DE_TESTE = "Justificativa registrada no histórico.";

const test = testDoPlaywright.extend({
  dadosDeTesteRestaurados: [async ({}, usar) => {
    await restaurarDadosDeTeste();
    await usar();
  }, { auto: true }],
});

async function abrirBusca(page) {
  await page.goto("/index.html");
}

async function abrirInclusao(page) {
  await page.goto("/cadastro.html?modo=novo");
}

async function abrirAlteracao(page, codigo) {
  await page.goto(`/cadastro.html?modo=alterar&codigo=${codigo}`);
}

async function abrirVisualizacao(page, codigo) {
  await page.goto(`/cadastro.html?modo=visualizar&codigo=${codigo}`);
}

async function buscar(page) {
  await page.locator("#btnBuscar").click();
}

async function listarTodosOsFornecedores(page) {
  await abrirBusca(page);
  await buscar(page);
}

async function buscarPorCodigo(page, codigo) {
  await page.locator("#txtCodigo").fill(codigo);
  await buscar(page);
}

const linhasDoResultado = (page) => page.locator("#tblResultado tbody tr");

const linhaDoFornecedor = (page, codigo) => page.locator(`#tblResultado tbody tr[data-codigo="${codigo}"]`);

const statusNaTabela = (page, codigo) => linhaDoFornecedor(page, codigo).locator(".badge");

async function selecionar(page, codigo) {
  await linhaDoFornecedor(page, codigo).click();
}

async function esperarBotoesHabilitados(page, habilitados) {
  for (const nome of BOTOES_DE_ACAO) {
    const botao = page.locator(`#btn${nome}`);
    if (habilitados.includes(nome)) await expect(botao, nome).toBeEnabled();
    else await expect(botao, nome).toBeDisabled();
  }
}

async function esperarTamanhosMaximos(page, tamanhoPorCampo) {
  for (const [id, tamanho] of Object.entries(tamanhoPorCampo)) {
    await expect(page.locator(`#${id}`), id).toHaveAttribute("maxlength", String(tamanho));
  }
}

async function usarPermissoes(page, permissoes) {
  await page.route("**/api/usuario", async (rota) => {
    const resposta = await rota.fetch();
    const usuario = await resposta.json();
    await rota.fulfill({ response: resposta, json: { ...usuario, permissoes } });
  });
}

async function salvar(page) {
  await page.locator("#btnSalvar").click();
}

async function preencherFornecedorValido(page, cnpj = CNPJ_NAO_CADASTRADO) {
  await page.locator("#txtRazaoSocial").fill("Editora Nova Página Ltda");
  await page.locator("#txtNomeFantasia").fill("Nova Página");
  await page.locator("#txtCnpj").fill(cnpj);
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

async function abrirModalDeStatus(page, codigo, operacao) {
  await selecionar(page, codigo);
  await page.locator(`#btn${operacao}`).click();
  await expect(page.locator(".modal-overlay")).toBeVisible();
}

async function informarMotivoEConfirmar(page) {
  await page.locator("#cboCategoria").selectOption({ index: 1 });
  await page.locator("#txtJustificativa").fill(JUSTIFICATIVA_DE_TESTE);
  await page.locator("#btnConfirmarStatus").click();
}

async function mudarStatus(page, codigo, operacao) {
  await abrirModalDeStatus(page, codigo, operacao);
  await informarMotivoEConfirmar(page);
  await expect(page.locator(".modal-overlay")).toHaveCount(0);
}

module.exports = {
  test,
  expect,
  CNPJ_NAO_CADASTRADO,
  JUSTIFICATIVA_DE_TESTE,
  abrirBusca,
  abrirInclusao,
  abrirAlteracao,
  abrirVisualizacao,
  buscar,
  listarTodosOsFornecedores,
  buscarPorCodigo,
  linhasDoResultado,
  statusNaTabela,
  selecionar,
  esperarBotoesHabilitados,
  esperarTamanhosMaximos,
  usarPermissoes,
  salvar,
  preencherFornecedorValido,
  abrirModalDeStatus,
  informarMotivoEConfirmar,
  mudarStatus,
};
