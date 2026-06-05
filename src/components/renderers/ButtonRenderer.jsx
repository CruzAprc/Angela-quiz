// Botão de avanço (ex.: "Continuar"). Full-width na cor do tema, com efeito
// pulse/bubble da inlead. Mantém a identidade visual e é otimizado para toque.
export default function ButtonRenderer({ layer, rounded, onAdvance }) {
  const content = layer?.content || {}
  const design = layer?.design || {}
  const pulse = design.pulse || content.pulse
  const label = content.label || 'Continuar'

  const handleClick = () => {
    onAdvance({ contentId: content.id, destination: content.destination })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`cta-button w-full ${rounded} ${pulse ? 'btn-pulse' : ''}`}
    >
      {label}
    </button>
  )
}
