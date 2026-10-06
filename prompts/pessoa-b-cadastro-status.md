# Prompt da Pessoa B: Cadastro e Inativação/Ativação (telas 11.3 e 11.4)

> Como usar: abra este repositório no seu assistente de código (Claude Code, Copilot, Cursor etc.) e cole o bloco abaixo. Ele também serve de roteiro se você for implementar sem IA.

```text
Você vai implementar a minha parte da atividade de LES (FATEC 2026): as telas 11.3 Cadastro de
Fornecedor e 11.4 Inativação e Ativação do caso de uso CDU01 – Manter Cadastro de Fornecedores,
em HTML, CSS e JavaScript puro (sem frameworks e sem back-end).

## Fontes obrigatórias (as ÚNICAS referências válidas)
Leia por completo antes de escrever qualquer código:
1. docs/UC_Manter_Cadastro_de_Fornecedores.md – Especificação do Caso de Uso CDU01
   (fluxos P3–P6, A1, A3, A4, A5, E1, E4 e as tabelas de elementos das seções 11.3 e 11.4).
2. docs/DRS_LES_2_2026.md – Documento de Requisitos v0.7, grupo "Cadastro de Fornecedores" e
   grupo "Geral".
3. docs/enunciado-atividade.md – escopo e regras desta entrega.
4. docs/contrato-integracao.md – acordo com a Pessoa A (estrutura, modelo, IDs e navegação).
   É obrigatório segui-lo.
Os arquivos docs/originais/*.docx são a fonte oficial. Se o .md divergir deles, vale o .docx.

## Requisitos que a implementação deve seguir
Siga os requisitos FUNCIONAIS, os requisitos NÃO FUNCIONAIS, as regras de negócio do DRS e o
documento de caso de uso. Cite o identificador de cada requisito em comentário no código, no
ponto onde ele é atendido (por exemplo // RN0082, // A4.3).
- Requisitos funcionais: RF0081 (cadastrar), RF0082 (alterar), RF0083 (inativar) e
  RF0084 (ativar).
- Requisitos não funcionais:
  - RNF0081 (código único gerado pelo sistema): o campo Código existe, é NÃO EDITÁVEL e fica
    vazio na inclusão. Não gere código no front.
  - RNF0013 (cadastro de domínios): todas as listas (tipos de telefone, tipos de logradouro,
    estados, países e categorias de inativação e de ativação) ficam em js/dominios.js,
    simulando as tabelas de domínio que o script de implantação vai criar.
  - RNF0012 (log de transação): é do back-end. Não simule.
  - RNF0011: não se aplica às suas telas.
- Regras de negócio:
  - RN0081: Razão Social, Nome Fantasia, CNPJ, E-mail e Telefone (tipo + DDD + número) são
    obrigatórios.
  - RN0082: Tipo Logradouro, Logradouro, Número, Bairro, CEP, Cidade, Estado e País são
    obrigatórios. Complemento é OPCIONAL.
  - RN0084 e RN0085: inativar e ativar exigem categoria e justificativa.
  - RN0086: depois de inativado, o fornecedor não pode ser usado em entrada de estoque. É só
    contexto: não há tela de estoque nesta etapa.
  - RN0083 (CNPJ único, P7/E2): é do back-end. NÃO implemente.
- Caso de uso: P3, P4.1–P4.3, P5, P6, E1, A1, A3, A4, A5, E4 e as tabelas de elementos de
  11.3 e 11.4 (nome, tipo, obrigatoriedade, tamanho, comportamento e permissão de acesso).

## O que implementar
Arquivos que são seus (contrato, seção 1): src/cadastro.html, src/css/cadastro.css,
src/js/dominios.js, src/js/cadastro.js e src/js/status.js.

1. Tela 11.3, uma única página que atende três modos, lidos de ?modo= na URL
   (contrato, seção 5).
   - Seção Dados do fornecedor (P4.1):
     - Código: Alfanumérico 10, NÃO EDITÁVEL em todos os modos.
     - Razão Social (100), Nome Fantasia (60), CNPJ (18) e E-mail (100).
   - Seção Telefone (P4.2):
     - Tipo de Telefone: combobox.
     - DDD: numérico 2.
     - Número do Telefone: numérico 9.
   - Seção Endereço (P4.3):
     - Tipo de Logradouro: combobox.
     - Logradouro (100), Número (10), Complemento (60, opcional), Bairro (60).
     - CEP: numérico 8.
     - Cidade (60).
     - Estado e País: combobox.
   - Marque com * todos os obrigatórios: são todos, exceto Complemento.
   - Botões Salvar e Cancelar.
2. Modos:
   - modo=novo: formulário vazio e Código vazio e bloqueado. Se vier &cnpj= na URL, preencha
     o campo CNPJ com esse valor (P4.1).
   - modo=alterar&codigo=X: carregue o fornecedor do mock e permita editar. O Código continua
     bloqueado (A3.1). O status atual é mantido.
   - modo=visualizar&codigo=X: os mesmos campos mais o status, TODOS somente leitura (A1.1).
     Para sair, veja a ambiguidade nº 1.
3. Salvar (P5 opção a, e A3.2 opção a) leva à validação dos obrigatórios (P6).
   - Se faltar algo, aplique o E1: destaque cada campo não preenchido, mostre quais estão
     pendentes, MANTENHA os dados digitados e volte ao formulário.
   - Se estiver tudo preenchido, volte para index.html. A persistência (P8) é do back-end.
4. Cancelar descarta os dados e volta para index.html (P1.2).
5. Tela 11.4 (A4 e A5): implemente em js/status.js a função abrirModalStatus(fornecedor,
   operacao, aoConcluir) exatamente como está no contrato. É uma única tela, que muda o título e
   as categorias conforme a operação.
   - Categoria: combobox obrigatório, com categoriasInativacao ou categoriasAtivacao.
   - Justificativa: texto obrigatório, até 255 caracteres.
   - Botões Confirmar e Cancelar.
   - Confirmar com categoria ou justificativa vazia aplica o E4: mensagem indicando o campo
     não informado, voltando a A4.1 ou A5.1.
   - Confirmar válido fecha o modal e chama aoConcluir.
   - Cancelar fecha o modal e volta para a busca.
6. P3: reaproveite a topbar da Pessoa A, com o usuário autenticado.
7. Base visual: siga design/telas-png/07 a 13 e o css/estilo.css da Pessoa A.

## Restrições
- NÃO inclua campos, telas, botões, mensagens ou comportamentos que não estejam nos documentos.
- Se encontrar uma ambiguidade, NÃO resolva por suposição: registre em docs/ambiguidades.md e
  siga a decisão provisória que está lá. As nº 1, 3, 4 e 5 são da sua parte.
- NÃO implemente nada que esteja fora do escopo: P7/E2 (CNPJ único), P8 (persistência),
  RNF0012 (log) e a geração de código (RNF0081).
- Use os nomes de campos, IDs e name do contrato. O formulário vai virar o DTO/entidade do
  back-end.
- Não edite os arquivos da Pessoa A (index.html, estilo.css, busca.js, mock-fornecedores.js).
  Se precisar de algo neles, peça a ela.

## Critérios de pronto
- [ ] Todos os elementos de 11.3 e 11.4 estão presentes, com tipo, obrigatoriedade e tamanho
      iguais aos da especificação.
- [ ] O Código nunca é editável (P4.1 e A3.1).
- [ ] A visualização é 100% somente leitura (A1.1).
- [ ] O CNPJ vindo da busca é preenchido na inclusão.
- [ ] Salvar com campos vazios mostra o E1 e mantém os dados digitados (CA02).
- [ ] Inativar e ativar só concluem com categoria e justificativa preenchidas (CA06 e E4).
- [ ] Cancelar volta para a busca em todas as telas.
- [ ] As listas vêm de js/dominios.js (RNF0013).
- [ ] Os requisitos estão citados em comentários no código.
- [ ] Os estados batem com design/telas-png/07 a 13.

Ao terminar, liste quais requisitos (RF, RNF, RN e passos do UC) foram atendidos e onde, e
quais ambiguidades foram registradas.
```

## Telas de referência

| Estado | Imagem |
|---|---|
| Inclusão | `design/telas-png/07-cadastro-inclusao.png` |
| Alteração | `design/telas-png/08-cadastro-alteracao.png` |
| Visualização | `design/telas-png/09-cadastro-visualizacao.png` |
| E1 | `design/telas-png/10-cadastro-E1-obrigatorios.png` |
| Inativar | `design/telas-png/11-modal-inativar.png` |
| Ativar | `design/telas-png/12-modal-ativar.png` |
| E4 | `design/telas-png/13-modal-E4-categoria-justificativa.png` |
