/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CULQI_PUBLIC_KEY: string;
  readonly PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  readonly PUBLIC_GOOGLE_PRIVATE_KEY: string;
  readonly PUBLIC_RESEND_API_KEY: string;
  readonly PUBLIC_PUBLISHED_SHEET_ID: string;
  readonly PUBLIC_SHEET_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
