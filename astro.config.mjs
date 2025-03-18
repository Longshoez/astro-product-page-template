// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.ayahuasca-ilumina.com",
  server: {
    headers:
      import.meta.env.NODE_ENV === "production"
        ? {
            "Content-Security-Policy": `
        default-src 'self';
        script-src 'self' https://sdk.mercadopago.com https://http2.mlstatic.com https://www.mercadopago.com https://storage.googleapis.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        connect-src 'self' https://api.mercadopago.com https://api.mercadolibre.com https://events.mercadopago.com;
        frame-src 'self' https://www.mercadopago.com https://www.mercadolibre.com;
        font-src 'self' https://http2.mlstatic.com;
      `
              .replace(/\s{2,}/g, " ")
              .trim(),
          }
        : {},
  },
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [react(), sitemap()],
  vite: {
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias:
        process.env.NODE_ENV === "production" || import.meta.env.PROD
          ? {
              "react-dom/server": "react-dom/server.edge",
            }
          : undefined,
    },
    assetsInclude: ["**/*.mp4"],
  },
});
