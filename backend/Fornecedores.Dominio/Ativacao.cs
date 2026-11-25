namespace Fornecedores.Dominio;

/// <summary>
/// Registro de uma ativação do fornecedor: categoria, justificativa, data, hora e
/// usuário responsável (A5.4, RN0085, RNF0012).
/// </summary>
public class Ativacao
{
    /// <summary>Ativação ainda não persistida.</summary>
    public Ativacao(
        CategoriaAtivacao categoria,
        string justificativa,
        DateTimeOffset dataHora,
        string usuario)
    {
        Categoria = categoria;
        Justificativa = justificativa;
        DataHora = dataHora;
        Usuario = usuario;
    }

    /// <summary>Ativação recuperada do banco.</summary>
    public Ativacao(
        long id,
        CategoriaAtivacao categoria,
        string justificativa,
        DateTimeOffset dataHora,
        string usuario)
        : this(categoria, justificativa, dataHora, usuario)
    {
        Id = id;
    }

    /// <summary>Identificador gerado pelo banco; zero enquanto não persistida.</summary>
    public long Id { get; set; }

    public CategoriaAtivacao Categoria { get; set; }

    public string Justificativa { get; set; }

    public DateTimeOffset DataHora { get; set; }

    /// <summary>Identificação do usuário autenticado que realizou a operação.</summary>
    public string Usuario { get; set; }
}
