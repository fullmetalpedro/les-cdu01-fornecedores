namespace Fornecedores.Dominio;

/// <summary>
/// Status do fornecedor (P8.2, A4.4, A5.4). No banco é gravado como ATIVO ou INATIVO.
/// </summary>
public enum StatusFornecedor
{
    Ativo,
    Inativo
}
