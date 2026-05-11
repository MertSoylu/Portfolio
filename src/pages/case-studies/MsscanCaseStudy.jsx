import React from 'react';
import { motion } from 'framer-motion';
import { HiLightningBolt, HiShieldCheck, HiGlobe, HiUsers, HiClock, HiChip } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';
import { useDarkMode } from '../../context/DarkModeContext';
import CaseStudyLayout from '../../components/CaseStudyLayout';
import FadeContent from '../../components/FadeContent';
import SpotlightCard from '../../components/SpotlightCard';

const MsscanCaseStudy = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();

  const metrics = isTurkish
    ? [
        { icon: <HiGlobe className="w-6 h-6" />, value: '7', label: 'Güvenlik Modülü' },
        { icon: <HiUsers className="w-6 h-6" />, value: 'HTML', label: 'Raporlama' },
        { icon: <HiClock className="w-6 h-6" />, value: 'Yapılandırılabilir', label: 'Tarama Hızı' },
        { icon: <HiChip className="w-6 h-6" />, value: 'Python', label: 'CLI Araç' },
      ]
    : [
        { icon: <HiGlobe className="w-6 h-6" />, value: '7', label: 'Security Modules' },
        { icon: <HiUsers className="w-6 h-6" />, value: 'HTML', label: 'Reporting' },
        { icon: <HiClock className="w-6 h-6" />, value: 'Configurable', label: 'Scan Rate' },
        { icon: <HiChip className="w-6 h-6" />, value: 'Python', label: 'CLI Tool' },
      ];

  const techStack = ['Python', 'Requests', 'BeautifulSoup', 'argparse', 'Jinja2', 'Threading'];

  const challenges = isTurkish
    ? [
        {
          title: 'Rate Limiting',
          desc: 'Hedef siteyi overload etmeden tarama yapmak için istek hızını ve timeout değerlerini yapılandırılabilir hale getirdim. Exponential backoff implementasyonu ekledim.',
        },
        {
          title: 'False Positive Azaltma',
          desc: 'XSS ve SQLi tespitinde false positive oranını düşürmek için çoklu payload testi ve response analizi yaptım. Her bulgu için confidence skoru ekledim.',
        },
        {
          title: 'HTML Rapor Üretimi',
          desc: 'Tarama sonuçlarını profesyonel HTML raporlarına dönüştürmek için Jinja2 template engine kullandım. Renk kodlu risk seviyeleri ve detaylı açıklamalar ekledim.',
        },
      ]
    : [
        {
          title: 'Rate Limiting',
          desc: 'Made request rate and timeout configurable to avoid overloading the target site. Added exponential backoff implementation.',
        },
        {
          title: 'Reducing False Positives',
          desc: 'Reduced false positive rates in XSS and SQLi detection by performing multi-payload testing and response analysis. Added confidence scores for each finding.',
        },
        {
          title: 'HTML Report Generation',
          desc: 'Used Jinja2 template engine to convert scan results into professional HTML reports. Added color-coded risk levels and detailed descriptions.',
        },
      ];

  const features = isTurkish
    ? [
        'XSS (Cross-Site Scripting) tespiti',
        'SQL Injection taraması',
        'CSRF güvenlik kontrolü',
        'SSRF (Server-Side Request Forgery) tespiti',
        'Open Redirect kontrolü',
        'HTTP Security Headers analizi',
        'Subdomain enumeration',
      ]
    : [
        'XSS (Cross-Site Scripting) detection',
        'SQL Injection scanning',
        'CSRF security check',
        'SSRF (Server-Side Request Forgery) detection',
        'Open Redirect check',
        'HTTP Security Headers analysis',
        'Subdomain enumeration',
      ];

  return (
    <CaseStudyLayout
      routePath="/case-study/msscan"
      title="msscan"
      subtitle={
        isTurkish
          ? 'Python ile geliştirilen terminal tabanlı web güvenlik tarayıcısı. 7 farklı güvenlik modülü ve HTML raporlama.'
          : 'A terminal-based web security scanner developed with Python. 7 security modules and HTML reporting.'
      }
      liveUrl="https://github.com/MertSoylu/msscan"
      heroImage="https://opengraph.githubassets.com/1/MertSoylu/msscan"
      currentId="msscan"
      isTurkish={isTurkish}
    >
      {/* Metrics */}
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-raised p-5 text-center"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent-500/10 text-accent-600 dark:text-accent-400 mb-3">
                {m.icon}
              </div>
              <div className="text-2xl font-bold text-sand-900 dark:text-zinc-50 mb-1">{m.value}</div>
              <div className="text-caption text-sand-600 dark:text-zinc-400">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </FadeContent>

      {/* Problem & Solution */}
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised p-6 sm:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-4">
                {isTurkish ? 'Problem' : 'Problem'}
              </h2>
              <p className="text-body text-sand-700 dark:text-zinc-300">
                {isTurkish
                  ? 'Web uygulamalarının güvenlik açıklarını hızlı ve otomatik tespit etmek için hafif, yapılandırılabilir bir araç eksik. Mevcut araçlar ya ağır ya da karmaşık.'
                  : 'A lightweight, configurable tool to quickly and automatically detect web application vulnerabilities is missing. Existing tools are either heavy or complex.'}
              </p>
            </div>
            <div>
              <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-4">
                {isTurkish ? 'Çözüm' : 'Solution'}
              </h2>
              <p className="text-body text-sand-700 dark:text-zinc-300">
                {isTurkish
                  ? 'Python ile terminal tabanlı bir güvenlik tarayıcısı geliştirdim. 7 farklı modül ile XSS, SQLi, CSRF, SSRF gibi yaygın açıkları tespit ediyor. HTML rapor üretiyor.'
                  : 'Developed a terminal-based security scanner in Python. Detects common vulnerabilities like XSS, SQLi, CSRF, and SSRF with 7 different modules. Generates HTML reports.'}
              </p>
            </div>
          </div>
        </div>
      </FadeContent>

      {/* Tech Stack */}
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised p-6 sm:p-8">
          <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-6">
            {isTurkish ? 'Teknoloji Yığını' : 'Tech Stack'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-accent-500/10 text-accent-700 dark:text-accent-300 text-sm font-medium rounded-full border border-accent-500/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </FadeContent>

      {/* Architecture Decisions */}
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised p-6 sm:p-8">
          <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-6">
            {isTurkish ? 'Mimari Kararlar' : 'Architecture Decisions'}
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-600 dark:text-accent-400 font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-sand-900 dark:text-zinc-100 mb-1">
                  {isTurkish ? 'Modüler Mimarisi' : 'Modular Architecture'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? 'Her güvenlik modülünü bağımsız bir sınıf olarak tasarladım. Yeni modül eklemek için base scanner sınıfını extend etmek yeterli.'
                    : 'Designed each security module as an independent class. To add a new module, simply extend the base scanner class.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-600 dark:text-accent-400 font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-sand-900 dark:text-zinc-100 mb-1">
                  {isTurkish ? 'Threading ile Paralel Tarama' : 'Parallel Scanning with Threading'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? 'Farklı modülleri paralel çalıştırarak tarama süresini %60 azalttım. Thread-safe result collection ile race condition önledim.'
                    : 'Reduced scan time by 60% by running different modules in parallel. Prevented race conditions with thread-safe result collection.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-600 dark:text-accent-400 font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-sand-900 dark:text-zinc-100 mb-1">
                  {isTurkish ? 'Jinja2 HTML Raporlama' : 'Jinja2 HTML Reporting'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? 'Tarama sonuçlarını Jinja2 template engine ile profesyonel HTML raporlarına dönüştürdüm. Renk kodlu risk seviyeleri ve düzeltme önerileri ekledim.'
                    : 'Converted scan results into professional HTML reports using Jinja2 template engine. Added color-coded risk levels and remediation suggestions.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeContent>

      {/* Challenges */}
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised p-6 sm:p-8">
          <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-6">
            {isTurkish ? 'Karşılaşılan Zorluklar' : 'Challenges Faced'}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {challenges.map((c) => (
              <SpotlightCard
                key={c.title}
                className="card-flat p-5"
                spotlightColor={isDark ? 'rgba(249, 115, 22, 0.12)' : 'rgba(240, 125, 45, 0.08)'}
              >
                <h4 className="text-h4 text-sand-900 dark:text-zinc-50 mb-2">{c.title}</h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">{c.desc}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </FadeContent>

      {/* Features */}
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised p-6 sm:p-8">
          <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-6">
            {isTurkish ? 'Öne Çıkan Özellikler' : 'Key Features'}
          </h2>
          <ul className="grid md:grid-cols-2 gap-3">
            {features.map((feat) => (
              <li
                key={feat}
                className="flex items-start gap-3 rounded-xl border border-sand-200/60 dark:border-zinc-800/60 bg-sand-100/40 dark:bg-zinc-900/40 px-4 py-3"
              >
                <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-500" />
                <span className="text-body-sm text-sand-700 dark:text-zinc-300">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </FadeContent>

      {/* Results */}
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised p-6 sm:p-8">
          <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-6">
            {isTurkish ? 'Sonuçlar' : 'Results'}
          </h2>
          <p className="text-body text-sand-700 dark:text-zinc-300 mb-4">
            {isTurkish
              ? 'msscan, web güvenliği öğrenme sürecimde önemli bir proje oldu. 7 farklı modül ile kapsamlı tarama sağlıyor ve profesyonel HTML raporları üretiyor.'
              : 'msscan was an important project in my web security learning journey. Provides comprehensive scanning with 7 different modules and generates professional HTML reports.'}
          </p>
          <div className="flex flex-wrap gap-2">
            {['Open Source', 'CLI Tool', 'HTML Reports', 'Multi-Module'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-300 text-xs font-medium rounded-full border border-green-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </FadeContent>
    </CaseStudyLayout>
  );
};

export default MsscanCaseStudy;
