import TextRenderer from './renderers/TextRenderer.jsx'
import ImageRenderer from './renderers/ImageRenderer.jsx'
import ButtonRenderer from './renderers/ButtonRenderer.jsx'
import OptionsRenderer from './renderers/OptionsRenderer.jsx'
import ClearRenderer from './renderers/ClearRenderer.jsx'
import LoadingRenderer from './renderers/LoadingRenderer.jsx'
import CarouselRenderer from './renderers/CarouselRenderer.jsx'
import VideoRenderer from './renderers/VideoRenderer.jsx'

const RENDERERS = {
  text: TextRenderer,
  image: ImageRenderer,
  button: ButtonRenderer,
  options: OptionsRenderer,
  clear: ClearRenderer,
  loading: LoadingRenderer,
  carousel: CarouselRenderer,
  video: VideoRenderer,
}

// Converte design.basis (ex.: 100, "49") em flex-basis %.
function basisStyle(design) {
  const b = design?.basis
  if (b == null) return { flexBasis: '100%' }
  const num = typeof b === 'string' ? parseFloat(b) : b
  if (Number.isNaN(num)) return { flexBasis: '100%' }
  return { flexBasis: `calc(${num}% - 0.25rem)` }
}

// horizontalAlign no JSON vem como classe de margem (mx-auto, mr-auto, ml-auto).
function alignClass(design) {
  return design?.horizontalAlign || ''
}

export default function Step({ step, rounded, onAdvance }) {
  const layers = step?.layers || []
  // etapa de "analisando": tem um loading -> textos ganham revelação sequencial
  const isAnalyzing = layers.some((l) => l.type === 'loading')
  return (
    <div className="flex flex-wrap items-start justify-center gap-y-3">
      {layers.map((layer) => {
        const Comp = RENDERERS[layer.type]
        if (!Comp) return null
        return (
          <div
            key={layer.id}
            style={basisStyle(layer.design)}
            className={`min-w-0 ${alignClass(layer.design)}`}
          >
            <Comp
              layer={layer}
              rounded={rounded}
              onAdvance={onAdvance}
              variant={isAnalyzing && layer.type === 'text' ? 'analyzing' : undefined}
            />
          </div>
        )
      })}
    </div>
  )
}
