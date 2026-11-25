namespace Fornecedores.Dominio;

/// <summary>
/// Operações de escrita do caso de uso que geram log (RNF0012, CA08). No banco são
/// gravadas como INCLUSAO, ALTERACAO, INATIVACAO e ATIVACAO.
/// </summary>
public enum TipoOperacao
{
    Inclusao,
    Alteracao,
    Inativacao,
    Ativacao
}
