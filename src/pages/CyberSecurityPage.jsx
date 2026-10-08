import { HiFingerPrint, HiShieldCheck, HiShieldExclamation, HiTerminal } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';
import ProjectShowcase from '../components/project/ProjectShowcase';
import Reveal from '../components/ui/Reveal';
import { pick, projectsByCategory } from '../data/projects';

// msscan'in mevcut kontrol listesi. Kısa teknik adlar iki dilde aynı; diğerleri doğal çevirilidir.
const SCAN_CHECKS = [
  { tr: 'XSS', en: 'XSS' },
  { tr: 'SQLi', en: 'SQLi' },
  { tr: 'CSRF', en: 'CSRF' },
  { tr: 'SSRF', en: 'SSRF' },
  { tr: 'Açık yönlendirme', en: 'Open redirect' },
  { tr: 'Güvenlik başlıkları', en: 'Security headers' },
  { tr: 'Alt alan adları', en: 'Subdomains' },
];

const FOCUS_AREAS = [
  {
    icon: HiShieldExclamation,
    title: { tr: 'Web açıklıkları', en: 'Web vulnerabilities' },
    desc: {
      tr: 'XSS, SQLi, CSRF, SSRF ve açık yönlendirme gibi sık görülen açıklıkları tanımak ve tespit etmek.',
      en: 'Recognizing and detecting common flaws such as XSS, SQLi, CSRF, SSRF and open redirects.',
    },
  },
  {
    icon: HiTerminal,
    title: { tr: 'CLI otomasyonu', en: 'CLI automation' },
    desc: {
      tr: 'Güvenlik kontrollerini terminalden, her seferinde aynı adımlarla çalıştırmak.',
      en: 'Running security checks from the terminal, the same way every time.',
    },
  },
  {
    icon: HiFingerPrint,
    title: { tr: 'Güvenli kodlama', en: 'Secure coding' },
    desc: {
      tr: 'Saldırgan bakış açısını günlük ürün ve tasarım kararlarının içine taşımak.',
      en: "Bringing an attacker's perspective into everyday product and design decisions.",
    },
  },
];

const CyberSecurityPage = () => {
  const { isTurkish } = useLanguage();
  const t = (value) => pick(value, isTurkish);
  const projects = projectsByCategory('Security');

  return (
    <SpecialtyPageLayout
      routePath="/cybersecurity"
      eyebrow={t({ tr: 'Siber güvenlik', en: 'Cybersecurity' })}
      eyebrowIcon={<HiShieldCheck className="h-4 w-4" aria-hidden="true" />}
      title={t({ tr: 'Siber Güvenlik', en: 'Cyber Security' })}
      subtitle={t({
        tr: 'Öğrendiğim güvenlik kavramlarını küçük, çalışan ve tekrarlanabilir araçlara dönüştürüyorum.',
        en: 'I turn the security concepts I learn into small, working and repeatable tools.',
      })}
    >
      {projects.length > 0 && (
        <section aria-labelledby="cyber-projects-heading">
          <Reveal as="h2" id="cyber-projects-heading" className="mb-8 text-h2 text-fg sm:mb-10">
            {t({ tr: 'Projeler', en: 'Projects' })}
          </Reveal>
          <div className="space-y-16 sm:space-y-20">
            {projects.map((project, index) => (
              <ProjectShowcase key={project.id} project={project} index={index} headingLevel="h3" />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="scan-checks-heading" className="mt-16 sm:mt-24">
        <Reveal as="h2" id="scan-checks-heading" className="mb-6 text-h2 text-fg">
          {t({ tr: 'Kontrol ettiği alanlar', en: 'What it checks' })}
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="flex flex-wrap gap-2">
            {SCAN_CHECKS.map((check) => (
              <li
                key={check.en}
                className="rounded-full border border-line/12 bg-surface2 px-3.5 py-1.5 text-sm font-medium text-fg"
              >
                {t(check)}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section aria-labelledby="focus-areas-heading" className="mt-16 sm:mt-24">
        <Reveal as="h2" id="focus-areas-heading" className="mb-8 text-h2 text-fg">
          {t({ tr: 'Odak alanları', en: 'Focus areas' })}
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {FOCUS_AREAS.map((area, index) => {
            const Icon = area.icon;
            return (
              <Reveal key={area.title.en} delay={index * 0.08} className="h-full">
                <div className="card card-hover h-full p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface2 text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-h4 text-fg">{t(area.title)}</h3>
                  <p className="text-body-sm text-muted">{t(area.desc)}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </SpecialtyPageLayout>
  );
};

export default CyberSecurityPage;
