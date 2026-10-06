# Contrato de integração entre a Pessoa A e a Pessoa B

Este arquivo é o acordo comum entre as duas partes. **Nenhuma das duas pessoas muda este contrato sozinha.** Uma alteração precisa ser combinada entre as duas e registrada aqui por commit.

## 1. Estrutura de pastas e dono de cada arquivo

```
src/
├── index.html               (A) Telas 11.1 Busca + 11.2 Resultado
├── cadastro.html            (B) Tela 11.3 – inclusão, alteração e visualização
├── css/
│   ├── estilo.css           (A) Base visual: cores, fonte, topbar, botões, campos, badge, tabela
│   └── cadastro.css         (B) Estilos específicos do formulário e do modal (opcional)
└── js/
    ├── mock-fornecedores.js (A) Fornecedores fictícios (substitui o banco nesta etapa)
    ├── dominios.js          (B) Tipos de telefone e de logradouro, estados, países, categorias (RNF0013)
    ├── busca.js             (A) Filtro, tabela e habilitação dos botões
    ├── cadastro.js          (B) Modos da tela 11.3 e validação de obrigatórios (P6/E1)
    └── status.js            (B) Modal 11.4 – inativar/ativar (A4/A5/E4)
```

Cada pessoa só edita os arquivos de que é dona. Se precisar mudar um arquivo da outra pessoa, peça a mudança ou abra um Pull Request para ela revisar.

## 2. Modelo do fornecedor

Os nomes abaixo serão os mesmos da entidade do back-end na entrega final. Não traduza, não abrevie e não renomeie.

```js
{
  codigo: "FOR-000001",            // Alfanumérico 10 – gerado pelo sistema (RNF0081), nunca editável
  razaoSocial: "",                 // Alfanumérico 100 – obrigatório
  nomeFantasia: "",                // Alfanumérico 60  – obrigatório
  cnpj: "",                        // Alfanumérico 18  – obrigatório
  email: "",                       // Alfanumérico 100 – obrigatório
  status: "ATIVO",                 // "ATIVO" | "INATIVO"
  telefone: {
    tipo: "",                      // Combobox (dominios.tiposTelefone) – obrigatório
    ddd: "",                       // Numérico 2 – obrigatório
    numero: ""                     // Numérico 9 – obrigatório
  },
  endereco: {
    tipoLogradouro: "",            // Combobox (dominios.tiposLogradouro) – obrigatório
    logradouro: "",                // Alfanumérico 100 – obrigatório
    numero: "",                    // Alfanumérico 10  – obrigatório
    complemento: "",               // Alfanumérico 60  – OPCIONAL
    bairro: "",                    // Alfanumérico 60  – obrigatório
    cep: "",                       // Numérico 8 – obrigatório
    cidade: "",                    // Alfanumérico 60  – obrigatório
    estado: "",                    // Combobox (dominios.estados) – obrigatório
    pais: ""                       // Combobox (dominios.paises) – obrigatório
  }
}
```

## 3. Domínios (`js/dominios.js`, da Pessoa B)

```js
const dominios = {
  tiposTelefone: [...],
  tiposLogradouro: [...],
  estados: [...],             // { sigla, nome }
  paises: [...],
  categoriasInativacao: [...],
  categoriasAtivacao: [...]
};
```

Cada item de domínio tem `codigo` e `nome` (estados usam `sigla` e `nome`). **O fornecedor guarda sempre o código** (`"COMERCIAL"`, `"RUA"`, `"BR"`, `"SP"`), e o combobox exibe o nome. Assim o valor já é a chave da tabela de domínio no back-end.

Os documentos não definem os valores das categorias. Use valores de exemplo e registre isso em [ambiguidades.md](ambiguidades.md).

## 4. Padrão de IDs e de `name`

| Prefixo | Uso | Exemplos |
|---|---|---|
| `txt` | campo de texto ou número | `txtCodigo`, `txtRazaoSocial`, `txtNomeFantasia`, `txtCnpj`, `txtEmail`, `txtDdd`, `txtNumeroTelefone`, `txtLogradouro`, `txtNumero`, `txtComplemento`, `txtBairro`, `txtCep`, `txtCidade`, `txtJustificativa` |
| `cbo` | combobox | `cboEstado`, `cboStatus`, `cboTipoTelefone`, `cboTipoLogradouro`, `cboPais`, `cboCategoria` |
| `btn` | botão | `btnBuscar`, `btnNovo`, `btnVisualizar`, `btnAlterar`, `btnInativar`, `btnAtivar`, `btnSalvar`, `btnCancelar`, `btnConfirmar` |
| `tbl` | tabela | `tblResultado` |

O atributo `name` de cada campo segue o modelo da seção 2, por exemplo `name="razaoSocial"` e `name="telefone.ddd"`. O `maxlength` de cada campo segue o tamanho da especificação.

## 5. Navegação entre as telas

| Ação na busca (A) | Destino (B) |
|---|---|
| Novo | `cadastro.html?modo=novo` ou `cadastro.html?modo=novo&cnpj=<cnpj do filtro>` (P1.3) |
| Visualizar | `cadastro.html?modo=visualizar&codigo=<codigo>` (A2 → A1) |
| Alterar | `cadastro.html?modo=alterar&codigo=<codigo>` (A2 → A3) |
| Inativar | `abrirModalStatus(fornecedor, "inativar")` (A2 → A4) |
| Ativar | `abrirModalStatus(fornecedor, "ativar")` (A2 → A5) |

**Retornos à busca (P1.2):**
- Na tela de cadastro, Salvar (depois da validação), Cancelar e o retorno da visualização voltam para `index.html`.
- No modal, Cancelar e Confirmar (depois da validação) apenas fecham o modal sobre a busca.

**Função exposta por `status.js` (B):**

```js
/**
 * Abre a tela 11.4 sobre a tela de busca.
 * @param {object} fornecedor  objeto no formato da seção 2
 * @param {"inativar"|"ativar"} operacao
 * @param {function} aoConcluir callback opcional chamado após Confirmar válido
 */
function abrirModalStatus(fornecedor, operacao, aoConcluir) {}
```

## 6. Usuário autenticado (P3)

As duas telas exibem na topbar o nome e o perfil do usuário autenticado. Nesta etapa os dados são fixos e ficam num objeto `usuarioLogado` em `mock-fornecedores.js`. A Pessoa A cria o HTML/CSS da topbar e a Pessoa B reaproveita o mesmo trecho.

## 7. Fora do escopo desta etapa (não implementar)

- Persistência (P8)
- Unicidade do CNPJ (P7/E2)
- Geração do código (RNF0081)
- Log (RNF0012)
- Tempo de resposta (RNF0011)

Não simule nenhum desses itens. A estrutura apenas não deve impedir que eles sejam implementados depois.
