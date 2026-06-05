import { useEffect, useRef } from 'react'

// VSLs do funil (player vturb / converteai), uma por ramificação do "É mãe?":
//  - PWA97Z  -> fluxo "Sim, sou mãe"      (VSL mãe)
//  - fVt9Gv  -> fluxo "Não, não sou mãe"  (VSL não-mãe)
const SCRIPT_BASE = 'https://scripts.converteai.net/00d6163e-e250-4c92-8e51-37b324f30ce8/players'
const playerScript = (raw) => `${SCRIPT_BASE}/${raw}/v4/player.js`

const VSLS = {
  // fluxo mãe
  PWA97Z: { id: 'vid-69d671dd4aa3375082038c50', script: playerScript('69d671dd4aa3375082038c50') },
  // fluxo não-mãe
  fVt9Gv: { id: 'vid-69d66d8f3355ef443fe8bd62', script: playerScript('69d66d8f3355ef443fe8bd62') },
}
// fallback: VSL mãe
const DEFAULT_VSL = VSLS.PWA97Z

export default function VideoRenderer({ layer }) {
  const ref = useRef(null)
  const vsl = VSLS[layer?.step] || DEFAULT_VSL

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // injeta o custom element do player correto para este step
    el.innerHTML = `<vturb-smartplayer id="${vsl.id}" style="display:block;margin:0 auto;width:100%;max-width:400px;"></vturb-smartplayer>`
    // carrega o script desse player apenas uma vez
    if (!document.querySelector(`script[data-vsl="${vsl.id}"]`)) {
      const s = document.createElement('script')
      s.src = vsl.script
      s.async = true
      s.dataset.vsl = vsl.id
      document.head.appendChild(s)
    }
  }, [vsl.id, vsl.script])

  return <div ref={ref} className="mx-auto w-full max-w-[400px]" />
}
