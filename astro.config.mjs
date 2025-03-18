// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.ayahuasca-ilumina.com",
  server: {
    headers:
      import.meta.env.NODE_ENV === "production"
        ? {
            "Content-Security-Policy": `
        default-src 'self';
        script-src 'self';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        connect-src 'self';
        frame-src 'self';
        font-src 'self';
      `
              .replace(/\s{2,}/g, " ")
              .trim(),
          }
        : {},
  },
  output: "server",
  adapter: vercel({}),
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
