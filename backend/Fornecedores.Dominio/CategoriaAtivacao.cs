namespace Fornecedores.Dominio;

public class CategoriaAtivacao(string codigo, string nome)
{
    public string Codigo { get; set; } = codigo;
    public string Nome { get; set; } = nome;
}
