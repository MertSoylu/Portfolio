import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import PageMeta from '../components/PageMeta';
import { AREAS } from '../data/areas';

const NotFoundPage = () => {
  const { isTurkish } = useLanguage();
  const t = (value) => (isTurkish ? value.tr : value.en);

  return (
    <div className="container-site flex min-h-[70vh] flex-col items-center justify-center pb-16 pt-28 text-center sm:pt-32">
      <PageMeta route="/404" noindex />

      <p
        aria-hidden="true"
        className="font-mono text-[clamp(7rem,28vw,14rem)] font-semibold leading-none tracking-tighter text-fg"
      >
        4<span className="text-accent">0</span>4
      </p>

      <h1 className="text-h2 mt-6">
        <span className="sr-only">404: </span>
        {isTurkish ? 'Sayfa bulunamadı' : 'Page not found'}
      </h1>
      <p className="text-lead mt-4 max-w-md">
        {isTurkish
          ? 'Aradığın sayfa mevcut değil ya da taşınmış olabilir.'
          : 'The page you are looking for does not exist or may have moved.'}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-primary btn-lg">
          {isTurkish ? 'Ana sayfa' : 'Home'}
        </Link>
        <Link to="/#projects" className="btn-secondary btn-lg">
          {isTurkish ? 'Projelere göz at' : 'Browse projects'}
        </Link>
      </div>

      <nav aria-labelledby="not-found-areas" className="mt-14 w-full max-w-3xl sm:mt-16">
        <p id="not-found-areas" className="label">
          {isTurkish ? 'Ya da bir alana geç' : 'Or jump to an area'}
        </p>
        <ul className="mt-4 grid gap-3 text-left sm:grid-cols-2">
          {AREAS.map((area) => (
            <li key={area.id}>
              <Link to={area.path} className="card-interactive flex min-h-11 items-center gap-3 px-4 py-3">
                <span aria-hidden="true" className="micro text-accent">
                  {area.index}
                </span>
                <span className="text-sm font-medium">{t(area.name)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NotFoundPage;
