import { api } from "./api.js";
import {
  camposObrigatoriosVazios, criarIcones, destacarCamposComErro, limparErrosDosCampos, preencherCombo,
  removerComAnimacao,
} from "./comum.js";

const OPERACOES = {
  inativar: {
    titulo: "Inativar Fornecedor",
    substantivo: "inativação",
    participio: "inativado",
    icone: "ban",
    classeIcone: "icon-inativar",
    classeBotao: "botao--perigo",
    categorias: (dominios) => dominios.categoriasInativacao,
    enviar: api.inativar,
  },
  ativar: {
    titulo: "Ativar Fornecedor",
    substantivo: "ativação",
    participio: "ativado",
    icone: "circle-check",
    classeIcone: "icon-ativar",
    classeBotao: "botao--primario",
    categorias: (dominios) => dominios.categoriasAtivacao,
    enviar: api.ativar,
  },
};

export function abrirModalStatus({ fornecedor, operacao: nomeDaOperacao, dominios, aoConcluir }) {
  const operacao = OPERACOES[nomeDaOperacao];
  const modal = criarModal(operacao);
  const elemento = (seletor) => modal.querySelector(seletor);
  const categoria = elemento("#cboCategoria");
  const justificativa = elemento("#txtJustificativa");
  const alerta = elemento("#modalStatusAlert");
  const botaoConfirmar = elemento("#btnConfirmarStatus");

  elemento(".modal-subtitle").textContent = `${fornecedor.codigo} · ${fornecedor.razaoSocial} · ${fornecedor.cnpj}`;
  preencherCombo(categoria, operacao.categorias(dominios));
  elemento("#btnCancelarStatus").addEventListener("click", fechar);
  botaoConfirmar.addEventListener("click", confirmar);
  document.body.append(modal);
  criarIcones();

  async function confirmar() {
    limparErros();
    const obrigatoriosVazios = camposObrigatoriosVazios(modal);
    if (obrigatoriosVazios.length > 0) exibirObrigatoriosVazios(obrigatoriosVazios);
    else await enviar();
  }

  function limparErros() {
    limparErrosDosCampos(modal);
    alerta.hidden = true;
  }

  function exibirObrigatoriosVazios(campos) {
    destacarCamposComErro(campos);
    exibirErro(`Informe a ${campos[0].name} da ${operacao.substantivo}.`);
  }

  async function enviar() {
    botaoConfirmar.disabled = true;
    try {
      await operacao.enviar(fornecedor.codigo, { categoria: categoria.value, justificativa: justificativa.value.trim() });
    } catch (erro) {
      exibirErro(erro.message);
      botaoConfirmar.disabled = false;
      return;
    }
    fechar();
    aoConcluir(`Fornecedor ${fornecedor.codigo} ${operacao.participio} com sucesso.`);
  }

  function exibirErro(mensagem) {
    elemento("#modalStatusAlertText").textContent = mensagem;
    alerta.hidden = false;
  }

  function fechar() {
    removerComAnimacao(modal);
  }
}

function criarModal(operacao) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="lblTituloModal">
      <div class="modal-header">
        <span class="modal-icon ${operacao.classeIcone}">
          <i data-lucide="${operacao.icone}" class="icone" aria-hidden="true"></i>
        </span>
        <div>
          <h2 id="lblTituloModal" class="modal-title">${operacao.titulo}</h2>
          <p class="modal-subtitle"></p>
        </div>
      </div>
      <div class="modal-body">
        <div id="modalStatusAlert" class="form-alert" hidden>
          <i data-lucide="circle-alert" class="icone" aria-hidden="true"></i>
          <span id="modalStatusAlertText"></span>
        </div>
        <div class="campo" data-field="categoria">
          <label for="cboCategoria">Categoria de ${operacao.substantivo} <span class="obrigatorio">*</span></label>
          <select id="cboCategoria" name="categoria">
            <option value="">Selecione</option>
          </select>
          <span class="field-error" hidden>Campo obrigatório</span>
        </div>
        <div class="campo" data-field="justificativa">
          <label for="txtJustificativa">Justificativa <span class="obrigatorio">*</span></label>
          <textarea id="txtJustificativa" name="justificativa" rows="4" maxlength="255"></textarea>
          <span class="char-counter">Máximo de 255 caracteres</span>
          <span class="field-error" hidden>Campo obrigatório</span>
        </div>
      </div>
      <div class="modal-actions">
        <button type="button" class="botao" id="btnCancelarStatus">Cancelar</button>
        <button type="button" class="botao ${operacao.classeBotao}" id="btnConfirmarStatus">Confirmar</button>
      </div>
    </div>
  `;
  return modal;
}
