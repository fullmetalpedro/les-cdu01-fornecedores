const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const URL_DO_BANCO = process.env.DATABASE_URL ?? "postgresql://postgres@localhost:5432/fornecedores_teste";
const BANCO_DE_MANUTENCAO_DO_POSTGRES = "/postgres";
const PORTA_PADRAO_DO_POSTGRES = 5432;

function lerArquivoDoProjeto(caminho) {
  return fs.readFileSync(path.join(__dirname, "..", caminho), "utf8");
}

async function executarSql(url, sql, parametros = []) {
  const cliente = new Client({ connectionString: url });
  await cliente.connect();
  try {
    return (await cliente.query(sql, parametros)).rows;
  } finally {
    await cliente.end();
  }
}

function consultarBanco(sql, parametros) {
  return executarSql(URL_DO_BANCO, sql, parametros);
}

function nomeDoBancoDeTeste() {
  return new URL(URL_DO_BANCO).pathname.slice(1);
}

function urlDoBancoDeManutencao() {
  const url = new URL(URL_DO_BANCO);
  url.pathname = BANCO_DE_MANUTENCAO_DO_POSTGRES;
  return url.href;
}

async function criarBancoSeNaoExistir() {
  const nome = nomeDoBancoDeTeste();
  const servidor = urlDoBancoDeManutencao();
  const existentes = await executarSql(servidor, "SELECT 1 FROM pg_database WHERE datname = $1", [nome]);
  if (existentes.length === 0) await executarSql(servidor, `CREATE DATABASE "${nome}"`);
}

async function recriarTabelasEDominios() {
  await consultarBanco("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
  await consultarBanco(lerArquivoDoProjeto("banco/01-ddl.sql"));
  await consultarBanco(lerArquivoDoProjeto("banco/02-dominios.sql"));
}

async function criarBancoDeTeste() {
  await criarBancoSeNaoExistir();
  await recriarTabelasEDominios();
}

function restaurarDadosDeTeste() {
  return consultarBanco(lerArquivoDoProjeto("tests/dados-teste.sql"));
}

function conexaoParaDotnet() {
  const url = new URL(URL_DO_BANCO);
  return [
    `Host=${url.hostname}`,
    `Port=${url.port || PORTA_PADRAO_DO_POSTGRES}`,
    `Database=${nomeDoBancoDeTeste()}`,
    `Username=${decodeURIComponent(url.username)}`,
    `Password=${decodeURIComponent(url.password)}`,
  ].join(";");
}

module.exports = { consultarBanco, criarBancoDeTeste, restaurarDadosDeTeste, conexaoParaDotnet };
