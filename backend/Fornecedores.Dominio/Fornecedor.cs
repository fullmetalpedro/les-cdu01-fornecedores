namespace Fornecedores.Dominio;

public class Fornecedor(
    string razaoSocial,
    string nomeFantasia,
    string cnpj,
    string email,
    Telefone telefone,
    Endereco endereco)
{
    public Fornecedor(
        string codigo,
        string razaoSocial,
        string nomeFantasia,
        string cnpj,
        string email,
        StatusFornecedor status,
        Telefone telefone,
        Endereco endereco)
        : this(razaoSocial, nomeFantasia, cnpj, email, telefone, endereco)
    {
        Codigo = codigo;
        Status = status;
    }

    public string? Codigo { get; set; }
    public string RazaoSocial { get; set; } = razaoSocial;
    public string NomeFantasia { get; set; } = nomeFantasia;
    public string Cnpj { get; set; } = cnpj;
    public string Email { get; set; } = email;
    public StatusFornecedor Status { get; set; } = StatusFornecedor.Ativo;
    public Telefone Telefone { get; set; } = telefone;
    public Endereco Endereco { get; set; } = endereco;
    public List<Inativacao> Inativacoes { get; } = [];
    public List<Ativacao> Ativacoes { get; } = [];
}
