using Fornecedores.Web.Controle;
using Fornecedores.Web.Fachada;
using Fornecedores.Web.Persistencia;
using Microsoft.Extensions.FileProviders;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);
var configuracao = builder.Configuration;

builder.Services
    .AddControllers(opcoes =>
    {
        opcoes.Filters.Add<TratadorDeExcecoes>();
        opcoes.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
    })
    .AddJsonOptions(opcoes => opcoes.JsonSerializerOptions.RespectNullableAnnotations = true);

builder.Services.AddSingleton(_ => NpgsqlDataSource.Create(configuracao.GetConnectionString("Fornecedores")!));
builder.Services.AddSingleton(configuracao.GetRequiredSection("UsuarioAutenticado").Get<UsuarioAutenticado>()!);
builder.Services.AddScoped<Conexao>();
builder.Services.AddScoped<FornecedorDao>();
builder.Services.AddScoped<HistoricoStatusDao>();
builder.Services.AddScoped<LogTransacaoDao>();
builder.Services.AddScoped<DominioDao>();
builder.Services.AddScoped<FachadaFornecedor>();

var app = builder.Build();

var pastaDasTelas = Path.GetFullPath(configuracao["PastaDasTelas"]!, app.Environment.ContentRootPath);
app.UseFileServer(new FileServerOptions
{
    FileProvider = new PhysicalFileProvider(pastaDasTelas),
    StaticFileOptions = { OnPrepareResponse = arquivo => arquivo.Context.Response.Headers.CacheControl = "no-cache" },
});
app.MapControllers();

app.Run();
