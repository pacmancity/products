import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"
// import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        plugins: [
          "@svgr/plugin-svgo",
          "@svgr/plugin-jsx"
        ],
        svgo: true,
        svgoConfig: {
          floatPrecision: 2,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ]
        },
      }
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  base: '/products/',
})
