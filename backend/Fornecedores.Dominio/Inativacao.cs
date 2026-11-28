namespace Fornecedores.Dominio;

public class Inativacao(CategoriaInativacao categoria, string justificativa, DateTimeOffset dataHora, string usuario)
{
    public long Id { get; set; }
    public CategoriaInativacao Categoria { get; set; } = categoria;
    public string Justificativa { get; set; } = justificativa;
    public DateTimeOffset DataHora { get; set; } = dataHora;
    public string Usuario { get; set; } = usuario;
}
