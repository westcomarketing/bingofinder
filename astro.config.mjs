// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://bingofinder.com",
  output: "server",
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // Prisma + libsql ship native bits that Astro should not pre-bundle.
      external: [
        "@prisma/client",
        "@prisma/adapter-libsql",
        "@libsql/client",
      ],
    },
  },
});
