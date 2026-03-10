/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_USERNAME: string;
  readonly VITE_GITHUB_TOKEN: string | undefined;
  readonly VITE_API_URL: string | undefined;
  readonly VITE_GA_ID: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
