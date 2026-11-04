import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  // Nitro is the deployment layer required by TanStack Start's official
  // Vercel guide. On Vercel it emits the Build Output API (`.vercel/output`)
  // with an SSR function; the Vercel "TanStack Start" preset auto-detects it.
  plugins: [tanstackStart(), nitro(), viteReact()],
})
