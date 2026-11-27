using Fornecedores.Dominio;
using NpgsqlTypes;

namespace Fornecedores.Web.Persistencia;

public sealed class LogTransacaoDao(Conexao conexao)
{
    public async Task Registrar(LogTransacao log)
    {
        await using var comando = await conexao.CriarComando("""
            INSERT INTO log_transacao (data_hora, usuario, operacao, fornecedor_codigo, dados_anteriores, dados_novos)
            VALUES (@data_hora, @usuario, @operacao, @fornecedor_codigo, @dados_anteriores, @dados_novos)
            """);
        comando.Parameters.AddWithValue("data_hora", log.DataHora);
        comando.Parameters.AddWithValue("usuario", log.Usuario);
        comando.Parameters.AddWithValue("operacao", log.Operacao.ToString().ToUpperInvariant());
        comando.Parameters.AddWithValue("fornecedor_codigo", log.Fornecedor.Codigo!);
        comando.Parameters.AddWithValue("dados_anteriores", NpgsqlDbType.Jsonb, (object?)log.DadosAnteriores ?? DBNull.Value);
        comando.Parameters.AddWithValue("dados_novos", NpgsqlDbType.Jsonb, log.DadosNovos);
        await comando.ExecuteNonQueryAsync();
    }
}
