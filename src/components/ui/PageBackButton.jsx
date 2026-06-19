import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';

const PageBackButton = ({ to = '/', className = '' }) => {
  const { isTurkish } = useLanguage();

  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-fg ${className}`}
    >
      <HiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {isTurkish ? 'Ana sayfaya dön' : 'Back to home'}
    </Link>
  );
};

export default PageBackButton;
