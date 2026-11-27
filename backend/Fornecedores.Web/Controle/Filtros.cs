using Fornecedores.Web.Fachada;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Fornecedores.Web.Controle;

public sealed record RespostaDeErro(IReadOnlyList<string> Mensagens);

public sealed class ExigePermissaoAttribute(string permissao) : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext contexto)
    {
        var usuario = contexto.HttpContext.RequestServices.GetRequiredService<UsuarioAutenticado>();
        if (!usuario.Possui(permissao))
        {
            contexto.Result = new ObjectResult(new RespostaDeErro([$"Acesso negado: requer a permissão {permissao}."]))
            {
                StatusCode = StatusCodes.Status403Forbidden,
            };
        }
    }
}

public sealed class TratadorDeExcecoes : IExceptionFilter
{
    public void OnException(ExceptionContext contexto)
    {
        contexto.Result = contexto.Exception switch
        {
            RegraDeNegocioException erro => new UnprocessableEntityObjectResult(new RespostaDeErro(erro.Mensagens)),
            FornecedorNaoEncontradoException erro => new NotFoundObjectResult(new RespostaDeErro([erro.Message])),
            _ => null,
        };
        contexto.ExceptionHandled = contexto.Result is not null;
    }
}
