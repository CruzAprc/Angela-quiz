// Renderiza uma imagem do funil.
export default function ImageRenderer({ layer, rounded }) {
  const img = layer?.content?.image
  if (!img?.src) return null
  return (
    <img
      src={img.src}
      width={img.width}
      height={img.height}
      alt=""
      loading="lazy"
      className={`block w-full h-auto ${rounded}`}
    />
  )
}
