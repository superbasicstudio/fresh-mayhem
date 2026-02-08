import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3022,
    host: true,
  },
  preview: {
    port: 3022,
  },
});
