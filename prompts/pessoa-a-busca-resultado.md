# Prompt da Pessoa A: Busca e Resultado (telas 11.1 e 11.2)

> Como usar: abra este repositório no seu assistente de código (Claude Code, Copilot, Cursor etc.) e cole o bloco abaixo. Ele também serve de roteiro se você for implementar sem IA.

```text
Você vai implementar a minha parte da atividade de LES (FATEC 2026): as telas 11.1 Busca e
11.2 Resultado da Busca do caso de uso CDU01 – Manter Cadastro de Fornecedores, em HTML, CSS e
JavaScript puro (sem frameworks e sem back-end).

## Fontes obrigatórias (as ÚNICAS referências válidas)
Leia por completo antes de escrever qualquer código:
1. docs/UC_Manter_Cadastro_de_Fornecedores.md – Especificação do Caso de Uso CDU01
   (fluxos P1, P2, A2, E3 e as tabelas de elementos das seções 11.1 e 11.2).
2. docs/DRS_LES_2_2026.md – Documento de Requisitos v0.7, grupo "Cadastro de Fornecedores" e
   grupo "Geral".
3. docs/enunciado-atividade.md – escopo e regras desta entrega.
4. docs/contrato-integracao.md – acordo com a Pessoa B (estrutura, modelo, IDs e navegação).
   É obrigatório segui-lo.
Os arquivos docs/originais/*.docx são a fonte oficial. Se o .md divergir deles, vale o .docx.

## Requisitos que a implementação deve seguir
Siga os requisitos FUNCIONAIS, os requisitos NÃO FUNCIONAIS, as regras de negócio do DRS e o
documento de caso de uso. Cite o identificador de cada requisito em comentário no código, no
ponto onde ele é atendido (por exemplo // RF0085, // P1.3).
- Requisitos funcionais: RF0085 (consulta com filtros combinados ou isolados). A sua tela
  também é a porta de entrada de RF0081, RF0082, RF0083 e RF0084 (botões Novo, Alterar,
  Inativar e Ativar).
- Requisitos não funcionais:
  - RNF0011 (consulta em até 1 s): a medição fica para o back-end, mas o filtro no front não
    pode ter nenhum atraso artificial.
  - RNF0081 (código único): exiba o código, sem gerar.
  - RNF0013 (domínios): o combobox de Estado deve ler a lista de js/dominios.js.
  - RNF0012 (log): é do back-end. Não simule.
- Regras de negócio: RN0083 (CNPJ único) é do back-end, não implemente. RN0086 explica por que
  o status importa e justifica a regra dos botões Inativar e Ativar.
- Caso de uso: P1.1, P1.2, P1.3, P2, P3, A2, E3 e a tabela de elementos de 11.1 e 11.2
  (nome, tipo, obrigatoriedade, tamanho, comportamento e permissão de acesso).

## O que implementar
Arquivos que são seus (contrato, seção 1): src/index.html, src/css/estilo.css,
src/js/mock-fornecedores.js e src/js/busca.js.

1. Tela 11.1 (P1.1):
   - Campos Código (10), Razão Social (100), Nome Fantasia (60), CNPJ (18) e Cidade (60), todos
     opcionais. Estado é um combobox opcional.
   - Status é um combobox OBRIGATÓRIO com as opções Ativo, Inativo e Todos, e padrão Todos.
   - Botão Buscar.
   - Respeite exatamente o tipo, a obrigatoriedade e o tamanho (maxlength) da tabela 11.1.
2. Busca (P1.2): filtre o mock usando qualquer combinação dos parâmetros (RF0085).
3. Tela 11.2 (P1.3):
   - Tabela com as colunas Código, Razão Social, Nome Fantasia, CNPJ, Cidade, Estado e Status.
   - Apenas UM registro pode ser selecionado.
   - Acima da tabela ficam os botões Novo, Visualizar, Alterar, Inativar e Ativar.
4. Regras de habilitação (P1.3 e P2):
   - Novo: habilitado SÓ depois de uma busca. Volta a ficar desabilitado quando qualquer
     parâmetro muda, até a próxima busca (CA05).
   - Visualizar e Alterar: SÓ com um registro selecionado.
   - Inativar: SÓ com um registro de status ATIVO selecionado.
   - Ativar: SÓ com um registro de status INATIVO selecionado.
5. E3: sem resultados, exiba na PRÓPRIA tela de pesquisa uma mensagem de que não foram
   encontrados fornecedores. Novo continua habilitado.
6. Navegação (contrato, seção 5):
   - Novo abre cadastro.html?modo=novo. Se o CNPJ foi usado como filtro, inclua &cnpj=...
   - Visualizar e Alterar abrem cadastro.html?modo=visualizar|alterar&codigo=...
   - Inativar e Ativar chamam abrirModalStatus(fornecedor, "inativar"|"ativar").
     Essa função é da Pessoa B. Enquanto ela não existir, use um stub que só faça
     console.log.
7. P3: topbar com o usuário autenticado (nome e perfil), usando o objeto usuarioLogado.
8. Mock: 6 fornecedores fictícios no formato do contrato (seção 2), misturando ATIVO e INATIVO.
9. Base visual: siga design/telas-png/01 a 06 e os tokens de cor do design
   (fundo #F4F5F7, primário #1F4E79, borda #D5DAE1, fonte Inter). Marque os campos
   obrigatórios com *.

## Restrições
- NÃO inclua campos, telas, botões, mensagens ou comportamentos que não estejam nos documentos.
- Se encontrar uma ambiguidade, NÃO resolva por suposição: registre em docs/ambiguidades.md e
  siga a decisão provisória que está lá.
- NÃO implemente nada que esteja fora do escopo: P7/E2, P8, RNF0011 (medição), RNF0012 e a
  geração de código (RNF0081).
- Use os nomes de campos, IDs e name do contrato. Eles serão reaproveitados no back-end.
- Não edite os arquivos da Pessoa B (cadastro.html, cadastro.js, status.js, dominios.js).

## Critérios de pronto
- [ ] Todos os elementos de 11.1 e 11.2 estão presentes, com tipo, obrigatoriedade e tamanho
      iguais aos da especificação.
- [ ] Os filtros funcionam sozinhos e combinados (RF0085).
- [ ] Novo começa desabilitado, é habilitado depois da busca e volta a ficar desabilitado
      quando um filtro muda (CA05).
- [ ] Visualizar e Alterar só ficam habilitados com seleção. Inativar só com ATIVO e Ativar só
      com INATIVO.
- [ ] O E3 aparece na tela de pesquisa e mantém Novo habilitado.
- [ ] O CNPJ do filtro chega ao cadastro em modo=novo.
- [ ] A topbar mostra o usuário autenticado (P3).
- [ ] Os requisitos estão citados em comentários no código.
- [ ] Os estados batem com design/telas-png/01 a 06.

Ao terminar, liste quais requisitos (RF, RNF, RN e passos do UC) foram atendidos e onde, e
quais ambiguidades foram registradas.
```

## Telas de referência

| Estado | Imagem |
|---|---|
| Antes da consulta | `design/telas-png/01-busca-antes-da-consulta.png` |
| Resultado sem seleção | `design/telas-png/02-resultado-sem-selecao.png` |
| ATIVO selecionado | `design/telas-png/03-resultado-ativo-selecionado.png` |
| INATIVO selecionado | `design/telas-png/04-resultado-inativo-selecionado.png` |
| Parâmetros alterados | `design/telas-png/05-resultado-parametros-alterados.png` |
| E3 | `design/telas-png/06-busca-E3-nenhum-encontrado.png` |
