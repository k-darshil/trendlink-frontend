// vite.config.ts
// Vite is the build tool that compiles our React/TypeScript into plain HTML+JS.
// This file configures how Vite works.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // During development, forward /api/* requests to API Gateway
  // This lets the frontend call the backend without CORS issues on your laptop
  server: {
    proxy: {
      "/api": {
        // Replace this with your API Gateway URL after deploying
        target: "https://YOUR_API_GATEWAY_URL",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
