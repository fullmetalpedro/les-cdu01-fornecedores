namespace Fornecedores.Dominio;

public class Ativacao(CategoriaAtivacao categoria, string justificativa, DateTimeOffset dataHora, string usuario)
{
    public long Id { get; set; }
    public CategoriaAtivacao Categoria { get; set; } = categoria;
    public string Justificativa { get; set; } = justificativa;
    public DateTimeOffset DataHora { get; set; } = dataHora;
    public string Usuario { get; set; } = usuario;
}
