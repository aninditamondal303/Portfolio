import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/inter-tight';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/caveat/latin-500.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles/global.css';
import App from './App';
import { prefersReducedMotion } from './hooks/motion';

// Hide elements that will be animated in, but only when motion is allowed.
// Without JavaScript or with reduced motion, everything is simply visible.
if (!prefersReducedMotion()) document.documentElement.classList.add('js-motion');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
