using Fornecedores.Dominio;

namespace Fornecedores.Web.Negocio;

public sealed class ValidarDadosObrigatorios : IStrategy<Fornecedor>
{
    public Task<string?> Processar(Fornecedor fornecedor)
    {
        var camposPendentes = CamposObrigatorios(fornecedor)
            .Where(campo => string.IsNullOrWhiteSpace(campo.Valor))
            .Select(campo => campo.Nome)
            .ToList();
        return Task.FromResult(camposPendentes.Count == 0
            ? null
            : $"Preencha os campos obrigatórios: {string.Join(", ", camposPendentes)}.");
    }

    private static (string Nome, string Valor)[] CamposObrigatorios(Fornecedor fornecedor) =>
    [
        ("Razão Social", fornecedor.RazaoSocial),
        ("Nome Fantasia", fornecedor.NomeFantasia),
        ("CNPJ", fornecedor.Cnpj),
        ("E-mail", fornecedor.Email),
        ("Tipo de Telefone", fornecedor.Telefone.Tipo.Codigo),
        ("DDD", fornecedor.Telefone.Ddd),
        ("Número do Telefone", fornecedor.Telefone.Numero),
        ("Tipo de Logradouro", fornecedor.Endereco.TipoLogradouro.Codigo),
        ("Logradouro", fornecedor.Endereco.Logradouro),
        ("Número", fornecedor.Endereco.Numero),
        ("Bairro", fornecedor.Endereco.Bairro),
        ("CEP", fornecedor.Endereco.Cep),
        ("Cidade", fornecedor.Endereco.Cidade),
        ("Estado", fornecedor.Endereco.Estado.Sigla),
        ("País", fornecedor.Endereco.Pais.Codigo),
    ];
}
