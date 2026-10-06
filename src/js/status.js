/*
 * Tela 11.4 (Inativação e Ativação) – CDU01 Manter Cadastro de Fornecedores.
 * Dona: Pessoa B. Função exposta conforme docs/contrato-integracao.md, seção 5.
 */

/**
 * Abre a tela 11.4 sobre a tela de busca.
 * @param {object} fornecedor  objeto no formato do contrato (seção 2)
 * @param {"inativar"|"ativar"} operacao
 * @param {function} [aoConcluir] callback opcional chamado após Confirmar válido
 */
function abrirModalStatus(fornecedor, operacao, aoConcluir) {
  "use strict";

  const isInativar = operacao === "inativar";
  // RN0084 (inativação) / RN0085 (ativação) - categorias carregadas como domínio (RNF0013).
  const categorias = isInativar ? dominios.categoriasInativacao : dominios.categoriasAtivacao;

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  // Apenas a estrutura estática vai para o innerHTML; os dados do fornecedor (razão
  // social, CNPJ etc.) são preenchidos depois via textContent para não permitir
  // injeção de HTML a partir de dados que, na entrega final, vêm do usuário.
  overlay.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true">
      <div class="modal-header">
        <span class="modal-icon ${isInativar ? "icon-inativar" : "icon-ativar"}">
          <i data-lucide="${isInativar ? "ban" : "circle-check"}" class="icone" aria-hidden="true"></i>
        </span>
        <div>
          <h2 class="modal-title"></h2>
          <p class="modal-subtitle"></p>
        </div>
      </div>
      <div class="modal-body">
        <div id="modalStatusAlert" class="form-alert" hidden>
          <i data-lucide="circle-alert" class="icone" aria-hidden="true"></i>
          <span id="modalStatusAlertText"></span>
        </div>
        <div class="campo" data-field="categoria">
          <label for="cboCategoria">${isInativar ? "Categoria de inativação" : "Categoria de ativação"} <span class="obrigatorio">*</span></label>
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
        <button type="button" class="botao ${isInativar ? "botao--perigo" : "botao--primario"}" id="btnConfirmarStatus">Confirmar</button>
      </div>
    </div>
  `;

  overlay.querySelector(".modal-title").textContent = isInativar ? "Inativar Fornecedor" : "Ativar Fornecedor";
  overlay.querySelector(".modal-subtitle").textContent =
    `${fornecedor.codigo} · ${fornecedor.razaoSocial} · ${fornecedor.cnpj}`;

  document.body.appendChild(overlay);
  if (window.lucide) lucide.createIcons();

  const cboCategoria = overlay.querySelector("#cboCategoria");
  categorias.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria.codigo;
    option.textContent = categoria.nome;
    cboCategoria.appendChild(option);
  });

  // Tabela 11.4 - Confirmar exige FORNECEDOR_INATIVAR ou FORNECEDOR_ATIVAR.
  const btnConfirmar = overlay.querySelector("#btnConfirmarStatus");
  btnConfirmar.disabled = !usuarioLogado.permissoes.includes(
    isInativar ? "FORNECEDOR_INATIVAR" : "FORNECEDOR_ATIVAR"
  );

  const txtJustificativa = overlay.querySelector("#txtJustificativa");
  const alertBox = overlay.querySelector("#modalStatusAlert");
  const alertText = overlay.querySelector("#modalStatusAlertText");

  function fecharModal() {
    overlay.remove();
  }

  function limparErros() {
    overlay.querySelectorAll(".campo.has-error").forEach((campo) => campo.classList.remove("has-error"));
    overlay.querySelectorAll(".field-error").forEach((span) => (span.hidden = true));
    alertBox.hidden = true;
  }

  // A4.3 / A5.3 - verifica se a categoria e a justificativa foram informadas.
  function validar() {
    limparErros();
    const categoriaPreenchida = !!cboCategoria.value;
    const justificativaPreenchida = !!txtJustificativa.value.trim();

    if (categoriaPreenchida && justificativaPreenchida) return true;

    // E4 - mensagem indicando o campo não informado, retorna a A4.1/A5.1.
    const camposFaltando = [];
    if (!categoriaPreenchida) {
      camposFaltando.push({ seletor: '[data-field="categoria"]', mensagem: "Informe a categoria da " + (isInativar ? "inativação" : "ativação") + "." });
    }
    if (!justificativaPreenchida) {
      camposFaltando.push({ seletor: '[data-field="justificativa"]', mensagem: "Informe a justificativa da " + (isInativar ? "inativação" : "ativação") + "." });
    }

    camposFaltando.forEach(({ seletor, mensagem }) => {
      const campo = overlay.querySelector(seletor);
      campo.classList.add("has-error");
      const erro = campo.querySelector(".field-error");
      if (erro) erro.hidden = false;
    });

    alertText.textContent = camposFaltando[0].mensagem;
    alertBox.hidden = false;
    return false;
  }

  overlay.querySelector("#btnCancelarStatus").addEventListener("click", function () {
    fecharModal(); // A4.2/A5.2 opção Cancelar - volta a P1.2 (fecha o modal sobre a busca)
  });

  btnConfirmar.addEventListener("click", function () {
    if (!validar()) return; // E4

    // A4.4/A5.4 - altera o status, persiste categoria/justificativa (back-end, fora do escopo).
    fecharModal();
    if (typeof aoConcluir === "function") {
      aoConcluir({
        categoria: cboCategoria.value,
        justificativa: txtJustificativa.value.trim(),
        novoStatus: isInativar ? "INATIVO" : "ATIVO",
      });
    }
  });
}
