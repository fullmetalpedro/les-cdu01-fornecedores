namespace Fornecedores.Dominio;

/// <summary>
/// Fornecedor dos livros comercializados pelo e-commerce (RF0081 a RF0085).
/// </summary>
public class Fornecedor
{
    /// <summary>
    /// Novo fornecedor, ainda não persistido: sem código (RNF0081, gerado na
    /// persistência) e com status ATIVO (P8.2).
    /// </summary>
    public Fornecedor(
        string razaoSocial,
        string nomeFantasia,
        string cnpj,
        string email,
        Telefone telefone,
        Endereco endereco)
    {
        RazaoSocial = razaoSocial;
        NomeFantasia = nomeFantasia;
        Cnpj = cnpj;
        Email = email;
        Status = StatusFornecedor.Ativo;
        Telefone = telefone;
        Endereco = endereco;
    }

    /// <summary>Fornecedor recuperado do banco (A2.1).</summary>
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

    /// <summary>
    /// Código único gerado pelo sistema na persistência (RNF0081, P8.1). Nulo enquanto
    /// o fornecedor não foi persistido. Não é editável pelo usuário (P4.1, A3.1).
    /// </summary>
    public string? Codigo { get; set; }

    public string RazaoSocial { get; set; }

    public string NomeFantasia { get; set; }

    /// <summary>Único entre todos os fornecedores, ativos ou inativos (RN0083).</summary>
    public string Cnpj { get; set; }

    public string Email { get; set; }

    /// <summary>Somente fornecedores ativos entram em entradas em estoque (RN0086).</summary>
    public StatusFornecedor Status { get; set; }

    public Telefone Telefone { get; set; }

    public Endereco Endereco { get; set; }

    /// <summary>Histórico das inativações do fornecedor (A4.4, RN0084).</summary>
    public List<Inativacao> Inativacoes { get; } = new List<Inativacao>();

    /// <summary>Histórico das ativações do fornecedor (A5.4, RN0085).</summary>
    public List<Ativacao> Ativacoes { get; } = new List<Ativacao>();
}
