import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/reservations/': {
        target: 'https://dream-lab-backend.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
