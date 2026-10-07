# Prompt usado para gerar o design no Pencil

Este é o prompt que gerou as telas de `design/`. Ele fica registrado para referência e para regerar o design se a especificação mudar.

```text
CONTEXTO DA ATIVIDADE
Atividade da disciplina LES (FATEC, 2026), feita em dupla ou individual: implementar em HTML as
telas do caso de uso CDU01 – Manter Cadastro de Fornecedores do E-commerce de Livros.
Este design é a base visual dessa implementação. A atividade é a 1ª etapa do trabalho final:
no fim do semestre, o mesmo CRUD será entregue completo, com banco de dados, design patterns e
diagramas de classes e de sequência. Por isso os nomes de campos, a organização das telas e a
navegação precisam ser estáveis e pensados para essa evolução. Use rótulos idênticos aos da
especificação.

REGRA DE OURO
As únicas referências são a Especificação do CDU01 e o DRS_LES_2_2026 v0.7. Não inclua campos,
telas, botões, mensagens ou comportamentos que não estejam nesses documentos. Cada elemento deve
seguir exatamente a tabela de elementos da especificação: nome, tipo, obrigatoriedade, tamanho e
comportamento.

ESCOPO DESTA ETAPA
Somente front-end. Os dados ficam fixos no código (mock).
Fora do escopo, então NÃO desenhe estados para: persistência (P8), unicidade de CNPJ (P7/E2),
geração do código (RNF0081), log (RNF0012) e tempo de resposta (RNF0011).

ATOR E ELEMENTO COMUM
Ator: Administrador, já autenticado. Todas as telas do cadastro exibem a identificação do
usuário autenticado (P3). Estilo: back-office administrativo, desktop (1440px), limpo.

TELA 11.1 – BUSCA (P1.1, P1.2)
Campos opcionais e combináveis:
- Código (10), Razão Social (100), Nome Fantasia (60), CNPJ (18), Cidade (60)
- Estado (combobox)
- Status (combobox obrigatório: Ativo/Inativo/Todos, padrão Todos)
- Botão Buscar

TELA 11.2 – RESULTADO (P1.3, P2, E3)
- Ações: Novo | Visualizar | Alterar | Inativar | Ativar.
- Tabela com seleção única: Código, Razão Social, Nome Fantasia, CNPJ, Cidade, Estado, Status.
- Novo: só depois da busca, e desabilitado se os filtros mudarem.
- Visualizar e Alterar: só com seleção.
- Inativar: só ATIVO. Ativar: só INATIVO.
- E3: mensagem na própria tela de pesquisa, com Novo habilitado.
Estados: antes da busca, sem seleção, ATIVO selecionado, INATIVO selecionado, filtros
alterados e E3.

TELA 11.3 – CADASTRO (Inclusão P4/P5, Alteração A3, Visualização A1)
Campos:
- Dados: Código (não editável, 10), Razão Social* (100), Nome Fantasia* (60), CNPJ* (18),
  E-mail* (100).
- Telefone: Tipo* (combobox), DDD* (2), Número* (9).
- Endereço: Tipo de Logradouro* (combobox), Logradouro* (100), Número* (10),
  Complemento (60), Bairro* (60), CEP* (8), Cidade* (60), Estado* (combobox), País* (combobox).
- Botões: Salvar e Cancelar.
Variantes: inclusão, alteração, visualização somente leitura e erro E1.

TELA 11.4 – INATIVAÇÃO / ATIVAÇÃO (A4, A5, E4)
- Uma única tela, mudando o título e as categorias.
- Categoria* (combobox), Justificativa* (texto, 255).
- Botões: Confirmar e Cancelar.
- E4: indica o campo não informado.
Variantes: Inativar, Ativar e E4.
```
