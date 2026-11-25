-- =============================================================================
-- CDU01 - Manter Cadastro de Fornecedores | Etapa 2 | Script DDL (PostgreSQL)
-- E-commerce de Livros - LES / FATEC 2026
--
-- Ordem de execução: 01-ddl.sql, depois 02-dominios.sql.
-- Tamanhos e obrigatoriedade seguem as tabelas de elementos da seção 11 da
-- especificação. As decisões citadas como "Dn" e as ambiguidades citadas como
-- "An" estão em modelagem/ambiguidades-e-decisoes.md.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Tabelas de domínio (pré-condição 7.2, RNF0013)
-- A chave é o código já usado como valor dos combobox da Etapa 1 (D4).
-- -----------------------------------------------------------------------------

CREATE TABLE tipo_telefone (
    codigo VARCHAR(30) NOT NULL,
    nome   VARCHAR(60) NOT NULL,
    CONSTRAINT pk_tipo_telefone PRIMARY KEY (codigo),
    CONSTRAINT uq_tipo_telefone_nome UNIQUE (nome)
);

CREATE TABLE tipo_logradouro (
    codigo VARCHAR(30) NOT NULL,
    nome   VARCHAR(60) NOT NULL,
    CONSTRAINT pk_tipo_logradouro PRIMARY KEY (codigo),
    CONSTRAINT uq_tipo_logradouro_nome UNIQUE (nome)
);

CREATE TABLE estado (
    sigla CHAR(2)     NOT NULL,
    nome  VARCHAR(60) NOT NULL,
    CONSTRAINT pk_estado PRIMARY KEY (sigla),
    CONSTRAINT uq_estado_nome UNIQUE (nome)
);

CREATE TABLE pais (
    codigo CHAR(2)     NOT NULL,
    nome   VARCHAR(60) NOT NULL,
    CONSTRAINT pk_pais PRIMARY KEY (codigo),
    CONSTRAINT uq_pais_nome UNIQUE (nome)
);

CREATE TABLE categoria_inativacao (
    codigo VARCHAR(30) NOT NULL,
    nome   VARCHAR(60) NOT NULL,
    CONSTRAINT pk_categoria_inativacao PRIMARY KEY (codigo),
    CONSTRAINT uq_categoria_inativacao_nome UNIQUE (nome)
);

CREATE TABLE categoria_ativacao (
    codigo VARCHAR(30) NOT NULL,
    nome   VARCHAR(60) NOT NULL,
    CONSTRAINT pk_categoria_ativacao PRIMARY KEY (codigo),
    CONSTRAINT uq_categoria_ativacao_nome UNIQUE (nome)
);

-- -----------------------------------------------------------------------------
-- Fornecedor (P4.1, P4.2, P4.3)
-- -----------------------------------------------------------------------------

-- RNF0081 / P8.1: o código é gerado pelo sistema na persistência.
-- Formato FOR-000000 herdado da Etapa 1 (A2).
CREATE SEQUENCE seq_fornecedor_codigo START WITH 1 MAXVALUE 999999 NO CYCLE;

CREATE TABLE fornecedor (
    -- Dados cadastrais (P4.1)
    codigo        VARCHAR(10)  NOT NULL
                  DEFAULT ('FOR-' || lpad(nextval('seq_fornecedor_codigo')::text, 6, '0')),
    razao_social  VARCHAR(100) NOT NULL,
    nome_fantasia VARCHAR(60)  NOT NULL,
    cnpj          VARCHAR(18)  NOT NULL,
    email         VARCHAR(100) NOT NULL,
    -- P8.2: todo novo fornecedor nasce ATIVO.
    status        VARCHAR(7)   NOT NULL DEFAULT 'ATIVO',

    -- Telefone (P4.2, RN0081). Colunas na própria tabela: ver D1.
    telefone_tipo   VARCHAR(30) NOT NULL,
    telefone_ddd    VARCHAR(2)  NOT NULL,
    telefone_numero VARCHAR(9)  NOT NULL,

    -- Endereço (P4.3, RN0082). Colunas na própria tabela: ver D1.
    endereco_tipo_logradouro VARCHAR(30)  NOT NULL,
    endereco_logradouro      VARCHAR(100) NOT NULL,
    endereco_numero          VARCHAR(10)  NOT NULL,
    endereco_complemento     VARCHAR(60)  NULL,      -- único campo opcional (RN0082)
    endereco_bairro          VARCHAR(60)  NOT NULL,
    endereco_cep             VARCHAR(8)   NOT NULL,
    endereco_cidade          VARCHAR(60)  NOT NULL,
    endereco_estado          CHAR(2)      NOT NULL,
    endereco_pais            CHAR(2)      NOT NULL,

    -- RNF0081: código único. Como chave primária, é também o que a futura
    -- entrada em estoque referencia (RN0050).
    CONSTRAINT pk_fornecedor PRIMARY KEY (codigo),

    CONSTRAINT fk_fornecedor_tipo_telefone
        FOREIGN KEY (telefone_tipo) REFERENCES tipo_telefone (codigo),
    CONSTRAINT fk_fornecedor_tipo_logradouro
        FOREIGN KEY (endereco_tipo_logradouro) REFERENCES tipo_logradouro (codigo),
    CONSTRAINT fk_fornecedor_estado
        FOREIGN KEY (endereco_estado) REFERENCES estado (sigla),
    CONSTRAINT fk_fornecedor_pais
        FOREIGN KEY (endereco_pais) REFERENCES pais (codigo),

    CONSTRAINT ck_fornecedor_status CHECK (status IN ('ATIVO', 'INATIVO')),

    -- RN0081 e RN0082: NOT NULL não impede texto em branco; estes CHECKs impedem.
    CONSTRAINT ck_fornecedor_razao_social_preenchida  CHECK (btrim(razao_social) <> ''),
    CONSTRAINT ck_fornecedor_nome_fantasia_preenchido CHECK (btrim(nome_fantasia) <> ''),
    CONSTRAINT ck_fornecedor_cnpj_preenchido          CHECK (btrim(cnpj) <> ''),
    CONSTRAINT ck_fornecedor_email_preenchido         CHECK (btrim(email) <> ''),
    CONSTRAINT ck_fornecedor_logradouro_preenchido    CHECK (btrim(endereco_logradouro) <> ''),
    CONSTRAINT ck_fornecedor_numero_preenchido        CHECK (btrim(endereco_numero) <> ''),
    CONSTRAINT ck_fornecedor_bairro_preenchido        CHECK (btrim(endereco_bairro) <> ''),
    CONSTRAINT ck_fornecedor_cidade_preenchida        CHECK (btrim(endereco_cidade) <> ''),

    -- Campos de tipo "Numérico" na seção 11.3: só dígitos, até o tamanho da
    -- especificação. Guardados como texto para preservar zeros à esquerda (D6).
    CONSTRAINT ck_fornecedor_telefone_ddd_numerico    CHECK (telefone_ddd ~ '^[0-9]{1,2}$'),
    CONSTRAINT ck_fornecedor_telefone_numero_numerico CHECK (telefone_numero ~ '^[0-9]{1,9}$'),
    CONSTRAINT ck_fornecedor_cep_numerico             CHECK (endereco_cep ~ '^[0-9]{1,8}$')
);

-- RN0083 / P7: CNPJ único independentemente do status. O índice não tem
-- cláusula WHERE, então vale para ATIVO e INATIVO. A comparação ignora a
-- pontuação, para que o mesmo CNPJ com e sem máscara não seja aceito duas
-- vezes (D5).
CREATE UNIQUE INDEX uq_fornecedor_cnpj
    ON fornecedor (regexp_replace(upper(cnpj), '[^0-9A-Z]', '', 'g'));

-- P1.1 / RNF0011: filtros da busca que não são chave. Código e CNPJ já têm
-- índice único.
CREATE INDEX ix_fornecedor_razao_social  ON fornecedor (razao_social);
CREATE INDEX ix_fornecedor_nome_fantasia ON fornecedor (nome_fantasia);
CREATE INDEX ix_fornecedor_cidade        ON fornecedor (endereco_cidade);
CREATE INDEX ix_fornecedor_estado        ON fornecedor (endereco_estado);
CREATE INDEX ix_fornecedor_status        ON fornecedor (status);

-- -----------------------------------------------------------------------------
-- Histórico de status (A4.4, A5.4, RN0084, RN0085) - ver D3
-- Uma linha para cada inativação e uma para cada ativação.
-- -----------------------------------------------------------------------------

CREATE TABLE fornecedor_inativacao (
    id                BIGINT       GENERATED ALWAYS AS IDENTITY,
    fornecedor_codigo VARCHAR(10)  NOT NULL,
    categoria         VARCHAR(30)  NOT NULL,                      -- RN0084
    justificativa     VARCHAR(255) NOT NULL,                      -- RN0084
    data_hora         TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP, -- RNF0012
    usuario           VARCHAR(100) NOT NULL,                      -- RNF0012 (A5)
    CONSTRAINT pk_fornecedor_inativacao PRIMARY KEY (id),
    CONSTRAINT fk_fornecedor_inativacao_fornecedor
        FOREIGN KEY (fornecedor_codigo) REFERENCES fornecedor (codigo),
    CONSTRAINT fk_fornecedor_inativacao_categoria
        FOREIGN KEY (categoria) REFERENCES categoria_inativacao (codigo),
    CONSTRAINT ck_fornecedor_inativacao_justificativa_preenchida CHECK (btrim(justificativa) <> ''),
    CONSTRAINT ck_fornecedor_inativacao_usuario_preenchido       CHECK (btrim(usuario) <> '')
);

CREATE INDEX ix_fornecedor_inativacao_fornecedor ON fornecedor_inativacao (fornecedor_codigo);

CREATE TABLE fornecedor_ativacao (
    id                BIGINT       GENERATED ALWAYS AS IDENTITY,
    fornecedor_codigo VARCHAR(10)  NOT NULL,
    categoria         VARCHAR(30)  NOT NULL,                      -- RN0085
    justificativa     VARCHAR(255) NOT NULL,                      -- RN0085
    data_hora         TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP, -- RNF0012
    usuario           VARCHAR(100) NOT NULL,                      -- RNF0012 (A5)
    CONSTRAINT pk_fornecedor_ativacao PRIMARY KEY (id),
    CONSTRAINT fk_fornecedor_ativacao_fornecedor
        FOREIGN KEY (fornecedor_codigo) REFERENCES fornecedor (codigo),
    CONSTRAINT fk_fornecedor_ativacao_categoria
        FOREIGN KEY (categoria) REFERENCES categoria_ativacao (codigo),
    CONSTRAINT ck_fornecedor_ativacao_justificativa_preenchida CHECK (btrim(justificativa) <> ''),
    CONSTRAINT ck_fornecedor_ativacao_usuario_preenchido       CHECK (btrim(usuario) <> '')
);

CREATE INDEX ix_fornecedor_ativacao_fornecedor ON fornecedor_ativacao (fornecedor_codigo);

-- -----------------------------------------------------------------------------
-- Log de transação (RNF0012, P8.3, CA08) - ver D7
-- Uma linha para cada inclusão, alteração, inativação e ativação.
-- -----------------------------------------------------------------------------

CREATE TABLE log_transacao (
    id                BIGINT       GENERATED ALWAYS AS IDENTITY,
    data_hora         TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario           VARCHAR(100) NOT NULL,
    operacao          VARCHAR(10)  NOT NULL,
    fornecedor_codigo VARCHAR(10)  NOT NULL,
    dados_anteriores  JSONB        NULL,      -- nulo apenas na inclusão
    dados_novos       JSONB        NOT NULL,
    CONSTRAINT pk_log_transacao PRIMARY KEY (id),
    CONSTRAINT fk_log_transacao_fornecedor
        FOREIGN KEY (fornecedor_codigo) REFERENCES fornecedor (codigo),
    CONSTRAINT ck_log_transacao_operacao
        CHECK (operacao IN ('INCLUSAO', 'ALTERACAO', 'INATIVACAO', 'ATIVACAO')),
    CONSTRAINT ck_log_transacao_usuario_preenchido CHECK (btrim(usuario) <> ''),
    CONSTRAINT ck_log_transacao_dados_anteriores
        CHECK ((operacao = 'INCLUSAO') = (dados_anteriores IS NULL))
);

CREATE INDEX ix_log_transacao_fornecedor ON log_transacao (fornecedor_codigo);

-- -----------------------------------------------------------------------------
-- Entrada em estoque (RN0050, RN0086, CA07) - fora do escopo desta etapa.
-- O modelo já permite a relação: a tabela de entrada em estoque terá uma
-- chave estrangeira para fornecedor (codigo), e a verificação da RN0086
-- consulta fornecedor.status. Exemplo, não executado aqui:
--
--   fornecedor_codigo VARCHAR(10) NOT NULL REFERENCES fornecedor (codigo)
-- -----------------------------------------------------------------------------

COMMIT;
