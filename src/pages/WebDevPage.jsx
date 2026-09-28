import { Link } from 'react-router-dom';
import { HiBookOpen, HiExternalLink, HiGlobe } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';
import Reveal from '../components/ui/Reveal';
import { ProjectPreview } from '../components/ui/DevicePreview';
import { caseStudyPath, pick, projectsByCategory } from '../data/projects';

const ProjectRow = ({ project, index, isTurkish }) => {
  const flip = index % 2 === 1;
  const t = (value) => pick(value, isTurkish);
  return (
    <Reveal className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div className={flip ? 'lg:order-2' : ''}>
        <ProjectPreview project={project} alt={`${project.title} ${isTurkish ? 'önizleme' : 'preview'}`} />
      </div>
      <div className={flip ? 'lg:order-1' : ''}>
        <p className="eyebrow mb-3 text-accent">{String(index + 1).padStart(2, '0')}</p>
        <h2 className="mb-3 text-h2 text-fg">{project.title}</h2>
        <p className="mb-4 text-body text-muted">{t(project.summary)}</p>
        {project.focus && (
          <p className="mb-5 border-l-2 border-accent/60 pl-4 text-sm font-medium leading-relaxed text-fg">
            {t(project.focus)}
          </p>
        )}
        <div className="mb-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={t(tag)}
              className="rounded-full border border-line/12 bg-surface2 px-2.5 py-1 text-xs font-medium text-muted"
            >
              {t(tag)}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={caseStudyPath(project.id)} className="btn-primary px-4 py-2 text-sm">
            <HiBookOpen className="h-4 w-4" />
            Case study
          </Link>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-4 py-2 text-sm"
          >
            <HiExternalLink className="h-4 w-4" />
            {isTurkish ? 'Canlı aç' : 'Open live'}
          </a>
        </div>
      </div>
    </Reveal>
  );
};

const WebDevPage = () => {
  const { isTurkish } = useLanguage();

  const projects = projectsByCategory('Web');

  return (
    <SpecialtyPageLayout
      routePath="/web"
      eyebrow={isTurkish ? 'Web geliştirme' : 'Web development'}
      eyebrowIcon={<HiGlobe className="h-4 w-4" />}
      title={isTurkish ? 'Canlı web ürünleri' : 'Live web products'}
      subtitle={
        isTurkish
          ? 'React, Next.js ve ürün odaklı arayüz kararlarıyla geliştirdiğim, yayında olan web projeleri.'
          : 'Live web projects built with React, Next.js, and product-minded interface decisions.'
      }
    >
      <div className="space-y-20 sm:space-y-24">
        {projects.map((project, index) => (
          <ProjectRow key={project.id} project={project} index={index} isTurkish={isTurkish} />
        ))}
      </div>
    </SpecialtyPageLayout>
  );
};

export default WebDevPage;
