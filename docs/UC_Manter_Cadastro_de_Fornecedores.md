# Especificação de Caso de Uso – CDU01 Manter Cadastro de Fornecedores

> Conversão automática para Markdown de `originais/UC_Manter_Cadastro_de_Fornecedores.docx`. Em caso de divergência, vale o documento original.

Especificação de Caso de Uso

E-COMMERCE DE LIVROS

Laboratório de Engenharia de Software

Histórico de Versões

| Data | Versão | Descrição | Autor | Revisor |  |
|---|---|---|---|---|---|
| 30/09/26 | 1.0 | Versão inicial da especificação do caso de uso Manter Cadastro de Fornecedores | Rodrigo Rocha Silva |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

| Cliente | FATEC  - Interno |
|---|---|
| Documento | Especificação de Caso de Uso: Manter Cadastro de Fornecedores |
| Data | 30 de setembro de 2026 |
| Autor(es) | Rodrigo Rocha Silva <br> rrochas@gmail.com |

Página de Assinaturas

| Revisado e Aprovado por: |  |  |
|---|---|---|
|  |  | dd.mm.aa |
| Revisado e Aprovado por: |  |  |
|  |  | dd.mm.aa |
| Revisado e Aprovado por: |  |  |
|  |  | dd.mm.aa |
| Revisado e Aprovado por: |  |  |
|  |  | dd.mm.aa |
| Revisado e Aprovado por: |  |  |
|  |  | dd.mm.aa |

Histórico de Versões

| Data | Versão | Descrição | Autor | Revisor |  |
|---|---|---|---|---|---|
| 30/09/26 | 1.0 | Versão inicial da especificação do caso de uso Manter Cadastro de Fornecedores | Rodrigo Rocha Silva |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

Índice

## Nome do Caso de Uso

CDU01 – Manter Cadastro de Fornecedores

## Objetivo

Este caso de uso tem como objetivo prover uma solução computacional capaz de manter o cadastro de fornecedores do e-commerce de livros, incluindo as funcionalidades de inserção (fluxo principal), consulta, visualização, alteração, inativação e ativação de fornecedores.

## Descrição

Através do cadastro de fornecedores é possível manter as informações das empresas que fornecem os livros comercializados pelo e-commerce. O fornecedor é a origem dos itens que entram no estoque da livraria, sendo informação obrigatória em toda entrada em estoque (RN0050).

No cadastro de fornecedores é possível informar a razão social, o nome fantasia, o CNPJ, o e-mail, o telefone e o endereço de cada fornecedor. Todo fornecedor recebe um código único gerado pelo sistema, e não é permitido o cadastro de dois fornecedores com o mesmo CNPJ.

É possível incluir, consultar, visualizar, alterar, inativar e ativar fornecedores. O fornecedor não é excluído da base: quando deixa de fornecer para a livraria, ele é inativado mediante categoria e justificativa, preservando o histórico das entradas em estoque já realizadas, e deixa de estar disponível para novas entradas em estoque.

## Requisitos Funcionais

### RF0081 – Cadastrar fornecedor

### RF0082 – Alterar cadastro de fornecedor

### RF0083 – Inativar cadastro de fornecedor

### RF0084 – Ativar cadastro de fornecedor

### RF0085 – Consulta de fornecedores

## Tipo de Caso de Uso

| X | Concreto (Iniciado diretamente por um Ator) |
|---|---|
|  | Abstrato (Não iniciado diretamente por um Ator. Geralmente relacionado a outro Caso de Uso) |

## Atores

| Nome Ator | Tipo |  |
|---|---|---|
|  | Primário | Secundário |
| Administrador | X |  |

## Pré-condições

### Permissão de Usuário

O usuário deve estar autenticado no sistema com perfil de administrador e ter permissão para executar as operações.

### Domínios Cadastrados

As categorias de inativação e de ativação de fornecedores, os tipos de telefone, os tipos de logradouro, os estados e os países devem estar previamente cadastrados por meio do script de implantação de domínios (RNF0013).

## Fluxo Principal

P1.  Iniciação

P1.1. O sistema oferece uma interface de busca ao usuário, com os campos código, razão social, nome fantasia, CNPJ, cidade, estado e status (Ativo, Inativo ou Todos) como parâmetros. Os parâmetros podem ser utilizados de forma combinada ou isolada (RF0085).

P1.2. O usuário solicita a busca com base nos parâmetros informados. O sistema deve responder à consulta em no máximo 1 segundo (RNF0011).

P1.3. O sistema exibe uma lista de fornecedores e, para cada registro retornado na busca: o código, a razão social, o nome fantasia, o CNPJ, a cidade, o estado e o status. (E3)

O usuário pode selecionar somente um fornecedor listado.

Após a consulta o sistema habilita a opção “Novo”, que permite ao usuário preencher um novo cadastro de fornecedor, caso os registros retornados não o satisfaçam. Caso o CNPJ tenha sido utilizado como parâmetro da consulta, ele será recuperado no preenchimento do novo cadastro.

No caso de o usuário modificar os parâmetros da consulta, não será permitido inserir um novo fornecedor até que seja realizada uma nova busca.

P2. Preparar operação de manutenção

Para o fornecedor selecionado no passo anterior, são apresentadas as opções abaixo.

- Caso a opção escolhida seja Novo, segue P3.
- Caso a opção escolhida seja Visualizar, segue A2 e em seguida A1.
- Caso a opção escolhida seja Alterar, segue A2 e em seguida A3.
- Caso a opção escolhida seja Inativar, segue A2 e em seguida A4.
- Caso a opção escolhida seja Ativar, segue A2 e em seguida A5.

A opção “Novo” somente é habilitada após a realização da consulta. As opções “Visualizar” e “Alterar” somente são habilitadas quando um fornecedor for selecionado. A opção “Inativar” somente é habilitada para fornecedores com status ATIVO, e a opção “Ativar” somente para fornecedores com status INATIVO.

P3.  Exibir identificação do usuário

São exibidas, em todas as telas do cadastro, as informações do usuário autenticado que está realizando a operação.

P4. Exibir campos de dados cadastrais

P4.1. O sistema oferece o campo não editável Código do Fornecedor, gerado pelo sistema no momento da persistência (RNF0081), e os campos razão social, nome fantasia, CNPJ e e-mail. Caso o CNPJ tenha sido informado na consulta, o campo é preenchido com o valor utilizado.

P4.2. O sistema oferece um conjunto de campos de telefone: tipo, DDD e número (RN0081).

P4.3. O sistema oferece um conjunto de campos de endereço: tipo de logradouro, logradouro, número, complemento, bairro, CEP, cidade, estado e país (RN0082).

Todos os campos, com exceção de complemento, são considerados de preenchimento obrigatório.

P5.  Concluir inserção do fornecedor

O sistema exibe as opções:

- Salvar,
- Cancelar.

Caso seja escolhida a opção ‘a’, segue P6.

Caso seja escolhida a opção ‘b’, os dados informados são descartados e o fluxo volta a P1.2.

P6.  Verificar dados obrigatórios

O sistema verifica se todas as informações obrigatórias foram preenchidas, conforme RN0081 e RN0082.

Caso a verificação retorne que não houve nenhum erro, segue P7. (E1)

P7.  Verificar unicidade do CNPJ

O sistema verifica se já existe outro fornecedor cadastrado com o mesmo CNPJ, independentemente do seu status (RN0083).

Caso não exista, segue P8. (E2)

P8. Persistir dados do fornecedor

P8.1. O sistema persiste os dados cadastrais do fornecedor. Caso seja um novo cadastro, é gerado um novo Código do Fornecedor, persistido juntamente com o fornecedor (RNF0081). O sistema exibe ao usuário este código e a mensagem de operação efetuada com sucesso.

P8.2. Caso seja um novo cadastro, o sistema atribui o status ATIVO ao fornecedor. Na alteração de um fornecedor já cadastrado, o status atual é mantido.

P8.3. O sistema registra a data, a hora e o usuário responsável pela operação, mantendo os dados alterados (RNF0012).

P8.4. Volta a P1.2.

## Fluxos Alternativos

A1.  Visualizar Fornecedor

Este passo é executado a partir do passo P2 quando escolhida a opção ‘b’.

A1.1. O sistema exibe os dados recuperados no passo A2, utilizando os campos descritos em P4, além do status do fornecedor. Todos os campos são exibidos no modo “somente leitura”.

A1.2. Volta a P1.2.

A2. Consultar fornecedor pontual

Este passo é executado a partir do passo P2 quando escolhida a opção ‘b’, ‘c’, ‘d’ ou ‘e’.

A2.1. O sistema executa uma consulta pontual do fornecedor selecionado no passo P1.3, trazendo todos os dados deste fornecedor. Segue para o fluxo determinado em P2.

A3.  Alterar Fornecedor

Este passo é executado a partir do passo P2 quando escolhida a opção ‘c’.

A3.1. O sistema exibe para edição os dados recuperados no passo A2, utilizando os campos descritos em P4. O Código do Fornecedor permanece não editável.

A3.2. O sistema permite as seguintes opções ao usuário:

- Salvar,
- Cancelar.

Caso seja escolhida a opção ‘a’, vai para o passo P6. Na verificação do passo P7, o próprio fornecedor em alteração é desconsiderado.

Caso seja escolhida a opção ‘b’, as alterações são descartadas e o fluxo volta a P1.2.

A4.  Inativar Fornecedor

Este passo é executado a partir do passo P2 quando escolhida a opção ‘d’, somente para fornecedores com status ATIVO.

A4.1. O sistema solicita ao usuário a categoria de inativação e a justificativa da inativação (RN0084).

A4.2. O sistema exibe as opções Confirmar e Cancelar. Caso o usuário escolha Cancelar, volta a P1.2. Caso escolha Confirmar, segue A4.3.

A4.3. O sistema verifica se a categoria e a justificativa foram informadas. (E4)

A4.4. O sistema altera o status do fornecedor para INATIVO, persiste a categoria e a justificativa informadas e registra a data, a hora e o usuário responsável (RNF0012). A partir deste momento, o fornecedor não pode ser informado em novas entradas em estoque (RN0086).

A4.5. O sistema emite mensagem de operação efetuada com sucesso e volta a P1.2.

A5.  Ativar Fornecedor

Este passo é executado a partir do passo P2 quando escolhida a opção ‘e’, somente para fornecedores com status INATIVO.

A5.1. O sistema solicita ao usuário a categoria de ativação e a justificativa da ativação (RN0085).

A5.2. O sistema exibe as opções Confirmar e Cancelar. Caso o usuário escolha Cancelar, volta a P1.2. Caso escolha Confirmar, segue A5.3.

A5.3. O sistema verifica se a categoria e a justificativa foram informadas. (E4)

A5.4. O sistema altera o status do fornecedor para ATIVO, persiste a categoria e a justificativa informadas e registra a data, a hora e o usuário responsável (RNF0012). A partir deste momento, o fornecedor volta a poder ser informado em entradas em estoque (RN0086).

A5.5. O sistema emite mensagem de operação efetuada com sucesso e volta a P1.2.

## Fluxos de Exceção

E1. Dados Obrigatórios não Preenchidos

Este fluxo é executado a partir do passo P6. O sistema exibe os campos obrigatórios não preenchidos e retorna ao passo P4, ou ao passo A3.1 no caso de alteração, mantendo os dados já digitados.

E2. CNPJ já Cadastrado

Este fluxo é executado a partir do passo P7. O sistema exibe mensagem informando que o CNPJ já está cadastrado, indicando o código do fornecedor existente, e retorna ao passo P4, ou ao passo A3.1 no caso de alteração, mantendo os dados já digitados.

E3. Nenhum Fornecedor Encontrado

Este fluxo é executado a partir do passo P1.3, quando nenhum fornecedor satisfaz os parâmetros informados. O sistema exibe, na própria tela de pesquisa, mensagem informando que não foram encontrados fornecedores e habilita a opção “Novo”, conforme descrito em P1.3.

E4. Categoria ou Justificativa não Informada

Este fluxo é executado a partir do passo A4.3 ou A5.3. O sistema exibe mensagem indicando o campo não informado e retorna ao passo A4.1 ou A5.1, conforme o fluxo de origem.

## Protótipos de Tela

### Protótipo da Tela de Busca

Através da tela de pesquisa de fornecedores é possível verificar se um fornecedor já possui cadastro no sistema antes de realizar um novo cadastro.

| Elemento | Tipo | Status | Tam | Comportamento |
|---|---|---|---|---|
| Código | Alfanumérico | Opcional | 10 | Filtra os fornecedores pelo código informado (P1.1). |
| Razão Social | Alfanumérico | Opcional | 100 | Filtra os fornecedores pela razão social informada (P1.1). |
| Nome Fantasia | Alfanumérico | Opcional | 60 | Filtra os fornecedores pelo nome fantasia informado (P1.1). |
| CNPJ | Alfanumérico | Opcional | 18 | Filtra os fornecedores pelo CNPJ informado. Quando informado, é recuperado no preenchimento de um novo cadastro (P1.3). |
| Cidade | Alfanumérico | Opcional | 60 | Filtra os fornecedores pela cidade do endereço (P1.1). |
| Estado | Combobox | Opcional | - | Filtra os fornecedores pelo estado do endereço. Assume os dados da tabela de estados. |
| Status | Combobox | Obrigatório | - | Opções Ativo, Inativo e Todos. Valor padrão: Todos. |
| Buscar | Botão | Default | - | Corresponde ao fluxo P1.2. Permissão de Acesso: FORNECEDOR_CONSULTAR |

### Protótipo da Tela de Resultado da Busca

Nesta pesquisa o resultado é exibido em uma estrutura de tabela, onde para selecionar um fornecedor basta selecionar o seu registro.

As opções Novo, Visualizar, Alterar, Inativar e Ativar são exibidas acima da tabela com o resultado. A opção Novo é habilitada após a realização da consulta. As opções Visualizar e Alterar são habilitadas apenas quando um registro for selecionado. A opção Inativar é habilitada apenas para registros com status Ativo, e a opção Ativar apenas para registros com status Inativo, sempre de acordo com a permissão de acesso do usuário.

Quando não forem encontrados fornecedores que satisfaçam os critérios de pesquisa informados, é exibida uma mensagem na própria tela de pesquisa informando ao usuário que não foram encontrados fornecedores (E3).

| Elemento | Tipo | Status | Tam | Comportamento |
|---|---|---|---|---|
| Resultado da Busca | Tabela | - | - | Exibe código, razão social, nome fantasia, CNPJ, cidade, estado e status de cada fornecedor retornado. Permite a seleção de somente um registro (P1.3). |
| Novo | Botão | Condicional | - | Corresponde ao passo P2, opção ‘a’. Permissão de Acesso: FORNECEDOR_INCLUIR |
| Visualizar | Botão | Condicional | - | Corresponde ao passo P2, opção ‘b’. Permissão de Acesso: FORNECEDOR_CONSULTAR |
| Alterar | Botão | Condicional | - | Corresponde ao passo P2, opção ‘c’. Permissão de Acesso: FORNECEDOR_ALTERAR |
| Inativar | Botão | Condicional | - | Corresponde ao passo P2, opção ‘d’. Permissão de Acesso: FORNECEDOR_INATIVAR |
| Ativar | Botão | Condicional | - | Corresponde ao passo P2, opção ‘e’. Permissão de Acesso: FORNECEDOR_ATIVAR |

### Protótipo da Tela de Cadastro de Fornecedor

A tela de cadastro é utilizada na inclusão (P4) e na alteração (A3) de fornecedores. Na visualização (A1), os mesmos campos são exibidos no modo somente leitura.

| Elemento | Tipo | Status | Tam | Comportamento |
|---|---|---|---|---|
| Código | Alfanumérico | Não editável | 10 | Gerado pelo sistema na persistência de um novo fornecedor (P8.1, RNF0081). |
| Razão Social | Alfanumérico | Obrigatório | 100 | Razão social do fornecedor (RN0081). |
| Nome Fantasia | Alfanumérico | Obrigatório | 60 | Nome fantasia do fornecedor (RN0081). |
| CNPJ | Alfanumérico | Obrigatório | 18 | Não pode repetir o CNPJ de outro fornecedor (P7, RN0083). Preenchido com o valor da consulta, quando informado. |
| E-mail | Alfanumérico | Obrigatório | 100 | E-mail do fornecedor (RN0081). |
| Tipo de Telefone | Combobox | Obrigatório | - | Assume os dados da tabela de tipos de telefone (RN0081). |
| DDD | Numérico | Obrigatório | 2 | DDD do telefone (RN0081). |
| Número do Telefone | Numérico | Obrigatório | 9 | Número do telefone (RN0081). |
| Tipo de Logradouro | Combobox | Obrigatório | - | Assume os dados da tabela de tipos de logradouro (RN0082). |
| Logradouro | Alfanumérico | Obrigatório | 100 | Logradouro do endereço (RN0082). |
| Número | Alfanumérico | Obrigatório | 10 | Número do endereço (RN0082). |
| Complemento | Alfanumérico | Opcional | 60 | Complemento do endereço (RN0082). |
| Bairro | Alfanumérico | Obrigatório | 60 | Bairro do endereço (RN0082). |
| CEP | Numérico | Obrigatório | 8 | CEP do endereço (RN0082). |
| Cidade | Alfanumérico | Obrigatório | 60 | Cidade do endereço (RN0082). |
| Estado | Combobox | Obrigatório | - | Assume os dados da tabela de estados (RN0082). |
| País | Combobox | Obrigatório | - | Assume os dados da tabela de países (RN0082). |
| Salvar | Botão | Default | - | Corresponde ao passo P5, opção ‘a’, ou A3.2, opção ‘a’. Permissão de Acesso: FORNECEDOR_INCLUIR ou FORNECEDOR_ALTERAR |
| Cancelar | Botão | - | - | Corresponde ao passo P5, opção ‘b’, ou A3.2, opção ‘b’. |

### Protótipo da Tela de Inativação e Ativação

A mesma tela é utilizada na inativação (A4) e na ativação (A5) de fornecedores, alterando o título e as categorias disponíveis conforme a operação.

| Elemento | Tipo | Status | Tam | Comportamento |
|---|---|---|---|---|
| Categoria | Combobox | Obrigatório | - | Categorias de inativação (A4.1, RN0084) ou de ativação (A5.1, RN0085), carregadas como domínio (RNF0013). |
| Justificativa | Texto | Obrigatório | 255 | Justificativa da inativação (RN0084) ou da ativação (RN0085). |
| Confirmar | Botão | Default | - | Corresponde ao passo A4.2 ou A5.2. Permissão de Acesso: FORNECEDOR_INATIVAR ou FORNECEDOR_ATIVAR |
| Cancelar | Botão | - | - | Corresponde ao passo A4.2 ou A5.2. Volta a P1.2. |

## Pós-condições

### Fornecedor Cadastrado ou Alterado

O fornecedor terá sido cadastrado com código único e status ATIVO, ou terá seus dados cadastrais alterados, com o registro da operação em log.

### Fornecedor Inativado ou Ativado

O fornecedor terá seu status alterado para INATIVO ou ATIVO, com a categoria e a justificativa da operação registradas.

### Fornecedor Visualizado

O fornecedor terá sido visualizado, sem nenhuma alteração em seus dados.

## Requisitos Não-Funcionais

### RNF0011 – Tempo de resposta para consultas

### RNF0012 – Log de transação

### RNF0013 – Cadastro de domínios

### RNF0081 – Código de fornecedor

## Ponto de Extensão

Não há pontos de extensão para este caso de uso.

## Critérios de Aceite

CA01. Um novo fornecedor com todos os dados obrigatórios preenchidos é persistido com código único e status ATIVO (P8.1, P8.2).

CA02. Um fornecedor com algum dado obrigatório não preenchido não é persistido, e o sistema indica os campos pendentes (E1).

CA03. O sistema não permite a inclusão nem a alteração de um fornecedor com CNPJ já utilizado por outro fornecedor, ativo ou inativo (E2).

CA04. A consulta aceita qualquer parâmetro de forma isolada ou combinada e responde em no máximo 1 segundo (P1.1, P1.2).

CA05. A opção Novo somente é habilitada após a realização de uma consulta e é desabilitada quando os parâmetros são modificados (P1.3).

CA06. A inativação e a ativação somente são concluídas com a categoria e a justificativa informadas (A4, A5, E4).

CA07. Um fornecedor com status INATIVO não pode ser informado em uma entrada em estoque (A4.4).

CA08. Toda inclusão, alteração, inativação e ativação registra data, hora, usuário responsável e dados alterados (P8.3, A4.4, A5.4).

## Observações

### Prioridade de desenvolvimento

- Alta

### Dependência com o controle de estoque

O cadastro de fornecedores é pré-requisito para a entrada em estoque, que exige a indicação do fornecedor (RN0050). Somente fornecedores com status ATIVO podem ser informados nessa operação (RN0086).

### Regras de negócio aplicadas

### RN0081 – Dados obrigatórios para o cadastro de um fornecedor

### RN0082 – Composição do endereço de fornecedor

### RN0083 – CNPJ único

### RN0084 – Associar motivo de inativação de fornecedor

### RN0085 – Associar motivo de ativação de fornecedor

### RN0086 – Fornecedor ativo para entrada em estoque

## Referências

- Documento de Requisitos de Software do E-commerce de Livros (DRS_LES_2_2026): grupos Geral, Cadastro de Fornecedores e Controle de estoque.
- Template de Especificação de Caso de Uso da FATEC (UC_FATEC).