namespace Fornecedores.Web.Negocio;

public interface IStrategy<in T>
{
    Task<string?> Processar(T entidade);
}
