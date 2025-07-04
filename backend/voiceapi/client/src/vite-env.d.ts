/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_DEFAULT_USER_ID: string
  readonly VITE_AUTH_TOKEN: string
  readonly VITE_LLM_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
