import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Dominio propio (out-studio.net): el sitio vive en la raíz.
  base: '/',
  plugins: [react()],
});
