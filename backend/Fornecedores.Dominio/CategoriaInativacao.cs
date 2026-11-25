namespace Fornecedores.Dominio;

/// <summary>
/// Categoria de inativação de fornecedor (A4.1, RN0084). Tabela de domínio (pré-condição 7.2, RNF0013).
/// </summary>
public class CategoriaInativacao
{
    public CategoriaInativacao(string codigo, string nome)
    {
        Codigo = codigo;
        Nome = nome;
    }

    /// <summary>Chave do registro na tabela de domínio; é o valor guardado no fornecedor.</summary>
    public string Codigo { get; set; }

    /// <summary>Texto exibido no combobox.</summary>
    public string Nome { get; set; }
}
