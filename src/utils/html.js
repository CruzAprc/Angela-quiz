// O conteúdo vindo do editor (Quill) da inlead usa "&nbsp;" ( ) entre quase
// todas as palavras. No mobile isso impede a quebra de linha e estoura a largura
// da tela. Trocamos por espaço normal para o texto fluir e quebrar naturalmente.
export function sanitizeRichText(html) {
  if (!html) return ''
  return html
    .replace(/&nbsp;/gi, ' ')
    .replace(/ /g, ' ')
}

// Versão em texto puro (para gravar respostas).
export function stripHtml(html) {
  if (!html) return ''
  return sanitizeRichText(html)
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
