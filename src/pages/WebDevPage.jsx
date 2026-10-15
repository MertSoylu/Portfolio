import { useLanguage } from '../context/LanguageContext';
import SpecialtyPageLayout, { InfoCard, PageSection } from '../components/SpecialtyPageLayout';
import Reveal from '../components/ui/Reveal';
import ProjectShowcase from '../components/project/ProjectShowcase';
import { areaById, fill } from '../data/areas';
import { getProject, pick, projectsByCategory } from '../data/projects';

const area = areaById('web');
const { projects: projectsCopy, tech, approach } = area.page;

const WebDevPage = () => {
  const { isTurkish } = useLanguage();
  const t = (value) => pick(value, isTurkish);

  const projects = projectsByCategory('Web');
  // Counts come from the data, never from hand-written text.
  const counts = { count: projects.length, live: projects.filter((project) => project.liveUrl).length };

  // Tag cloud: every project tag once, in order of first appearance.
  const techTags = [...new Set(projects.flatMap((project) => project.tags ?? []).map(t))];

  return (
    <SpecialtyPageLayout areaId={area.id} projects={projects}>
      <PageSection
        id="web-projects-heading"
        index="01"
        label={t(projectsCopy.label)}
        title={fill(t(projectsCopy.title), counts)}
        lead={t(projectsCopy.lead)}
      >
        <div className="space-y-16 md:space-y-24">
          {projects.map((project, index) => (
            <ProjectShowcase
              key={project.id}
              project={project}
              index={index}
              flip={index % 2 === 1}
              headingLevel="h3"
            />
          ))}
        </div>
      </PageSection>

      {techTags.length > 0 && (
        <PageSection
          id="web-tech-heading"
          index="02"
          label={t(tech.label)}
          title={t(tech.title)}
          lead={t(tech.lead)}
        >
          <Reveal>
            <ul className="flex flex-wrap gap-2">
              {techTags.map((tag) => (
                <li key={tag} className="tag px-3 py-1.5 text-sm text-fg">
                  {tag}
                </li>
              ))}
            </ul>
          </Reveal>
        </PageSection>
      )}

      <PageSection id="web-approach-heading" index="03" label={t(approach.label)} title={t(approach.title)}>
        <ul className="grid gap-4 md:grid-cols-3">
          {approach.items.map((item, index) => (
            <Reveal as="li" key={item.title.en} delay={index * 0.06} className="h-full">
              <InfoCard
                index={String(index + 1).padStart(2, '0')}
                title={t(item.title)}
                meta={
                  getProject(item.project) && (
                    <span className="micro text-muted">{getProject(item.project).title}</span>
                  )
                }
              >
                {t(item.desc)}
              </InfoCard>
            </Reveal>
          ))}
        </ul>
      </PageSection>
    </SpecialtyPageLayout>
  );
};

export default WebDevPage;
