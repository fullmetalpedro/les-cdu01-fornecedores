// Servidor estático para os testes (o http.server do Python recusa conexões com testes em paralelo).
const http = require("http");
const fs = require("fs");
const path = require("path");

const raiz = path.resolve(process.env.SRC_DIR || path.join(__dirname, "..", "src"));
const porta = Number(process.env.PORTA || 4173);
const tipos = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml" };

http.createServer((req, res) => {
  const caminho = path.join(raiz, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!caminho.startsWith(raiz)) return res.writeHead(403).end();
  fs.readFile(caminho, (erro, conteudo) => {
    if (erro) return res.writeHead(404).end();
    res.writeHead(200, { "Content-Type": `${tipos[path.extname(caminho)] || "application/octet-stream"}; charset=utf-8` });
    res.end(conteudo);
  });
}).listen(porta, () => console.log(`Servindo ${raiz} em http://localhost:${porta}`));
