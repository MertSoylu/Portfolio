import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';

const PageBackButton = ({ to = '/', className = '' }) => {
  const { isTurkish } = useLanguage();

  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2 rounded-full border border-line/10 bg-canvas/60 py-1.5 pl-3 pr-4 text-sm font-medium text-fg/75 backdrop-blur-md transition-colors hover:border-line/25 hover:text-fg ${className}`}
    >
      <HiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {isTurkish ? 'Ana sayfaya dön' : 'Back to home'}
    </Link>
  );
};

export default PageBackButton;
