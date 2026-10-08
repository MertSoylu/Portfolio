import { Link } from 'react-router-dom';
import { HiArrowRight, HiExternalLink } from 'react-icons/hi';
import Reveal from '../ui/Reveal';
import { ProjectPreview } from '../ui/DevicePreview';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORY_LABELS, UI_COPY, caseStudyPath, pick } from '../../data/projects';

const HEADING_CLASS = { h2: 'text-h2', h3: 'text-h3' };

// Etiket metinleri string ya da { tr, en } olabilir; pick ikisini de tek yoldan okur.
export const TagList = ({ tags = [] }) => {
  const { isTurkish } = useLanguage();

  if (!tags.length) return null;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const label = pick(tag, isTurkish);
        return (
          <li
            key={label}
            className="rounded-full border border-line/12 bg-surface2 px-2.5 py-1 text-xs font-medium text-muted"
          >
            {label}
          </li>
        );
      })}
    </ul>
  );
};

// Vaka incelemesi ana eylemdir; canlı site ve kaynak kodu ikincil bağlantılardır.
// Harici bağlantılar yeni sekmede açılır, ekran okuyucu için bunu belirten bir not taşır.
export const ProjectActions = ({ project, showCaseStudy = true, size = 'sm' }) => {
  const { isTurkish } = useLanguage();
  const t = (value) => pick(value, isTurkish);
  const sizeClass = size === 'sm' ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base';
  const newTabNote = t({ tr: '(yeni sekmede açılır)', en: '(opens in a new tab)' });

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {showCaseStudy && (
        <Link to={caseStudyPath(project.id)} className={`btn-primary ${sizeClass}`}>
          {t(UI_COPY.caseStudy)}
          <HiArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-secondary ${sizeClass}`}
        >
          {t(project.liveLabel || UI_COPY.liveSite)}
          <HiExternalLink className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{newTabNote}</span>
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-secondary ${sizeClass}`}
        >
          {t(UI_COPY.sourceCode)}
          <HiExternalLink className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{newTabNote}</span>
        </a>
      )}
    </div>
  );
};

// Tek bir projenin vitrin bloğu: önizleme + metin. lg'de iki sütun; `flip` yalnızca lg'de
// sütunların yerini değiştirir, mobilde önizleme her zaman üstte kalır.
const ProjectShowcase = ({ project, index = 0, flip = false, headingLevel = 'h2' }) => {
  const { isTurkish } = useLanguage();
  const t = (value) => pick(value, isTurkish);
  const Heading = headingLevel;
  const headingClass = HEADING_CLASS[headingLevel] ?? HEADING_CLASS.h2;
  const number = String(index + 1).padStart(2, '0');

  return (
    <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      <Reveal className={`min-w-0 ${flip ? 'lg:order-2' : 'lg:order-1'}`}>
        <ProjectPreview
          project={project}
          alt={`${project.title} ${t(UI_COPY.preview)}`}
          eager={index === 0}
        />
      </Reveal>

      <Reveal delay={0.08} className={`flex min-w-0 flex-col ${flip ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="eyebrow text-accent">
            {number} · {t(CATEGORY_LABELS[project.category])}
          </span>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
            {t(project.status)}
          </span>
        </div>

        <Heading className={`${headingClass} text-fg`}>{project.title}</Heading>
        <p className="mt-3 text-body-lg text-muted">{t(project.summary)}</p>

        {project.focus && (
          <p className="mt-5 border-l-2 border-accent pl-4 text-body text-fg/80">{t(project.focus)}</p>
        )}

        {project.highlights && (
          <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-line/10 py-4">
            {project.highlights.map((item) => (
              <div key={item.value} className="flex flex-col-reverse">
                <dt className="text-xs text-muted">{t(item.label)}</dt>
                <dd className="font-display text-2xl font-semibold text-fg">{item.value}</dd>
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
