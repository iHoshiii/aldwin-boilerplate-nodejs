// vite.config.js
import react from '@vitejs/plugin-react';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  // PostCSS (Tailwind) is auto-detected from postcss.config.cjs
  css: {
    postcss: './postcss.config.cjs',
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    assetsDir: '',
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 3001,
    open: true,
    strictPort: true,
    proxy: {
      '/api': `http://localhost:${process.env.PORT || 8081}`,
      '/auth': `http://localhost:${process.env.PORT || 8081}`,
    },
  },
  preview: {
    port: 3001,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
