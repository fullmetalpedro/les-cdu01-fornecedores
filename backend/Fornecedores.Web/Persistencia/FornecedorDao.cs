using System.Data;
using Fornecedores.Dominio;
using Npgsql;

namespace Fornecedores.Web.Persistencia;

public sealed class FornecedorDao(Conexao conexao)
{
    private const string SelecaoComNomesDosDominios = """
        SELECT f.*,
               tt.nome AS telefone_tipo_nome,
               tl.nome AS endereco_tipo_logradouro_nome,
               e.nome  AS endereco_estado_nome,
               p.nome  AS endereco_pais_nome
          FROM fornecedor f
          JOIN tipo_telefone   tt ON tt.codigo = f.telefone_tipo
          JOIN tipo_logradouro tl ON tl.codigo = f.endereco_tipo_logradouro
          JOIN estado          e  ON e.sigla   = f.endereco_estado
          JOIN pais            p  ON p.codigo  = f.endereco_pais
        """;

    public async Task<IReadOnlyList<Fornecedor>> Consultar(FiltroFornecedor filtro)
    {
        await using var comando = await conexao.CriarComando(SelecaoComNomesDosDominios);
        var condicoes = new List<string>();
        foreach (var (condicao, parametro, valor) in CondicoesDoFiltro(filtro))
        {
            if (string.IsNullOrWhiteSpace(valor))
                continue;
            condicoes.Add(condicao);
            comando.Parameters.AddWithValue(parametro, valor.Trim());
        }
        if (condicoes.Count > 0)
            comando.CommandText += " WHERE " + string.Join(" AND ", condicoes);
        comando.CommandText += " ORDER BY f.codigo";
        return await LerTodos(comando);
    }

    public Task<Fornecedor?> ConsultarPorCodigo(string codigo) =>
        ConsultarUm("f.codigo = @codigo", "codigo", codigo);

    public Task<Fornecedor?> ConsultarPorCnpj(string cnpj) =>
        ConsultarUm($"{SemPontuacao("f.cnpj")} = {SemPontuacao("@cnpj")}", "cnpj", cnpj);

    public async Task<string> Incluir(Fornecedor fornecedor)
    {
        await using var comando = await conexao.CriarComando("""
            INSERT INTO fornecedor (
                razao_social, nome_fantasia, cnpj, email,
                telefone_tipo, telefone_ddd, telefone_numero,
                endereco_tipo_logradouro, endereco_logradouro, endereco_numero, endereco_complemento,
                endereco_bairro, endereco_cep, endereco_cidade, endereco_estado, endereco_pais)
            VALUES (
                @razao_social, @nome_fantasia, @cnpj, @email,
                @telefone_tipo, @telefone_ddd, @telefone_numero,
                @endereco_tipo_logradouro, @endereco_logradouro, @endereco_numero, @endereco_complemento,
                @endereco_bairro, @endereco_cep, @endereco_cidade, @endereco_estado, @endereco_pais)
            RETURNING codigo
            """);
        AdicionarDadosCadastrais(comando, fornecedor);
        return (string)(await comando.ExecuteScalarAsync())!;
    }

    public async Task Alterar(Fornecedor fornecedor)
    {
        await using var comando = await conexao.CriarComando("""
            UPDATE fornecedor
               SET razao_social = @razao_social, nome_fantasia = @nome_fantasia, cnpj = @cnpj, email = @email,
                   telefone_tipo = @telefone_tipo, telefone_ddd = @telefone_ddd, telefone_numero = @telefone_numero,
                   endereco_tipo_logradouro = @endereco_tipo_logradouro, endereco_logradouro = @endereco_logradouro,
                   endereco_numero = @endereco_numero, endereco_complemento = @endereco_complemento,
                   endereco_bairro = @endereco_bairro, endereco_cep = @endereco_cep, endereco_cidade = @endereco_cidade,
                   endereco_estado = @endereco_estado, endereco_pais = @endereco_pais
             WHERE codigo = @codigo
            """);
        AdicionarDadosCadastrais(comando, fornecedor);
        comando.Parameters.AddWithValue("codigo", fornecedor.Codigo!);
        await comando.ExecuteNonQueryAsync();
    }

    public async Task AlterarStatus(Fornecedor fornecedor)
    {
        await using var comando = await conexao.CriarComando("UPDATE fornecedor SET status = @status WHERE codigo = @codigo");
        comando.Parameters.AddWithValue("status", fornecedor.Status.ToString().ToUpperInvariant());
        comando.Parameters.AddWithValue("codigo", fornecedor.Codigo!);
        await comando.ExecuteNonQueryAsync();
    }

    private static (string Condicao, string Parametro, string? Valor)[] CondicoesDoFiltro(FiltroFornecedor filtro) =>
    [
        (ContemIgnorandoAcentos("f.codigo", "@codigo"), "codigo", filtro.Codigo),
        (ContemIgnorandoAcentos("f.razao_social", "@razao_social"), "razao_social", filtro.RazaoSocial),
        (ContemIgnorandoAcentos("f.nome_fantasia", "@nome_fantasia"), "nome_fantasia", filtro.NomeFantasia),
        ($"{SemPontuacao("f.cnpj")} LIKE '%' || {SemPontuacao("@cnpj")} || '%'", "cnpj", filtro.Cnpj),
        (ContemIgnorandoAcentos("f.endereco_cidade", "@cidade"), "cidade", filtro.Cidade),
        ("f.endereco_estado = @estado", "estado", filtro.Estado),
        ("f.status = @status", "status", filtro.Status?.ToString().ToUpperInvariant()),
    ];

    private static string ContemIgnorandoAcentos(string coluna, string parametro) =>
        $"unaccent({coluna}) ILIKE '%' || unaccent({parametro}) || '%'";

    private static string SemPontuacao(string cnpj) => $"regexp_replace(upper({cnpj}), '[^0-9A-Z]', '', 'g')";

    private async Task<Fornecedor?> ConsultarUm(string condicao, string parametro, string valor)
    {
        await using var comando = await conexao.CriarComando($"{SelecaoComNomesDosDominios} WHERE {condicao}");
        comando.Parameters.AddWithValue(parametro, valor);
        return (await LerTodos(comando)).SingleOrDefault();
    }

    private static void AdicionarDadosCadastrais(NpgsqlCommand comando, Fornecedor fornecedor)
    {
        var telefone = fornecedor.Telefone;
        var endereco = fornecedor.Endereco;
        comando.Parameters.AddWithValue("razao_social", fornecedor.RazaoSocial);
        comando.Parameters.AddWithValue("nome_fantasia", fornecedor.NomeFantasia);
        comando.Parameters.AddWithValue("cnpj", fornecedor.Cnpj);
        comando.Parameters.AddWithValue("email", fornecedor.Email);
        comando.Parameters.AddWithValue("telefone_tipo", telefone.Tipo.Codigo);
        comando.Parameters.AddWithValue("telefone_ddd", telefone.Ddd);
        comando.Parameters.AddWithValue("telefone_numero", telefone.Numero);
        comando.Parameters.AddWithValue("endereco_tipo_logradouro", endereco.TipoLogradouro.Codigo);
        comando.Parameters.AddWithValue("endereco_logradouro", endereco.Logradouro);
        comando.Parameters.AddWithValue("endereco_numero", endereco.Numero);
        comando.Parameters.AddWithValue("endereco_complemento", (object?)endereco.Complemento ?? DBNull.Value);
        comando.Parameters.AddWithValue("endereco_bairro", endereco.Bairro);
        comando.Parameters.AddWithValue("endereco_cep", endereco.Cep);
        comando.Parameters.AddWithValue("endereco_cidade", endereco.Cidade);
        comando.Parameters.AddWithValue("endereco_estado", endereco.Estado.Sigla);
        comando.Parameters.AddWithValue("endereco_pais", endereco.Pais.Codigo);
    }

    private static async Task<IReadOnlyList<Fornecedor>> LerTodos(NpgsqlCommand comando)
    {
        await using var leitor = await comando.ExecuteReaderAsync();
        var fornecedores = new List<Fornecedor>();
        while (await leitor.ReadAsync())
            fornecedores.Add(Ler(leitor));
        return fornecedores;
    }

    private static Fornecedor Ler(NpgsqlDataReader linha) => new(
        codigo: linha.GetString("codigo"),
        razaoSocial: linha.GetString("razao_social"),
        nomeFantasia: linha.GetString("nome_fantasia"),
        cnpj: linha.GetString("cnpj"),
        email: linha.GetString("email"),
        status: Enum.Parse<StatusFornecedor>(linha.GetString("status"), ignoreCase: true),
        telefone: new Telefone(
            new TipoTelefone(linha.GetString("telefone_tipo"), linha.GetString("telefone_tipo_nome")),
            linha.GetString("telefone_ddd"),
            linha.GetString("telefone_numero")),
        endereco: new Endereco(
            new TipoLogradouro(linha.GetString("endereco_tipo_logradouro"), linha.GetString("endereco_tipo_logradouro_nome")),
            linha.GetString("endereco_logradouro"),
            linha.GetString("endereco_numero"),
            linha.IsDBNull("endereco_complemento") ? null : linha.GetString("endereco_complemento"),
            linha.GetString("endereco_bairro"),
            linha.GetString("endereco_cep"),
            linha.GetString("endereco_cidade"),
            new Estado(linha.GetString("endereco_estado"), linha.GetString("endereco_estado_nome")),
            new Pais(linha.GetString("endereco_pais"), linha.GetString("endereco_pais_nome"))));
}
