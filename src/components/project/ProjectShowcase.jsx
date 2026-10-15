import { Link } from 'react-router-dom';
import { HiArrowRight, HiExternalLink } from 'react-icons/hi';
import Reveal from '../ui/Reveal';
import { ProjectPreview } from '../ui/DevicePreview';
import { useLanguage } from '../../context/LanguageContext';
import { UI_COPY, caseStudyPath, pick } from '../../data/projects';

const HEADING_CLASS = { h2: 'text-h2', h3: 'text-h3' };

// Etiket metinleri string ya da { tr, en } olabilir; pick ikisini de tek yoldan okur.
export const TagList = ({ tags = [] }) => {
  const { isTurkish } = useLanguage();

  if (!tags.length) return null;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag, index) => (
        <li key={index} className="tag">
          {pick(tag, isTurkish)}
        </li>
      ))}
    </ul>
  );
};

// Eylemlerin ilki ana eylemdir (`btn-primary`), kalanlar ikincildir. Vitrinde ilk eylem vaka
// incelemesidir; vaka sayfasında (`showCaseStudy={false}`) canlı site ya da kaynak kodu öne çıkar.
// Harici bağlantılar yeni sekmede açılır; ekran okuyucu için bunu belirten bir not taşırlar.
// `extraLinks` ([{ label, href }]) projeye özel ek harici bağlantılardır (ör. crates.io).
export const ProjectActions = ({ project, showCaseStudy = true, size = 'sm', extraLinks = [] }) => {
  const { isTurkish } = useLanguage();
  const t = (value) => pick(value, isTurkish);
  const sizeClass = size === 'lg' ? ' btn-lg' : '';

  const actions = [
    showCaseStudy && { key: 'case-study', to: caseStudyPath(project.id), label: t(UI_COPY.caseStudy) },
    project.liveUrl && {
      key: 'live',
      href: project.liveUrl,
      label: t(project.liveLabel || UI_COPY.liveSite),
    },
    project.githubUrl && { key: 'github', href: project.githubUrl, label: t(UI_COPY.sourceCode) },
    ...extraLinks.map((link) => ({ key: link.href, href: link.href, label: t(link.label) })),
  ].filter(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {actions.map((action, index) => {
        const className = `${index === 0 ? 'btn-primary' : 'btn-secondary'}${sizeClass}`;

        if (action.to) {
          return (
            <Link key={action.key} to={action.to} className={className}>
              {action.label}
              <HiArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          );
        }

        return (
          <a
            key={action.key}
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {action.label}
            <HiExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="sr-only"> {t(UI_COPY.newTab)}</span>
          </a>
        );
      })}
    </div>
  );
};

// Tek bir projenin vitrin bloğu (alan sayfaları): önizleme + metin. lg'de iki sütun; `flip`
// yalnızca lg'de sütunların yerini değiştirir, mobilde önizleme her zaman üstte kalır.
// Kategori burada yazılmaz: alan sayfası zaten hangi alanda olduğunu söylüyor.
const ProjectShowcase = ({ project, index = 0, flip = false, headingLevel = 'h2' }) => {
  const { isTurkish } = useLanguage();
  const t = (value) => pick(value, isTurkish);
  const Heading = headingLevel;
  const headingClass = HEADING_CLASS[headingLevel] ?? HEADING_CLASS.h2;
  const number = String(index + 1).padStart(2, '0');
  const highlights = project.highlights ?? [];

  return (
    <article className="card grid items-center gap-6 p-4 sm:gap-8 sm:p-6 lg:grid-cols-2 lg:gap-12 lg:p-8">
      <Reveal className={`min-w-0 ${flip ? 'lg:order-2' : 'lg:order-1'}`}>
        <ProjectPreview project={project} eager={index === 0} />
      </Reveal>

      <Reveal delay={0.08} className={`flex min-w-0 flex-col ${flip ? 'lg:order-1' : 'lg:order-2'}`}>
        <p className="label mb-4">
          <span className="text-accent">{number}</span>
          <span aria-hidden="true"> / </span>
          {t(project.status)}
        </p>

        <Heading className={`${headingClass} break-words`}>{project.title}</Heading>
        <p className="mt-3 text-base text-muted sm:text-lg">{t(project.summary)}</p>

        {project.focus && <p className="mt-5 border-l-2 border-accent pl-4 text-fg/80">{t(project.focus)}</p>}

        {highlights.length > 0 && (
          <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-line/10 py-4">
            {highlights.map((item, itemIndex) => (
              <div key={itemIndex} className="flex min-w-0 flex-col-reverse">
                <dt className="text-xs text-muted">{t(item.label)}</dt>
                <dd className="font-mono text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6">
          <TagList tags={project.tags} />
        </div>

        <div className="mt-7">
          <ProjectActions project={project} />
        </div>
      </Reveal>
    </article>
  );
};

export default ProjectShowcase;
