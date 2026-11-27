namespace Fornecedores.Dominio;

public class Telefone(TipoTelefone tipo, string ddd, string numero)
{
    public TipoTelefone Tipo { get; set; } = tipo;
    public string Ddd { get; set; } = ddd;
    public string Numero { get; set; } = numero;
}
