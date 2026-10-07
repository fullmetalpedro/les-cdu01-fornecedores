# Divisão da atividade entre duas pessoas

A divisão foi feita por telas, o que reduz conflitos no código. O esforço das duas partes é parecido: a parte de A tem mais lógica de estado nos botões, e a parte de B tem mais campos, três modos de tela e as validações.

| | Pessoa A: Busca | Pessoa B: Manutenção |
|---|---|---|
| Responsável | Pedro Paulo Sousa de Carlo | Pedro Araujo |
| Telas | 11.1 Busca, 11.2 Resultado | 11.3 Cadastro (inclusão, alteração e visualização), 11.4 Inativação/Ativação |
| Fluxos do UC | P1.1–P1.3, P2, P3, A2, E3 | P3–P6, A1, A3, A4, A5, E1, E4 |
| RF | RF0085 (e a entrada para RF0081 a RF0084) | RF0081, RF0082, RF0083, RF0084 |
| RNF | RNF0011 (preparar), RNF0013 (consome) | RNF0081 (Código não editável), RNF0013 (domínios) |
| RN | RN0086 (regra de status dos botões) | RN0081, RN0082, RN0084, RN0085 |
| Prompt | [prompts/pessoa-a-busca-resultado.md](../prompts/pessoa-a-busca-resultado.md) | [prompts/pessoa-b-cadastro-status.md](../prompts/pessoa-b-cadastro-status.md) |

## Etapa 0: as duas pessoas juntas (cerca de 1h)

1. Leiam juntos o [enunciado](enunciado-atividade.md), o [caso de uso](UC_Manter_Cadastro_de_Fornecedores.md) e o grupo "Cadastro de Fornecedores" do [DRS](DRS_LES_2_2026.md).
2. Revisem e aprovem o [contrato de integração](contrato-integracao.md): estrutura, modelo, IDs e navegação.
3. Criem as branches `pessoa-a/busca` e `pessoa-b/cadastro`.

## Etapa 1: em paralelo

Cada pessoa segue o seu prompt, em commits pequenos na própria branch. O que for ambíguo vai para [ambiguidades.md](ambiguidades.md).

## Etapa 2: integração e revisão cruzada

1. Cada pessoa abre um Pull Request para a `main`. **A outra pessoa revisa**, conferindo campo por campo contra a tabela de elementos da especificação.
2. Depois do merge, testem juntos a navegação completa: Busca → Novo / Visualizar / Alterar / Inativar / Ativar → volta à busca.
3. Rodem o checklist de entrega abaixo.
4. A Pessoa A envia ao professor as ambiguidades consolidadas.

## Checklist de entrega (front-end)

- [ ] As 4 telas da seção 11 estão implementadas, com os elementos exatamente como nas tabelas.
- [ ] Os campos obrigatórios estão marcados visualmente (RN0081 e RN0082).
- [ ] Novo só é habilitado depois de uma busca e é desabilitado ao mudar um filtro (P1.3 / CA05).
- [ ] Visualizar e Alterar só com seleção. Inativar só com ATIVO e Ativar só com INATIVO (P2).
- [ ] O Código não é editável em nenhuma tela (P4.1 / A3.1).
- [ ] A visualização é toda somente leitura (A1.1).
- [ ] E1, E3 e E4 estão implementados. E2 fica para o back-end.
- [ ] Todos os retornos à busca funcionam (Cancelar, Salvar e Confirmar).
- [ ] Não há nenhum campo, tela ou comportamento fora dos documentos.
- [ ] As ambiguidades foram registradas e comunicadas.

## Pensando no trabalho final

A mesma divisão continua natural:
- **A:** a consulta (filtros, DAO de busca e diagrama de sequência da consulta).
- **B:** a manutenção (validação das RNs, persistência, inativação/ativação e diagramas desses fluxos).
- **Juntos:** o diagrama de classes e a aplicação dos design patterns.
