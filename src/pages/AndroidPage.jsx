import { useLanguage } from '../context/LanguageContext';
import SpecialtyPageLayout, { InfoCard, PageSection } from '../components/SpecialtyPageLayout';
import Reveal from '../components/ui/Reveal';
import ProjectShowcase from '../components/project/ProjectShowcase';
import { areaById } from '../data/areas';
import { pick, projectsByCategory } from '../data/projects';

const area = areaById('android');
const { projects: projectsCopy, features, stats } = area.page;

const AndroidPage = () => {
  const { isTurkish } = useLanguage();
  const t = (value) => pick(value, isTurkish);

  const projects = projectsByCategory('Android');

  // Stats that describe the data are derived from it, so the numbers cannot drift from the page.
  const derived = {
    features: features.items.length,
    live: projects.filter((project) => project.liveUrl).length,
  };
  const statItems = stats.items.map((item) => ({
    ...item,
    value: item.derive ? derived[item.derive] : item.value,
  }));

  return (
    <SpecialtyPageLayout areaId={area.id} projects={projects}>
      <PageSection
        id="android-projects-heading"
        index="01"
        label={t(projectsCopy.label)}
        title={t(projectsCopy.title)}
      >
        <div className="space-y-16 md:space-y-24">
          {projects.map((project, index) => (
            <ProjectShowcase key={project.id} project={project} index={index} headingLevel="h3" />
          ))}
        </div>
      </PageSection>

      <PageSection
        id="android-features-heading"
        index="02"
        label={t(features.label)}
        title={t(features.title)}
        lead={t(features.lead)}
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {features.items.map((item, index) => (
            <Reveal as="li" key={item.title.en} delay={index * 0.06} className="h-full">
              <InfoCard index={String(index + 1).padStart(2, '0')} title={t(item.title)}>
                {t(item.desc)}
              </InfoCard>
            </Reveal>
          ))}
        </ul>
      </PageSection>

      <PageSection id="android-stats-heading" index="03" label={t(stats.label)} title={t(stats.title)}>
        <Reveal>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line/10 bg-line/10 lg:grid-cols-4">
            {statItems.map((item) => (
              <div key={item.label.en} className="bg-surface p-5 sm:p-6">
                <dt className="label">{t(item.label)}</dt>
                <dd className="mt-3">
                  <span className="block font-mono text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                    {item.value}
                  </span>
                  <span className="mt-2 block text-sm text-muted">{t(item.sub)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </PageSection>
    </SpecialtyPageLayout>
  );
};

export default AndroidPage;
