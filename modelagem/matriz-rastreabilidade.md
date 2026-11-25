# Matriz de rastreabilidade – CDU01, Etapa 2

Referências: [especificação do caso de uso](../docs/UC_Manter_Cadastro_de_Fornecedores.md) e [DRS v0.7](../docs/DRS_LES_2_2026.md).
"Dn" e "An" apontam para o [registro de ambiguidades e decisões](ambiguidades-e-decisoes.md).

## 1. Campo da tela → atributo da classe → coluna do banco

`name` é o atributo `name` do campo no HTML da Etapa 1 (`src/index.html`, `src/cadastro.html` e `src/js/status.js`).

### 1.1 Tela de Cadastro (11.3) e Tela de Busca (11.1)

| Campo da tela | `name` (Etapa 1) | Classe.Atributo (C#) | Tabela.coluna | Tipo e tamanho | Obrig. | Filtro da busca (P1.1) | Requisito |
|---|---|---|---|---|---|---|---|
| Código | `codigo` | `Fornecedor.Codigo` | `fornecedor.codigo` | VARCHAR(10), PK | Sim | Sim | RNF0081, P4.1, P8.1 |
| Razão Social | `razaoSocial` | `Fornecedor.RazaoSocial` | `fornecedor.razao_social` | VARCHAR(100) | Sim | Sim | RN0081 |
| Nome Fantasia | `nomeFantasia` | `Fornecedor.NomeFantasia` | `fornecedor.nome_fantasia` | VARCHAR(60) | Sim | Sim | RN0081 |
| CNPJ | `cnpj` | `Fornecedor.Cnpj` | `fornecedor.cnpj` | VARCHAR(18), único | Sim | Sim | RN0081, RN0083, P7 |
| E-mail | `email` | `Fornecedor.Email` | `fornecedor.email` | VARCHAR(100) | Sim | Não | RN0081 |
| Status | `status` | `Fornecedor.Status` | `fornecedor.status` | VARCHAR(7): ATIVO ou INATIVO | Sim | Sim | P1.1, P8.2, A4.4, A5.4, RN0086 |
| Tipo de Telefone | `telefone.tipo` | `Telefone.Tipo` → `TipoTelefone` | `fornecedor.telefone_tipo` | VARCHAR(30), FK `tipo_telefone` | Sim | Não | RN0081, P4.2 |
| DDD | `telefone.ddd` | `Telefone.Ddd` | `fornecedor.telefone_ddd` | VARCHAR(2), só dígitos | Sim | Não | RN0081, P4.2 |
| Número do Telefone | `telefone.numero` | `Telefone.Numero` | `fornecedor.telefone_numero` | VARCHAR(9), só dígitos | Sim | Não | RN0081, P4.2 |
| Tipo de Logradouro | `endereco.tipoLogradouro` | `Endereco.TipoLogradouro` → `TipoLogradouro` | `fornecedor.endereco_tipo_logradouro` | VARCHAR(30), FK `tipo_logradouro` | Sim | Não | RN0082, P4.3 |
| Logradouro | `endereco.logradouro` | `Endereco.Logradouro` | `fornecedor.endereco_logradouro` | VARCHAR(100) | Sim | Não | RN0082 |
| Número | `endereco.numero` | `Endereco.Numero` | `fornecedor.endereco_numero` | VARCHAR(10) | Sim | Não | RN0082 |
| Complemento | `endereco.complemento` | `Endereco.Complemento` | `fornecedor.endereco_complemento` | VARCHAR(60) | **Não** | Não | RN0082 |
| Bairro | `endereco.bairro` | `Endereco.Bairro` | `fornecedor.endereco_bairro` | VARCHAR(60) | Sim | Não | RN0082 |
| CEP | `endereco.cep` | `Endereco.Cep` | `fornecedor.endereco_cep` | VARCHAR(8), só dígitos | Sim | Não | RN0082 |
| Cidade | `endereco.cidade` | `Endereco.Cidade` | `fornecedor.endereco_cidade` | VARCHAR(60) | Sim | Sim | RN0082, P1.1 |
| Estado | `endereco.estado` | `Endereco.Estado` → `Estado` | `fornecedor.endereco_estado` | CHAR(2), FK `estado` | Sim | Sim | RN0082, P1.1 |
| País | `endereco.pais` | `Endereco.Pais` → `Pais` | `fornecedor.endereco_pais` | CHAR(2), FK `pais` | Sim | Não | RN0082 |

Os sete filtros da busca (código, razão social, nome fantasia, CNPJ, cidade, estado e status) e as sete colunas do resultado (P1.3) estão todos na tabela `fornecedor`. A opção "Todos" do filtro de status não é um valor guardado: significa não filtrar por `status`.

### 1.2 Tela de Inativação e Ativação (11.4)

| Campo da tela | `name` (Etapa 1) | Classe.Atributo (C#) | Tabela.coluna | Tipo e tamanho | Obrig. | Requisito |
|---|---|---|---|---|---|---|
| Categoria (inativação) | `categoria` | `Inativacao.Categoria` → `CategoriaInativacao` | `fornecedor_inativacao.categoria` | VARCHAR(30), FK `categoria_inativacao` | Sim | RN0084, A4.1 |
| Justificativa (inativação) | `justificativa` | `Inativacao.Justificativa` | `fornecedor_inativacao.justificativa` | VARCHAR(255) | Sim | RN0084, A4.1 |
| Categoria (ativação) | `categoria` | `Ativacao.Categoria` → `CategoriaAtivacao` | `fornecedor_ativacao.categoria` | VARCHAR(30), FK `categoria_ativacao` | Sim | RN0085, A5.1 |
| Justificativa (ativação) | `justificativa` | `Ativacao.Justificativa` | `fornecedor_ativacao.justificativa` | VARCHAR(255) | Sim | RN0085, A5.1 |

### 1.3 Atributos que não vêm de campo de tela

| Classe.Atributo (C#) | Tabela.coluna | Tipo | Origem |
|---|---|---|---|
| `Inativacao.Id`, `Ativacao.Id` | `fornecedor_inativacao.id`, `fornecedor_ativacao.id` | BIGINT identity, PK | Chave técnica (D8) |
| `Inativacao.DataHora`, `Ativacao.DataHora` | `.data_hora` | TIMESTAMPTZ | RNF0012, A4.4, A5.4 |
| `Inativacao.Usuario`, `Ativacao.Usuario` | `.usuario` | VARCHAR(100) | RNF0012, A4.4, A5.4 (A5) |
| `Fornecedor.Inativacoes`, `Fornecedor.Ativacoes` | `fornecedor_inativacao.fornecedor_codigo`, `fornecedor_ativacao.fornecedor_codigo` | VARCHAR(10), FK `fornecedor` | RN0084, RN0085 (D3) |
| `LogTransacao.Id` | `log_transacao.id` | BIGINT identity, PK | Chave técnica (D8) |
| `LogTransacao.DataHora` | `log_transacao.data_hora` | TIMESTAMPTZ | RNF0012, P8.3, CA08 |
| `LogTransacao.Usuario` | `log_transacao.usuario` | VARCHAR(100) | RNF0012, P8.3, CA08 (A5) |
| `LogTransacao.Operacao` | `log_transacao.operacao` | VARCHAR(10) | CA08 |
| `LogTransacao.Fornecedor` | `log_transacao.fornecedor_codigo` | VARCHAR(10), FK `fornecedor` | RNF0012 (D7) |
| `LogTransacao.DadosAnteriores`, `.DadosNovos` | `log_transacao.dados_anteriores`, `.dados_novos` | JSONB | RNF0012 "dados alterados" (A4) |
| `TipoTelefone`, `TipoLogradouro`, `Pais`, `CategoriaInativacao`, `CategoriaAtivacao`: `.Codigo`, `.Nome` | `<tabela>.codigo`, `<tabela>.nome` | VARCHAR(30) ou CHAR(2); VARCHAR(60) | Pré-condição 7.2, RNF0013 (D4) |
| `Estado.Sigla`, `Estado.Nome` | `estado.sigla`, `estado.nome` | CHAR(2); VARCHAR(60) | Pré-condição 7.2, RNF0013 (D4) |

## 2. Ajustes de nomes em relação à Etapa 1

Nenhum campo da Etapa 1 foi renomeado. Os nomes do [contrato de integração](../docs/contrato-integracao.md) foram mantidos e só mudam de grafia conforme a convenção de cada camada:

| Camada | Convenção | Exemplo |
|---|---|---|
| HTML/JavaScript (Etapa 1) | camelCase, com ponto para o objeto aninhado | `endereco.tipoLogradouro` |
| Classes C# | PascalCase | `Endereco.TipoLogradouro` |
| Banco de dados | snake_case, com o prefixo do objeto aninhado | `endereco_tipo_logradouro` |

Duas diferenças de forma, sem mudança de nome:

- Nos combobox, o front guarda o código do domínio (`"COMERCIAL"`, `"SP"`). Na classe, o atributo é o objeto de domínio (`TipoTelefone`, `Estado`); no banco, a coluna guarda esse mesmo código como chave estrangeira.
- `status` era o texto `"ATIVO"`/`"INATIVO"` no front. Na classe é o enum `StatusFornecedor`; no banco continua o mesmo texto.

## 3. Requisito → artefato

| Requisito | Onde é atendido no modelo |
|---|---|
| RF0081 Cadastrar | Tabela `fornecedor`; classes `Fornecedor`, `Telefone`, `Endereco` |
| RF0082 Alterar | Mesmas estruturas; propriedades com `set`; `codigo` é a chave e não muda |
| RF0083 Inativar | `fornecedor.status`; tabela `fornecedor_inativacao`; classe `Inativacao` |
| RF0084 Ativar | `fornecedor.status`; tabela `fornecedor_ativacao`; classe `Ativacao` |
| RF0085 Consultar | Os sete filtros de P1.1 são colunas de `fornecedor` (seção 1.1) |
| RNF0011 Tempo de resposta | Índices nas colunas de filtro de `fornecedor`; a medição é da implementação |
| RNF0012 Log de transação | Tabela `log_transacao`; classe `LogTransacao`; `data_hora` e `usuario` também no histórico de status |
| RNF0013 Domínios | `banco/02-dominios.sql` carrega as seis tabelas da pré-condição 7.2 |
| RNF0081 Código único | `pk_fornecedor` em `fornecedor.codigo`, gerado por `seq_fornecedor_codigo` |
| RN0081 Dados obrigatórios | `NOT NULL` e `CHECK (btrim(...) <> '')` em razão social, nome fantasia, CNPJ, e-mail e telefone |
| RN0082 Composição do endereço | `NOT NULL` e `CHECK` nas colunas `endereco_*`; só `endereco_complemento` aceita nulo |
| RN0083 CNPJ único | Índice único `uq_fornecedor_cnpj`, sem filtro por status |
| RN0084 Motivo de inativação | `fornecedor_inativacao.categoria` e `.justificativa` `NOT NULL`; FK para `categoria_inativacao` |
| RN0085 Motivo de ativação | `fornecedor_ativacao.categoria` e `.justificativa` `NOT NULL`; FK para `categoria_ativacao` |
| RN0050 Fornecedor na entrada em estoque | `fornecedor.codigo` é chave primária e pode ser referenciado por chave estrangeira |
| RN0086, CA07 Só fornecedor ativo | `fornecedor.status` permite a verificação no registro da entrada em estoque |
| P8.2 Novo fornecedor ATIVO | `DEFAULT 'ATIVO'` em `fornecedor.status`; construtor de novo `Fornecedor` |
| CA08 Registro em toda escrita | `log_transacao.operacao` aceita INCLUSAO, ALTERACAO, INATIVACAO e ATIVACAO |

## 4. Regra → restrição no banco

Cada restrição abaixo foi exercitada com inserções válidas e inválidas num PostgreSQL de teste.

| Regra | Restrição no DDL |
|---|---|
| RN0081, RN0082: campos obrigatórios | `NOT NULL` em todas as colunas de `fornecedor`, menos `endereco_complemento` |
| RN0081, RN0082: obrigatório não pode ficar em branco | `ck_fornecedor_*_preenchid[ao]` |
| RN0081, RN0082: obrigatório de combobox | `NOT NULL` + `fk_fornecedor_tipo_telefone`, `_tipo_logradouro`, `_estado`, `_pais` |
| Seção 11.3: tamanhos | `VARCHAR(n)` e `CHAR(n)` com o tamanho de cada elemento |
| Seção 11.3: tipo Numérico (DDD, telefone, CEP) | `ck_fornecedor_telefone_ddd_numerico`, `_telefone_numero_numerico`, `_cep_numerico` |
| RN0083: CNPJ único em qualquer status | `uq_fornecedor_cnpj` |
| RNF0081: código único | `pk_fornecedor` |
| P8.2, A4.4, A5.4: status ATIVO ou INATIVO | `ck_fornecedor_status`, `DEFAULT 'ATIVO'` |
| RN0084: categoria e justificativa da inativação | `NOT NULL`, `fk_fornecedor_inativacao_categoria`, `ck_fornecedor_inativacao_justificativa_preenchida` |
| RN0085: categoria e justificativa da ativação | `NOT NULL`, `fk_fornecedor_ativacao_categoria`, `ck_fornecedor_ativacao_justificativa_preenchida` |
| RNF0012: data, hora e usuário | `NOT NULL` em `data_hora` e `usuario` de `fornecedor_inativacao`, `fornecedor_ativacao` e `log_transacao` |
| RNF0012: dados alterados | `dados_novos NOT NULL`; `ck_log_transacao_dados_anteriores` |
| Descrição do UC: fornecedor não é excluído | As chaves estrangeiras do histórico e do log impedem o `DELETE` de fornecedor com registros |
