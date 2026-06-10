import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'logo.png', 'pwa.png'],
      manifest: {
        name: 'EmDia - Controle Financeiro',
        short_name: 'EmDia',
        description: 'Seu controle financeiro pessoal simplificado e visual.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: 'pwa.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
