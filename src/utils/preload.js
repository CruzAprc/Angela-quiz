// Pré-carrega em segundo plano as imagens dos carrosséis (prova social) de todo o
// funil. Chamado no mount: enquanto a pessoa lê o intro e responde as perguntas,
// os prints das duas ramificações já entram em cache — quando a etapa de análise
// abre, aparecem instantaneamente (sem "branco").

function collectCarouselImages(funnel) {
  const urls = new Set()
  const walk = (layers) => {
    for (const c of layers || []) {
      if (!c || typeof c !== 'object') continue
      if (c.type === 'carousel') {
        for (const item of c.content?.items || []) {
          const src = item?.image?.src
          if (src) urls.add(src)
        }
      }
      if (Array.isArray(c.layers)) walk(c.layers)
      if (Array.isArray(c.components)) walk(c.components)
    }
  }
  for (const step of funnel?.steps || []) walk(step.layers)
  return [...urls]
}

export function preloadFunnelImages(funnel) {
  if (typeof window === 'undefined') return
  const urls = collectCarouselImages(funnel)
  // pequeno atraso para não competir com o render inicial do intro
  window.setTimeout(() => {
    for (const url of urls) {
      const img = new Image()
      img.decoding = 'async'
      img.src = url
    }
  }, 300)
}
