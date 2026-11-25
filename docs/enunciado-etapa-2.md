# Enunciado da atividade – Etapa 2: modelo de dados e classes de domínio

Nesta atividade, cada DUPLA (OU INDIVIDUAL) deverá modelar o banco de dados e as classes de domínio necessários para implementar o caso de uso CDU01 Manter Cadastro de Fornecedores, conforme a especificação do caso de uso e o Documento de Requisitos, ambos utilizados na atividade anterior (Etapa 1).

**Importante: esta atividade é a segunda etapa do trabalho final da disciplina.**

O modelo de dados e as classes entregues agora servirão de base para a camada de persistência e a camada de domínio da implementação final. Por isso, devem ser coerentes com as telas entregues na Etapa 1: cada campo das telas deve ter um atributo correspondente nas classes e uma coluna correspondente no banco de dados. Caso o grupo identifique a necessidade de ajustar o nome de algum campo da Etapa 1, o ajuste deve ser realizado e registrado.

## Escopo desta etapa

1. **Modelo de dados (MER/DER):** diagrama que contempla todas as entidades necessárias ao caso de uso, com atributos, tipos, tamanhos, chaves primárias, chaves estrangeiras e cardinalidades. Os tamanhos e a obrigatoriedade devem seguir as tabelas de elementos da seção 11 da especificação.
2. **Script DDL:** script SQL de criação das tabelas, com as restrições que garantem as regras do caso de uso no próprio banco, entre elas a obrigatoriedade dos campos (RN0081 e RN0082), a unicidade do CNPJ independentemente do status (RN0083) e a unicidade do código do fornecedor (RNF0081).
3. **Script de domínios (RNF0013):** script SQL de carga das tabelas de domínio citadas na pré-condição 7.2: categorias de inativação, categorias de ativação, tipos de telefone, tipos de logradouro, estados e países.
4. **Diagrama de classes de domínio:** classes que representam os conceitos do caso de uso, com atributos, tipos, associações, multiplicidades e navegabilidade.
5. **Implementação das classes de domínio:** código das classes do diagrama, na linguagem adotada para o projeto, com atributos, construtores e métodos de acesso.

## Pontos que o modelo deve contemplar

1. Os dados cadastrais do fornecedor, o telefone (tipo, DDD e número) e o endereço (P4.1, P4.2 e P4.3).
2. O status do fornecedor (ATIVO ou INATIVO) e a categoria e a justificativa de cada inativação e ativação (A4.4, A5.4, RN0084 e RN0085).
3. O registro de data, hora, usuário responsável e dados alterados em toda inclusão, alteração, inativação e ativação (RNF0012 e CA08).
4. A possibilidade de a entrada em estoque referenciar o fornecedor e verificar seu status (RN0050 e RN0086). Não é necessário modelar a entrada em estoque; basta garantir que o modelo do fornecedor permita essa relação.
5. Todos os filtros da tela de busca (P1.1) devem ser atendidos pelo modelo.

## Fora do escopo desta etapa

A implementação da persistência (DAOs ou equivalentes), as classes de controle e de visão, a aplicação dos design patterns e os diagramas de sequência serão cobrados posteriormente. Nesta etapa, as classes devem conter apenas a representação do domínio.

## Regras gerais

A especificação de caso de uso e o DRS são as únicas referências para esta modelagem. Não devem ser incluídos entidades, atributos ou regras que não estejam previstos nesses documentos. Caso o grupo identifique alguma ambiguidade ou inconsistência, deve registrá-la e comunicá-la ao professor, e não resolvê-la por suposição. Toda decisão de modelagem que não decorra diretamente dos documentos (por exemplo, a forma de guardar o histórico de status) deve ser justificada com referência ao requisito que a motivou.

## Entrega

Um arquivo .zip, nomeado com a identificação da dupla, contendo: o diagrama de dados e o diagrama de classes (em imagem ou PDF), os scripts SQL de criação e de domínios, o código das classes, a matriz de rastreabilidade e o registro de ambiguidades e decisões.
