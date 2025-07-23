import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';

import { VitePWA } from 'vite-plugin-pwa';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'sw.js',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      injectRegister: 'auto',
    }),
  ],
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
  server: {},
});
