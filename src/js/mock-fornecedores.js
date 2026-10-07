/*
 * Dados fictícios desta etapa (Pessoa A). Na entrega final serão substituídos
 * pela consulta ao banco de dados. Formato: docs/contrato-integracao.md, seção 2.
 */

// P3: usuário autenticado exibido em todas as telas do cadastro.
// Pré-condição 7.1: perfil de administrador com permissão para as operações.
const usuarioLogado = {
  nome: "Ana Souza",
  perfil: "Administrador",
  permissoes: [
    "FORNECEDOR_CONSULTAR",
    "FORNECEDOR_INCLUIR",
    "FORNECEDOR_ALTERAR",
    "FORNECEDOR_INATIVAR",
    "FORNECEDOR_ATIVAR"
  ]
};

const fornecedores = [
  {
    codigo: "FOR-000001", razaoSocial: "Editora Horizonte Ltda", nomeFantasia: "Horizonte Livros",
    cnpj: "12.345.678/0001-90", email: "contato@horizontelivros.com.br", status: "ATIVO",
    telefone: { tipo: "COMERCIAL", ddd: "11", numero: "32145678" },
    endereco: { tipoLogradouro: "RUA", logradouro: "das Palmeiras", numero: "1200", complemento: "Sala 4",
      bairro: "Centro", cep: "01010000", cidade: "São Paulo", estado: "SP", pais: "BR" }
  },
  {
    codigo: "FOR-000002", razaoSocial: "Distribuidora Letra Viva S.A.", nomeFantasia: "Letra Viva",
    cnpj: "23.456.789/0001-01", email: "comercial@letraviva.com.br", status: "ATIVO",
    telefone: { tipo: "COMERCIAL", ddd: "19", numero: "37654321" },
    endereco: { tipoLogradouro: "AVENIDA", logradouro: "Norte-Sul", numero: "455", complemento: "",
      bairro: "Cambuí", cep: "13025000", cidade: "Campinas", estado: "SP", pais: "BR" }
  },
  {
    codigo: "FOR-000003", razaoSocial: "Páginas & Cia Comércio de Livros Ltda", nomeFantasia: "Páginas & Cia",
    cnpj: "34.567.890/0001-12", email: "vendas@paginasecia.com.br", status: "INATIVO",
    telefone: { tipo: "CELULAR", ddd: "21", numero: "998877665" },
    endereco: { tipoLogradouro: "RUA", logradouro: "da Assembleia", numero: "10", complemento: "Loja B",
      bairro: "Centro", cep: "20011000", cidade: "Rio de Janeiro", estado: "RJ", pais: "BR" }
  },
  {
    codigo: "FOR-000004", razaoSocial: "Editora Quatro Ventos Ltda", nomeFantasia: "Quatro Ventos",
    cnpj: "45.678.901/0001-23", email: "editorial@quatroventos.com.br", status: "ATIVO",
    telefone: { tipo: "COMERCIAL", ddd: "31", numero: "32221100" },
    endereco: { tipoLogradouro: "AVENIDA", logradouro: "Afonso Pena", numero: "3000", complemento: "",
      bairro: "Funcionários", cep: "30130009", cidade: "Belo Horizonte", estado: "MG", pais: "BR" }
  },
  {
    codigo: "FOR-000005", razaoSocial: "Atlântico Distribuidora de Livros Ltda", nomeFantasia: "Atlântico",
    cnpj: "56.789.012/0001-34", email: "pedidos@atlanticolivros.com.br", status: "ATIVO",
    telefone: { tipo: "COMERCIAL", ddd: "41", numero: "33445566" },
    endereco: { tipoLogradouro: "RUA", logradouro: "XV de Novembro", numero: "800", complemento: "",
      bairro: "Centro", cep: "80020310", cidade: "Curitiba", estado: "PR", pais: "BR" }
  },
  {
    codigo: "FOR-000006", razaoSocial: "Editora Sertão Ltda", nomeFantasia: "Sertão Editorial",
    cnpj: "67.890.123/0001-45", email: "contato@sertaoeditorial.com.br", status: "INATIVO",
    telefone: { tipo: "COMERCIAL", ddd: "81", numero: "34567890" },
    endereco: { tipoLogradouro: "AVENIDA", logradouro: "Boa Viagem", numero: "1500", complemento: "Apto 101",
      bairro: "Boa Viagem", cep: "51011000", cidade: "Recife", estado: "PE", pais: "BR" }
  }
];

/*
 * A4.4 / A5.4: enquanto não há back-end (P8), a mudança de status fica guardada na sessão
 * do navegador para valer também ao navegar entre a busca e o cadastro.
 */
const CHAVE_STATUS = "fornecedores.statusAlterados";

function lerStatusAlterados() {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE_STATUS)) || {};
  } catch (e) {
    return {};
  }
}

function atualizarStatusFornecedor(codigo, status) {
  const fornecedor = fornecedores.find((f) => f.codigo === codigo);
  if (fornecedor) fornecedor.status = status;
  const alterados = { ...lerStatusAlterados(), [codigo]: status };
  try { sessionStorage.setItem(CHAVE_STATUS, JSON.stringify(alterados)); } catch (e) { /* sessão indisponível */ }
}

for (const [codigo, status] of Object.entries(lerStatusAlterados())) {
  const fornecedor = fornecedores.find((f) => f.codigo === codigo);
  if (fornecedor) fornecedor.status = status;
}
