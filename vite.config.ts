import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  // Dominio propio (out-studio.net): el sitio vive en la raíz.
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      // Sitio multipágina: el landing (index) y la página de contacto,
      // que se abre en pestaña nueva desde el menú.
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        contacto: fileURLToPath(new URL('./contacto.html', import.meta.url)),
      },
    },
  },
});
