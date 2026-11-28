const MENSAGEM_GENERICA = "Não foi possível concluir a operação. Tente novamente.";
const MENSAGEM_SEM_CONEXAO = "Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.";

async function requisitar(url, { metodo = "GET", corpo } = {}) {
  const resposta = await fetch(url, {
    method: metodo,
    headers: corpo ? { "Content-Type": "application/json" } : {},
    body: corpo ? JSON.stringify(corpo) : undefined,
  }).catch(() => {
    throw new Error(MENSAGEM_SEM_CONEXAO);
  });
  const conteudo = await resposta.json().catch(() => null);
  if (!resposta.ok) throw new Error(conteudo?.mensagens?.join(" ") ?? MENSAGEM_GENERICA);
  return conteudo;
}

const urlDoFornecedor = (codigo) => `/api/fornecedores/${encodeURIComponent(codigo)}`;

export const api = {
  usuario: () => requisitar("/api/usuario"),
  dominios: () => requisitar("/api/dominios"),
  consultar: (filtro) => requisitar(`/api/fornecedores?${new URLSearchParams(filtro)}`),
  consultarPorCodigo: (codigo) => requisitar(urlDoFornecedor(codigo)),
  incluir: (fornecedor) => requisitar("/api/fornecedores", { metodo: "POST", corpo: fornecedor }),
  alterar: (codigo, fornecedor) => requisitar(urlDoFornecedor(codigo), { metodo: "PUT", corpo: fornecedor }),
  inativar: (codigo, motivo) => requisitar(`${urlDoFornecedor(codigo)}/inativacao`, { metodo: "POST", corpo: motivo }),
  ativar: (codigo, motivo) => requisitar(`${urlDoFornecedor(codigo)}/ativacao`, { metodo: "POST", corpo: motivo }),
};
