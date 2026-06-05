import { useEffect, useState } from 'react'
import { sanitizeRichText, stripHtml } from '../../utils/html.js'

// Carrossel de prova social (depoimentos / prints de resultado).
// Auto-rotaciona enquanto a aluna espera, com moldura na identidade visual.
export default function CarouselRenderer({ layer, rounded }) {
  const content = layer?.content || {}
  const items = content.items || []
  const [idx, setIdx] = useState(0)

  // auto-rotação: distribui todos os prints dentro do tempo do loading (~8s),
  // garantindo que cada prova social apareça antes de avançar.
  useEffect(() => {
    if (items.length <= 1) return
    const interval = Math.max(1500, Math.floor(8000 / items.length))
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), interval)
    return () => clearInterval(t)
  }, [items.length])

  if (items.length === 0) return null
  const go = (n) => setIdx((idx + n + items.length) % items.length)

  return (
    <div className="w-full">
      <div className={`social-proof-frame relative overflow-hidden ${rounded}`}>
        {/* trilho deslizante */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {items.map((item, i) => (
            <div key={item.id || i} className="flex w-full flex-none flex-col items-center justify-center">
              {item.image?.src && (
                <img
                  src={item.image.src}
                  alt=""
                  loading="lazy"
                  className="mx-auto block max-h-[60vh] w-full object-contain"
                />
              )}
              {stripHtml(item.text) && (
                <div
                  className="rich-text px-4 py-3 text-center text-sm"
                  dangerouslySetInnerHTML={{ __html: sanitizeRichText(item.text) }}
                />
              )}
            </div>
          ))}
        </div>

        {/* setas */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-3 py-2 text-white backdrop-blur-sm active:scale-95"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próximo"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-3 py-2 text-white backdrop-blur-sm active:scale-95"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* indicadores */}
      {content.pagination && items.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {items.map((it, i) => (
            <button
              key={it.id || i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === idx ? '20px' : '8px',
                backgroundColor: i === idx ? 'var(--theme-color)' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
