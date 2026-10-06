const { expect } = require("@playwright/test");

const BOTOES = ["Novo", "Visualizar", "Alterar", "Inativar", "Ativar"];

/** Abre a busca sem parâmetros guardados de execuções anteriores. */
async function abrirBusca(page) {
  await page.goto("/index.html");
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
}

async function buscar(page) {
  await page.locator("#btnBuscar").click();
}

async function selecionar(page, codigo) {
  await page.locator(`#tblResultado tbody tr[data-codigo="${codigo}"]`).click();
}

/** Confere quais botões de ação estão habilitados; os demais devem estar desabilitados. */
async function esperarBotoesHabilitados(page, habilitados) {
  for (const nome of BOTOES) {
    const botao = page.locator(`#btn${nome}`);
    if (habilitados.includes(nome)) await expect(botao, nome).toBeEnabled();
    else await expect(botao, nome).toBeDisabled();
  }
}

/** Serve o mock com outra lista de permissões para o usuário autenticado. */
async function usarPermissoes(page, permissoes) {
  await page.route("**/js/mock-fornecedores.js", async (route) => {
    const resposta = await route.fetch();
    const corpo = (await resposta.text()).replace(
      /permissoes:\s*\[[^\]]*\]/,
      `permissoes: ${JSON.stringify(permissoes)}`
    );
    await route.fulfill({ response: resposta, body: corpo });
  });
}

module.exports = { abrirBusca, buscar, selecionar, esperarBotoesHabilitados, usarPermissoes };
