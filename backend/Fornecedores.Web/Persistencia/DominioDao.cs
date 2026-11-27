using Fornecedores.Dominio;

namespace Fornecedores.Web.Persistencia;

public sealed record Dominios(
    IReadOnlyList<TipoTelefone> TiposTelefone,
    IReadOnlyList<TipoLogradouro> TiposLogradouro,
    IReadOnlyList<Estado> Estados,
    IReadOnlyList<Pais> Paises,
    IReadOnlyList<CategoriaInativacao> CategoriasInativacao,
    IReadOnlyList<CategoriaAtivacao> CategoriasAtivacao);

public sealed class DominioDao(Conexao conexao)
{
    public async Task<Dominios> Consultar() => new(
        await Listar("tipo_telefone", "codigo", (codigo, nome) => new TipoTelefone(codigo, nome)),
        await Listar("tipo_logradouro", "codigo", (codigo, nome) => new TipoLogradouro(codigo, nome)),
        await Listar("estado", "sigla", (sigla, nome) => new Estado(sigla, nome)),
        await Listar("pais", "codigo", (codigo, nome) => new Pais(codigo, nome)),
        await Listar("categoria_inativacao", "codigo", (codigo, nome) => new CategoriaInativacao(codigo, nome)),
        await Listar("categoria_ativacao", "codigo", (codigo, nome) => new CategoriaAtivacao(codigo, nome)));

    private async Task<IReadOnlyList<T>> Listar<T>(string tabela, string chave, Func<string, string, T> criar)
    {
        await using var comando = await conexao.CriarComando($"SELECT {chave}, nome FROM {tabela} ORDER BY lower(unaccent(nome))");
        await using var leitor = await comando.ExecuteReaderAsync();
        var itens = new List<T>();
        while (await leitor.ReadAsync())
            itens.Add(criar(leitor.GetString(0), leitor.GetString(1)));
        return itens;
    }
}
