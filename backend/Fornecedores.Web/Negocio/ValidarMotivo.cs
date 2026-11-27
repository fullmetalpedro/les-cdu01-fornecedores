using Fornecedores.Dominio;

namespace Fornecedores.Web.Negocio;

public sealed class ValidarMotivo : IStrategy<Inativacao>, IStrategy<Ativacao>
{
    private const int TamanhoMaximoDaJustificativa = 255;

    public Task<string?> Processar(Inativacao inativacao) =>
        Task.FromResult(Validar(inativacao.Categoria.Codigo, inativacao.Justificativa, "inativação"));

    public Task<string?> Processar(Ativacao ativacao) =>
        Task.FromResult(Validar(ativacao.Categoria.Codigo, ativacao.Justificativa, "ativação"));

    private static string? Validar(string categoria, string justificativa, string operacao)
    {
        var mensagens = new List<string>();
        if (string.IsNullOrWhiteSpace(categoria))
            mensagens.Add($"Informe a categoria da {operacao}.");
        if (string.IsNullOrWhiteSpace(justificativa))
            mensagens.Add($"Informe a justificativa da {operacao}.");
        else if (justificativa.Length > TamanhoMaximoDaJustificativa)
            mensagens.Add($"A justificativa deve ter no máximo {TamanhoMaximoDaJustificativa} caracteres.");
        return mensagens.Count == 0 ? null : string.Join(" ", mensagens);
    }
}
