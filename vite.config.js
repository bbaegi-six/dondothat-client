import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';

import { VitePWA } from 'vite-plugin-pwa';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'sw.js',
      devOptions: {
        enabled: false,  // iOS Safari 호환성을 위해 비활성화
        type: 'module',
      },
      injectRegister: 'auto',
    }),
  ],
  build: {
    target: ['es2015', 'safari11'],  // iOS Safari 호환성
    rollupOptions: {
      output: {
        manualChunks: undefined,  // iOS에서 청크 로딩 이슈 방지
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    postcss: (ctx) => {
      if (ctx.file && ctx.file.includes('node_modules')) {
        return {};
      }
      return {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      };
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  define: {
    global: 'globalThis',
  },
});
