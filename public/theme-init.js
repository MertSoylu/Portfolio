// Runs before first paint (blocking <script src> in <head>, allowed by CSP script-src 'self').
// Applies the saved theme (default: dark) so there is no flash, and syncs <meta name="theme-color">.
// Keep the storage key and colours in sync with src/context/DarkModeContext.jsx.
(function () {
  var dark = true;
  try {
    var saved = localStorage.getItem('darkMode');
    if (saved !== null) dark = !!JSON.parse(saved);
  } catch (e) {
    dark = true;
  }

  var root = document.documentElement;
  if (dark) root.classList.add('dark');
  else root.classList.remove('dark');

  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', dark ? '#0A0B0D' : '#F7F7F4');
})();
