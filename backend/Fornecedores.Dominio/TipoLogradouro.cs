namespace Fornecedores.Dominio;

/// <summary>
/// Tipo de logradouro. Tabela de domínio carregada pelo script de implantação (pré-condição 7.2, RNF0013).
/// </summary>
public class TipoLogradouro
{
    public TipoLogradouro(string codigo, string nome)
    {
        Codigo = codigo;
        Nome = nome;
    }

    /// <summary>Chave do registro na tabela de domínio; é o valor guardado no fornecedor.</summary>
    public string Codigo { get; set; }

    /// <summary>Texto exibido no combobox.</summary>
    public string Nome { get; set; }
}
