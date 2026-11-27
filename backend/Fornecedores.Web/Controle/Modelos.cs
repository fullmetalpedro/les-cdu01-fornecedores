using Fornecedores.Dominio;

namespace Fornecedores.Web.Controle;

public sealed record FornecedorModelo
{
    public string? Codigo { get; init; }
    public string RazaoSocial { get; init; } = "";
    public string NomeFantasia { get; init; } = "";
    public string Cnpj { get; init; } = "";
    public string Email { get; init; } = "";
    public string? Status { get; init; }
    public TelefoneModelo Telefone { get; init; } = new();
    public EnderecoModelo Endereco { get; init; } = new();

    public static FornecedorModelo De(Fornecedor fornecedor) => new()
    {
        Codigo = fornecedor.Codigo,
        RazaoSocial = fornecedor.RazaoSocial,
        NomeFantasia = fornecedor.NomeFantasia,
        Cnpj = fornecedor.Cnpj,
        Email = fornecedor.Email,
        Status = fornecedor.Status.ToString().ToUpperInvariant(),
        Telefone = TelefoneModelo.De(fornecedor.Telefone),
        Endereco = EnderecoModelo.De(fornecedor.Endereco),
    };

    public Fornecedor ParaDominio(string? codigo = null) => new(
        RazaoSocial.Trim(),
        NomeFantasia.Trim(),
        Cnpj.Trim(),
        Email.Trim(),
        Telefone.ParaDominio(),
        Endereco.ParaDominio())
    {
        Codigo = codigo,
    };
}

public sealed record TelefoneModelo
{
    public string Tipo { get; init; } = "";
    public string Ddd { get; init; } = "";
    public string Numero { get; init; } = "";

    public static TelefoneModelo De(Telefone telefone) => new()
    {
        Tipo = telefone.Tipo.Codigo,
        Ddd = telefone.Ddd,
        Numero = telefone.Numero,
    };

    public Telefone ParaDominio() => new(
        new TipoTelefone(Tipo.Trim(), ItemDeDominio.NomeNaoEnviadoPelaTela),
        Ddd.Trim(),
        Numero.Trim());
}

public sealed record EnderecoModelo
{
    public string TipoLogradouro { get; init; } = "";
    public string Logradouro { get; init; } = "";
    public string Numero { get; init; } = "";
    public string? Complemento { get; init; }
    public string Bairro { get; init; } = "";
    public string Cep { get; init; } = "";
    public string Cidade { get; init; } = "";
    public string Estado { get; init; } = "";
    public string Pais { get; init; } = "";

    public static EnderecoModelo De(Endereco endereco) => new()
    {
        TipoLogradouro = endereco.TipoLogradouro.Codigo,
        Logradouro = endereco.Logradouro,
        Numero = endereco.Numero,
        Complemento = endereco.Complemento,
        Bairro = endereco.Bairro,
        Cep = endereco.Cep,
        Cidade = endereco.Cidade,
        Estado = endereco.Estado.Sigla,
        Pais = endereco.Pais.Codigo,
    };

    public Endereco ParaDominio() => new(
        new TipoLogradouro(TipoLogradouro.Trim(), ItemDeDominio.NomeNaoEnviadoPelaTela),
        Logradouro.Trim(),
        Numero.Trim(),
        string.IsNullOrWhiteSpace(Complemento) ? null : Complemento.Trim(),
        Bairro.Trim(),
        Cep.Trim(),
        Cidade.Trim(),
        new Estado(Estado.Trim(), ItemDeDominio.NomeNaoEnviadoPelaTela),
        new Pais(Pais.Trim(), ItemDeDominio.NomeNaoEnviadoPelaTela));
}

public sealed record MotivoModelo
{
    public string Categoria { get; init; } = "";
    public string Justificativa { get; init; } = "";

    public Inativacao ParaInativacao(string usuario) => new(
        new CategoriaInativacao(Categoria, ItemDeDominio.NomeNaoEnviadoPelaTela),
        Justificativa.Trim(),
        DateTimeOffset.UtcNow,
        usuario);

    public Ativacao ParaAtivacao(string usuario) => new(
        new CategoriaAtivacao(Categoria, ItemDeDominio.NomeNaoEnviadoPelaTela),
        Justificativa.Trim(),
        DateTimeOffset.UtcNow,
        usuario);
}

internal static class ItemDeDominio
{
    public const string NomeNaoEnviadoPelaTela = "";
}
