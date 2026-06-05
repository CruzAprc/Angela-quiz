// Aplica os design tokens do funil como CSS variables no :root.
export function applyTheme(design) {
  if (!design) return
  const root = document.documentElement
  if (design.themeColor) root.style.setProperty('--theme-color', design.themeColor)
  if (design.backgroundColor) root.style.setProperty('--bg-color', design.backgroundColor)
  if (design.titleColor) root.style.setProperty('--title-color', design.titleColor)
  if (design.contentColor) root.style.setProperty('--content-color', design.contentColor)
  // contentSize do funil vem em px (ex.: 16). Limita a um range mobile saudável.
  if (design.contentSize) {
    const px = Math.min(18, Math.max(14, Number(design.contentSize) || 16))
    root.style.setProperty('--content-size', `${px}px`)
  }
  if (design.elementSize) root.style.setProperty('--element-size', design.elementSize)
}

// Mapeia o token "rounded" do funil para classes Tailwind.
export function roundedClass(design) {
  return design?.rounded || 'rounded-2xl'
}
