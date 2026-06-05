import { useCallback, useMemo, useState } from 'react'
import { buildStepIndex, resolveDestination } from './navigation.js'

// Estado central do quiz: step atual, respostas e histórico (para "voltar").
export function useQuiz(funnel) {
  const stepIndex = useMemo(() => buildStepIndex(funnel), [funnel])
  const firstStepId = funnel.steps[0]?.id

  const [currentId, setCurrentId] = useState(firstStepId)
  const [history, setHistory] = useState([]) // pilha de ids visitados
  const [answers, setAnswers] = useState({}) // { [componentName|contentId]: label/valor }

  const current = stepIndex[currentId]?.step ?? null
  const currentPos = stepIndex[currentId]?.index ?? 0
  const total = funnel.steps.length
  const progress = Math.round(((currentPos + 1) / total) * 100)

  // Avança a partir de um elemento interativo (opção/botão/loading).
  const advance = useCallback(
    ({ contentId, destination, answerKey, answerValue }) => {
      const nextId = resolveDestination(funnel, currentId, contentId, destination)
      if (answerKey != null) {
        setAnswers((prev) => ({ ...prev, [answerKey]: answerValue }))
      }
      if (!nextId) {
        // Fim do funil — não há próximo step.
        return
      }
      setHistory((h) => [...h, currentId])
      setCurrentId(nextId)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [funnel, currentId],
  )

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h
      const prev = h[h.length - 1]
      setCurrentId(prev)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return h.slice(0, -1)
    })
  }, [])

  const restart = useCallback(() => {
    setCurrentId(firstStepId)
    setHistory([])
    setAnswers({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [firstStepId])

  return {
    current,
    currentId,
    progress,
    currentPos,
    total,
    answers,
    canGoBack: history.length > 0,
    advance,
    goBack,
    restart,
  }
}
