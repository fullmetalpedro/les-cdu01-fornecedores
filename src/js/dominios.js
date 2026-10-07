// RNF0013 - Cadastro de domínios: simula as tabelas de domínio que o script de
// implantação vai criar (tipos de telefone, tipos de logradouro, estados, países
// e categorias de inativação/ativação de fornecedores).
//
// Os documentos não definem os nomes das categorias de inativação e de ativação;
// os valores abaixo são de exemplo.
const dominios = {
  tiposTelefone: [
    { codigo: "COMERCIAL", nome: "Comercial" },
    { codigo: "CELULAR", nome: "Celular" },
    { codigo: "RESIDENCIAL", nome: "Residencial" },
    { codigo: "WHATSAPP", nome: "WhatsApp" },
  ],

  tiposLogradouro: [
    { codigo: "RUA", nome: "Rua" },
    { codigo: "AVENIDA", nome: "Avenida" },
    { codigo: "ALAMEDA", nome: "Alameda" },
    { codigo: "TRAVESSA", nome: "Travessa" },
    { codigo: "RODOVIA", nome: "Rodovia" },
  ],

  estados: [
    { sigla: "AC", nome: "Acre" },
    { sigla: "AL", nome: "Alagoas" },
    { sigla: "AP", nome: "Amapá" },
    { sigla: "AM", nome: "Amazonas" },
    { sigla: "BA", nome: "Bahia" },
    { sigla: "CE", nome: "Ceará" },
    { sigla: "DF", nome: "Distrito Federal" },
    { sigla: "ES", nome: "Espírito Santo" },
    { sigla: "GO", nome: "Goiás" },
    { sigla: "MA", nome: "Maranhão" },
    { sigla: "MT", nome: "Mato Grosso" },
    { sigla: "MS", nome: "Mato Grosso do Sul" },
    { sigla: "MG", nome: "Minas Gerais" },
    { sigla: "PA", nome: "Pará" },
    { sigla: "PB", nome: "Paraíba" },
    { sigla: "PR", nome: "Paraná" },
    { sigla: "PE", nome: "Pernambuco" },
    { sigla: "PI", nome: "Piauí" },
    { sigla: "RJ", nome: "Rio de Janeiro" },
    { sigla: "RN", nome: "Rio Grande do Norte" },
    { sigla: "RS", nome: "Rio Grande do Sul" },
    { sigla: "RO", nome: "Rondônia" },
    { sigla: "RR", nome: "Roraima" },
    { sigla: "SC", nome: "Santa Catarina" },
    { sigla: "SP", nome: "São Paulo" },
    { sigla: "SE", nome: "Sergipe" },
    { sigla: "TO", nome: "Tocantins" },
  ],

  paises: [
    { codigo: "BR", nome: "Brasil" },
    { codigo: "AR", nome: "Argentina" },
    { codigo: "PY", nome: "Paraguai" },
    { codigo: "UY", nome: "Uruguai" },
    { codigo: "US", nome: "Estados Unidos" },
    { codigo: "PT", nome: "Portugal" },
  ],

  categoriasInativacao: [
    { codigo: "ENCERRAMENTO_CONTRATO", nome: "Encerramento de contrato" },
    { codigo: "DESCUMPRIMENTO_CONTRATUAL", nome: "Descumprimento contratual" },
    { codigo: "ENCERRAMENTO_ATIVIDADES", nome: "Encerramento das atividades do fornecedor" },
    { codigo: "SOLICITACAO_FORNECEDOR", nome: "Solicitação do próprio fornecedor" },
    { codigo: "OUTRO", nome: "Outro motivo" },
  ],

  categoriasAtivacao: [
    { codigo: "RENOVACAO_CONTRATO", nome: "Renovação de contrato" },
    { codigo: "REGULARIZACAO_PENDENCIA", nome: "Regularização de pendência" },
    { codigo: "RETORNO_OPERACAO", nome: "Retorno às atividades" },
    { codigo: "OUTRO", nome: "Outro motivo" },
  ],
};
