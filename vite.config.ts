import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  let currentToken: string | null = null;
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  async function refreshToken() {
    if (refreshTimer) clearTimeout(refreshTimer);
    try {
      const credentials = Buffer.from(
        `${env.COGNITO_CLIENT_ID}:${env.COGNITO_CLIENT_SECRET}`
      ).toString("base64");
      const res = await fetch(env.COGNITO_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        body: `grant_type=client_credentials&scope=${encodeURIComponent(env.COGNITO_SCOPE)}`,
      });
      const data = (await res.json()) as { access_token: string; expires_in: number };
      currentToken = data.access_token;
      console.log("[vite proxy] Cognito token fetched, expires in", data.expires_in, "s");
      // Refresh 60s before expiry
      refreshTimer = setTimeout(refreshToken, (data.expires_in - 60) * 1000);
    } catch (err) {
      console.error("[vite proxy] Cognito token fetch failed:", err);
      refreshTimer = setTimeout(refreshToken, 30_000);
    }
  }

  // Fetch token immediately on startup
  refreshToken();

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.API_GATEWAY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (currentToken) {
                proxyReq.setHeader("Authorization", `Bearer ${currentToken}`);
              } else {
                console.warn("[vite proxy] No token yet — request may fail");
              }
            });
          },
        },
      },
    },
  };
});
