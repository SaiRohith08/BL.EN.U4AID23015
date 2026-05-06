import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api1": {
        target: "http://20.244.56.144",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api1/, "")
      },
      "/api2": {
        target: "http://20.207.122.201",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api2/, "")
      }
    }
  }
});
