using System.Text.RegularExpressions;
using Fornecedores.Dominio;

namespace Fornecedores.Web.Negocio;

public sealed partial class ValidarFormatos : IStrategy<Fornecedor>
{
    public Task<string?> Processar(Fornecedor fornecedor)
    {
        var mensagens = new List<string>();
        if (fornecedor.Cnpj != "" && !CnpjValido().IsMatch(fornecedor.Cnpj))
            mensagens.Add("CNPJ deve ter 14 caracteres, no formato 00.000.000/0000-00.");
        if (fornecedor.Email != "" && !EmailValido().IsMatch(fornecedor.Email))
            mensagens.Add("E-mail deve estar no formato nome@dominio.com.");
        return Task.FromResult(mensagens.Count == 0 ? null : string.Join(" ", mensagens));
    }

    [GeneratedRegex(@"^[0-9A-Z]{2}\.?[0-9A-Z]{3}\.?[0-9A-Z]{3}/?[0-9A-Z]{4}-?[0-9]{2}$", RegexOptions.IgnoreCase)]
    private static partial Regex CnpjValido();

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$")]
    private static partial Regex EmailValido();
}
