// Gravação das sessões e respostas do quiz no Supabase (tabelas quiz_sessions / quiz_answers).
// Usa a REST API (PostgREST) com a anon key — sem dependências extras.
// Todas as chamadas são "fire-and-forget" e tolerantes a falha: nunca quebram o quiz.
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_ENABLED } from './supabase.js'

const baseHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
}

function getCookie(name) {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'))
  return m ? decodeURIComponent(m.pop()) : null
}

// Coleta UTMs, click ids e dados do dispositivo a partir da URL/navegador.
function trackingParams() {
  const p = new URLSearchParams(window.location.search)
  const get = (k) => p.get(k) || null
  const ua = navigator.userAgent
  const device = /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? 'mobile' : 'desktop'
  return {
    utm_source: get('utm_source'),
    utm_medium: get('utm_medium'),
    utm_campaign: get('utm_campaign'),
    utm_content: get('utm_content'),
    utm_term: get('utm_term'),
    fbclid: get('fbclid'),
    gclid: get('gclid'),
    fbp: getCookie('_fbp'),
    fbc: getCookie('_fbc'),
    referrer: document.referrer || null,
    landing_url: window.location.href,
    user_agent: ua,
    device,
  }
}

// Cria a sessão ao entrar no funil. Retorna o id (uuid) ou null.
export async function createSession(funnel) {
  if (!SUPABASE_ENABLED) return null
  try {
    const body = {
      funnel_slug: funnel.slug,
      funnel_id: funnel.id,
      last_step_id: funnel.steps?.[0]?.id ?? null,
      ...trackingParams(),
    }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/quiz_sessions`, {
      method: 'POST',
      headers: { ...baseHeaders, Prefer: 'return=representation' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return null
    const rows = await res.json()
    return rows?.[0]?.id ?? null
  } catch {
    return null
  }
}

// Grava uma resposta escolhida.
export async function recordAnswer(sessionId, answer) {
  if (!SUPABASE_ENABLED || !sessionId) return
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/quiz_answers`, {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify({ session_id: sessionId, ...answer }),
    })
  } catch {
    /* silencioso */
  }
}

// Atualiza o progresso/conclusão da sessão.
export async function updateSession(sessionId, patch) {
  if (!SUPABASE_ENABLED || !sessionId) return
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/quiz_sessions?id=eq.${sessionId}`, {
      method: 'PATCH',
      headers: baseHeaders,
      body: JSON.stringify(patch),
    })
  } catch {
    /* silencioso */
  }
}
