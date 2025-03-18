/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GOOGLE_SHEET_ID: string;
  readonly CULQI_PUBLIC_KEY: string;
  readonly GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  readonly GOOGLE_PRIVATE_KEY: string;
  readonly RESEND_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
