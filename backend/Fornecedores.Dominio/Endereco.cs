namespace Fornecedores.Dominio;

public class Endereco(
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
    public TipoLogradouro TipoLogradouro { get; set; } = tipoLogradouro;
    public string Logradouro { get; set; } = logradouro;
    public string Numero { get; set; } = numero;
    public string? Complemento { get; set; } = complemento;
    public string Bairro { get; set; } = bairro;
    public string Cep { get; set; } = cep;
    public string Cidade { get; set; } = cidade;
    public Estado Estado { get; set; } = estado;
    public Pais Pais { get; set; } = pais;
}
