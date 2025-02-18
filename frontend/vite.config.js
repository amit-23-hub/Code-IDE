import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [],
    },
  },
  server: {
    proxy: {
      '/signUp': 'https://synlab.vercel.app', // Backend ka URL
    },
  },
});
