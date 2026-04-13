import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "fs";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "chrome120",
    rollupOptions: {
      input: {
        "content-script": resolve(__dirname, "src/content/index.ts"),
        "service-worker": resolve(__dirname, "src/background/service-worker.ts"),
        popup: resolve(__dirname, "src/popup/popup.ts"),
      },
      output: {
        format: "es",
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
      },
    },
    minify: false,
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@carscout/shared": resolve(__dirname, "../../packages/shared/src"),
    },
  },
  plugins: [
    {
      name: "chrome-extension-build",
      closeBundle() {
        const distDir = resolve(__dirname, "dist");

        // Content scripts in Chrome MV3 can't use ES module imports.
        // If the content script has import statements, we need to handle this.
        // The simplest fix: if chunks were created, add them to web_accessible_resources
        // in the manifest and convert the content script to use importScripts or
        // dynamically import. For now, we'll wrap the content script.
        const csPath = resolve(distDir, "content-script.js");
        if (existsSync(csPath)) {
          let code = readFileSync(csPath, "utf-8");
          // Check if it has imports (shared chunks)
          if (code.includes("import ")) {
            // Read all imported chunk files and inline them
            const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]\.\/(.+?)['"]/g;
            let match;
            let inlinedCode = "";
            const processedChunks = new Set<string>();

            while ((match = importRegex.exec(code)) !== null) {
              const chunkPath = resolve(distDir, match[2]);
              if (existsSync(chunkPath) && !processedChunks.has(chunkPath)) {
                processedChunks.add(chunkPath);
                let chunkCode = readFileSync(chunkPath, "utf-8");
                // Remove export statements from chunk
                chunkCode = chunkCode.replace(/^export\s+/gm, "");
                inlinedCode += chunkCode + "\n";
              }
            }

            // Remove import statements from main code
            code = code.replace(/^import\s+.*?;\s*$/gm, "");

            code = inlinedCode + code;
          }

          // Wrap in IIFE
          writeFileSync(csPath, `(function(){\n"use strict";\n${code}\n})();\n`);
        }

        // Copy static files
        copyFileSync(
          resolve(__dirname, "manifest.json"),
          resolve(distDir, "manifest.json")
        );
        copyFileSync(
          resolve(__dirname, "src/popup/popup.html"),
          resolve(distDir, "popup.html")
        );
        copyFileSync(
          resolve(__dirname, "src/popup/popup.css"),
          resolve(distDir, "popup.css")
        );
      },
    },
  ],
});
