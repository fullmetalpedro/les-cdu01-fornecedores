namespace Fornecedores.Dominio;

/// <summary>
/// Registro de uma operação de escrita sobre um fornecedor: data, hora, usuário
/// responsável e dados alterados (RNF0012, P8.3, CA08).
/// </summary>
public class LogTransacao
{
    /// <summary>Log ainda não persistido.</summary>
    public LogTransacao(
        DateTimeOffset dataHora,
        string usuario,
        TipoOperacao operacao,
        Fornecedor fornecedor,
        string? dadosAnteriores,
        string dadosNovos)
    {
        DataHora = dataHora;
        Usuario = usuario;
        Operacao = operacao;
        Fornecedor = fornecedor;
        DadosAnteriores = dadosAnteriores;
        DadosNovos = dadosNovos;
    }

    /// <summary>Log recuperado do banco.</summary>
    public LogTransacao(
        long id,
        DateTimeOffset dataHora,
        string usuario,
        TipoOperacao operacao,
        Fornecedor fornecedor,
        string? dadosAnteriores,
        string dadosNovos)
        : this(dataHora, usuario, operacao, fornecedor, dadosAnteriores, dadosNovos)
    {
        Id = id;
    }

    /// <summary>Identificador gerado pelo banco; zero enquanto não persistido.</summary>
    public long Id { get; set; }

    public DateTimeOffset DataHora { get; set; }

    /// <summary>Identificação do usuário autenticado que realizou a operação.</summary>
    public string Usuario { get; set; }

    public TipoOperacao Operacao { get; set; }

    public Fornecedor Fornecedor { get; set; }

    /// <summary>Dados do fornecedor antes da operação, em JSON. Nulo na inclusão.</summary>
    public string? DadosAnteriores { get; set; }

    /// <summary>Dados do fornecedor depois da operação, em JSON.</summary>
    public string DadosNovos { get; set; }
}
