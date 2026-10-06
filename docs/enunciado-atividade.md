# Enunciado da atividade – CDU01 Manter Cadastro de Fornecedores

Nesta atividade, cada DUPLA (OU INDIVIDUAL) deverá implementar, em HTML, as telas do caso de uso CDU01 Manter Cadastro de Fornecedores, conforme a especificação do caso de uso e o Documento de Requisitos (DRS_LES_2_2026, versão 0.7) disponibilizados junto a esta atividade.

**Importante: esta atividade é a primeira etapa do trabalho final da disciplina.**

O CRUD de fornecedores será o trabalho final da disciplina. Nesta etapa será entregue apenas o front-end, mas ao final do semestre o grupo deverá apresentar a implementação completa, contemplando:

- Todas as funcionalidades do caso de uso implementadas, com acesso a banco de dados.
- A aplicação de todos os design patterns estudados na disciplina.
- Os diagramas de classes e de sequência completos do caso de uso.

Por isso, as telas entregues agora servirão de base para a implementação final. Decisões nesta etapa, como os nomes de campos, a organização das telas e a navegação, devem ser tomadas considerando a evolução do projeto.

## Escopo desta etapa

A implementação deverá contemplar as quatro telas descritas na seção 11 da especificação de caso de uso:

- **Tela de Busca (11.1):** campos código, razão social, nome fantasia, CNPJ, cidade, estado e status e o botão Buscar (P1.1 e P1.2).
- **Tela de Resultado da Busca (11.2):** tabela de resultados e as opções Novo, Visualizar, Alterar, Inativar e Ativar (P1.3 e P2).
- **Tela de Cadastro de Fornecedor (11.3):** dados do fornecedor, telefone e endereço, com as opções Salvar e Cancelar. A mesma tela deve atender à inclusão (P4 e P5), à alteração (A3) e à visualização em modo somente leitura (A1).
- **Tela de Inativação e Ativação (11.4):** categoria, justificativa e opções de Confirmar e Cancelar (A4 e A5).

Para cada tela, os elementos devem seguir exatamente as tabelas de elementos da especificação: nome, tipo de campo, obrigatoriedade, tamanho e comportamento. Os campos obrigatórios devem estar identificados visualmente na tela, conforme as RN0081 e RN0082.

Também devem ser respeitados os comportamentos de interface descritos nos fluxos:

- A opção Novo somente é habilitada após a realização de uma consulta e é desabilitada quando os parâmetros de busca são modificados (P1.3).
- As opções Visualizar e Alterar somente são habilitadas quando um fornecedor é selecionado. A opção Inativar somente está habilitada para fornecedores com status Ativo, e a opção Ativar somente está habilitada para fornecedores com status Inativo (P2).
- O campo Código não é editável em nenhuma tela de cadastro (P4.1 e A3.1).
- Na visualização, todos os campos são exibidos em modo somente leitura (A1.1).
- A navegação entre as telas deve seguir os fluxos principais, alternativos e de exceção da especificação, incluindo os retornos indicados em cada fluxo (por exemplo, Cancelar volta à busca).

Como ainda não haverá acesso ao banco de dados, os fornecedores exibidos no resultado da busca e os valores das listas (tipos de telefone, tipos de logradouro, estados, países e categorias) podem ser definidos no próprio código HTML ou JavaScript.

## Fora do escopo desta etapa

A persistência dos dados (P8), a verificação de unicidade do CNPJ (P7 e E2), a geração do código do fornecedor (RNF0081), o registro de log (RNF0012) e o tempo de resposta das consultas (RNF0011) dependem do back-end e serão cobrados apenas na entrega final.

## Regras gerais

A especificação de caso de uso e o DRS são as únicas referências para esta implementação. Não devem ser incluídos campos, telas ou comportamentos que não estejam previstos nesses documentos. Caso o grupo identifique alguma ambiguidade ou inconsistência, deve registrá-la e comunicá-la ao professor, e não resolvê-la por suposição.
