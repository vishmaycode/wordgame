import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => {
  return {
    server: {
      open: true,
      port: 3000
    },
    build: {
      outDir: "dist",
      rollupOptions: {
        output: {
          manualChunks: {
            'react': ['react'],
            'lucide-react': ['lucide-react'],
          }
        }
      }
    },
    plugins: [react(), svgr({ svgrOptions: { icon: true } })],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
