/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ADAPTER?: string
  readonly VITE_API_URL?: string
  readonly VITE_MOCK_SCENARIO?: string
  readonly VITE_MOCK_SESSION?: string
  readonly VITE_API_TIMEOUT_MS?: string
  readonly VITE_SHOW_DEV_CHROME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
