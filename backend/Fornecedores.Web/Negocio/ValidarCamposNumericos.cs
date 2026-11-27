using Fornecedores.Dominio;

namespace Fornecedores.Web.Negocio;

public sealed class ValidarCamposNumericos : IStrategy<Fornecedor>
{
    public Task<string?> Processar(Fornecedor fornecedor)
    {
        var mensagens = CamposNumericos(fornecedor)
            .Where(campo => campo.Valor != "" && !EhNumericoComAte(campo.Valor, campo.MaximoDeDigitos))
            .Select(campo => $"{campo.Nome} deve ter até {campo.MaximoDeDigitos} dígitos numéricos.")
            .ToList();
        return Task.FromResult(mensagens.Count == 0 ? null : string.Join(" ", mensagens));
    }

    private static (string Nome, string Valor, int MaximoDeDigitos)[] CamposNumericos(Fornecedor fornecedor) =>
    [
        ("DDD", fornecedor.Telefone.Ddd, 2),
        ("Número do Telefone", fornecedor.Telefone.Numero, 9),
        ("CEP", fornecedor.Endereco.Cep, 8),
    ];

    private static bool EhNumericoComAte(string valor, int maximoDeDigitos) =>
        valor.Length <= maximoDeDigitos && valor.All(char.IsAsciiDigit);
}
