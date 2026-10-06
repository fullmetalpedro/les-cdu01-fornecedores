# Ambiguidades e inconsistências para consultar o professor

As regras da atividade pedem que ambiguidades não sejam resolvidas por suposição. Elas devem ser registradas e comunicadas ao professor. Cada pessoa adiciona aqui as que encontrar na sua parte, e a Pessoa A consolida tudo numa única mensagem.

| # | Onde | Ambiguidade | Decisão provisória no protótipo | Status |
|---|---|---|---|---|
| 1 | 11.3 / A1 | A tabela da tela 11.3 só prevê os botões Salvar e Cancelar. A1.2 diz apenas "volta a P1.2". Qual botão usar para sair da visualização? | Exibir só **Cancelar** na visualização | Aberta |
| 2 | 11.1 / 11.2 / E3 | 11.1 e 11.2 são telas separadas ou uma página só? O E3 exibe a mensagem "na própria tela de pesquisa". | Uma página só, com busca e resultado | Aberta |
| 3 | 11.1 / 11.3 | O CNPJ é "Alfanumérico 18" (com máscara?) e o CEP é "Numérico 8" (sem hífen?). | CNPJ com máscara `00.000.000/0000-00` e CEP com 8 dígitos sem hífen | Aberta |
| 4 | 11.4 / RN0084 / RN0085 | Os documentos não definem os nomes das categorias de inativação e de ativação. | Valores de exemplo em `dominios.js` | Aberta |
| 5 | 11.3 / RN0081 | O número do telefone é "Numérico 9". Telefones fixos têm 8 dígitos: os dois formatos são aceitos? | Aceitar 8 ou 9 dígitos | Aberta |
