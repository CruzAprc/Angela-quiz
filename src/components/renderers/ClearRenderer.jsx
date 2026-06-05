// Espaçador vertical. content.clear vem como classe Tailwind do funil (ex.: "h-[1rem]").
// Como esse valor vem do JSON (não escaneado pelo Tailwind), extraímos a altura e
// aplicamos via style inline para garantir o espaçamento.
function heightFrom(cls) {
  if (!cls) return '1rem'
  const m = String(cls).match(/h-\[(.+?)\]/)
  if (m) return m[1]
  const named = { 'h-1': '0.25rem', 'h-2': '0.5rem', 'h-4': '1rem', 'h-8': '2rem' }
  return named[cls] || '1rem'
}

export default function ClearRenderer({ layer }) {
  const height = heightFrom(layer?.content?.clear)
  return <div className="w-full" style={{ height }} aria-hidden="true" />
}
