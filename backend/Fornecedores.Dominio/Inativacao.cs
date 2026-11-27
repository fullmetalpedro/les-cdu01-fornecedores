namespace Fornecedores.Dominio;

public class Inativacao(CategoriaInativacao categoria, string justificativa, DateTimeOffset dataHora, string usuario)
{
    public Inativacao(long id, CategoriaInativacao categoria, string justificativa, DateTimeOffset dataHora, string usuario)
        : this(categoria, justificativa, dataHora, usuario)
    {
        Id = id;
    }

    public long Id { get; set; }
    public CategoriaInativacao Categoria { get; set; } = categoria;
    public string Justificativa { get; set; } = justificativa;
    public DateTimeOffset DataHora { get; set; } = dataHora;
    public string Usuario { get; set; } = usuario;
}
