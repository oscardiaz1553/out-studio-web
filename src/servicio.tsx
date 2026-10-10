import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource/instrument-sans/400.css';
import '@fontsource/instrument-sans/500.css';
import ServicePage from './pages/ServicePage';
import data from './data/services.json';
import './index.css';

// Cada HTML de servicio marca su página en <div id="root" data-slug="…">.
const root = document.getElementById('root')!;
const page = data.pages.find((p) => p.slug === root.dataset.slug) ?? data.pages[0];

// Quita el contenido estático para buscadores (ver scripts/postbuild-seo.mjs):
// a partir de aquí manda la app.
document.getElementById('static-content')?.remove();

createRoot(root).render(
  <StrictMode>
    <ServicePage page={page} />
  </StrictMode>
);
