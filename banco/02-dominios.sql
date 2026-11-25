-- =============================================================================
-- CDU01 - Manter Cadastro de Fornecedores | Etapa 2 | Script de domínios
-- RNF0013 - Cadastro de domínios (pré-condição 7.2 do caso de uso)
--
-- Executar depois de 01-ddl.sql. Pode ser executado mais de uma vez: registros
-- já existentes são mantidos.
--
-- ATENÇÃO (A1): a especificação e o DRS não definem os valores das categorias
-- de inativação e de ativação, dos tipos de telefone, dos tipos de logradouro
-- nem dos países. Os valores abaixo são os mesmos exibidos nos combobox da
-- Etapa 1 (src/js/dominios.js) e ficam como provisórios até a resposta do
-- professor. Os estados são as 27 unidades federativas do Brasil.
-- =============================================================================

BEGIN;

INSERT INTO tipo_telefone (codigo, nome) VALUES
    ('COMERCIAL',   'Comercial'),
    ('CELULAR',     'Celular'),
    ('RESIDENCIAL', 'Residencial'),
    ('WHATSAPP',    'WhatsApp')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO tipo_logradouro (codigo, nome) VALUES
    ('RUA',      'Rua'),
    ('AVENIDA',  'Avenida'),
    ('ALAMEDA',  'Alameda'),
    ('TRAVESSA', 'Travessa'),
    ('RODOVIA',  'Rodovia')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO estado (sigla, nome) VALUES
    ('AC', 'Acre'),
    ('AL', 'Alagoas'),
    ('AP', 'Amapá'),
    ('AM', 'Amazonas'),
    ('BA', 'Bahia'),
    ('CE', 'Ceará'),
    ('DF', 'Distrito Federal'),
    ('ES', 'Espírito Santo'),
    ('GO', 'Goiás'),
    ('MA', 'Maranhão'),
    ('MT', 'Mato Grosso'),
    ('MS', 'Mato Grosso do Sul'),
    ('MG', 'Minas Gerais'),
    ('PA', 'Pará'),
    ('PB', 'Paraíba'),
    ('PR', 'Paraná'),
    ('PE', 'Pernambuco'),
    ('PI', 'Piauí'),
    ('RJ', 'Rio de Janeiro'),
    ('RN', 'Rio Grande do Norte'),
    ('RS', 'Rio Grande do Sul'),
    ('RO', 'Rondônia'),
    ('RR', 'Roraima'),
    ('SC', 'Santa Catarina'),
    ('SP', 'São Paulo'),
    ('SE', 'Sergipe'),
    ('TO', 'Tocantins')
ON CONFLICT (sigla) DO NOTHING;

INSERT INTO pais (codigo, nome) VALUES
    ('BR', 'Brasil'),
    ('AR', 'Argentina'),
    ('PY', 'Paraguai'),
    ('UY', 'Uruguai'),
    ('US', 'Estados Unidos'),
    ('PT', 'Portugal')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO categoria_inativacao (codigo, nome) VALUES
    ('ENCERRAMENTO_CONTRATO',     'Encerramento de contrato'),
    ('DESCUMPRIMENTO_CONTRATUAL', 'Descumprimento contratual'),
    ('ENCERRAMENTO_ATIVIDADES',   'Encerramento das atividades do fornecedor'),
    ('SOLICITACAO_FORNECEDOR',    'Solicitação do próprio fornecedor'),
    ('OUTRO',                     'Outro motivo')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO categoria_ativacao (codigo, nome) VALUES
    ('RENOVACAO_CONTRATO',      'Renovação de contrato'),
    ('REGULARIZACAO_PENDENCIA', 'Regularização de pendência'),
    ('RETORNO_OPERACAO',        'Retorno às atividades'),
    ('OUTRO',                   'Outro motivo')
ON CONFLICT (codigo) DO NOTHING;

COMMIT;
