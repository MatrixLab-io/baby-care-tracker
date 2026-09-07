import { readFileSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

/**
 * public/sw.js is copied verbatim, so `define` never reaches it. Stamp the
 * version in after the bundle is written: the worker's bytes then change on
 * every release, which is what makes the browser see an update at all, and the
 * cache name changes with it so old assets are dropped.
 */
const stampServiceWorkerVersion = () => {
  let outDir = 'dist'
  return {
    name: 'stamp-service-worker-version',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    async closeBundle() {
      const swPath = path.resolve(outDir, 'sw.js')
      const source = await readFile(swPath, 'utf8')
      await writeFile(swPath, source.replaceAll('__APP_VERSION__', pkg.version))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), stampServiceWorkerVersion()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
