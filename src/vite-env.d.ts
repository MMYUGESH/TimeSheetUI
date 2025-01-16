/// <reference types="react-router" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_APP: boolean;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
