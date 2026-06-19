import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { initWebVitals } from './utils/vitals';
import './index.css';

// Always start at top on page load/refresh
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
document.documentElement.style.scrollBehavior = 'auto';
window.scrollTo(0, 0);

if (typeof window !== 'undefined' && import.meta.env.PROD) {
  console.log(
    // eslint-disable-line no-console
    '%cMert Soylu %cgithub.com/MertSoylu',
    'font-size: 18px; font-weight: 700; color: #f07d2d;',
    'font-size: 13px; color: #888;',
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);

initWebVitals();
