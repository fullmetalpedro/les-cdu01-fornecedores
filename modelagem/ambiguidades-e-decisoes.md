# Registro de ambiguidades e decisões – CDU01, Etapa 2

Referências: [especificação do caso de uso](../docs/UC_Manter_Cadastro_de_Fornecedores.md) e [DRS v0.7](../docs/DRS_LES_2_2026.md).

## 1. Ambiguidades e inconsistências (a comunicar ao professor)

Nenhuma delas foi resolvida por suposição. Onde o modelo precisava de algum valor para existir, a coluna "Como está no modelo" diz o que foi adotado de forma provisória e o que muda conforme a resposta.

| # | Onde | Ambiguidade ou inconsistência | Como está no modelo (provisório) |
|---|---|---|---|
| A1 | Pré-condição 7.2, RNF0013 | Os documentos não listam os valores das categorias de inativação, das categorias de ativação, dos tipos de telefone, dos tipos de logradouro nem dos países. | `02-dominios.sql` carrega os mesmos valores exibidos nos combobox da Etapa 1. Trocar os valores não altera a estrutura. |
| A2 | Seção 11.3, RNF0081 | O código é "Alfanumérico, tamanho 10, gerado pelo sistema", mas o formato não é definido. | Formato `FOR-000000` da Etapa 1, gerado por sequência. Outro formato muda só o `DEFAULT` da coluna. |
| A3 | Seções 11.1 e 11.3, RN0083 | O CNPJ é "Alfanumérico, tamanho 18". O tamanho sugere o valor com máscara (`00.000.000/0000-00`), mas os documentos não dizem se o valor é guardado com ou sem máscara nem se o dígito verificador deve ser validado. | A coluna aceita até 18 caracteres, sem impor máscara nem validar dígito. A unicidade ignora a pontuação (D5). |
| A4 | RNF0012, P8.3, CA08 | "Manter os dados alterados" não diz se é o valor anterior, o novo ou os dois, nem se são todos os dados do fornecedor ou só os campos que mudaram. | `log_transacao` tem `dados_anteriores` e `dados_novos`, o que atende a qualquer das leituras. O conteúdo de cada um será definido na implementação, conforme a resposta. |
| A5 | P3, RNF0012, pré-condição 7.1 | O "usuário responsável" e as "informações do usuário autenticado" são citados, mas nenhum documento define a entidade usuário, seus atributos ou seu cadastro (o DRS só trata de senha no grupo de clientes). | A coluna `usuario VARCHAR(100)` guarda a identificação do usuário, sem chave estrangeira. Nenhuma tabela de usuário foi criada. Se houver uma entidade usuário, a coluna passa a ser chave estrangeira. |
| A6 | Seção 11.3, pré-condição 7.2 | Estado e país são domínios independentes e ambos obrigatórios. Os documentos não dizem se a tabela de estados se relaciona com a de países nem qual estado informar para um fornecedor de outro país. | `estado` e `pais` não se relacionam; a carga tem os 27 estados do Brasil. |
| A7 | Seção 11.3 | DDD (2), Número do Telefone (9) e CEP (8) são "Numérico". Não está dito se o tamanho é exato ou máximo. | O banco aceita de 1 dígito até o tamanho indicado. Se o tamanho for exato, muda só a expressão do `CHECK`. |
| A8 | P1.1, RF0085 | Não está dito se os filtros de texto (razão social, nome fantasia, cidade) comparam o valor inteiro ou parte dele, nem se diferenciam maiúsculas e acentos. | Não afeta as tabelas. Afeta a consulta e o tipo de índice, que são da próxima etapa. |
| A9 | DRS, RNF0013 | A RNF0013 está no grupo "Cadastro de Livros" e cita "fornecedor" como exemplo de tabela de domínio a ser carregada pelo script. No caso de uso, o fornecedor é um cadastro mantido pelo administrador, e a pré-condição 7.2 não o inclui entre os domínios. | O script de domínios não insere fornecedores; carrega só as seis tabelas da pré-condição 7.2. |
| A10 | P8.2, RN0085 | O novo fornecedor recebe o status ATIVO na inclusão. A RN0085 exige categoria e justificativa para "todo fornecedor que for ativado", e a tela de inclusão não tem esses campos. | A inclusão não gera registro em `fornecedor_ativacao`; fica registrada no log como INCLUSAO. |

## 2. Decisões de modelagem que não decorrem diretamente dos documentos

| # | Decisão | Justificativa | Requisito |
|---|---|---|---|
| D1 | Telefone e endereço são colunas da tabela `fornecedor` (prefixos `telefone_` e `endereco_`), e não tabelas separadas. Nas classes, continuam sendo `Telefone` e `Endereco`, em composição com `Fornecedor`. | Os documentos preveem um telefone e um endereço por fornecedor, ambos obrigatórios. Na mesma tabela, o `NOT NULL` garante no próprio banco que não existe fornecedor sem telefone ou sem endereço; em tabelas separadas, essa garantia dependeria da aplicação. Os filtros por cidade e estado também ficam numa consulta de uma tabela só. | RN0081, RN0082, P1.1, RNF0011 |
| D2 | `fornecedor.codigo` é a chave primária. Não há identificador numérico adicional. | O código já é único e gerado pelo sistema. Um segundo identificador seria um atributo não previsto. É também a coluna que a entrada em estoque vai referenciar. | RNF0081, RN0050 |
| D3 | O histórico de status fica em duas tabelas, `fornecedor_inativacao` e `fornecedor_ativacao`, com uma linha por ocorrência. O status atual continua em `fornecedor.status`. | A categoria e a justificativa são de cada inativação e de cada ativação, então um par de colunas no fornecedor perderia as ocorrências anteriores. Duas tabelas permitem que cada uma tenha chave estrangeira obrigatória para o seu próprio domínio de categorias. O status atual na tabela `fornecedor` atende ao filtro da busca e à verificação da entrada em estoque sem consultar o histórico. | A4.4, A5.4, RN0084, RN0085, P1.1, RN0086 |
| D4 | As tabelas de domínio têm `codigo` (chave) e `nome`; `estado` usa `sigla`. Os tamanhos (30, 2 e 60) foram definidos pela dupla. | A seção 11 não dá tamanho para os combobox. O código é o valor que os combobox da Etapa 1 já enviam, então a tela não muda. | Pré-condição 7.2, RNF0013 |
| D5 | A unicidade do CNPJ é um índice único sobre o CNPJ sem pontuação e em maiúsculas, sem filtro por status. | Com uma restrição simples sobre o texto, `12.345.678/0001-90` e `12345678000190` seriam aceitos como CNPJs diferentes (A3). Sem filtro por status, a regra vale para ativos e inativos. | RN0083, P7, CA03 |
| D6 | DDD, número do telefone e CEP são `VARCHAR` com `CHECK` de só dígitos; nas classes, `string`. | São identificadores, não quantidades. Um tipo numérico perderia o zero à esquerda de CEPs como `01010000`. | Seção 11.3 |
| D7 | O log é uma tabela própria, `log_transacao`, ligada ao fornecedor, com a operação e os dados em JSONB. | O log cobre as quatro operações de escrita, e duas delas (inclusão e alteração) não têm histórico de status. JSONB guarda os dados alterados sem uma coluna por campo. A tabela se limita ao fornecedor porque é o único cadastro deste caso de uso. | RNF0012, P8.3, CA08 |
| D8 | `fornecedor_inativacao`, `fornecedor_ativacao` e `log_transacao` têm chave técnica `id` (identity). | Essas tabelas não têm chave natural: o mesmo fornecedor pode ter várias linhas, e data e hora não garantem unicidade. | A4.4, A5.4, RNF0012 |
| D9 | Data e hora ficam numa única coluna `TIMESTAMPTZ`; nas classes, `DateTimeOffset`. | Um único valor registra a data e a hora sem depender do fuso do servidor. | RNF0012 |
| D10 | Data, hora e usuário aparecem no histórico de status e também no log. | O histórico atende à RN0084, à RN0085 e à pós-condição 13.2 (motivo de cada mudança de status). O log atende à RNF0012 (dados alterados em toda escrita). Cada um pode ser consultado sem o outro. | RN0084, RN0085, RNF0012 |
| D11 | A entrada em estoque não foi modelada. O DDL traz, em comentário, a chave estrangeira que ela terá. | O enunciado pede apenas que o modelo permita a relação. | RN0050, RN0086 |
| D12 | Índices nas colunas de filtro da busca que não são chave. | Apoio ao tempo de resposta. O tipo definitivo de índice depende de A8. | RNF0011, P1.1 |
| D13 | As classes têm só propriedades e construtores, sem regras de validação. `Fornecedor.Codigo` aceita nulo. | O enunciado restringe esta etapa à representação do domínio. Em C#, as propriedades são os métodos de acesso. O código só existe depois da persistência. | Enunciado, P8.1 |
| D14 | Linguagem C# (.NET 10) e banco PostgreSQL. | Escolha da dupla para o projeto. | Enunciado |

## 3. Limite conhecido desta etapa

O banco não impede, sozinho, que `fornecedor.status` seja alterado sem a linha correspondente em `fornecedor_inativacao` ou `fornecedor_ativacao`. As duas escritas (e a do log) devem ocorrer na mesma transação, o que é responsabilidade da camada de persistência da próxima etapa.

## 4. Decisões da implementação (Etapa 3)

| # | Decisão | Justificativa | Requisito |
|---|---|---|---|
| D15 | Os filtros de texto da busca (código, razão social, nome fantasia e cidade) encontram o valor em qualquer parte do campo, sem diferenciar maiúsculas e acentos. O CNPJ é comparado só pelos dígitos. O DDL passa a criar a extensão `unaccent`. | Mantém o comportamento da Etapa 1 enquanto A8 não for respondida. | P1.1, RF0085, A8 |
| D16 | O usuário autenticado (nome, perfil e permissões) vem da configuração do servidor (`appsettings.json`). O nome é o valor gravado como usuário responsável. | A autenticação é pré-condição do caso de uso e nenhum documento define a entidade usuário. | Pré-condição 7.1, P3, RNF0012, A5 |
| D17 | O log guarda o fornecedor completo antes (`dados_anteriores`) e depois (`dados_novos`) de cada operação. | Atende às duas leituras de "manter os dados alterados" enquanto A4 não for respondida. | RNF0012, CA08, A4 |
| D18 | As permissões das tabelas da seção 11 são verificadas na tela (botões desabilitados) e no servidor (resposta 403). | A tela sozinha não impede uma chamada direta à API. | Seção 11 |
| D19 | Depois de salvar, inativar ou ativar, a tela de busca exibe a mensagem de sucesso com o código do fornecedor num toast, que fecha sozinho em 5 segundos, pelo botão ou numa nova busca. | P8.1, A4.5 e A5.5 pedem a mensagem; a busca é o destino de P8.4, A4.5 e A5.5. | P8.1, P8.4, A4.5, A5.5 |
| D20 | A alteração de um fornecedor inexistente e a inativação ou ativação de um fornecedor que já está no status de destino são recusadas pelo servidor. | A2 exige a consulta pontual antes da operação, e A4 e A5 valem só para ATIVO e INATIVO, respectivamente. | A2, A4, A5 |
