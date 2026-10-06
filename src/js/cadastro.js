// js/cadastro.js (Pessoa B) - Tela 11.3, modos novo/alterar/visualizar (P3-P6, A1, A3, E1).
(function () {
  "use strict";

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

  const form = document.getElementById("formCadastro");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnCancelar = document.getElementById("btnCancelar");
  const pageTitle = document.getElementById("pageTitle");
  const statusBadge = document.getElementById("statusBadge");
  const requiredHint = document.getElementById("requiredHint");
  const formAlert = document.getElementById("formAlert");
  const formAlertDetail = document.getElementById("formAlertDetail");

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
    preencherCombo(document.getElementById("cboTipoTelefone"), dominios.tiposTelefone, "codigo", "nome");
    preencherCombo(document.getElementById("cboTipoLogradouro"), dominios.tiposLogradouro, "codigo", "nome");
    preencherCombo(document.getElementById("cboEstado"), dominios.estados, "sigla", "nome");
    preencherCombo(document.getElementById("cboPais"), dominios.paises, "codigo", "nome");
  }

  // P3 - identificação do usuário autenticado. usuarioLogado vem de js/mock-fornecedores.js
  // (Pessoa A, contrato seção 6); usa um valor padrão enquanto esse arquivo não existir.
  function preencherTopbar() {
    const usuario =
      typeof usuarioLogado !== "undefined"
        ? usuarioLogado
        : { nome: "Usuário", perfil: "Administrador" };
    document.getElementById("topbarUserName").textContent = usuario.nome;
    document.getElementById("topbarUserRole").textContent = usuario.perfil;
    document.getElementById("topbarUserAvatar").textContent = usuario.nome
      .split(" ")
      .map((parte) => parte[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  // Busca o fornecedor no mock da Pessoa A (js/mock-fornecedores.js, contrato seção 2).
  function buscarFornecedorPorCodigo(codigo) {
    if (typeof mockFornecedores === "undefined") return null;
    return mockFornecedores.find((f) => f.codigo === codigo) || null;
  }

  function getCampo(name) {
    return form.querySelector(`[name="${CSS.escape(name)}"]`);
  }

  function preencherFormulario(fornecedor) {
    getCampo("codigo").value = fornecedor.codigo || "";
    getCampo("razaoSocial").value = fornecedor.razaoSocial || "";
    getCampo("nomeFantasia").value = fornecedor.nomeFantasia || "";
    getCampo("cnpj").value = fornecedor.cnpj || "";
    getCampo("email").value = fornecedor.email || "";
    getCampo("telefone.tipo").value = (fornecedor.telefone || {}).tipo || "";
    getCampo("telefone.ddd").value = (fornecedor.telefone || {}).ddd || "";
    getCampo("telefone.numero").value = (fornecedor.telefone || {}).numero || "";
    getCampo("endereco.tipoLogradouro").value = (fornecedor.endereco || {}).tipoLogradouro || "";
    getCampo("endereco.logradouro").value = (fornecedor.endereco || {}).logradouro || "";
    getCampo("endereco.numero").value = (fornecedor.endereco || {}).numero || "";
    getCampo("endereco.complemento").value = (fornecedor.endereco || {}).complemento || "";
    getCampo("endereco.bairro").value = (fornecedor.endereco || {}).bairro || "";
    getCampo("endereco.cep").value = (fornecedor.endereco || {}).cep || "";
    getCampo("endereco.cidade").value = (fornecedor.endereco || {}).cidade || "";
    getCampo("endereco.estado").value = (fornecedor.endereco || {}).estado || "";
    getCampo("endereco.pais").value = (fornecedor.endereco || {}).pais || "";
  }

  function exibirStatusBadge(status) {
    statusBadge.hidden = false;
    statusBadge.textContent = status === "ATIVO" ? "ATIVO" : "INATIVO";
    statusBadge.classList.remove("status-ativo", "status-inativo");
    statusBadge.classList.add(status === "ATIVO" ? "status-ativo" : "status-inativo");
  }

  // A1.1 - na visualização todos os campos são somente leitura.
  function aplicarSomenteLeitura() {
    form.querySelectorAll("input, select, textarea").forEach((campo) => {
      if (campo.tagName === "SELECT") campo.setAttribute("disabled", "disabled");
      else campo.setAttribute("readonly", "readonly");
    });
    btnSalvar.hidden = true; // Ambiguidade #1 (docs/ambiguidades.md): só Cancelar na visualização.
    requiredHint.hidden = true;
  }

  function inicializar() {
    preencherTopbar();
    preencherCombos();
    aplicarMascarasEEntradaNumerica();

    const { modo, codigo, cnpj } = getParams();

    if (modo === "novo") {
      pageTitle.textContent = "Novo Fornecedor";
      // P1.3 / P4.1 - CNPJ recuperado quando usado como parâmetro de busca.
      if (cnpj) getCampo("cnpj").value = cnpj;
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
  }

  // Ambiguidade #3 (docs/ambiguidades.md): CNPJ com máscara 00.000.000/0000-00.
  function aplicarMascaraCnpj(valor) {
    const digitos = valor.replace(/\D/g, "").slice(0, 14);
    if (digitos.length > 12) return digitos.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})$/, "$1.$2.$3/$4-$5");
    if (digitos.length > 8) return digitos.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4})$/, "$1.$2.$3/$4");
    if (digitos.length > 5) return digitos.replace(/^(\d{2})(\d{3})(\d{1,3})$/, "$1.$2.$3");
    if (digitos.length > 2) return digitos.replace(/^(\d{2})(\d{1,3})$/, "$1.$2");
    return digitos;
  }

  function aplicarMascarasEEntradaNumerica() {
    getCampo("cnpj").addEventListener("input", (evento) => {
      evento.target.value = aplicarMascaraCnpj(evento.target.value);
    });
    // Ambiguidade #5: aceita 8 ou 9 dígitos para o número do telefone.
    ["telefone.ddd", "telefone.numero", "endereco.cep"].forEach((name) => {
      getCampo(name).addEventListener("input", (evento) => {
        evento.target.value = evento.target.value.replace(/\D/g, "");
      });
    });
  }

  function limparErros() {
    form.querySelectorAll(".field.has-error").forEach((campo) => campo.classList.remove("has-error"));
    form.querySelectorAll(".field-error").forEach((span) => (span.hidden = true));
    formAlert.hidden = true;
  }

  // P6 - verificação dos dados obrigatórios (RN0081/RN0082). Retorna os campos pendentes.
  function validarObrigatorios() {
    const pendentes = [];
    CAMPOS_OBRIGATORIOS.forEach(({ name, label }) => {
      const campo = getCampo(name);
      const valor = (campo.value || "").trim();
      if (!valor) pendentes.push({ name, label, campo });
    });
    return pendentes;
  }

  // E1 - destaca os campos pendentes, mostra quais estão faltando e mantém os dados digitados.
  function exibirErrosValidacao(pendentes) {
    pendentes.forEach(({ name, campo }) => {
      const wrapper = form.querySelector(`.field[data-field="${CSS.escape(name)}"]`);
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
