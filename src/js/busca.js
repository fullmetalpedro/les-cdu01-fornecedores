import { api } from "./api.js";
import {
  $, aplicarMascaraCnpj, carregarSessao, criarIcones, exibirStatusNoBadge, preencherCombo, retirarMensagemDeSucesso,
  temPermissao,
} from "./comum.js";
import { abrirModalStatus } from "./status.js";

const CHAVE_PARAMETROS_DA_BUSCA = "fornecedores.parametrosBusca";
const STATUS_TODOS = "TODOS";

const formulario = $("frmBusca");
const campos = {
  codigo: $("txtCodigo"),
  razaoSocial: $("txtRazaoSocial"),
  nomeFantasia: $("txtNomeFantasia"),
  cnpj: $("txtCnpj"),
  cidade: $("txtCidade"),
  estado: $("cboEstado"),
  status: $("cboStatus"),
};
const botaoBuscar = $("btnBuscar");
const botoesDeAcao = {
  novo: $("btnNovo"),
  visualizar: $("btnVisualizar"),
  alterar: $("btnAlterar"),
  inativar: $("btnInativar"),
  ativar: $("btnAtivar"),
};
const tabela = $("tblResultado");
const corpoTabela = tabela.tBodies[0];
const msgNenhumEncontrado = $("msgNenhumEncontrado");
const msgSucesso = $("msgSucesso");
const msgErro = $("msgErro");

let consultaRealizada = false;
let parametrosAlterados = false;
let cnpjDaConsulta = "";
let resultado = [];
let selecionado = null;

const { usuario, dominios } = await carregarSessao();
prepararTela();

function prepararTela() {
  preencherCombo(campos.estado, dominios.estados, { valor: "sigla", texto: "sigla" });
  restaurarParametros();
  registrarEventos();
  botaoBuscar.disabled = !podeUsar(botaoBuscar);
  atualizarBotoesDeAcao();
  criarIcones();
  exibirMensagemDeSucessoPendente();
}

function restaurarParametros() {
  const salvos = JSON.parse(sessionStorage.getItem(CHAVE_PARAMETROS_DA_BUSCA));
  if (!salvos) return;
  for (const [nome, campo] of Object.entries(campos)) {
    campo.value = salvos[nome] ?? campo.value;
  }
}

function registrarEventos() {
  formulario.addEventListener("submit", buscarPeloFormulario);
  for (const campo of Object.values(campos)) {
    campo.addEventListener("input", marcarParametrosAlterados);
    campo.addEventListener("change", marcarParametrosAlterados);
  }
  aplicarMascaraCnpj(campos.cnpj);

  botoesDeAcao.novo.addEventListener("click", incluirNovo);
  botoesDeAcao.visualizar.addEventListener("click", () => irParaCadastro("visualizar", { codigo: selecionado.codigo }));
  botoesDeAcao.alterar.addEventListener("click", () => irParaCadastro("alterar", { codigo: selecionado.codigo }));
  botoesDeAcao.inativar.addEventListener("click", () => abrirModalDeStatus("inativar"));
  botoesDeAcao.ativar.addEventListener("click", () => abrirModalDeStatus("ativar"));
}

function buscarPeloFormulario(evento) {
  evento.preventDefault();
  msgSucesso.hidden = true;
  buscar();
}

async function buscar() {
  const parametros = lerParametros();
  try {
    resultado = await api.consultar(filtroDaConsulta(parametros));
  } catch (erro) {
    exibirMensagem(msgErro, erro.message);
    return;
  }
  msgErro.hidden = true;
  consultaRealizada = true;
  parametrosAlterados = false;
  cnpjDaConsulta = parametros.cnpj;
  selecionado = null;
  guardarParametros(parametros);
  exibirResultado();
  atualizarBotoesDeAcao();
}

function lerParametros() {
  return Object.fromEntries(Object.entries(campos).map(([nome, campo]) => [nome, campo.value.trim()]));
}

function filtroDaConsulta(parametros) {
  const { status, ...demais } = parametros;
  const filtro = Object.fromEntries(Object.entries(demais).filter(([, valor]) => valor));
  if (status && status !== STATUS_TODOS) filtro.status = status;
  return filtro;
}

function guardarParametros(parametros) {
  sessionStorage.setItem(CHAVE_PARAMETROS_DA_BUSCA, JSON.stringify(parametros));
}

function exibirResultado() {
  const vazio = resultado.length === 0;
  tabela.hidden = vazio;
  msgNenhumEncontrado.hidden = !vazio;
  corpoTabela.replaceChildren();
  resultado.forEach(adicionarLinha);
}

function adicionarLinha(fornecedor) {
  const linha = corpoTabela.insertRow();
  linha.dataset.codigo = fornecedor.codigo;
  linha.addEventListener("click", () => selecionar(fornecedor.codigo));

  linha.insertCell().append(criarRadioDeSelecao(fornecedor));
  adicionarCelula(linha, fornecedor.codigo);
  adicionarCelula(linha, fornecedor.razaoSocial).classList.add("razao");
  adicionarCelula(linha, fornecedor.nomeFantasia);
  adicionarCelula(linha, fornecedor.cnpj);
  adicionarCelula(linha, fornecedor.endereco.cidade);
  adicionarCelula(linha, fornecedor.endereco.estado);
  linha.insertCell().append(criarBadgeDeStatus(fornecedor.status));
}

function criarRadioDeSelecao(fornecedor) {
  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "fornecedorSelecionado";
  radio.value = fornecedor.codigo;
  radio.setAttribute("aria-label", `Selecionar ${fornecedor.razaoSocial}`);
  return radio;
}

function adicionarCelula(linha, texto) {
  const celula = linha.insertCell();
  celula.textContent = texto;
  return celula;
}

function criarBadgeDeStatus(status) {
  const badge = document.createElement("span");
  badge.className = "badge";
  exibirStatusNoBadge(badge, status);
  return badge;
}

function selecionar(codigo) {
  selecionado = resultado.find((fornecedor) => fornecedor.codigo === codigo) ?? null;
  for (const linha of corpoTabela.rows) {
    const marcada = linha.dataset.codigo === codigo;
    linha.classList.toggle("selecionado", marcada);
    linha.querySelector("input[type=radio]").checked = marcada;
  }
  atualizarBotoesDeAcao();
}

function atualizarBotoesDeAcao() {
  const liberadoPelaTela = {
    novo: consultaRealizada && !parametrosAlterados,
    visualizar: selecionado !== null,
    alterar: selecionado !== null,
    inativar: selecionado?.status === "ATIVO",
    ativar: selecionado?.status === "INATIVO",
  };
  for (const [acao, botao] of Object.entries(botoesDeAcao)) {
    botao.disabled = !(liberadoPelaTela[acao] && podeUsar(botao));
  }
}

function podeUsar(botao) {
  return temPermissao(usuario, botao.dataset.permissao);
}

function marcarParametrosAlterados() {
  if (!consultaRealizada || parametrosAlterados) return;
  parametrosAlterados = true;
  atualizarBotoesDeAcao();
}

function incluirNovo() {
  irParaCadastro("novo", cnpjDaConsulta ? { cnpj: cnpjDaConsulta } : {});
}

function irParaCadastro(modo, parametros) {
  window.location.href = `cadastro.html?${new URLSearchParams({ modo, ...parametros })}`;
}

function abrirModalDeStatus(operacao) {
  abrirModalStatus({
    fornecedor: selecionado,
    operacao,
    dominios,
    aoConcluir: async (mensagem) => {
      exibirMensagem(msgSucesso, mensagem);
      await buscar();
    },
  });
}

function exibirMensagemDeSucessoPendente() {
  const mensagem = retirarMensagemDeSucesso();
  if (mensagem) exibirMensagem(msgSucesso, mensagem);
}

function exibirMensagem(alerta, texto) {
  alerta.querySelector("[data-texto]").textContent = texto;
  alerta.hidden = false;
}
