namespace Fornecedores.Dominio;

/// <summary>
/// Categoria de ativação de fornecedor (A5.1, RN0085). Tabela de domínio (pré-condição 7.2, RNF0013).
/// </summary>
public class CategoriaAtivacao
{
    public CategoriaAtivacao(string codigo, string nome)
    {
        Codigo = codigo;
        Nome = nome;
    }

    /// <summary>Chave do registro na tabela de domínio; é o valor guardado no fornecedor.</summary>
    public string Codigo { get; set; }

    /// <summary>Texto exibido no combobox.</summary>
    public string Nome { get; set; }
}
