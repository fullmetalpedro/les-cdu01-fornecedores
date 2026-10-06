/*
 * RNF0013 – Domínios que o script de implantação vai cadastrar.
 * DONO: Pessoa B (docs/contrato-integracao.md, seção 3).
 * Versão PROVISÓRIA criada pela Pessoa A para a busca funcionar (combobox Estado).
 * A Pessoa B pode completar ou substituir à vontade, mantendo os nomes das chaves.
 */
const dominios = {
  tiposTelefone: ["Comercial", "Celular", "Residencial"],
  tiposLogradouro: ["Rua", "Avenida", "Travessa", "Alameda", "Praça", "Rodovia"],
  estados: [
    { sigla: "AC", nome: "Acre" }, { sigla: "AL", nome: "Alagoas" }, { sigla: "AP", nome: "Amapá" },
    { sigla: "AM", nome: "Amazonas" }, { sigla: "BA", nome: "Bahia" }, { sigla: "CE", nome: "Ceará" },
    { sigla: "DF", nome: "Distrito Federal" }, { sigla: "ES", nome: "Espírito Santo" }, { sigla: "GO", nome: "Goiás" },
    { sigla: "MA", nome: "Maranhão" }, { sigla: "MT", nome: "Mato Grosso" }, { sigla: "MS", nome: "Mato Grosso do Sul" },
    { sigla: "MG", nome: "Minas Gerais" }, { sigla: "PA", nome: "Pará" }, { sigla: "PB", nome: "Paraíba" },
    { sigla: "PR", nome: "Paraná" }, { sigla: "PE", nome: "Pernambuco" }, { sigla: "PI", nome: "Piauí" },
    { sigla: "RJ", nome: "Rio de Janeiro" }, { sigla: "RN", nome: "Rio Grande do Norte" }, { sigla: "RS", nome: "Rio Grande do Sul" },
    { sigla: "RO", nome: "Rondônia" }, { sigla: "RR", nome: "Roraima" }, { sigla: "SC", nome: "Santa Catarina" },
    { sigla: "SP", nome: "São Paulo" }, { sigla: "SE", nome: "Sergipe" }, { sigla: "TO", nome: "Tocantins" }
  ],
  paises: ["Brasil"],
  // Valores de exemplo: os documentos não definem as categorias (docs/ambiguidades.md, nº 4)
  categoriasInativacao: ["Encerramento de contrato", "Irregularidade fiscal", "Outros"],
  categoriasAtivacao: ["Retomada de fornecimento", "Regularização cadastral", "Outros"]
};
