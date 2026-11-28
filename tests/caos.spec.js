const {
  test, expect, CNPJ_NAO_CADASTRADO, abrirBusca, buscar, linhasDoResultado, esperarBotoesHabilitados,
} = require("./apoio");
const { consultarBanco } = require("./banco");

const XSS = `<img src=x onerror="document.title='XSS'">`;

function fornecedorValido(trocas = {}) {
  return {
    razaoSocial: "Caos Ltda",
    nomeFantasia: "Caos",
    cnpj: CNPJ_NAO_CADASTRADO,
    email: "caos@caos.com",
    ...trocas,
    telefone: { tipo: "COMERCIAL", ddd: "11", numero: "912345678", ...trocas.telefone },
    endereco: {
      tipoLogradouro: "RUA", logradouro: "A", numero: "1", complemento: null, bairro: "B",
      cep: "01001000", cidade: "C", estado: "SP", pais: "BR", ...trocas.endereco,
    },
  };
}

async function incluirPelaApi(request, trocas) {
  const resposta = await request.post("/api/fornecedores", { data: fornecedorValido(trocas) });
  return { status: resposta.status(), corpo: await resposta.json() };
}

test.describe("API rejeita dados inválidos com 422 em vez de falhar", () => {
  const casos = [
    ["texto acima do tamanho da coluna", { razaoSocial: "x".repeat(101) }, "Razão Social deve ter no máximo 100 caracteres."],
    ["código de domínio inexistente", { endereco: { estado: "XX" } }, "Estado inválido."],
    ["CNPJ fora do formato", { cnpj: "abcdefgh" }, "CNPJ deve ter 14 caracteres, no formato 00.000.000/0000-00."],
    ["e-mail fora do formato", { email: "sem-arroba" }, "E-mail deve estar no formato nome@dominio.com."],
    ["caractere nulo", { nomeFantasia: "a\u0000b" }, "Os dados contêm caracteres inválidos."],
  ];

  for (const [nome, trocas, mensagem] of casos) {
    test(nome, async ({ request }) => {
      const { status, corpo } = await incluirPelaApi(request, trocas);

      expect(status).toBe(422);
      expect(corpo.mensagens).toContain(mensagem);
    });
  }

  test("JSON malformado responde no formato de erro da API", async ({ request }) => {
    const resposta = await request.post("/api/fornecedores", {
      headers: { "Content-Type": "application/json" }, data: "{quebrado",
    });

    expect(resposta.status()).toBe(400);
    expect((await resposta.json()).mensagens).toEqual(["Os dados enviados estão em formato inválido."]);
  });

  test("categoria de outra operação não é aceita", async ({ request }) => {
    const resposta = await request.post("/api/fornecedores/FOR-000002/inativacao", {
      data: { categoria: "RENOVACAO_CONTRATO", justificativa: "teste" },
    });

    expect(resposta.status()).toBe(422);
    expect((await resposta.json()).mensagens).toEqual(["Categoria de inativação inválida."]);
  });
});

test("inativações simultâneas do mesmo fornecedor gravam uma única vez", async ({ request }) => {
  const inativar = () => request.post("/api/fornecedores/FOR-000002/inativacao", {
    data: { categoria: "OUTRO", justificativa: "corrida" },
  });

  const respostas = await Promise.all(Array.from({ length: 6 }, inativar));
  const [historico] = await consultarBanco(
    "SELECT count(*)::int AS total FROM fornecedor_inativacao WHERE fornecedor_codigo = 'FOR-000002'");

  expect(respostas.filter((resposta) => resposta.ok())).toHaveLength(1);
  expect(historico.total).toBe(1);
});

test("razão social com HTML é exibida como texto na busca e no modal", async ({ page, request }) => {
  await incluirPelaApi(request, { razaoSocial: XSS });
  await abrirBusca(page);
  await buscar(page);

  await page.getByRole("row", { name: XSS }).click();
  await page.locator("#btnInativar").click();

  await expect(page.locator(".modal-subtitle")).toContainText(XSS);
  await expect(page.locator("main img, .modal-card img")).toHaveCount(0);
  await expect(page).not.toHaveTitle("XSS");
});

test("parâmetros de busca corrompidos no navegador não travam a tela", async ({ page }) => {
  await abrirBusca(page);
  await page.evaluate(() => sessionStorage.setItem("fornecedores.parametrosBusca", "{quebrado"));
  await page.reload();

  await expect(page.locator("#btnBuscar")).toBeEnabled();
  await buscar(page);
  await expect(linhasDoResultado(page)).toHaveCount(6);
});

test("modo desconhecido na URL abre a inclusão", async ({ page }) => {
  await page.goto("/cadastro.html?modo=constructor");

  await expect(page.locator("#pageTitle")).toHaveText("Novo Fornecedor");
  await expect(page.locator("#btnSalvar")).toBeEnabled();
});

test("alteração sem código avisa e não deixa salvar", async ({ page }) => {
  await page.goto("/cadastro.html?modo=alterar");

  await expect(page.locator("#formAlert")).toContainText("Nenhum fornecedor foi informado.");
  await expect(page.locator("#btnSalvar")).toBeDisabled();
});

test("servidor fora do ar mostra uma mensagem em português", async ({ page }) => {
  await abrirBusca(page);
  await expect(page.locator("#btnBuscar")).toBeEnabled();
  await page.route("**/api/fornecedores*", (rota) => rota.abort("connectionrefused"));

  await buscar(page);

  await expect(page.locator(".toast--erro")).toContainText("Não foi possível conectar ao servidor.");
});

test("servidor fora do ar ao abrir a tela avisa o usuário", async ({ page }) => {
  await page.route("**/api/dominios", (rota) => rota.abort("connectionrefused"));

  await abrirBusca(page);

  await expect(page.locator(".toast--erro")).toContainText("Não foi possível conectar ao servidor.");
});

test("resposta atrasada de uma busca antiga não sobrescreve a mais recente", async ({ page }) => {
  await abrirBusca(page);
  await page.route("**/api/fornecedores?*razaoSocial=Editora*", async (rota) => {
    await new Promise((resolver) => setTimeout(resolver, 1500));
    await rota.continue();
  });

  await page.locator("#txtRazaoSocial").fill("Editora");
  await buscar(page);
  await page.locator("#txtRazaoSocial").fill("Atlantico");
  await buscar(page);
  await page.waitForTimeout(2000);

  await expect(linhasDoResultado(page)).toHaveCount(1);
  await expect(linhasDoResultado(page).first()).toContainText("Atlântico");
  await esperarBotoesHabilitados(page, ["Novo"]);
});
