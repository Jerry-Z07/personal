/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CORS_PROXY_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
