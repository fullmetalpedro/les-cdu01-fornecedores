TRUNCATE log_transacao, fornecedor_inativacao, fornecedor_ativacao, fornecedor RESTART IDENTITY;
ALTER SEQUENCE seq_fornecedor_codigo RESTART;

INSERT INTO fornecedor (
    razao_social, nome_fantasia, cnpj, email, status,
    telefone_tipo, telefone_ddd, telefone_numero,
    endereco_tipo_logradouro, endereco_logradouro, endereco_numero, endereco_complemento,
    endereco_bairro, endereco_cep, endereco_cidade, endereco_estado, endereco_pais)
VALUES
    ('Editora Horizonte Ltda', 'Horizonte Livros', '12.345.678/0001-90', 'contato@horizontelivros.com.br', 'ATIVO',
     'COMERCIAL', '11', '32145678', 'RUA', 'das Palmeiras', '1200', 'Sala 4', 'Centro', '01010000', 'São Paulo', 'SP', 'BR'),
    ('Distribuidora Letra Viva S.A.', 'Letra Viva', '23.456.789/0001-01', 'comercial@letraviva.com.br', 'ATIVO',
     'COMERCIAL', '19', '37654321', 'AVENIDA', 'Norte-Sul', '455', NULL, 'Cambuí', '13025000', 'Campinas', 'SP', 'BR'),
    ('Páginas & Cia Comércio de Livros Ltda', 'Páginas & Cia', '34.567.890/0001-12', 'vendas@paginasecia.com.br', 'INATIVO',
     'CELULAR', '21', '998877665', 'RUA', 'da Assembleia', '10', 'Loja B', 'Centro', '20011000', 'Rio de Janeiro', 'RJ', 'BR'),
    ('Editora Quatro Ventos Ltda', 'Quatro Ventos', '45.678.901/0001-23', 'editorial@quatroventos.com.br', 'ATIVO',
     'COMERCIAL', '31', '32221100', 'AVENIDA', 'Afonso Pena', '3000', NULL, 'Funcionários', '30130009', 'Belo Horizonte', 'MG', 'BR'),
    ('Atlântico Distribuidora de Livros Ltda', 'Atlântico', '56.789.012/0001-34', 'pedidos@atlanticolivros.com.br', 'ATIVO',
     'COMERCIAL', '41', '33445566', 'RUA', 'XV de Novembro', '800', NULL, 'Centro', '80020310', 'Curitiba', 'PR', 'BR'),
    ('Editora Sertão Ltda', 'Sertão Editorial', '67.890.123/0001-45', 'contato@sertaoeditorial.com.br', 'INATIVO',
     'COMERCIAL', '81', '34567890', 'AVENIDA', 'Boa Viagem', '1500', 'Apto 101', 'Boa Viagem', '51011000', 'Recife', 'PE', 'BR');
