/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * On Vercel the API runs in the same project (/api), so VITE_API_URL is
 * normally left unset and the site calls its own domain. If it IS set, it must
 * be a real https address: a leftover localhost URL would break production.
 * Local and CI builds are left alone.
 */
function assertApiUrlOnVercel(mode: string) {
  if (!process.env.VERCEL) return
  const url = loadEnv(mode, __dirname, 'VITE_').VITE_API_URL
  if (url && (!/^https:\/\//.test(url) || /localhost|127\.0\.0\.1/.test(url))) {
    throw new Error(
      `VITE_API_URL is set to "${url}". On Vercel leave it unset (the API is served from /api), ` +
        `or set it to a real https address. Vercel → Project → Settings → Environment Variables.`,
    )
  }
}

export default defineConfig(({ mode }) => {
  assertApiUrlOnVercel(mode)

  return {
    plugins: [react()],
    test: {
      environment: 'jsdom',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // Consumed straight from source so the workspace needs no build step.
        '@odonto/shared': path.resolve(__dirname, '../shared/src/index.ts'),
      },
    },
    server: {
      port: 5173,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/mixins" as m;`,
        },
      },
    },
  }
})
