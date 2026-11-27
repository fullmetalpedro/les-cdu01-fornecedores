namespace Fornecedores.Dominio;

public class LogTransacao(
    DateTimeOffset dataHora,
    string usuario,
    TipoOperacao operacao,
    Fornecedor fornecedor,
    string? dadosAnteriores,
    string dadosNovos)
{
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

    public long Id { get; set; }
    public DateTimeOffset DataHora { get; set; } = dataHora;
    public string Usuario { get; set; } = usuario;
    public TipoOperacao Operacao { get; set; } = operacao;
    public Fornecedor Fornecedor { get; set; } = fornecedor;
    public string? DadosAnteriores { get; set; } = dadosAnteriores;
    public string DadosNovos { get; set; } = dadosNovos;
}
