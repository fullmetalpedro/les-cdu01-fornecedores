namespace Fornecedores.Web.Fachada;

public sealed class RegraDeNegocioException(IReadOnlyList<string> mensagens) : Exception(string.Join(" ", mensagens))
{
    public RegraDeNegocioException(string mensagem) : this([mensagem]) { }

    public IReadOnlyList<string> Mensagens { get; } = mensagens;
}

public sealed class FornecedorNaoEncontradoException(string codigo)
    : Exception($"Fornecedor {codigo} não encontrado.");
