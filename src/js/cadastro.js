/*
 * Tela 11.3 (Cadastro de Fornecedor) – CDU01 Manter Cadastro de Fornecedores.
 * Dona: Pessoa B. Contrato com a Pessoa A: docs/contrato-integracao.md.
 * Modos novo/alterar/visualizar (P3-P6, A1, A3, E1).
 */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  // RN0081 - Razão Social, Nome Fantasia, CNPJ, E-mail e Telefone (tipo + DDD + número)
  // RN0082 - Tipo Logradouro, Logradouro, Número, Bairro, CEP, Cidade, Estado e País
  const CAMPOS_OBRIGATORIOS = [
    { name: "razaoSocial", label: "Razão Social" },
    { name: "nomeFantasia", label: "Nome Fantasia" },
    { name: "cnpj", label: "CNPJ" },
    { name: "email", label: "E-mail" },
    { name: "telefone.tipo", label: "Tipo de Telefone" },
    { name: "telefone.ddd", label: "DDD" },
    { name: "telefone.numero", label: "Número do Telefone" },
    { name: "endereco.tipoLogradouro", label: "Tipo de Logradouro" },
    { name: "endereco.logradouro", label: "Logradouro" },
    { name: "endereco.numero", label: "Número" },
    { name: "endereco.bairro", label: "Bairro" },
    { name: "endereco.cep", label: "CEP" },
    { name: "endereco.cidade", label: "Cidade" },
    { name: "endereco.estado", label: "Estado" },
    { name: "endereco.pais", label: "País" },
  ];

  const form = $("formCadastro");
  const btnSalvar = $("btnSalvar");
  const btnCancelar = $("btnCancelar");
  const pageTitle = $("pageTitle");
  const statusBadge = $("statusBadge");
  const requiredHint = $("requiredHint");
  const formAlert = $("formAlert");
  const formAlertDetail = $("formAlertDetail");

  function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      modo: params.get("modo") || "novo",
      codigo: params.get("codigo") || "",
      cnpj: params.get("cnpj") || "",
    };
  }

  // RNF0013 - os combobox assumem os dados das tabelas de domínio (js/dominios.js).
  function preencherCombo(select, opcoes, valorProp, textoProp) {
    opcoes.forEach((opcao) => {
      const option = document.createElement("option");
      option.value = opcao[valorProp];
      option.textContent = opcao[textoProp];
      select.appendChild(option);
    });
  }

  function preencherCombos() {
    preencherCombo($("cboTipoTelefone"), dominios.tiposTelefone, "codigo", "nome");
    preencherCombo($("cboTipoLogradouro"), dominios.tiposLogradouro, "codigo", "nome");
    preencherCombo($("cboEstado"), dominios.estados, "sigla", "nome");
    preencherCombo($("cboPais"), dominios.paises, "codigo", "nome");
  }

  // P3 - identificação do usuário autenticado (usuarioLogado vem de js/mock-fornecedores.js).
  function exibirUsuario() {
    $("lblNomeUsuario").textContent = usuarioLogado.nome;
    $("lblPerfilUsuario").textContent = usuarioLogado.perfil;
    $("lblIniciaisUsuario").textContent = usuarioLogado.nome
      .split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  }

  // Busca o fornecedor no mock da Pessoa A (js/mock-fornecedores.js, contrato seção 2).
  function buscarFornecedorPorCodigo(codigo) {
    return fornecedores.find((f) => f.codigo === codigo) || null;
  }

  // Os name="" do formulário seguem o contrato (seção 2), incluindo os aninhados
  // (telefone.ddd, endereco.cidade etc.), então dá para percorrer form.elements.
  function preencherFormulario(fornecedor) {
    for (const campo of form.elements) {
      if (!campo.name) continue;
      const valor = campo.name.split(".").reduce((atual, chave) => (atual ? atual[chave] : undefined), fornecedor);
      campo.value = valor ?? "";
    }
  }

  function exibirStatusBadge(status) {
    const ativo = status === "ATIVO";
    statusBadge.hidden = false;
    statusBadge.textContent = ativo ? "ATIVO" : "INATIVO";
    statusBadge.classList.remove("badge--ativo", "badge--inativo");
    statusBadge.classList.add(ativo ? "badge--ativo" : "badge--inativo");
  }

  // A1.1 - na visualização todos os campos são somente leitura.
  function aplicarSomenteLeitura() {
    for (const campo of form.elements) {
      if (!campo.name) continue;
      if (campo.tagName === "SELECT") campo.disabled = true;
      else campo.readOnly = true;
    }
    btnSalvar.hidden = true; // A1: na visualização só o Cancelar fica disponível.
    requiredHint.hidden = true;
  }

  function inicializar() {
    exibirUsuario();
    preencherCombos();
    aplicarMascarasEEntradaNumerica();
    if (window.lucide) lucide.createIcons();

    const { modo, codigo, cnpj } = getParams();

    if (modo === "novo") {
      pageTitle.textContent = "Novo Fornecedor";
      // P1.3 / P4.1 - CNPJ recuperado quando usado como parâmetro de busca.
      if (cnpj) $("txtCnpj").value = cnpj;
    } else if (modo === "alterar") {
      pageTitle.textContent = "Alterar Fornecedor";
      const fornecedor = buscarFornecedorPorCodigo(codigo);
      if (fornecedor) preencherFormulario(fornecedor); // A3.1 - Código permanece não editável.
    } else if (modo === "visualizar") {
      pageTitle.textContent = "Visualizar Fornecedor";
      const fornecedor = buscarFornecedorPorCodigo(codigo);
      if (fornecedor) {
        preencherFormulario(fornecedor);
        exibirStatusBadge(fornecedor.status); // A1.1 - status também é exibido.
      }
      aplicarSomenteLeitura();
    }

    // Tabela 11.3 - Salvar exige FORNECEDOR_INCLUIR (inclusão) ou FORNECEDOR_ALTERAR (alteração).
    const permissaoSalvar = modo === "novo" ? "FORNECEDOR_INCLUIR" : "FORNECEDOR_ALTERAR";
    btnSalvar.disabled = !usuarioLogado.permissoes.includes(permissaoSalvar);
  }

  // CNPJ com máscara 00.000.000/0000-00.
  function aplicarMascaraCnpj(valor) {
    const digitos = valor.replace(/\D/g, "").slice(0, 14);
    if (digitos.length > 12) return digitos.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})$/, "$1.$2.$3/$4-$5");
    if (digitos.length > 8) return digitos.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4})$/, "$1.$2.$3/$4");
    if (digitos.length > 5) return digitos.replace(/^(\d{2})(\d{3})(\d{1,3})$/, "$1.$2.$3");
    if (digitos.length > 2) return digitos.replace(/^(\d{2})(\d{1,3})$/, "$1.$2");
    return digitos;
  }

  function aplicarMascarasEEntradaNumerica() {
    $("txtCnpj").addEventListener("input", (evento) => {
      evento.target.value = aplicarMascaraCnpj(evento.target.value);
    });
    // Aceita 8 ou 9 dígitos para o número do telefone.
    ["txtDdd", "txtNumeroTelefone", "txtCep"].forEach((id) => {
      $(id).addEventListener("input", (evento) => {
        evento.target.value = evento.target.value.replace(/\D/g, "");
      });
    });
  }

  function limparErros() {
    form.querySelectorAll(".campo.has-error").forEach((campo) => campo.classList.remove("has-error"));
    form.querySelectorAll(".field-error").forEach((span) => (span.hidden = true));
    formAlert.hidden = true;
  }

  // P6 - verificação dos dados obrigatórios (RN0081/RN0082). Retorna os campos pendentes.
  function validarObrigatorios() {
    const pendentes = [];
    CAMPOS_OBRIGATORIOS.forEach(({ name, label }) => {
      const campo = form.querySelector(`[name="${CSS.escape(name)}"]`);
      const valor = (campo.value || "").trim();
      if (!valor) pendentes.push({ name, label, campo });
    });
    return pendentes;
  }

  // E1 - destaca os campos pendentes, mostra quais estão faltando e mantém os dados digitados.
  function exibirErrosValidacao(pendentes) {
    pendentes.forEach(({ name, campo }) => {
      const wrapper = form.querySelector(`.campo[data-field="${CSS.escape(name)}"]`);
      wrapper.classList.add("has-error");
      const erro = wrapper.querySelector(".field-error");
      if (erro) erro.hidden = false;
    });
    const labels = pendentes.map((p) => p.label);
    const listaLabels =
      labels.length > 1 ? labels.slice(0, -1).join(", ") + " e " + labels[labels.length - 1] : labels[0];
    formAlertDetail.textContent = "Preencha: " + listaLabels + ". Os dados já digitados foram mantidos.";
    formAlert.hidden = false;
    pendentes[0].campo.focus();
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault(); // P5/A3.2 opção 'a' - Salvar
    limparErros();

    const pendentes = validarObrigatorios();
    if (pendentes.length > 0) {
      exibirErrosValidacao(pendentes); // E1
      return;
    }

    // P7 (unicidade do CNPJ) e P8 (persistência) são do back-end e não são simulados aqui.
    window.location.href = "index.html"; // P8.4 / volta a P1.2
  });

  btnCancelar.addEventListener("click", function () {
    window.location.href = "index.html"; // P5 opção 'b' / A3.2 opção 'b' / A1.2
  });

  inicializar();
})();
