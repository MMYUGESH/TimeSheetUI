import path from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import { reactRouterDevTools } from "react-router-devtools";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactRouterDevTools(), reactRouter()],
  resolve: { alias: { "@frontend": path.resolve(__dirname, "./src") } },
});