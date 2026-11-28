using System.Text.Json;
using System.Text.Json.Serialization;
using Fornecedores.Dominio;
using Fornecedores.Web.Negocio;
using Fornecedores.Web.Persistencia;

namespace Fornecedores.Web.Fachada;

public sealed class FachadaFornecedor(
    Conexao conexao,
    FornecedorDao fornecedorDao,
    HistoricoStatusDao historicoDao,
    LogTransacaoDao logDao,
    DominioDao dominioDao)
{
    private static readonly JsonSerializerOptions OpcoesDoLog = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseUpper) },
    };

    private const string SomenteAtivosPodemSerInativados = "Somente fornecedores ativos podem ser inativados.";
    private const string SomenteInativosPodemSerAtivados = "Somente fornecedores inativos podem ser ativados.";

    private static readonly ValidarMotivo RegraDoMotivo = new();

    public Task<Dominios> ConsultarDominios() => dominioDao.Consultar();

    public Task<IReadOnlyList<Fornecedor>> Consultar(FiltroFornecedor filtro) => fornecedorDao.Consultar(filtro);

    public async Task<Fornecedor> ConsultarPorCodigo(string codigo) =>
        await fornecedorDao.ConsultarPorCodigo(codigo) ?? throw new FornecedorNaoEncontradoException(codigo);

    public async Task<Fornecedor> Incluir(Fornecedor fornecedor, string usuario)
    {
        await Validar(await RegrasDeCadastro(), fornecedor);
        await conexao.EmTransacao(async () =>
        {
            fornecedor.Codigo = await fornecedorDao.Incluir(fornecedor);
            await RegistrarLog(TipoOperacao.Inclusao, fornecedor, dadosAnteriores: null, usuario);
        });
        return fornecedor;
    }

    public async Task<Fornecedor> Alterar(Fornecedor fornecedor, string usuario)
    {
        var anterior = await ConsultarPorCodigo(fornecedor.Codigo!);
        fornecedor.Status = anterior.Status;
        await Validar(await RegrasDeCadastro(), fornecedor);
        await conexao.EmTransacao(async () =>
        {
            await fornecedorDao.Alterar(fornecedor);
            await RegistrarLog(TipoOperacao.Alteracao, fornecedor, ParaJson(anterior), usuario);
        });
        return fornecedor;
    }

    public async Task Inativar(string codigo, Inativacao inativacao)
    {
        var fornecedor = await ConsultarPorCodigo(codigo);
        ExigirStatus(fornecedor, StatusFornecedor.Ativo, SomenteAtivosPodemSerInativados);
        await Validar([RegraDoMotivo, await RegraDosDominios()], inativacao);
        await MudarStatus(fornecedor, StatusFornecedor.Inativo, TipoOperacao.Inativacao, inativacao.Usuario,
            SomenteAtivosPodemSerInativados, registrarMotivo: () => historicoDao.RegistrarInativacao(codigo, inativacao));
    }

    public async Task Ativar(string codigo, Ativacao ativacao)
    {
        var fornecedor = await ConsultarPorCodigo(codigo);
        ExigirStatus(fornecedor, StatusFornecedor.Inativo, SomenteInativosPodemSerAtivados);
        await Validar([RegraDoMotivo, await RegraDosDominios()], ativacao);
        await MudarStatus(fornecedor, StatusFornecedor.Ativo, TipoOperacao.Ativacao, ativacao.Usuario,
            SomenteInativosPodemSerAtivados, registrarMotivo: () => historicoDao.RegistrarAtivacao(codigo, ativacao));
    }

    private async Task<IStrategy<Fornecedor>[]> RegrasDeCadastro() =>
    [
        new ValidarDadosObrigatorios(),
        new ValidarTamanhos(),
        new ValidarFormatos(),
        new ValidarCamposNumericos(),
        await RegraDosDominios(),
        new ValidarCnpjUnico(fornecedorDao),
    ];

    private async Task<ValidarDominios> RegraDosDominios() => new(await dominioDao.Consultar());

    private static async Task Validar<T>(IEnumerable<IStrategy<T>> regras, T entidade)
    {
        var mensagens = new List<string>();
        foreach (var regra in regras)
        {
            if (await regra.Processar(entidade) is { } mensagem)
                mensagens.Add(mensagem);
        }
        if (mensagens.Count > 0)
            throw new RegraDeNegocioException(mensagens);
    }

    private static void ExigirStatus(Fornecedor fornecedor, StatusFornecedor esperado, string mensagem)
    {
        if (fornecedor.Status != esperado)
            throw new RegraDeNegocioException(mensagem);
    }

    private async Task MudarStatus(
        Fornecedor fornecedor, StatusFornecedor novoStatus, TipoOperacao operacao, string usuario,
        string mensagemSeOStatusMudou, Func<Task> registrarMotivo)
    {
        var dadosAnteriores = ParaJson(fornecedor);
        var statusAnterior = fornecedor.Status;
        fornecedor.Status = novoStatus;
        await conexao.EmTransacao(async () =>
        {
            if (!await fornecedorDao.AlterarStatus(fornecedor.Codigo!, statusAnterior, novoStatus))
                throw new RegraDeNegocioException(mensagemSeOStatusMudou);
            await registrarMotivo();
            await RegistrarLog(operacao, fornecedor, dadosAnteriores, usuario);
        });
    }

    private Task RegistrarLog(TipoOperacao operacao, Fornecedor fornecedor, string? dadosAnteriores, string usuario) =>
        logDao.Registrar(new LogTransacao(
            DateTimeOffset.UtcNow, usuario, operacao, fornecedor, dadosAnteriores, dadosNovos: ParaJson(fornecedor)));

    private static string ParaJson(Fornecedor fornecedor) => JsonSerializer.Serialize(fornecedor, OpcoesDoLog);
}
