import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initMetaPixel } from './pixel/metaPixel.js'

// Pixel desativado em localhost (ver src/pixel/metaPixel.js). Reativar ao publicar.
initMetaPixel()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
