import { Link } from 'react-router-dom';
import { HiArrowLeft, HiHome } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';

const NotFoundPage = () => {
  const { isTurkish } = useLanguage();

  const quickLinks = [
    { to: '/web', label: isTurkish ? 'Web Geliştirme' : 'Web Development' },
    { to: '/android', label: 'Android' },
    { to: '/cybersecurity', label: isTurkish ? 'Siber Güvenlik' : 'Cybersecurity' },
    { to: '/data-science', label: isTurkish ? 'Veri Bilimi' : 'Data Science' },
  ];

  return (
    <SpecialtyPageLayout routePath="/404" centered hideBackButton>
      <p className="font-display text-[7rem] font-semibold leading-none text-accent sm:text-[9rem]">404</p>

      <h1 className="mb-4 mt-2 text-h2 text-fg">{isTurkish ? 'Sayfa bulunamadı' : 'Page not found'}</h1>
      <p className="mb-8 text-body text-muted">
        {isTurkish
          ? 'Aradığın sayfa mevcut değil ya da taşınmış olabilir.'
          : "The page you're looking for doesn't exist or may have been moved."}
      </p>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/" className="btn-primary">
          <HiHome className="h-5 w-5" />
          {isTurkish ? 'Ana sayfa' : 'Go home'}
        </Link>
        <button type="button" onClick={() => window.history.back()} className="btn-secondary">
          <HiArrowLeft className="h-5 w-5" />
          {isTurkish ? 'Geri dön' : 'Go back'}
        </button>
      </div>

      <div className="mt-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          {isTurkish ? 'Belki şunu mu arıyordun?' : 'Maybe you were looking for'}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {quickLinks.map((quick) => (
            <Link
              key={quick.to}
              to={quick.to}
              className="rounded-full border border-line/12 bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-line/25 hover:text-fg"
            >
              {quick.label}
            </Link>
          ))}
        </div>
      </div>
    </SpecialtyPageLayout>
  );
};

export default NotFoundPage;
