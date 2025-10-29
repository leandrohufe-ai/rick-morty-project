import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        ".next/",
        "**/*.test.ts",
        "**/*.test.tsx",
      ],
    },
  },
  resolve: {
    alias: {
      "@rick-morty/types": path.resolve(__dirname, "./packages/types/src"),
      "@rick-morty/api-client": path.resolve(
        __dirname,
        "./packages/api-client/src"
      ),
      "@rick-morty/utils": path.resolve(__dirname, "./packages/utils/src"),
      "@rick-morty/ui": path.resolve(__dirname, "./packages/ui/src"),
      "@rick-morty/config": path.resolve(__dirname, "./packages/config/src"),
    },
  },
});
