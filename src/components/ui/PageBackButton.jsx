import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';

// Back link at the top of a page. Defaults to the home page's area cards (`/#about`), which is where
// every area page is reached from; `label` replaces the default "Ana sayfa / Home" text.
const PageBackButton = ({ to = '/#about', label, className = '' }) => {
  const { isTurkish } = useLanguage();

  return (
    <Link
      to={to}
      className={`inline-flex min-h-11 items-center gap-2 rounded-md border border-line/15 px-3.5 text-sm font-medium text-muted transition-colors duration-150 hover:border-line/40 hover:bg-surface2 hover:text-fg ${className}`}
    >
      <HiArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
      {label ?? (isTurkish ? 'Ana sayfa' : 'Home')}
    </Link>
  );
};

export default PageBackButton;
