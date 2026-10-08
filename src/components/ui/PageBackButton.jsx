import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';
import { UI_COPY, pick } from '../../data/projects';

// Sayfa başındaki geri bağlantısı. `label` verilirse varsayılan "Ana sayfaya dön" metni yerine geçer.
const PageBackButton = ({ to = '/', label, className = '' }) => {
  const { isTurkish } = useLanguage();

  return (
    <Link
      to={to}
      className={`group inline-flex min-h-[2.75rem] items-center gap-2 rounded-full border border-line/10 bg-canvas/60 py-1.5 pl-3 pr-4 text-sm font-medium text-fg/75 backdrop-blur-md transition-colors hover:border-line/25 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      <HiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
      {label ?? pick(UI_COPY.backHome, isTurkish)}
    </Link>
  );
};

export default PageBackButton;
