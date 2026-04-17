import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/asa-3-number-speed-drill/' : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
