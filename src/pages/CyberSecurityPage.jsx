import React from 'react';
import { motion } from 'framer-motion';
import { HiBookOpen, HiExternalLink, HiLightningBolt, HiShieldCheck } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SitePreview from '../components/SitePreview';
import DecryptedText from '../components/DecryptedText';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';

const CyberSecurityPage = () => {
  const { isTurkish } = useLanguage();

  const terminalContent = (
    <>
      <p>
        <span className="text-cyan-300">msscan&gt;</span> set url https://example.com
      </p>
      <p>
        <span className="text-cyan-300">msscan&gt;</span> set modules xss,sqli,headers
      </p>
      <p>
        <span className="text-cyan-300">msscan&gt;</span> set rate-limit 10
      </p>
      <p className="text-accent-300">[*] {isTurkish ? 'Async tarama başladı' : 'Async scan started'}</p>
      <p className="text-cyan-200">[+] XSS context checks completed</p>
      <p className="text-emerald-300">[✓] HTML report generated</p>
    </>
  );

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

  const cyberTitle = (
    <DecryptedText
      text={isTurkish ? 'Siber Güvenlik' : 'Cyber Security'}
      speed={40}
      maxIterations={15}
      sequential
      revealDirection="center"
      animateOn="view"
      characters="01!@#$%^&*{}[]<>/\\|~`"
      className="text-h1 text-ink-900 dark:text-white"
      encryptedClassName="text-h1 text-accent-500/60 dark:text-accent-300/60"
      parentClassName="text-h1 inline-block"
    />
  );

  return (
    <SpecialtyPageLayout
      routePath="/cybersecurity"
      accent="red"
      eyebrow={isTurkish ? 'Siber güvenlik' : 'Cybersecurity'}
      eyebrowIcon={<HiShieldCheck className="h-4 w-4" />}
      titleNode={cyberTitle}
      subtitle={
        isTurkish
          ? 'Güvenlik tarafında odağım, öğrenilen kavramları küçük ama çalışır araçlara dönüştürmek.'
          : 'My security focus is turning learned concepts into small but working tools.'
      }
      sideNode={
        <SitePreview
          title="msscan"
          url="https://github.com/MertSoylu/msscan"
          type="terminal"
          variant="terminal"
          terminalContent={terminalContent}
          expandable={false}
          showActions={false}
        />
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55 }}
          className="card-prominent p-6 sm:p-8"
        >
          <p className="mb-2 text-caption text-accent-700 dark:text-accent-200">msscan</p>
          <h2 className="mb-4 text-h2 text-ink-900 dark:text-white">
            {isTurkish ? 'Async Python web güvenlik tarayıcısı.' : 'Async Python web security scanner.'}
          </h2>
          <p className="mb-5 text-body text-ink-600 dark:text-ink-200">
            {isTurkish
              ? 'msscan; XSS, SQL injection, CSRF, SSRF, open redirect, HTTP security headers ve subdomain enumeration kontrolleri için geliştirdiğim terminal aracıdır. README’de belirtilen odak: async execution, rate limiting, context-aware detection ve HTML rapor üretimi.'
              : 'msscan is my terminal tool for XSS, SQL injection, CSRF, SSRF, open redirect, HTTP security headers, and subdomain enumeration checks. The README focus is async execution, rate limiting, context-aware detection, and HTML reporting.'}
          </p>
          <div className="mb-6 flex flex-wrap gap-2">
            {['Python', 'Async', 'Rate limiting', 'HTML reports', 'Security headers'].map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-ink-200/70 bg-white/50 px-2.5 py-1 text-xs font-bold text-ink-600 dark:border-white/10 dark:bg-white/10 dark:text-ink-200"
              >
                {tag}
              </span>
            ))}
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
        </motion.article>

        <div className="grid gap-3">
          {focusAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="card-raised p-5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-accent-300/50 bg-accent-50 text-accent-700 dark:border-accent-300/20 dark:bg-accent-300/10 dark:text-accent-200">
                <HiLightningBolt className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-h4 text-ink-900 dark:text-white">{area.title}</h3>
              <p className="text-body-sm text-ink-600 dark:text-ink-200">{area.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SpecialtyPageLayout>
  );
};

export default CyberSecurityPage;
