using Fornecedores.Dominio;

namespace Fornecedores.Web.Persistencia;

public sealed record FiltroFornecedor(
    string? Codigo,
    string? RazaoSocial,
    string? NomeFantasia,
    string? Cnpj,
    string? Cidade,
    string? Estado,
    StatusFornecedor? Status);
