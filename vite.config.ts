import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

// Una página de entrada por servicio (ver src/data/services.json).
const services = JSON.parse(
  readFileSync(new URL('./src/data/services.json', import.meta.url), 'utf8'),
).pages as { slug: string }[];
const servicePages = Object.fromEntries(
  services.map((s) => [
    `servicio-${s.slug}`,
    fileURLToPath(new URL(`./servicios/${s.slug}/index.html`, import.meta.url)),
  ]),
);

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
        proyectos: fileURLToPath(new URL('./proyectos.html', import.meta.url)),
        cotizar: fileURLToPath(new URL('./cotizar.html', import.meta.url)),
        ...servicePages,
      },
    },
  },
});
