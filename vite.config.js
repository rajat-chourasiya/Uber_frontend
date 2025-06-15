// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default({
  plugins: [react()],
  server: {
      host: 'localhost'
  },
});

