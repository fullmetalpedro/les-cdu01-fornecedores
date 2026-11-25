namespace Fornecedores.Dominio;

/// <summary>
/// Endereço do fornecedor (P4.3, RN0082). Só o complemento é opcional.
/// </summary>
public class Endereco
{
    public Endereco(
        TipoLogradouro tipoLogradouro,
        string logradouro,
        string numero,
        string? complemento,
        string bairro,
        string cep,
        string cidade,
        Estado estado,
        Pais pais)
    {
        TipoLogradouro = tipoLogradouro;
        Logradouro = logradouro;
        Numero = numero;
        Complemento = complemento;
        Bairro = bairro;
        Cep = cep;
        Cidade = cidade;
        Estado = estado;
        Pais = pais;
    }

    public TipoLogradouro TipoLogradouro { get; set; }

    public string Logradouro { get; set; }

    /// <summary>Alfanumérico: aceita, por exemplo, "1200", "s/n" e "45-B".</summary>
    public string Numero { get; set; }

    public string? Complemento { get; set; }

    public string Bairro { get; set; }

    /// <summary>Numérico, tamanho 8, sem máscara.</summary>
    public string Cep { get; set; }

    public string Cidade { get; set; }

    public Estado Estado { get; set; }

    public Pais Pais { get; set; }
}
