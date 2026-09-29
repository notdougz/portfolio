import { defineConfig } from "vite";
import { cpSync } from "node:fs";
// Preserve existing public asset URLs, including images selected by the gallery.
export default defineConfig({
  plugins: [
    {
      name: "public-files",
      closeBundle() {
        cpSync("assets", "dist/assets", { recursive: true });
        for (const file of [
          "about.html",
          "projects.html",
          "curriculo.html",
          "robots.txt",
          "sitemap.xml",
        ])
          cpSync(file, `dist/${file}`);
      },
    },
  ],
  build: {
    assetsDir: "bundles",
    rollupOptions: { input: { main: "index.html", english: "en.html" } },
  },
});
