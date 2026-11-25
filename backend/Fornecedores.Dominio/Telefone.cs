namespace Fornecedores.Dominio;

/// <summary>
/// Telefone do fornecedor: tipo, DDD e número (P4.2, RN0081).
/// </summary>
public class Telefone
{
    public Telefone(TipoTelefone tipo, string ddd, string numero)
    {
        Tipo = tipo;
        Ddd = ddd;
        Numero = numero;
    }

    public TipoTelefone Tipo { get; set; }

    /// <summary>Numérico, tamanho 2.</summary>
    public string Ddd { get; set; }

    /// <summary>Numérico, tamanho 9.</summary>
    public string Numero { get; set; }
}
