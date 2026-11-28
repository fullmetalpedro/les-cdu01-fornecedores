import { api } from "./api.js";
import {
  $, aplicarMascaraCnpj, camposObrigatoriosVazios, carregarSessao, criarIcones, destacarCamposComErro,
  exibirStatusNoBadge, guardarMensagemDeSucesso, limparErrosDosCampos, preencherCombo, somenteDigitos, temPermissao,
} from "./comum.js";

const MODOS = {
  novo: { titulo: "Novo Fornecedor", permissaoParaSalvar: "FORNECEDOR_INCLUIR", acaoConcluida: "cadastrado" },
  alterar: { titulo: "Alterar Fornecedor", permissaoParaSalvar: "FORNECEDOR_ALTERAR", acaoConcluida: "alterado" },
  visualizar: { titulo: "Visualizar Fornecedor" },
};
const IDS_DOS_CAMPOS_NUMERICOS = ["txtDdd", "txtNumeroTelefone", "txtCep"];
const AVISO_DADOS_MANTIDOS = "Os dados já digitados foram mantidos.";

const parametrosDaUrl = new URLSearchParams(window.location.search);
const nomeDoModo = parametrosDaUrl.get("modo") ?? "novo";
const modo = MODOS[nomeDoModo];
const emInclusao = nomeDoModo === "novo";
const emVisualizacao = nomeDoModo === "visualizar";
const codigo = parametrosDaUrl.get("codigo") ?? "";

const formulario = $("formCadastro");
const alerta = $("formAlert");
const botaoSalvar = $("btnSalvar");
const campoCnpj = $("txtCnpj");

const { usuario, dominios } = await carregarSessao();
prepararFormulario();
await preencherDadosIniciais();
criarIcones();

function prepararFormulario() {
  $("pageTitle").textContent = modo.titulo;
  preencherCombos();
  aplicarMascaraCnpj(campoCnpj);
  IDS_DOS_CAMPOS_NUMERICOS.forEach((id) => aceitarSomenteDigitos($(id)));
  formulario.addEventListener("submit", salvar);
  $("btnCancelar").addEventListener("click", voltarParaBusca);
  botaoSalvar.disabled = !temPermissao(usuario, modo.permissaoParaSalvar);
  if (emVisualizacao) aplicarSomenteLeitura();
}

function preencherCombos() {
  preencherCombo($("cboTipoTelefone"), dominios.tiposTelefone);
  preencherCombo($("cboTipoLogradouro"), dominios.tiposLogradouro);
  preencherCombo($("cboEstado"), dominios.estados, { valor: "sigla" });
  preencherCombo($("cboPais"), dominios.paises);
}

function aceitarSomenteDigitos(campo) {
  campo.addEventListener("input", () => {
    campo.value = somenteDigitos(campo.value);
  });
  campo.addEventListener("paste", (evento) => {
    evento.preventDefault();
    colarSomenteDigitos(campo, evento.clipboardData.getData("text"));
  });
}

function colarSomenteDigitos(campo, textoColado) {
  campo.setRangeText(somenteDigitos(textoColado), campo.selectionStart, campo.selectionEnd, "end");
  campo.value = campo.value.slice(0, campo.maxLength);
}

function aplicarSomenteLeitura() {
  for (const campo of camposEditaveis()) {
    if (campo.tagName === "SELECT") campo.disabled = true;
    else campo.readOnly = true;
  }
  botaoSalvar.hidden = true;
  $("requiredHint").hidden = true;
}

function camposEditaveis() {
  return [...formulario.elements].filter((campo) => campo.name && campo.name !== "codigo");
}

async function preencherDadosIniciais() {
  if (emInclusao) campoCnpj.value = parametrosDaUrl.get("cnpj") ?? "";
  else await carregarFornecedor();
}

async function carregarFornecedor() {
  try {
    const fornecedor = await api.consultarPorCodigo(codigo);
    preencherFormulario(fornecedor);
    if (emVisualizacao) exibirStatusNoBadge($("statusBadge"), fornecedor.status);
  } catch (erro) {
    exibirAlerta("Não foi possível carregar o fornecedor", erro.message);
    botaoSalvar.disabled = true;
  }
}

function preencherFormulario(fornecedor) {
  for (const campo of formulario.elements) {
    if (campo.name) campo.value = lerValorDoCaminho(fornecedor, campo.name) ?? "";
  }
}

function lerValorDoCaminho(objeto, caminho) {
  return caminho.split(".").reduce((atual, chave) => atual?.[chave], objeto);
}

async function salvar(evento) {
  evento.preventDefault();
  limparErros();
  const obrigatoriosVazios = camposObrigatoriosVazios(formulario);
  if (obrigatoriosVazios.length > 0) exibirObrigatoriosVazios(obrigatoriosVazios);
  else await enviarFornecedor();
}

function limparErros() {
  limparErrosDosCampos(formulario);
  alerta.hidden = true;
}

function exibirObrigatoriosVazios(campos) {
  destacarCamposComErro(campos);
  const rotulos = campos.map(rotuloDoCampo);
  exibirAlerta("Existem campos obrigatórios não preenchidos", `Preencha: ${listarComE(rotulos)}. ${AVISO_DADOS_MANTIDOS}`);
  campos[0].focus();
}

function rotuloDoCampo(campo) {
  return campo.labels[0].firstChild.textContent.trim();
}

function listarComE(itens) {
  if (itens.length === 1) return itens[0];
  return `${itens.slice(0, -1).join(", ")} e ${itens.at(-1)}`;
}

async function enviarFornecedor() {
  botaoSalvar.disabled = true;
  try {
    const fornecedor = lerFormulario();
    const salvo = emInclusao ? await api.incluir(fornecedor) : await api.alterar(codigo, fornecedor);
    guardarMensagemDeSucesso(`Fornecedor ${salvo.codigo} ${modo.acaoConcluida} com sucesso.`);
    voltarParaBusca();
  } catch (erro) {
    exibirAlerta("Não foi possível salvar o fornecedor", `${erro.message} ${AVISO_DADOS_MANTIDOS}`);
    botaoSalvar.disabled = false;
  }
}

function lerFormulario() {
  const fornecedor = { telefone: {}, endereco: {} };
  for (const campo of camposEditaveis()) {
    const valor = campo.value.trim();
    const [nome, subcampo] = campo.name.split(".");
    if (subcampo) fornecedor[nome][subcampo] = valor;
    else fornecedor[nome] = valor;
  }
  return fornecedor;
}

function exibirAlerta(titulo, detalhe) {
  $("formAlertTitulo").textContent = titulo;
  $("formAlertDetail").textContent = detalhe;
  alerta.hidden = false;
  alerta.scrollIntoView({ block: "center", behavior: "smooth" });
}

function voltarParaBusca() {
  window.location.href = "index.html";
}
