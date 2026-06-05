import { useEffect } from 'react'
import funnel from './data/funnel.json'
import { useQuiz } from './engine/useQuiz.js'
import { applyTheme, roundedClass } from './theme/applyTheme.js'
import { preloadFunnelImages } from './utils/preload.js'
import Step from './components/Step.jsx'

export default function App() {
  const { current, progress, canGoBack, advance, goBack, restart } = useQuiz(funnel)
  const rounded = roundedClass(funnel.design)
  const logo = funnel.design?.logo?.src

  useEffect(() => {
    applyTheme(funnel.design)
    // pré-carrega os prints de prova social em segundo plano
    preloadFunnelImages(funnel)
  }, [])

  return (
    <div className="flex min-h-[100dvh] w-full flex-col overflow-x-hidden">
      {/* Header fixo no topo: barra de progresso + logo (modo fixedTop) */}
      <header
        className="fixed inset-x-0 top-0 z-20 bg-[var(--bg-color)]/95 backdrop-blur"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="h-1 w-full bg-white/10">
          <div
            className="h-full transition-[width] duration-300"
            style={{ width: `${progress}%`, backgroundColor: 'var(--theme-color)' }}
          />
        </div>
        <div className="relative mx-auto flex w-full max-w-[480px] items-center justify-center px-4 py-3">
          {canGoBack && (
            <button
              type="button"
              onClick={goBack}
              aria-label="Voltar"
              className="absolute left-3 -m-2 p-2 text-sm text-white/70 active:text-white"
            >
              ‹ Voltar
            </button>
          )}
          {logo && <img src={logo} alt="logo" className="h-7 w-auto object-contain" />}
        </div>
      </header>

      {/* Conteúdo do step atual — coluna mobile centralizada vertical e horizontalmente.
          O wrapper com my-auto centraliza steps curtos e NÃO corta os altos (intro). */}
      <main
        className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-4 pt-20"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)' }}
      >
        <div className="my-auto w-full py-4">
          {current ? (
            <Step step={current} rounded={rounded} onAdvance={advance} />
          ) : (
            <FunnelEnd onRestart={restart} />
          )}
        </div>
      </main>

    </div>
  )
}

function FunnelEnd({ onRestart }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-xl font-semibold">Fim do funil 🎉</p>
      <p className="opacity-70">Você percorreu todo o quiz.</p>
      <button
        type="button"
        onClick={onRestart}
        style={{ backgroundColor: 'var(--theme-color)' }}
        className="rounded-2xl px-6 py-3 font-semibold text-white"
      >
        Recomeçar
      </button>
    </div>
  )
}
