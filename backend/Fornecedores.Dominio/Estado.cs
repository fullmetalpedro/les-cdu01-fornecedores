namespace Fornecedores.Dominio;

/// <summary>
/// Estado do endereço. Tabela de domínio carregada pelo script de implantação (pré-condição 7.2, RNF0013).
/// </summary>
public class Estado
{
    public Estado(string sigla, string nome)
    {
        Sigla = sigla;
        Nome = nome;
    }

    /// <summary>Chave do registro na tabela de domínio; é o valor guardado no fornecedor.</summary>
    public string Sigla { get; set; }

    /// <summary>Texto exibido no combobox.</summary>
    public string Nome { get; set; }
}
