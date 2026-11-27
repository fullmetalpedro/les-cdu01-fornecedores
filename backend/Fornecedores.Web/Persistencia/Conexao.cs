using Npgsql;

namespace Fornecedores.Web.Persistencia;

public sealed class Conexao(NpgsqlDataSource fonteDeDados) : IAsyncDisposable
{
    private NpgsqlConnection? conexao;
    private NpgsqlTransaction? transacao;

    public async Task<NpgsqlCommand> CriarComando(string sql) => new(sql, await Abrir(), transacao);

    public async Task EmTransacao(Func<Task> operacao)
    {
        var conexaoAberta = await Abrir();
        transacao = await conexaoAberta.BeginTransactionAsync();
        try
        {
            await operacao();
            await transacao.CommitAsync();
        }
        finally
        {
            await transacao.DisposeAsync();
            transacao = null;
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (conexao is not null)
            await conexao.DisposeAsync();
    }

    private async Task<NpgsqlConnection> Abrir() => conexao ??= await fonteDeDados.OpenConnectionAsync();
}
