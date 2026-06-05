# Quiz Angela Comunidade — clone local (independente da inlead)

Clone do funil/quiz `angela-funil-vslquiz` (originalmente em `inlead.digital/angelacomunidade`),
agora como projeto próprio em React + Vite, rodando em localhost e 100% editável.

**Mobile-first:** o layout é otimizado para celular — coluna centralizada (máx. 480px),
sem rolagem horizontal, texto que quebra corretamente, emojis nas opções, áreas seguras (notch iOS)
e alvos de toque ≥ 56px. É o foco do projeto.

## Rodar

```bash
npm install
npm run download-assets   # baixa as imagens para public/assets (já executado)
npm run dev               # abre http://localhost:5173
```

## Como funciona

- **Fonte de verdade:** `src/data/funnel.json` — a definição completa do funil (15 steps, design,
  navegação, opções, textos). É só editar esse arquivo para mudar perguntas, textos e fluxo.
- **Engine:** `src/engine/` — `useQuiz.js` (estado) e `navigation.js` (roteamento por `content.id`
  → step destino, usando o mapa `funnel.navigation`). Suporta ramificação condicional e botão Voltar.
- **Renderers:** `src/components/renderers/` — um componente por tipo: `text`, `options`, `button`,
  `image`, `clear`, `loading`, `carousel`, `video`.
- **Tema:** `src/theme/applyTheme.js` aplica cores/fonte do `design` via CSS variables.

## Pontos de atenção

- **VSL:** os steps de vídeo (`PWA97Z` no fluxo "mãe" e `fVt9Gv` no fluxo alternativo) carregam o
  player **vturb/converteai** (`vid-69d671dd4aa3375082038c50`), configurado em
  `src/components/renderers/VideoRenderer.jsx`. Os dois finais de funil exibem a VSL.
- **Meta Pixel:** desativado em localhost. Para reativar ao publicar, mude `ENABLE_PIXEL` para `true`
  em `src/pixel/metaPixel.js` (id `962858769592570`).
- **Assets:** todas as 19 imagens estão em `public/assets/` (sem dependência do CDN da inlead).

## Estrutura dos steps

`fjZYm1` Intro → `PXPkHY` Idade → `SQao4h` É mãe? → ramifica entre o fluxo "mãe"
(`PmN6Cy → nr408P → 6penCf → AlXDC6` loading+prova social → `A9Pl85` commitment → `PWA97Z` VSL)
e o fluxo alternativo (`od75Qs` E4 → … → `fVt9Gv` E9 VSL).
