// Otimiza as imagens de public/assets para uso na web (mobile-first).
// - Redimensiona para no máximo MAX_DIM px na maior dimensão.
// - Recomprime como JPEG (qualidade QUALITY).
// - Converte fotos PNG para .jpg e atualiza os caminhos no src/data/funnel.json.
// - Mantém o logo (com transparência) intacto.
//
// Usa o `sips` nativo do macOS (sem dependências). Uso: node scripts/optimize-images.mjs
import { readFileSync, writeFileSync, readdirSync, statSync, renameSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const ASSETS = path.join(ROOT, 'public/assets')
const FUNNEL = path.join(ROOT, 'src/data/funnel.json')

const MAX_DIM = 800
const QUALITY = 72
// arquivos que NÃO devem ser tocados (logo com transparência)
const SKIP = new Set(['BxzT1-comunidade-recortada-v2.png'])

const sips = (...args) => execFileSync('sips', args, { stdio: ['ignore', 'ignore', 'ignore'] })
const kb = (p) => (statSync(p).size / 1024).toFixed(0)

let funnel = readFileSync(FUNNEL, 'utf8')
const renames = [] // { from: 'a.png', to: 'a.jpg' }
let beforeTotal = 0
let afterTotal = 0

for (const file of readdirSync(ASSETS)) {
  const src = path.join(ASSETS, file)
  if (!statSync(src).isFile()) continue
  if (SKIP.has(file)) {
    afterTotal += statSync(src).size
    continue
  }
  const ext = path.extname(file).toLowerCase()
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue

  beforeTotal += statSync(src).size
  const before = kb(src)

  if (ext === '.png') {
    // converte foto PNG -> JPG (novo arquivo) e remove o PNG
    const jpgName = file.replace(/\.png$/i, '.jpg')
    const jpgPath = path.join(ASSETS, jpgName)
    sips('-s', 'format', 'jpeg', '-s', 'formatOptions', String(QUALITY),
         '--resampleHeightWidthMax', String(MAX_DIM), src, '--out', jpgPath)
    rmSync(src)
    renames.push({ from: file, to: jpgName })
    afterTotal += statSync(jpgPath).size
    console.log(`  ${file} (${before} KB) -> ${jpgName} (${kb(jpgPath)} KB)`)
  } else {
    // JPEG: redimensiona + recomprime no lugar
    sips('-s', 'format', 'jpeg', '-s', 'formatOptions', String(QUALITY),
         '--resampleHeightWidthMax', String(MAX_DIM), src, '--out', src)
    afterTotal += statSync(src).size
    console.log(`  ${file} (${before} KB) -> (${kb(src)} KB)`)
  }
}

// atualiza referências dos PNGs convertidos no funnel.json
for (const { from, to } of renames) {
  funnel = funnel.split(`/assets/${from}`).join(`/assets/${to}`)
}
if (renames.length) {
  JSON.parse(funnel) // valida
  writeFileSync(FUNNEL, funnel)
  console.log(`\n${renames.length} referência(s) .png -> .jpg atualizadas no funnel.json`)
}

console.log(
  `\nTotal: ${(beforeTotal / 1024 / 1024).toFixed(2)} MB -> ${(afterTotal / 1024 / 1024).toFixed(2)} MB`,
)
