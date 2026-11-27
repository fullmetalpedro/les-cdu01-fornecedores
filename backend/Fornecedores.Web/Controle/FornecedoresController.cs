using Fornecedores.Web.Fachada;
using Fornecedores.Web.Persistencia;
using Microsoft.AspNetCore.Mvc;

namespace Fornecedores.Web.Controle;

[ApiController]
[Route("api/fornecedores")]
public sealed class FornecedoresController(FachadaFornecedor fachada, UsuarioAutenticado usuario) : ControllerBase
{
    [HttpGet]
    [ExigePermissao(Permissao.Consultar)]
    public async Task<IEnumerable<FornecedorModelo>> Consultar([FromQuery] FiltroFornecedor filtro) =>
        (await fachada.Consultar(filtro)).Select(FornecedorModelo.De);

    [HttpGet("{codigo}")]
    [ExigePermissao(Permissao.Consultar)]
    public async Task<FornecedorModelo> ConsultarPorCodigo(string codigo) =>
        FornecedorModelo.De(await fachada.ConsultarPorCodigo(codigo));

    [HttpPost]
    [ExigePermissao(Permissao.Incluir)]
    public async Task<FornecedorModelo> Incluir(FornecedorModelo fornecedor) =>
        FornecedorModelo.De(await fachada.Incluir(fornecedor.ParaDominio(), usuario.Nome));

    [HttpPut("{codigo}")]
    [ExigePermissao(Permissao.Alterar)]
    public async Task<FornecedorModelo> Alterar(string codigo, FornecedorModelo fornecedor) =>
        FornecedorModelo.De(await fachada.Alterar(fornecedor.ParaDominio(codigo), usuario.Nome));

    [HttpPost("{codigo}/inativacao")]
    [ExigePermissao(Permissao.Inativar)]
    public Task Inativar(string codigo, MotivoModelo motivo) =>
        fachada.Inativar(codigo, motivo.ParaInativacao(usuario.Nome));

    [HttpPost("{codigo}/ativacao")]
    [ExigePermissao(Permissao.Ativar)]
    public Task Ativar(string codigo, MotivoModelo motivo) =>
        fachada.Ativar(codigo, motivo.ParaAtivacao(usuario.Nome));
}
