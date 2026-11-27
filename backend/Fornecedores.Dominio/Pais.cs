namespace Fornecedores.Dominio;

public class Pais(string codigo, string nome)
{
    public string Codigo { get; set; } = codigo;
    public string Nome { get; set; } = nome;
}
