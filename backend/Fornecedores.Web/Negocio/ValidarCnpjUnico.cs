using Fornecedores.Dominio;
using Fornecedores.Web.Persistencia;

namespace Fornecedores.Web.Negocio;

public sealed class ValidarCnpjUnico(FornecedorDao fornecedorDao) : IStrategy<Fornecedor>
{
    public async Task<string?> Processar(Fornecedor fornecedor)
    {
        if (string.IsNullOrWhiteSpace(fornecedor.Cnpj))
            return null;

        var fornecedorComMesmoCnpj = await fornecedorDao.ConsultarPorCnpj(fornecedor.Cnpj);
        return fornecedorComMesmoCnpj is not null && fornecedorComMesmoCnpj.Codigo != fornecedor.Codigo
            ? $"CNPJ já cadastrado para o fornecedor {fornecedorComMesmoCnpj.Codigo}."
            : null;
    }
}
