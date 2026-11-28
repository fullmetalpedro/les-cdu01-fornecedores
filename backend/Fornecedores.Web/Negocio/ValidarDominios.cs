using Fornecedores.Dominio;
using Fornecedores.Web.Persistencia;

namespace Fornecedores.Web.Negocio;

public sealed class ValidarDominios(Dominios dominios) : IStrategy<Fornecedor>, IStrategy<Inativacao>, IStrategy<Ativacao>
{
    public Task<string?> Processar(Fornecedor fornecedor)
    {
        var mensagens = CamposDeDominio(fornecedor)
            .Where(campo => campo.Codigo != "" && !campo.Validos.Contains(campo.Codigo))
            .Select(campo => $"{campo.Nome} inválido.")
            .ToList();
        return Task.FromResult(mensagens.Count == 0 ? null : string.Join(" ", mensagens));
    }

    public Task<string?> Processar(Inativacao inativacao) =>
        Task.FromResult(ValidarCategoria(inativacao.Categoria.Codigo, dominios.CategoriasInativacao.Select(item => item.Codigo), "inativação"));

    public Task<string?> Processar(Ativacao ativacao) =>
        Task.FromResult(ValidarCategoria(ativacao.Categoria.Codigo, dominios.CategoriasAtivacao.Select(item => item.Codigo), "ativação"));

    private (string Nome, string Codigo, IEnumerable<string> Validos)[] CamposDeDominio(Fornecedor fornecedor) =>
    [
        ("Tipo de Telefone", fornecedor.Telefone.Tipo.Codigo, dominios.TiposTelefone.Select(item => item.Codigo)),
        ("Tipo de Logradouro", fornecedor.Endereco.TipoLogradouro.Codigo, dominios.TiposLogradouro.Select(item => item.Codigo)),
        ("Estado", fornecedor.Endereco.Estado.Sigla, dominios.Estados.Select(item => item.Sigla)),
        ("País", fornecedor.Endereco.Pais.Codigo, dominios.Paises.Select(item => item.Codigo)),
    ];

    private static string? ValidarCategoria(string categoria, IEnumerable<string> validas, string operacao) =>
        categoria == "" || validas.Contains(categoria) ? null : $"Categoria de {operacao} inválida.";
}
