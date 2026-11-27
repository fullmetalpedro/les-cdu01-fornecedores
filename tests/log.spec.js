const {
  test, expect, JUSTIFICATIVA_DE_TESTE, abrirInclusao, abrirAlteracao, buscarPorCodigo, salvar,
  preencherFornecedorValido, mudarStatus,
} = require("./apoio");
const { consultarBanco } = require("./banco");

const CODIGO_DO_NOVO_FORNECEDOR = "FOR-000007";

async function cadastrarFornecedorValido(page) {
  await abrirInclusao(page);
  await preencherFornecedorValido(page);
  await salvar(page);
  await expect(page.locator("#msgSucesso")).toBeVisible();
}

async function alterarNomeFantasia(page, codigo, nomeFantasia) {
  await abrirAlteracao(page, codigo);
  await page.locator("#txtNomeFantasia").fill(nomeFantasia);
  await salvar(page);
  await expect(page.locator("#msgSucesso")).toBeVisible();
}

function lerLogDoFornecedor(codigo) {
  return consultarBanco(`
    SELECT operacao, usuario, data_hora, dados_anteriores, dados_novos
      FROM log_transacao WHERE fornecedor_codigo = $1 ORDER BY id`, [codigo]);
}

test("CA08: inclusão, alteração, inativação e ativação registram data, hora, usuário e dados", async ({ page }) => {
  await cadastrarFornecedorValido(page);
  await alterarNomeFantasia(page, CODIGO_DO_NOVO_FORNECEDOR, "Nova Página Editora");
  await buscarPorCodigo(page, CODIGO_DO_NOVO_FORNECEDOR);
  await mudarStatus(page, CODIGO_DO_NOVO_FORNECEDOR, "Inativar");
  await mudarStatus(page, CODIGO_DO_NOVO_FORNECEDOR, "Ativar");

  const log = await lerLogDoFornecedor(CODIGO_DO_NOVO_FORNECEDOR);
  const [inclusao, alteracao, inativacao] = log;
  const [motivoDaInativacao] = await consultarBanco("SELECT categoria, justificativa, usuario FROM fornecedor_inativacao");
  const [motivoDaAtivacao] = await consultarBanco("SELECT categoria FROM fornecedor_ativacao");

  expect(log.map((linha) => linha.operacao)).toEqual(["INCLUSAO", "ALTERACAO", "INATIVACAO", "ATIVACAO"]);
  for (const linha of log) {
    expect(linha.usuario).toBe("Ana Souza");
    expect(linha.data_hora).toBeInstanceOf(Date);
  }
  expect(inclusao.dados_anteriores).toBeNull();
  expect(alteracao.dados_anteriores.nomeFantasia).toBe("Nova Página");
  expect(alteracao.dados_novos.nomeFantasia).toBe("Nova Página Editora");
  expect([inativacao.dados_anteriores.status, inativacao.dados_novos.status]).toEqual(["ATIVO", "INATIVO"]);
  expect(motivoDaInativacao).toMatchObject({ justificativa: JUSTIFICATIVA_DE_TESTE, usuario: "Ana Souza" });
  expect(motivoDaAtivacao.categoria).toBeTruthy();
});
