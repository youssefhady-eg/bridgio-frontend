import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Same `~/*` → `./src/*` mapping as vite.config.ts, so tests can import
    // modules that use the app's path alias.
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
