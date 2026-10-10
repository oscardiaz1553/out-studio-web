import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource/instrument-sans/400.css';
import '@fontsource/instrument-sans/500.css';
import ProjectsPage from './pages/ProjectsPage';
import './index.css';

// Quita el contenido estático para buscadores (ver scripts/postbuild-seo.mjs):
// a partir de aquí manda la app.
document.getElementById('static-content')?.remove();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProjectsPage />
  </StrictMode>
);
