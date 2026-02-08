import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'lcov'],
      include: ['src/**', 'components/**', 'data/**'],
      exclude: ['node_modules/', 'tests/', 'dist/'],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/components',
      '@data': '/data',
    },
  },
});
