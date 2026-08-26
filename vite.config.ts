import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

// NOTE: update `base` to match your GitHub repo name before deploying,
// e.g. base: '/my-repo-name/'
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/interview-prep/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Interview Prep',
        short_name: 'InterviewPrep',
        description: 'Senior Java / Spring Boot / Microservices interview revision reference',
        theme_color: '#2A5C4B',
        background_color: '#FAFAF9',
        display: 'standalone',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
}))
