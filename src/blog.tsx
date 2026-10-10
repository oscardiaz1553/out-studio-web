import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource/instrument-sans/400.css';
import '@fontsource/instrument-sans/500.css';
import { BlogIndex, BlogPost } from './pages/BlogPages';
import blog from './data/blog.json';
import './index.css';

// El índice usa data-slug="" y cada artículo, data-slug="<slug>".
const root = document.getElementById('root')!;
const post = blog.posts.find((p) => p.slug === root.dataset.slug);

// Quita el contenido estático para buscadores (ver scripts/postbuild-seo.mjs):
// a partir de aquí manda la app.
document.getElementById('static-content')?.remove();

createRoot(root).render(
  <StrictMode>{post ? <BlogPost post={post} /> : <BlogIndex />}</StrictMode>
);
