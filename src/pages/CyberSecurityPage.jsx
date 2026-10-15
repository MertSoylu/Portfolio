import { HiExternalLink } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import SpecialtyPageLayout, { InfoCard, PageSection } from '../components/SpecialtyPageLayout';
import Reveal from '../components/ui/Reveal';
import ProjectShowcase from '../components/project/ProjectShowcase';
import { areaById } from '../data/areas';
import { pick, projectsByCategory } from '../data/projects';
import { CERTIFICATES } from '../utils/constants';

const area = areaById('cybersecurity');
const { projects: projectsCopy, checks, focus, certificate: certificateCopy } = area.page;

const CyberSecurityPage = () => {
  const { isTurkish } = useLanguage();
  const t = (value) => pick(value, isTurkish);

  const projects = projectsByCategory('Security');
  const certificate = CERTIFICATES.find((item) => item.id === certificateCopy.id);

  // Sections are numbered in order; without projects the others shift up so there is no gap.
  const offset = projects.length > 0 ? 0 : 1;
  const sectionIndex = (position) => String(position - offset).padStart(2, '0');

  return (
    <SpecialtyPageLayout areaId={area.id} projects={projects}>
      {projects.length > 0 && (
        <PageSection
          id="cyber-projects-heading"
          index={sectionIndex(1)}
          label={t(projectsCopy.label)}
          title={t(projectsCopy.title)}
        >
          <div className="space-y-16 md:space-y-24">
            {projects.map((project, index) => (
              <ProjectShowcase key={project.id} project={project} index={index} headingLevel="h3" />
            ))}
          </div>
        </PageSection>
      )}

      <PageSection
        id="cyber-checks-heading"
        index={sectionIndex(2)}
        label={t(checks.label)}
        title={t(checks.title)}
        lead={t(checks.lead)}
      >
        <Reveal>
          <ul className="flex flex-wrap gap-2">
            {checks.items.map((item) => (
              <li key={item.en} className="tag px-3 py-1.5 text-sm text-fg">
                {t(item)}
              </li>
            ))}
          </ul>
        </Reveal>
      </PageSection>

      <PageSection
        id="cyber-focus-heading"
        index={sectionIndex(3)}
        label={t(focus.label)}
        title={t(focus.title)}
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {focus.items.map((item, index) => (
            <Reveal as="li" key={item.title.en} delay={index * 0.06} className="h-full">
              <InfoCard index={String(index + 1).padStart(2, '0')} title={t(item.title)}>
                {t(item.desc)}
              </InfoCard>
            </Reveal>
          ))}
        </ul>
      </PageSection>

      {certificate && (
        <PageSection
          id="cyber-certificate-heading"
          index={sectionIndex(4)}
          label={t(certificateCopy.label)}
          title={t(certificateCopy.title)}
        >
          <Reveal>
            <article className="card flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="min-w-0">
                <p className="label">
                  {certificate.issuer} · {certificate.date}
                </p>
                <h3 className="text-h3 mt-2">{t(certificate.title)}</h3>
                {certificate.skills?.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {certificate.skills.map((skill) => (
                      <li key={skill} className="tag">
                        {skill}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <a
                href={certificate.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary shrink-0 self-start md:self-center"
              >
                {t(certificateCopy.open)}
                <HiExternalLink className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">
                  {isTurkish ? '(yeni sekmede açılır)' : '(opens in a new tab)'}
                </span>
              </a>
            </article>
          </Reveal>
        </PageSection>
      )}
    </SpecialtyPageLayout>
  );
};

export default CyberSecurityPage;
