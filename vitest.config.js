import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    css: false,
    include: ['src/**/*.{test,spec}.{js,jsx}', 'tests/unit/**/*.{test,spec}.{js,jsx}'],
    exclude: ['node_modules', 'dist', 'tests/e2e/**'],
  },
});
