# CDU01 – Manter Cadastro de Fornecedores

Projeto da disciplina **Laboratório de Engenharia de Software (LES) – FATEC, 2026**: o E-commerce de Livros.

Esta é a **1ª etapa do trabalho final**: o front-end em HTML das telas do caso de uso CDU01. Na entrega final, o mesmo CRUD terá banco de dados, os design patterns da disciplina e os diagramas de classes e de sequência.

> **Regra de ouro:** a [Especificação do Caso de Uso](docs/UC_Manter_Cadastro_de_Fornecedores.md) e o [Documento de Requisitos (DRS v0.7)](docs/DRS_LES_2_2026.md) são as **únicas** referências. Toda implementação deve seguir os requisitos funcionais, os não funcionais, as regras de negócio e os fluxos do caso de uso. Nada pode ser acrescentado além do que está neles. Ambiguidades são registradas em [docs/ambiguidades.md](docs/ambiguidades.md), e não resolvidas por suposição.

## Por onde começar

1. Leia o [enunciado da atividade](docs/enunciado-atividade.md).
2. Veja a [apresentação animada de uso do sistema](apresentacao/index.html). Para ver no navegador, baixe o repositório e abra o `index.html`.
3. Leia a [divisão de tarefas](docs/divisao-tarefas.md) e o [contrato de integração](docs/contrato-integracao.md).
4. Cada pessoa usa o seu prompt:
   - **Pessoa A:** Busca e Resultado (11.1 e 11.2) → [prompts/pessoa-a-busca-resultado.md](prompts/pessoa-a-busca-resultado.md)
   - **Pessoa B:** Cadastro e Inativação/Ativação (11.3 e 11.4) → [prompts/pessoa-b-cadastro-status.md](prompts/pessoa-b-cadastro-status.md)

## Estrutura do repositório

```
docs/
├── originais/                          Documentos oficiais (.docx) – fonte de verdade
├── DRS_LES_2_2026.md                   DRS v0.7 convertido para Markdown
├── UC_Manter_Cadastro_de_Fornecedores.md  Caso de uso CDU01 convertido para Markdown
├── enunciado-atividade.md              Enunciado e escopo desta etapa
├── divisao-tarefas.md                  Divisão entre as duas pessoas e checklist de entrega
├── contrato-integracao.md              Estrutura, modelo, IDs e navegação combinados
└── ambiguidades.md                     Pontos a confirmar com o professor
prompts/
├── pessoa-a-busca-resultado.md
├── pessoa-b-cadastro-status.md
└── design-pencil.md                    Prompt usado para gerar o design
design/
├── telas-png/                          13 estados das telas (referência visual)
├── telas-html/fornecedores.html        Exportação HTML/CSS do Pencil (só referência)
└── fornecedores.pen                    Arquivo-fonte do design (pencil.dev)
apresentacao/                           Apresentação com animações CSS (← → navega, R repete)
src/                                    Código da implementação (criado pelas duas pessoas)
```

## Requisitos cobertos

| Tipo | IDs |
|---|---|
| Requisitos funcionais | RF0081 Cadastrar, RF0082 Alterar, RF0083 Inativar, RF0084 Ativar, RF0085 Consultar |
| Requisitos não funcionais | RNF0011 Tempo de resposta, RNF0012 Log, RNF0013 Domínios, RNF0081 Código de fornecedor |
| Regras de negócio | RN0081 a RN0086 |
| Fora desta etapa (back-end) | P7/E2 (CNPJ único), P8 (persistência), RNF0011 (medição), RNF0012, geração do código (RNF0081) |
