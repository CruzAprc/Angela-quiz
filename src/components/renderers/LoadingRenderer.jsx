import { useEffect, useRef, useState } from 'react'

// Step de carregamento ("Montando seu plano personalizado, amiga..." 13s).
// Anel circular de progresso com a % no centro; avança sozinho ao chegar em 100%.
export default function LoadingRenderer({ layer, onAdvance }) {
  const content = layer?.content || {}
  const seconds = Number(content.seconds) || 5
  const [pct, setPct] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    const start = performance.now()
    let raf
    const tick = (now) => {
      const elapsed = (now - start) / 1000
      const p = Math.min(100, Math.round((elapsed / seconds) * 100))
      setPct(p)
      if (p >= 100) {
        if (!done.current) {
          done.current = true
          onAdvance({ contentId: content.id, destination: content.destination })
        }
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // geometria do anel SVG
  const R = 52
  const C = 2 * Math.PI * R
  const dash = C - (pct / 100) * C

  return (
    <div className="flex w-full flex-col items-center gap-5 py-4 text-center">
      <div className="relative h-[132px] w-[132px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="var(--theme-color)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={dash}
            style={{ transition: 'stroke-dashoffset 0.15s linear' }}
          />
        </svg>
        {content.show_percent && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-extrabold" style={{ color: 'var(--title-color)' }}>
              {pct}%
            </span>
          </div>
        )}
      </div>

      {content.show_title && content.title && (
        <p
          className="max-w-[18rem] text-lg font-bold leading-snug"
          style={{ color: 'var(--title-color)' }}
        >
          {content.title}
        </p>
      )}
    </div>
  )
}
