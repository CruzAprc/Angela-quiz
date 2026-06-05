// Baixa todos os assets de mídia (media.inlead.cloud) referenciados no funil
// para public/assets/ e reescreve as URLs no src/data/funnel.json para /assets/<arquivo>.
// Torna o projeto 100% independente da infraestrutura da inlead.
//
// Uso: node scripts/download-assets.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const FUNNEL = path.join(ROOT, 'src/data/funnel.json')
const ASSETS_DIR = path.join(ROOT, 'public/assets')

const CDN_RE = /https:\/\/media\.inlead\.cloud\/[^\s"'\\)]+/g

function localNameFor(url) {
  // usa o basename do arquivo (ex.: BxzT1-comunidade-recortada-v2.png)
  const clean = url.split('?')[0]
  return path.basename(clean)
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} para ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buf)
  return buf.length
}

async function main() {
  await mkdir(ASSETS_DIR, { recursive: true })
  let raw = await readFile(FUNNEL, 'utf8')

  const urls = [...new Set(raw.match(CDN_RE) || [])]
  console.log(`Encontrados ${urls.length} assets de mídia no funil.`)

  let ok = 0
  for (const url of urls) {
    const name = localNameFor(url)
    const dest = path.join(ASSETS_DIR, name)
    try {
      if (existsSync(dest)) {
        console.log(`  • já existe: ${name}`)
      } else {
        const size = await download(url, dest)
        console.log(`  ✓ baixado: ${name} (${(size / 1024).toFixed(0)} KB)`)
      }
      // reescreve TODAS as ocorrências dessa URL no JSON -> /assets/<name>
      raw = raw.split(url).join(`/assets/${name}`)
      ok++
    } catch (err) {
      console.error(`  ✗ falhou: ${url}\n    ${err.message}`)
    }
  }

  // valida que o JSON continua válido após a reescrita
  JSON.parse(raw)
  await writeFile(FUNNEL, raw)

  const remaining = (raw.match(CDN_RE) || []).length
  console.log(`\nConcluído: ${ok}/${urls.length} assets. URLs da inlead restantes no JSON: ${remaining}`)
  if (remaining > 0) {
    console.warn('Atenção: ainda há referências ao CDN da inlead (provavelmente downloads que falharam).')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
