import { useLanguage } from '../context/LanguageContext';

/**
 * Route-level loading state: monogram inside a hairline ring with a quarter-arc spinning in CSS
 * (no JS animation; the global reduced-motion rule stops it).
 */
const LoadingSpinner = () => {
  const { isTurkish } = useLanguage();

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-5 pt-16"
    >
      <div className="relative h-14 w-14" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border border-line/15" />
        <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-accent motion-reduce:animate-none" />
        <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold text-fg">
          MS
        </span>
      </div>
      <p className="label">{isTurkish ? 'Yükleniyor…' : 'Loading…'}</p>
    </div>
  );
};

export default LoadingSpinner;
