import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './styles/global.css';

import App from './App.jsx';
import { pages, pageKeyFor } from './routes.js';
import { setStaticBoot } from './lib/motion.js';

// Lets CSS hide [data-animate] elements only when JS is actually running.
document.documentElement.classList.add('js');

const root = document.getElementById('root');

// The build saves every page as finished HTML (scripts/prerender.mjs), so the
// visitor is already reading it while this file downloads. Take over without
// a blink: fetch the page's own code first, then render in one go, and tell
// the entrance animations to leave alone what is already on screen.
const isStatic = root.hasChildNodes();
setStaticBoot(isStatic);

const start = () => {
  document.documentElement.removeAttribute('data-static');
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
};

const key = isStatic ? pageKeyFor(window.location.pathname) : null;
if (key) pages[key].preload().then(start, start);
else start();
