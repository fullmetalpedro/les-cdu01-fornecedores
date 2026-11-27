using Fornecedores.Dominio;

namespace Fornecedores.Web.Persistencia;

public sealed class HistoricoStatusDao(Conexao conexao)
{
    public Task RegistrarInativacao(string codigoFornecedor, Inativacao inativacao) =>
        Registrar("fornecedor_inativacao", codigoFornecedor, inativacao.Categoria.Codigo,
            inativacao.Justificativa, inativacao.DataHora, inativacao.Usuario);

    public Task RegistrarAtivacao(string codigoFornecedor, Ativacao ativacao) =>
        Registrar("fornecedor_ativacao", codigoFornecedor, ativacao.Categoria.Codigo,
            ativacao.Justificativa, ativacao.DataHora, ativacao.Usuario);

    private async Task Registrar(
        string tabela, string codigoFornecedor, string categoria, string justificativa, DateTimeOffset dataHora, string usuario)
    {
        await using var comando = await conexao.CriarComando($"""
            INSERT INTO {tabela} (fornecedor_codigo, categoria, justificativa, data_hora, usuario)
            VALUES (@fornecedor_codigo, @categoria, @justificativa, @data_hora, @usuario)
            """);
        comando.Parameters.AddWithValue("fornecedor_codigo", codigoFornecedor);
        comando.Parameters.AddWithValue("categoria", categoria);
        comando.Parameters.AddWithValue("justificativa", justificativa);
        comando.Parameters.AddWithValue("data_hora", dataHora);
        comando.Parameters.AddWithValue("usuario", usuario);
        await comando.ExecuteNonQueryAsync();
    }
}
