import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource/instrument-sans/400.css';
import '@fontsource/instrument-sans/500.css';
import QuoteBuilderPage from './pages/QuoteBuilderPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QuoteBuilderPage />
  </StrictMode>
);
