namespace Fornecedores.Dominio;

/// <summary>
/// Registro de uma inativação do fornecedor: categoria, justificativa, data, hora e
/// usuário responsável (A4.4, RN0084, RNF0012).
/// </summary>
public class Inativacao
{
    /// <summary>Inativação ainda não persistida.</summary>
    public Inativacao(
        CategoriaInativacao categoria,
        string justificativa,
        DateTimeOffset dataHora,
        string usuario)
    {
        Categoria = categoria;
        Justificativa = justificativa;
        DataHora = dataHora;
        Usuario = usuario;
    }

    /// <summary>Inativação recuperada do banco.</summary>
    public Inativacao(
        long id,
        CategoriaInativacao categoria,
        string justificativa,
        DateTimeOffset dataHora,
        string usuario)
        : this(categoria, justificativa, dataHora, usuario)
    {
        Id = id;
    }

    /// <summary>Identificador gerado pelo banco; zero enquanto não persistida.</summary>
    public long Id { get; set; }

    public CategoriaInativacao Categoria { get; set; }

    public string Justificativa { get; set; }

    public DateTimeOffset DataHora { get; set; }

    /// <summary>Identificação do usuário autenticado que realizou a operação.</summary>
    public string Usuario { get; set; }
}
