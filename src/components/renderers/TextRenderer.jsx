import { sanitizeRichText } from '../../utils/html.js'

// Renderiza conteúdo de texto rico (HTML do editor Quill) do funil.
// variant="analyzing": usado na etapa de loading; revela as linhas em sequência.
export default function TextRenderer({ layer, variant }) {
  const html = sanitizeRichText(layer?.content?.text || '')
  const cls = variant === 'analyzing' ? 'rich-text rich-text--analyzing' : 'rich-text'
  return (
    <div
      className={`${cls} w-full max-w-full`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
