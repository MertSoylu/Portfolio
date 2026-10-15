// In-page navigation shared by the Navbar and Footer: scroll to a home section and keep the URL in sync.
// Returns false when the section is not on the current page, so the caller can fall back to router navigation.
export const scrollToSection = (id, reduceMotion = false) => {
  const target = document.getElementById(id);
  if (!target) return false;
  window.history.pushState(null, '', `/#${id}`);
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  return true;
};

// Plain left-click without modifier keys (anything else should keep the browser's default link behaviour).
export const isPlainLeftClick = (event) =>
  event.button === 0 && !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
