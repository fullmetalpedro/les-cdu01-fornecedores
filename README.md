# CDU01 – Manter Cadastro de Fornecedores

Projeto da disciplina **Laboratório de Engenharia de Software (LES) – FATEC, 2026**: o E-commerce de Livros.

O repositório reúne as etapas do trabalho final: as telas em HTML (Etapa 1), o modelo de dados e as classes de domínio (Etapa 2) e o CRUD completo com banco de dados e os design patterns da disciplina (Etapa 3).

> **Regra de ouro:** a [Especificação do Caso de Uso](docs/UC_Manter_Cadastro_de_Fornecedores.md) e o [Documento de Requisitos (DRS v0.7)](docs/DRS_LES_2_2026.md) são as **únicas** referências. Toda implementação deve seguir os requisitos funcionais, os não funcionais, as regras de negócio e os fluxos do caso de uso. Nada pode ser acrescentado além do que está neles.

## Autores

| Nome | GitHub | Parte |
|---|---|---|
| Pedro Paulo Sousa de Carlo | [@fullmetalpedro](https://github.com/fullmetalpedro) | Pessoa A: Busca e Resultado (11.1 e 11.2) |
| Pedro Araujo | [@Araujo2303](https://github.com/Araujo2303) | Pessoa B: Cadastro e Inativação/Ativação (11.3 e 11.4) |

## Por onde começar

1. Leia o [enunciado da atividade](docs/enunciado-atividade.md).
2. Veja a [apresentação animada de uso do sistema](apresentacao/index.html). Para ver no navegador, baixe o repositório e abra o `index.html`.
3. Leia a [divisão de tarefas](docs/divisao-tarefas.md) e o [contrato de integração](docs/contrato-integracao.md).
4. Cada pessoa usa o seu prompt:
   - **Pessoa A:** Busca e Resultado (11.1 e 11.2) → [prompts/pessoa-a-busca-resultado.md](prompts/pessoa-a-busca-resultado.md)
   - **Pessoa B:** Cadastro e Inativação/Ativação (11.3 e 11.4) → [prompts/pessoa-b-cadastro-status.md](prompts/pessoa-b-cadastro-status.md)

## Etapa 2: modelo de dados e classes de domínio

[Enunciado da Etapa 2](docs/enunciado-etapa-2.md). Linguagem: C# (.NET 10). Banco: PostgreSQL.

| Entrega | Arquivo |
|---|---|
| Modelo de dados (DER) | [modelagem/diagramas/der.png](modelagem/diagramas/der.png) |
| Script DDL | [banco/01-ddl.sql](banco/01-ddl.sql) |
| Script de domínios (RNF0013) | [banco/02-dominios.sql](banco/02-dominios.sql) |
| Diagrama de classes de domínio | [modelagem/diagramas/classes.png](modelagem/diagramas/classes.png) |
| Classes de domínio | [backend/Fornecedores.Dominio/](backend/Fornecedores.Dominio/) |
| Matriz de rastreabilidade | [modelagem/matriz-rastreabilidade.md](modelagem/matriz-rastreabilidade.md) |
| Ambiguidades e decisões | [modelagem/ambiguidades-e-decisoes.md](modelagem/ambiguidades-e-decisoes.md) |

Para criar o banco, execute os dois scripts em ordem:

```bash
psql -d <banco> -f banco/01-ddl.sql -f banco/02-dominios.sql
```

Os diagramas são gerados a partir dos arquivos `.mmd` com `node modelagem/diagramas/renderizar.mjs`.

## Etapa 3: CRUD completo

O back-end em ASP.NET Core (`backend/Fornecedores.Web`) serve as telas de `src/` e a API usada por elas.

| Camada | Padrão | Onde |
|---|---|---|
| Visão | MVC (View) | `src/*.html` e `src/js/` |
| Controle | MVC (Controller) | `backend/Fornecedores.Web/Controle/` |
| Fachada | Facade | `backend/Fornecedores.Web/Fachada/FachadaFornecedor.cs` |
| Regras de negócio | Strategy | `backend/Fornecedores.Web/Negocio/` |
| Persistência | DAO | `backend/Fornecedores.Web/Persistencia/` |
| Domínio | MVC (Model) | `backend/Fornecedores.Dominio/` |

Cada requisição passa pelo controller, que chama a fachada. A fachada aplica as strategies da operação (dados obrigatórios, campos numéricos, CNPJ único e motivo da inativação ou ativação) e, se todas passarem, grava pelos DAOs numa única transação, junto com o log.

| Strategy | Regra |
|---|---|
| `ValidarDadosObrigatorios` | RN0081, RN0082, E1 |
| `ValidarCamposNumericos` | DDD, número do telefone e CEP (seção 11.3) |
| `ValidarCnpjUnico` | RN0083, E2 |
| `ValidarMotivo` | RN0084, RN0085, E4 |

## Como rodar

Requisitos: .NET 10 SDK e PostgreSQL com a extensão `unaccent` (incluída nas distribuições oficiais).

1. Crie o banco e carregue os scripts:

   ```bash
   createdb -U postgres fornecedores
   psql -U postgres -d fornecedores -f banco/01-ddl.sql -f banco/02-dominios.sql
   ```

2. Confira a conexão e o usuário autenticado em `backend/Fornecedores.Web/appsettings.json`.
3. Rode o servidor:

   ```bash
   dotnet run --project backend/Fornecedores.Web --urls http://localhost:5080
   ```

4. Abra http://localhost:5080.

Para ter os mesmos seis fornecedores usados nos testes, rode também `tests/dados-teste.sql`. Esse script apaga os fornecedores existentes.

## Testes automatizados (Playwright)

Os testes em `tests/` usam o sistema completo (telas, API e banco) e validam:
- tamanhos e obrigatoriedade dos campos;
- regras de habilitação dos botões e permissões de acesso;
- inclusão, alteração, inativação e ativação gravadas no banco;
- fluxos E1, E2, E3 e E4;
- log de toda operação de escrita (CA08);
- navegação entre as telas;
- console sem erros e ausência de emojis (só ícones Lucide).

O Playwright cria o banco `fornecedores_teste`, roda os scripts de `banco/` e inicia o servidor. Antes de cada teste, `tests/dados-teste.sql` restaura os seis fornecedores. Por padrão a conexão é `postgresql://postgres@localhost:5432/fornecedores_teste`; outra pode ser informada em `DATABASE_URL`.

```bash
npm install
npx playwright install chromium
npm test
```

Para usar o navegador já instalado em vez de baixar o Chromium, defina `PW_CHANNEL`, por exemplo `PW_CHANNEL=msedge npm test`. O relatório HTML abre com `npm run test:report`. Os testes também rodam no GitHub Actions a cada PR.

## Estrutura do repositório

```
docs/
├── originais/                          Documentos oficiais (.docx) – fonte de verdade
├── DRS_LES_2_2026.md                   DRS v0.7 convertido para Markdown
├── UC_Manter_Cadastro_de_Fornecedores.md  Caso de uso CDU01 convertido para Markdown
├── enunciado-atividade.md              Enunciado e escopo desta etapa
├── divisao-tarefas.md                  Divisão entre as duas pessoas e checklist de entrega
└── contrato-integracao.md              Estrutura, modelo, IDs e navegação combinados
prompts/
├── pessoa-a-busca-resultado.md
├── pessoa-b-cadastro-status.md
└── design-pencil.md                    Prompt usado para gerar o design
design/
├── telas-png/                          13 estados das telas (referência visual)
├── telas-html/fornecedores.html        Exportação HTML/CSS do Pencil (só referência)
└── fornecedores.pen                    Arquivo-fonte do design (pencil.dev)
apresentacao/                           Apresentação com animações CSS (← → navega, R repete)
banco/                                  Scripts SQL de criação e de domínios
modelagem/                              DER, diagrama de classes, rastreabilidade e decisões
backend/
├── Fornecedores.Dominio/               Classes de domínio (Etapa 2)
└── Fornecedores.Web/                   Controllers, fachada, strategies e DAOs (Etapa 3)
src/                                    Telas (visão do MVC)
tests/                                  Testes end-to-end com Playwright
```

## Requisitos cobertos

| Tipo | IDs |
|---|---|
| Requisitos funcionais | RF0081 Cadastrar, RF0082 Alterar, RF0083 Inativar, RF0084 Ativar, RF0085 Consultar |
| Requisitos não funcionais | RNF0011 Tempo de resposta, RNF0012 Log, RNF0013 Domínios, RNF0081 Código de fornecedor |
| Regras de negócio | RN0081 a RN0086 |
