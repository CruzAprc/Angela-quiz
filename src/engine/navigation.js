// Engine de navegação do funil.
//
// O mapa `funnel.navigation` é a fonte de verdade: ele mapeia o `content.id`
// de cada elemento interativo (opção / botão / loading) -> id do step destino,
// ou a string "next" (avançar para o próximo step da lista).
//
// Ordem de resolução:
//   1. navigation[contentId]  (mapa global do funil)
//   2. content.destination    (fallback embutido no próprio elemento)
//   3. próximo step na lista   (quando destino == "next" ou ausente)

export function buildStepIndex(funnel) {
  const byId = {}
  funnel.steps.forEach((s, i) => {
    byId[s.id] = { step: s, index: i }
  })
  return byId
}

// Resolve o id do próximo step a partir do elemento interativo clicado.
export function resolveDestination(funnel, currentStepId, contentId, contentDestination) {
  const nav = funnel.navigation || {}
  let dest = nav[contentId] ?? contentDestination ?? 'next'

  if (dest === 'next' || dest == null) {
    return nextStepId(funnel, currentStepId)
  }

  // Destino aponta para um step inexistente (ex.: step removido na inlead) -> avança.
  const exists = funnel.steps.some((s) => s.id === dest)
  if (!exists) return nextStepId(funnel, currentStepId)

  return dest
}

export function nextStepId(funnel, currentStepId) {
  const idx = funnel.steps.findIndex((s) => s.id === currentStepId)
  if (idx === -1 || idx + 1 >= funnel.steps.length) return null // fim do funil
  return funnel.steps[idx + 1].id
}
