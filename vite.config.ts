import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Required for GitHub Pages project-site URLs (username.github.io/out-studio-web/)
  base: '/out-studio-web/',
  plugins: [react()],
});
