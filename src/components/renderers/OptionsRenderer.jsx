import { useState } from 'react'
import { sanitizeRichText, stripHtml } from '../../utils/html.js'

// Renderiza opções de múltipla escolha fiel à identidade da inlead:
// fundo escuro com leve tom do tema, borda na cor do tema, emoji à esquerda
// e chevron ">" dentro de um círculo à direita (design.icon === 'right').
export default function OptionsRenderer({ layer, rounded, onAdvance }) {
  const content = layer?.content || {}
  const design = layer?.design || {}
  const options = content.options || []
  // a inlead prioriza design.grid (ex.: idade = grid-cols-2); cai para content.cols.
  const cols = design.grid || content.cols || 'grid-cols-1'
  const gap = design.gap || 'gap-3'
  const showChevron = design.icon === 'right'
  const [selected, setSelected] = useState(null)

  const answerKey = content.name || content.id

  const handle = (opt) => {
    if (selected) return
    setSelected(opt.id)
    setTimeout(() => {
      onAdvance({
        contentId: opt.id,
        destination: opt.destination,
        answerKey,
        answerValue: stripHtml(opt.label),
      })
    }, 200)
  }

  return (
    <div className={`grid ${cols} ${gap} w-full`}>
      {options.map((opt) => {
        const isSel = selected === opt.id
        const isEmoji = opt.image?.type === 'emoji' && opt.image?.src
        const isImg = opt.image?.type === 'image' && opt.image?.src
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => handle(opt)}
            className={`option-card group flex items-center gap-3 px-4 py-3 text-left ${rounded}
              ${isSel ? 'option-card--selected' : ''}`}
          >
            {isEmoji && (
              <span className="flex-none text-[26px] leading-none">{opt.image.src}</span>
            )}
            {isImg && (
              <img
                src={opt.image.src}
                alt=""
                className="h-11 w-11 flex-none rounded-xl object-cover"
              />
            )}
            <span
              className="rich-text min-w-0 flex-1 text-[15px] font-medium leading-snug"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(opt.label || '') }}
            />
            {showChevron && (
              <span
                className={`option-chevron flex-none ${isSel ? 'option-chevron--selected' : ''}`}
                aria-hidden="true"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
