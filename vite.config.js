import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Bundles em dist/static — /assets fica só para as peças de public/assets
  build: { assetsDir: 'static' },
  server: { port: 5173 },
  preview: { port: 8765 },
});
