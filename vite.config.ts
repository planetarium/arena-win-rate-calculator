import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = new URL('.', import.meta.url).pathname;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "~", replacement: `${__dirname}/src` }],
  },
});
