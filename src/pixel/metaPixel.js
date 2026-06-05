// Meta Pixel recuperado do funil original da inlead.
// DESATIVADO por padrão para não poluir os dados do Facebook durante testes em localhost.
// Para reativar ao publicar, troque ENABLE_PIXEL para true.
const ENABLE_PIXEL = false
const PIXEL_ID = '962858769592570'

export function initMetaPixel() {
  if (!ENABLE_PIXEL) {
    // eslint-disable-next-line no-console
    console.info('[Meta Pixel] desativado em localhost (ENABLE_PIXEL=false).')
    return
  }
  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */
  window.fbq('init', PIXEL_ID)
  window.fbq('track', 'PageView')
}

// Dispara um evento custom (no-op quando o pixel está desativado).
export function trackPixel(event, params) {
  if (!ENABLE_PIXEL || typeof window.fbq !== 'function') return
  window.fbq('track', event, params)
}
