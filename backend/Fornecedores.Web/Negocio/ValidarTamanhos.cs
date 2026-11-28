using Fornecedores.Dominio;

namespace Fornecedores.Web.Negocio;

public sealed class ValidarTamanhos : IStrategy<Fornecedor>
{
    public Task<string?> Processar(Fornecedor fornecedor)
    {
        var mensagens = CamposDeTexto(fornecedor)
            .Where(campo => campo.Valor?.Length > campo.TamanhoMaximo)
            .Select(campo => $"{campo.Nome} deve ter no máximo {campo.TamanhoMaximo} caracteres.")
            .ToList();
        return Task.FromResult(mensagens.Count == 0 ? null : string.Join(" ", mensagens));
    }

    private static (string Nome, string? Valor, int TamanhoMaximo)[] CamposDeTexto(Fornecedor fornecedor) =>
    [
        ("Razão Social", fornecedor.RazaoSocial, 100),
        ("Nome Fantasia", fornecedor.NomeFantasia, 60),
        ("E-mail", fornecedor.Email, 100),
        ("Logradouro", fornecedor.Endereco.Logradouro, 100),
        ("Número", fornecedor.Endereco.Numero, 10),
        ("Complemento", fornecedor.Endereco.Complemento, 60),
        ("Bairro", fornecedor.Endereco.Bairro, 60),
        ("Cidade", fornecedor.Endereco.Cidade, 60),
    ];
}
