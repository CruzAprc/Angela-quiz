import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // host: true expõe o servidor na rede local para abrir no celular
    // (mesma rede Wi-Fi) usando o IP da máquina, ex.: http://192.168.x.x:5173
    host: true,
    port: 5173,
    open: true,
  },
})
