import {
  HiBookOpen,
  HiExternalLink,
  HiFingerPrint,
  HiShieldCheck,
  HiShieldExclamation,
  HiTerminal,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';
import Reveal from '../components/ui/Reveal';

const THREAT_ICONS = [HiShieldExclamation, HiTerminal, HiFingerPrint];

const CyberSecurityPage = () => {
  const { isTurkish } = useLanguage();

  const scanTargets = ['XSS', 'SQLi', 'CSRF', 'SSRF', 'Open redirect', 'Security headers', 'Subdomains'];

  const focusAreas = isTurkish
    ? [
        { title: 'Web açıklıkları', desc: 'XSS, SQLi, CSRF, SSRF, open redirect ve header kontrolleri.' },
        { title: 'CLI otomasyon', desc: 'Terminal tabanlı araçlarla tekrarlanabilir güvenlik kontrolleri.' },
        {
          title: 'Güvenli kodlama',
          desc: 'Uygulama geliştirirken saldırgan bakışını tasarım kararlarına katmak.',
        },
      ]
    : [
        { title: 'Web vulnerabilities', desc: 'XSS, SQLi, CSRF, SSRF, open redirect, and header checks.' },
        { title: 'CLI automation', desc: 'Repeatable security checks through terminal-based tooling.' },
        { title: 'Secure coding', desc: 'Bringing an attacker mindset into everyday product decisions.' },
      ];

  return (
    <SpecialtyPageLayout
      routePath="/cybersecurity"
      eyebrow={isTurkish ? 'Siber güvenlik' : 'Cybersecurity'}
      eyebrowIcon={<HiShieldCheck className="h-4 w-4" />}
      title={isTurkish ? 'Siber Güvenlik' : 'Cyber Security'}
      subtitle={
        isTurkish
          ? 'Güvenlik tarafında odağım, öğrenilen kavramları küçük ama çalışır araçlara dönüştürmek.'
          : 'My security focus is turning learned concepts into small but working tools.'
      }
    >
      <Reveal className="card-prominent p-6 sm:p-8">
        <p className="eyebrow mb-2 text-accent">msscan</p>
        <h2 className="mb-4 text-h2 text-fg">
          {isTurkish ? 'Async Python web güvenlik tarayıcısı.' : 'Async Python web security scanner.'}
        </h2>
        <p className="mb-6 max-w-3xl text-body text-muted">
          {isTurkish
            ? 'msscan; XSS, SQL injection, CSRF, SSRF, open redirect, HTTP security headers ve subdomain enumeration kontrolleri için geliştirdiğim terminal aracıdır. Odak: async çalışma, rate limiting, bağlam farkında tespit ve HTML rapor üretimi.'
            : 'msscan is my terminal tool for XSS, SQL injection, CSRF, SSRF, open redirect, HTTP security headers, and subdomain enumeration checks. Focus: async execution, rate limiting, context-aware detection, and HTML reporting.'}
        </p>

        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            {isTurkish ? 'Kontrol ettiği alanlar' : 'What it checks'}
          </p>
          <div className="flex flex-wrap gap-2">
            {scanTargets.map((target) => (
              <span
                key={target}
                className="rounded-full border border-line/12 bg-surface2 px-3 py-1 text-xs font-medium text-fg"
              >
                {target}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/MertSoylu/msscan"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <HiExternalLink className="h-4 w-4" />
            GitHub
          </a>
          <Link to="/case-study/msscan" className="btn-secondary">
            <HiBookOpen className="h-4 w-4" />
            Case Study
          </Link>
        </div>
      </Reveal>

      <section className="mt-16" aria-labelledby="focus-areas-heading">
        <h2 id="focus-areas-heading" className="mb-8 text-h2 text-fg">
          {isTurkish ? 'Odak alanları' : 'Focus areas'}
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {focusAreas.map((area, index) => {
            const Icon = THREAT_ICONS[index] ?? HiShieldExclamation;
            return (
              <Reveal key={area.title} delay={index * 0.08} className="h-full">
                <div className="card card-hover h-full p-6">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface2 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-h4 text-fg">{area.title}</h3>
                  <p className="text-body-sm text-muted">{area.desc}</p>
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
