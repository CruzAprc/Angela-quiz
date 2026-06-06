import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildStepIndex, resolveDestination } from './navigation.js'
import { createSession, recordAnswer, updateSession } from '../lib/tracking.js'
import { stripHtml } from '../utils/html.js'

// Extrai o texto da pergunta (primeiro heading do primeiro layer de texto do step).
function getStepQuestion(step) {
  const find = (layers) => {
    for (const c of layers || []) {
      if (c?.type === 'text' && c.content?.text) return c.content.text
      for (const k of ['layers', 'components']) {
        if (Array.isArray(c?.[k])) {
          const r = find(c[k])
          if (r) return r
        }
      }
    }
    return null
  }
  const html = find(step?.layers)
  if (!html) return null
  const heading = html.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i)
  return stripHtml(heading ? heading[1] : html)
}

// Indica se o step de destino é uma VSL (ponto de conversão).
function stepHasVideo(step) {
  const find = (layers) => {
    for (const c of layers || []) {
      if (c?.type === 'video') return true
      for (const k of ['layers', 'components']) {
        if (Array.isArray(c?.[k]) && find(c[k])) return true
      }
    }
    return false
  }
  return find(step?.layers)
}

// Estado central do quiz: step atual, respostas e histórico (para "voltar").
export function useQuiz(funnel) {
  const stepIndex = useMemo(() => buildStepIndex(funnel), [funnel])
  const firstStepId = funnel.steps[0]?.id

  const [currentId, setCurrentId] = useState(firstStepId)
  const [history, setHistory] = useState([]) // pilha de ids visitados
  const [answers, setAnswers] = useState({}) // { [componentName|contentId]: label/valor }

  // tracking da sessão no Supabase
  const sessionIdRef = useRef(null)
  const answerCountRef = useRef(0)
  const didInitRef = useRef(false)

  useEffect(() => {
    // guard contra o duplo-mount do StrictMode (dev): cria a sessão só uma vez
    if (didInitRef.current) return
    didInitRef.current = true
    createSession(funnel).then((id) => {
      sessionIdRef.current = id
    })
  }, [funnel])

  const current = stepIndex[currentId]?.step ?? null
  const currentPos = stepIndex[currentId]?.index ?? 0
  const total = funnel.steps.length
  const progress = Math.round(((currentPos + 1) / total) * 100)

  // Avança a partir de um elemento interativo (opção/botão/loading).
  const advance = useCallback(
    ({ contentId, destination, answerKey, answerValue }) => {
      const fromStep = stepIndex[currentId]?.step ?? null
      const nextId = resolveDestination(funnel, currentId, contentId, destination)

      if (answerKey != null) {
        setAnswers((prev) => ({ ...prev, [answerKey]: answerValue }))
        // grava a resposta no Supabase (fire-and-forget)
        answerCountRef.current += 1
        recordAnswer(sessionIdRef.current, {
          step_id: currentId,
          step_name: fromStep?.title ?? null,
          question: getStepQuestion(fromStep),
          content_id: answerKey,
          option_id: contentId ?? null,
          answer_label: answerValue ?? null,
          answer_value: answerValue ?? null,
          position: answerCountRef.current,
        })
      }

      const nextStep = nextId ? stepIndex[nextId]?.step : null
      const reachedVsl = nextStep ? stepHasVideo(nextStep) : false
      // atualiza progresso/conclusão da sessão
      updateSession(sessionIdRef.current, {
        last_step_id: nextId ?? currentId,
        answers_count: answerCountRef.current,
        steps_completed: history.length + 1,
        ...(reachedVsl || !nextId
          ? { completed: true, completed_at: new Date().toISOString() }
          : {}),
      })

      if (!nextId) return // fim do funil
      setHistory((h) => [...h, currentId])
      setCurrentId(nextId)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [funnel, currentId, history.length, stepIndex],
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
