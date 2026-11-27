using Fornecedores.Web.Fachada;
using Fornecedores.Web.Persistencia;
using Microsoft.AspNetCore.Mvc;

namespace Fornecedores.Web.Controle;

[ApiController]
[Route("api")]
public sealed class SessaoController(FachadaFornecedor fachada, UsuarioAutenticado usuario) : ControllerBase
{
    [HttpGet("usuario")]
    public UsuarioAutenticado Usuario() => usuario;

    [HttpGet("dominios")]
    public Task<Dominios> Dominios() => fachada.ConsultarDominios();
}
