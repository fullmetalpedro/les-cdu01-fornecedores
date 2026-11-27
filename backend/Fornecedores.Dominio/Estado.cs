namespace Fornecedores.Dominio;

public class Estado(string sigla, string nome)
{
    public string Sigla { get; set; } = sigla;
    public string Nome { get; set; } = nome;
}
