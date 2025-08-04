/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_VERSION: string
  readonly VITE_BUILD_TIME: string
  // Add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 