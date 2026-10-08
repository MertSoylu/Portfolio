import { HiGlobe } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';
import Reveal from '../components/ui/Reveal';
import ProjectShowcase from '../components/project/ProjectShowcase';
import { projectsByCategory } from '../data/projects';

const WebDevPage = () => {
  const { isTurkish } = useLanguage();

  const projects = projectsByCategory('Web');
  // Yayında olan proje sayısı veriden hesaplanır; metne elle yazılmaz.
  const liveCount = projects.filter((project) => project.liveUrl).length;

  const intro = isTurkish
    ? `${projects.length} proje, ${liveCount} tanesi yayında. Her birinde önizleme, odak notu ve vaka incelemesi var.`
    : `${projects.length} projects, ${liveCount} of them live. Each one has a preview, a focus note and a case study.`;

  return (
    <SpecialtyPageLayout
      routePath="/web"
      eyebrow={isTurkish ? 'Web geliştirme' : 'Web development'}
      eyebrowIcon={<HiGlobe className="h-4 w-4" />}
      title={isTurkish ? 'Yayında çalışan web projeleri' : 'Web projects running live'}
      subtitle={
        isTurkish
          ? 'JavaScript ve Next.js ile geliştirdiğim projeler. Her birinin kararları ve teknik tercihleri vaka incelemesinde anlatılıyor.'
          : 'Projects built with JavaScript and Next.js. The decisions and technical trade-offs of each one are laid out in its case study.'
      }
    >
      <Reveal className="card mb-16 flex items-center gap-4 p-5 sm:mb-20 sm:p-6">
        <span
          aria-hidden="true"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface2 text-accent"
        >
          <HiGlobe className="h-5 w-5" />
        </span>
        <p className="text-body-sm text-muted">{intro}</p>
      </Reveal>

      <div className="space-y-20 sm:space-y-24">
        {projects.map((project, index) => (
          <ProjectShowcase key={project.id} project={project} index={index} flip={index % 2 === 1} />
        ))}
      </div>
    </SpecialtyPageLayout>
  );
};

export default WebDevPage;
