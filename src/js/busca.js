/*
 * Telas 11.1 (Busca) e 11.2 (Resultado da Busca) – CDU01 Manter Cadastro de Fornecedores.
 * Dona: Pessoa A. Contrato com a Pessoa B: docs/contrato-integracao.md.
 */
(function () {
  const $ = (id) => document.getElementById(id);

  const form = $("frmBusca");
  const campos = {
    codigo: $("txtCodigo"),
    razaoSocial: $("txtRazaoSocial"),
    nomeFantasia: $("txtNomeFantasia"),
    cnpj: $("txtCnpj"),
    cidade: $("txtCidade"),
    estado: $("cboEstado"),
    status: $("cboStatus")
  };
  const botoes = {
    novo: $("btnNovo"),
    visualizar: $("btnVisualizar"),
    alterar: $("btnAlterar"),
    inativar: $("btnInativar"),
    ativar: $("btnAtivar")
  };
  const tabela = $("tblResultado");
  const corpoTabela = tabela.querySelector("tbody");
  const msgNenhumEncontrado = $("msgNenhumEncontrado");
  const CHAVE_PARAMETROS = "fornecedores.parametrosBusca";

  // Estado da tela
  let consultaRealizada = false;   // P1.3: Novo só depois de uma consulta
  let parametrosAlterados = false; // P1.3: parâmetros mudaram depois da busca
  let cnpjDaConsulta = "";         // P1.3: CNPJ usado como parâmetro vai para o novo cadastro
  let resultado = [];
  let selecionado = null;          // P1.3: somente um fornecedor pode ser selecionado

  // ---------- P3: identificação do usuário autenticado ----------
  function exibirUsuario() {
    $("lblNomeUsuario").textContent = usuarioLogado.nome;
    $("lblPerfilUsuario").textContent = usuarioLogado.perfil;
    $("lblIniciaisUsuario").textContent = usuarioLogado.nome
      .split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  }

  const temPermissao = (botao) => usuarioLogado.permissoes.includes(botao.dataset.permissao);

  // ---------- RNF0013: combobox de Estado vem da tabela de domínio ----------
  function carregarEstados() {
    for (const { sigla, nome } of dominios.estados) {
      campos.estado.add(new Option(sigla, sigla));
      campos.estado.options[campos.estado.options.length - 1].title = nome;
    }
  }

  // Ambiguidade nº 3: CNPJ Alfanumérico 18 tratado com a máscara 00.000.000/0000-00
  function mascararCnpj(valor) {
    const d = valor.replace(/\D/g, "").slice(0, 14);
    return d
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  const normalizar = (texto) =>
    (texto || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const contem = (valor, filtro) => !filtro || normalizar(valor).includes(normalizar(filtro));
  const soDigitos = (texto) => (texto || "").replace(/\D/g, "");

  function lerParametros() {
    return {
      codigo: campos.codigo.value.trim(),
      razaoSocial: campos.razaoSocial.value.trim(),
      nomeFantasia: campos.nomeFantasia.value.trim(),
      cnpj: campos.cnpj.value.trim(),
      cidade: campos.cidade.value.trim(),
      estado: campos.estado.value,
      status: campos.status.value
    };
  }

  // ---------- RF0085 / P1.1: parâmetros combinados ou isolados ----------
  function filtrar(p) {
    return fornecedores.filter((f) =>
      contem(f.codigo, p.codigo) &&
      contem(f.razaoSocial, p.razaoSocial) &&
      contem(f.nomeFantasia, p.nomeFantasia) &&
      (!soDigitos(p.cnpj) || soDigitos(f.cnpj).includes(soDigitos(p.cnpj))) &&
      contem(f.endereco.cidade, p.cidade) &&
      (!p.estado || f.endereco.estado === p.estado) &&
      (p.status === "TODOS" || f.status === p.status)
    );
  }

  // ---------- P1.2: o usuário solicita a busca ----------
  function buscar() {
    const parametros = lerParametros();
    resultado = filtrar(parametros); // RNF0011: sem atraso artificial; a medição é do back-end
    consultaRealizada = true;
    parametrosAlterados = false;
    cnpjDaConsulta = parametros.cnpj;
    selecionado = null;
    try { sessionStorage.setItem(CHAVE_PARAMETROS, JSON.stringify(parametros)); } catch (e) { /* opcional */ }
    renderizarResultado();
    atualizarBotoes();
  }

  // ---------- P1.3: lista com código, razão social, nome fantasia, CNPJ, cidade, estado e status ----------
  function renderizarResultado() {
    corpoTabela.replaceChildren();
    const vazio = resultado.length === 0;
    tabela.hidden = vazio;
    msgNenhumEncontrado.hidden = !vazio; // E3: mensagem na própria tela de pesquisa

    for (const f of resultado) {
      const tr = document.createElement("tr");
      tr.dataset.codigo = f.codigo;

      const tdSelecao = document.createElement("td");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "fornecedorSelecionado";
      radio.value = f.codigo;
      radio.setAttribute("aria-label", `Selecionar ${f.razaoSocial}`);
      tdSelecao.append(radio);
      tr.append(tdSelecao);

      const colunas = [f.codigo, f.razaoSocial, f.nomeFantasia, f.cnpj, f.endereco.cidade, f.endereco.estado];
      colunas.forEach((valor, i) => {
        const td = document.createElement("td");
        td.textContent = valor;
        if (i === 1) td.className = "razao";
        tr.append(td);
      });

      const tdStatus = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = `badge badge--${f.status === "ATIVO" ? "ativo" : "inativo"}`;
      badge.textContent = f.status;
      tdStatus.append(badge);
      tr.append(tdStatus);

      tr.addEventListener("click", () => selecionar(f.codigo));
      corpoTabela.append(tr);
    }
  }

  // P1.3: somente um fornecedor listado pode ser selecionado
  function selecionar(codigo) {
    selecionado = resultado.find((f) => f.codigo === codigo) || null;
    for (const tr of corpoTabela.rows) {
      const marcado = tr.dataset.codigo === codigo;
      tr.classList.toggle("selecionado", marcado);
      tr.querySelector("input[type=radio]").checked = marcado;
    }
    atualizarBotoes();
  }

  // ---------- P2: habilitação das opções (sempre conforme a permissão de acesso) ----------
  function atualizarBotoes() {
    const regras = {
      novo: consultaRealizada && !parametrosAlterados,          // P1.3 / CA05
      visualizar: !!selecionado,                                // P2
      alterar: !!selecionado,                                   // P2
      inativar: !!selecionado && selecionado.status === "ATIVO",  // P2 / RN0086
      ativar: !!selecionado && selecionado.status === "INATIVO"   // P2 / RN0086
    };
    for (const [nome, habilitado] of Object.entries(regras)) {
      botoes[nome].disabled = !(habilitado && temPermissao(botoes[nome]));
    }
  }

  // P1.3: modificou os parâmetros, não é permitido inserir até uma nova busca
  function aoAlterarParametro() {
    if (!consultaRealizada || parametrosAlterados) return;
    parametrosAlterados = true;
    atualizarBotoes();
  }

  // ---------- Navegação (docs/contrato-integracao.md, seção 5) ----------
  function irParaCadastro(modo, extras) {
    const params = new URLSearchParams({ modo, ...extras });
    window.location.href = `cadastro.html?${params}`;
  }

  // A4/A5 são da Pessoa B (js/status.js). Stub enquanto a função não existir.
  function abrirStatus(operacao) {
    if (typeof window.abrirModalStatus === "function") {
      window.abrirModalStatus(selecionado, operacao, buscar); // A4.5/A5.5: volta a P1.2
    } else {
      console.log(`[stub] abrirModalStatus(${selecionado.codigo}, "${operacao}") – aguardando js/status.js da Pessoa B`);
    }
  }

  // P1.2 / P8.4 / A1.2: ao voltar para a busca, os últimos parâmetros são reapresentados
  function restaurarParametros() {
    let salvos = null;
    try { salvos = JSON.parse(sessionStorage.getItem(CHAVE_PARAMETROS)); } catch (e) { /* opcional */ }
    if (!salvos) return;
    for (const [nome, campo] of Object.entries(campos)) {
      if (salvos[nome] !== undefined) campo.value = salvos[nome];
    }
  }

  // ---------- Eventos ----------
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!temPermissao($("btnBuscar"))) return;
    buscar();
  });
  for (const campo of Object.values(campos)) {
    campo.addEventListener("input", aoAlterarParametro);
    campo.addEventListener("change", aoAlterarParametro);
  }
  campos.cnpj.addEventListener("input", () => {
    campos.cnpj.value = mascararCnpj(campos.cnpj.value);
  });

  // P2 opção a – Novo (segue P3); CNPJ da consulta recuperado no novo cadastro (P1.3 / P4.1)
  botoes.novo.addEventListener("click", () =>
    irParaCadastro("novo", cnpjDaConsulta ? { cnpj: cnpjDaConsulta } : {}));
  // P2 opção b – Visualizar (A2 → A1)
  botoes.visualizar.addEventListener("click", () =>
    irParaCadastro("visualizar", { codigo: selecionado.codigo }));
  // P2 opção c – Alterar (A2 → A3)
  botoes.alterar.addEventListener("click", () =>
    irParaCadastro("alterar", { codigo: selecionado.codigo }));
  // P2 opções d/e – Inativar (A2 → A4) e Ativar (A2 → A5)
  botoes.inativar.addEventListener("click", () => abrirStatus("inativar"));
  botoes.ativar.addEventListener("click", () => abrirStatus("ativar"));

  // ---------- Inicialização ----------
  exibirUsuario();
  carregarEstados();
  restaurarParametros();
  $("btnBuscar").disabled = !temPermissao($("btnBuscar"));
  atualizarBotoes();
})();
