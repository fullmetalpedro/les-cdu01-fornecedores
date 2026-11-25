// Gera der.png e classes.png a partir dos arquivos .mmd (Mermaid).
// Uso, na raiz do repositório:  node modelagem/diagramas/renderizar.mjs
// Usa o Playwright do projeto; PW_CHANNEL escolhe o navegador (padrão: msedge).
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pasta = dirname(fileURLToPath(import.meta.url));
const navegador = await chromium.launch({ channel: process.env.PW_CHANNEL || "msedge" });
const pagina = await navegador.newPage({ viewport: { width: 2000, height: 1400 }, deviceScaleFactor: 2 });

for (const nome of ["der", "classes"]) {
  const fonte = readFileSync(join(pasta, `${nome}.mmd`), "utf8");
  await pagina.setContent(`<!doctype html><html><body style="margin:0;background:#fff">
    <div id="diagrama" style="display:inline-block;padding:24px"></div>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js"></script></body></html>`);
  await pagina.waitForFunction(() => window.mermaid);
  await pagina.evaluate(async (texto) => {
    mermaid.initialize({ startOnLoad: false, theme: "neutral", er: { useMaxWidth: false }, class: { useMaxWidth: false } });
    const { svg } = await mermaid.render("svg", texto);
    const diagrama = document.getElementById("diagrama");
    diagrama.innerHTML = svg;
    // Tamanho natural do desenho, sem encolher para caber na janela.
    const desenho = diagrama.querySelector("svg");
    desenho.style.maxWidth = "none";
    desenho.setAttribute("width", desenho.viewBox.baseVal.width);
    desenho.setAttribute("height", desenho.viewBox.baseVal.height);
  }, fonte);
  await pagina.locator("#diagrama").screenshot({ path: join(pasta, `${nome}.png`) });
  console.log(`${nome}.png gerado`);
}

await navegador.close();
