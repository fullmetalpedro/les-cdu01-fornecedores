import { api } from "./api.js";

const CHAVE_MENSAGEM_DE_SUCESSO = "fornecedores.mensagem";
const CAMPOS_OBRIGATORIOS = ".campo:has(.obrigatorio) :is(input, select, textarea)";
const ICONES_DAS_NOTIFICACOES = { sucesso: "circle-check", erro: "circle-alert" };

export const $ = (id) => document.getElementById(id);

export const criarIcones = () => window.lucide?.createIcons();

export const temPermissao = (usuario, permissao) => usuario.permissoes.includes(permissao);

export const somenteDigitos = (texto) => texto.replace(/\D/g, "");

export async function carregarSessao() {
  const [usuario, dominios] = await Promise.all([api.usuario(), api.dominios()]);
  exibirUsuario(usuario);
  return { usuario, dominios };
}

function exibirUsuario(usuario) {
  $("lblNomeUsuario").textContent = usuario.nome;
  $("lblPerfilUsuario").textContent = usuario.perfil;
  $("lblIniciaisUsuario").textContent = iniciais(usuario.nome);
}

function iniciais(nome) {
  return nome.split(" ").map((parte) => parte[0]).slice(0, 2).join("").toUpperCase();
}

export function preencherCombo(combo, itens, { valor = "codigo", texto = "nome" } = {}) {
  for (const item of itens) {
    const opcao = new Option(item[texto], item[valor]);
    opcao.title = item.nome;
    combo.add(opcao);
  }
}

export function aplicarMascaraCnpj(campo) {
  campo.addEventListener("input", () => {
    campo.value = mascararCnpj(campo.value);
  });
}

function mascararCnpj(valor) {
  return somenteDigitos(valor).slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function exibirStatusNoBadge(badge, status) {
  badge.textContent = status;
  badge.classList.add(`badge--${status.toLowerCase()}`);
  badge.hidden = false;
}

export function camposObrigatoriosVazios(container) {
  return [...container.querySelectorAll(CAMPOS_OBRIGATORIOS)].filter((campo) => !campo.value.trim());
}

export function destacarCamposComErro(campos) {
  for (const campo of campos) {
    const grupo = campo.closest(".campo");
    grupo.classList.add("has-error");
    grupo.querySelector(".field-error").hidden = false;
  }
}

export function limparErrosDosCampos(container) {
  for (const grupo of container.querySelectorAll(".has-error")) {
    grupo.classList.remove("has-error");
    grupo.querySelector(".field-error").hidden = true;
  }
}

export function guardarMensagemDeSucesso(texto) {
  sessionStorage.setItem(CHAVE_MENSAGEM_DE_SUCESSO, texto);
}

export function retirarMensagemDeSucesso() {
  const texto = sessionStorage.getItem(CHAVE_MENSAGEM_DE_SUCESSO);
  sessionStorage.removeItem(CHAVE_MENSAGEM_DE_SUCESSO);
  return texto;
}

export async function removerComAnimacao(elemento) {
  elemento.classList.add("saindo");
  await Promise.allSettled(elemento.getAnimations({ subtree: true }).map((animacao) => animacao.finished));
  elemento.remove();
}

export function notificar(texto, tipo = "sucesso") {
  const toast = document.createElement("div");
  toast.className = `toast toast--${tipo}`;
  if (tipo === "erro") toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <i data-lucide="${ICONES_DAS_NOTIFICACOES[tipo]}" class="icone" aria-hidden="true"></i>
    <span class="toast__texto"></span>
    <button type="button" class="toast__fechar" aria-label="Fechar notificação">
      <i data-lucide="x" class="icone" aria-hidden="true"></i>
    </button>
  `;
  toast.querySelector(".toast__texto").textContent = texto;
  toast.querySelector(".toast__fechar").addEventListener("click", () => fecharNotificacao(toast));
  toast.addEventListener("animationend", (evento) => {
    if (evento.animationName === "contagem-do-toast") fecharNotificacao(toast);
  });
  areaDasNotificacoes().append(toast);
  criarIcones();
}

export function fecharNotificacoes() {
  document.querySelectorAll(".toast").forEach(fecharNotificacao);
}

function fecharNotificacao(toast) {
  if (!toast.classList.contains("saindo")) removerComAnimacao(toast);
}

function areaDasNotificacoes() {
  let area = document.querySelector(".toasts");
  if (!area) {
    area = document.createElement("div");
    area.className = "toasts";
    area.setAttribute("aria-live", "polite");
    document.body.append(area);
  }
  return area;
}
