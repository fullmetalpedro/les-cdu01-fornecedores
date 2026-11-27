namespace Fornecedores.Web.Controle;

public sealed record UsuarioAutenticado(string Nome, string Perfil, string[] Permissoes)
{
    public bool Possui(string permissao) => Permissoes.Contains(permissao);
}

public static class Permissao
{
    public const string Consultar = "FORNECEDOR_CONSULTAR";
    public const string Incluir = "FORNECEDOR_INCLUIR";
    public const string Alterar = "FORNECEDOR_ALTERAR";
    public const string Inativar = "FORNECEDOR_INATIVAR";
    public const string Ativar = "FORNECEDOR_ATIVAR";
}
