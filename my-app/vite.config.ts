import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  root: './src',
  mode: 'production',
  build: {
    outDir: '../dist',
    minify: false,
    emptyOutDir: true,
  },
});
