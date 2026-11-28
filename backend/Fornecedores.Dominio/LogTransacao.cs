namespace Fornecedores.Dominio;

public class LogTransacao(
    DateTimeOffset dataHora,
    string usuario,
    TipoOperacao operacao,
    Fornecedor fornecedor,
    string? dadosAnteriores,
    string dadosNovos)
{
    public long Id { get; set; }
    public DateTimeOffset DataHora { get; set; } = dataHora;
    public string Usuario { get; set; } = usuario;
    public TipoOperacao Operacao { get; set; } = operacao;
    public Fornecedor Fornecedor { get; set; } = fornecedor;
    public string? DadosAnteriores { get; set; } = dadosAnteriores;
    public string DadosNovos { get; set; } = dadosNovos;
}
