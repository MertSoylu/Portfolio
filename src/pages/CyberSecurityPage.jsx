import React from 'react';
import { motion } from 'framer-motion';
import {
  HiShieldCheck,
  HiLightningBolt,
  HiBookOpen,
  HiChip,
  HiAcademicCap,
  HiDownload,
  HiExternalLink,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import SitePreview from '../components/SitePreview';
import DecryptedText from '../components/DecryptedText';
import SpotlightCard from '../components/SpotlightCard';
import StarBorder from '../components/StarBorder';
import ElectricBorder from '../components/ElectricBorder';
import FadeContent from '../components/FadeContent';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';

const CyberSecurityPage = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();

  const learningAreas = isTurkish
    ? [
        {
          icon: <HiShieldCheck className="w-7 h-7" />,
          title: 'Ağ Güvenliği',
          desc: 'Ağ protokolleri, güvenlik duvarları ve sızma testi temelleri',
        },
        {
          icon: <HiLightningBolt className="w-7 h-7" />,
          title: 'Python ile Güvenlik',
          desc: 'Güvenlik araçları ve otomasyon scriptleri geliştirme',
        },
        {
          icon: <HiBookOpen className="w-7 h-7" />,
          title: 'Şifreleme',
          desc: 'Kriptografi temelleri, hash fonksiyonları ve şifreleme algoritmaları',
        },
        {
          icon: <HiChip className="w-7 h-7" />,
          title: 'Güvenli Kodlama',
          desc: 'OWASP standartları ve güvenli yazılım geliştirme pratikleri',
        },
      ]
    : [
        {
          icon: <HiShieldCheck className="w-7 h-7" />,
          title: 'Network Security',
          desc: 'Network protocols, firewalls, and penetration testing fundamentals',
        },
        {
          icon: <HiLightningBolt className="w-7 h-7" />,
          title: 'Security with Python',
          desc: 'Building security tools and automation scripts',
        },
        {
          icon: <HiBookOpen className="w-7 h-7" />,
          title: 'Encryption',
          desc: 'Cryptography fundamentals, hash functions, and encryption algorithms',
        },
        {
          icon: <HiChip className="w-7 h-7" />,
          title: 'Secure Coding',
          desc: 'OWASP standards and secure software development practices',
        },
      ];

  const terminalLines = [
    { prompt: '~$', cmd: 'msscan', delay: 0 },
    { prompt: 'msscan>', cmd: 'set url https://example.com', delay: 0.5 },
    { prompt: '', cmd: '[✓] Target set: https://example.com', delay: 0.9, isOutput: true, isSuccess: true },
    { prompt: 'msscan>', cmd: 'set req 10', delay: 1.2 },
    { prompt: '', cmd: '[✓] Rate set: 10 req/s', delay: 1.6, isOutput: true, isSuccess: true },
    { prompt: 'msscan>', cmd: 'run', delay: 2.0 },
    { prompt: '', cmd: '[*] Starting msscan...', delay: 2.4, isOutput: true },
    { prompt: '', cmd: '[*] Running XSS module...', delay: 2.8, isOutput: true },
    {
      prompt: '',
      cmd: '[+] XSS: 2 reflected vulnerabilities found',
      delay: 3.2,
      isOutput: true,
      isWarning: true,
    },
    { prompt: '', cmd: '[*] Running SQLi module...', delay: 3.5, isOutput: true },
    { prompt: '', cmd: '[✓] SQLi: No issues found.', delay: 3.9, isOutput: true, isSuccess: true },
    { prompt: '', cmd: '[*] Running Headers module...', delay: 4.2, isOutput: true },
    {
      prompt: '',
      cmd: '[!] Missing: Content-Security-Policy, X-Frame-Options',
      delay: 4.5,
      isOutput: true,
      isWarning: true,
    },
    {
      prompt: '',
      cmd: '[✓] Scan complete. Report saved to report.html',
      delay: 4.9,
      isOutput: true,
      isSuccess: true,
    },
  ];

  const terminalContent = (
    <>
      {terminalLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: line.delay, duration: 0.3 }}
          className="flex items-center gap-2"
        >
          {line.prompt && <span className="text-emerald-400">{line.prompt}</span>}
          <span
            className={
              line.isSuccess
                ? 'text-emerald-400'
                : line.isWarning
                  ? 'text-yellow-400'
                  : line.isOutput
                    ? 'text-gray-400'
                    : 'text-gray-200'
            }
          >
            {line.cmd}
          </span>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 5.3 }}
        className="flex items-center gap-2"
      >
        <span className="text-emerald-400">~$</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-2 h-4 bg-emerald-400"
        />
      </motion.div>
    </>
  );

  const cyberTitle = (
    <DecryptedText
      text={isTurkish ? 'Siber Güvenlik' : 'Cyber Security'}
      speed={40}
      maxIterations={15}
      sequential
      revealDirection="center"
      animateOn="view"
      characters="01!@#$%^&*{}[]<>/\|~`"
      className="text-h1 text-sand-900 dark:text-zinc-50"
      encryptedClassName="text-h1 text-red-500/60 dark:text-red-400/60"
      parentClassName="text-h1 inline-block"
    />
  );

  return (
    <SpecialtyPageLayout
      routePath="/cybersecurity"
      accent="red"
      eyebrow={isTurkish ? 'Siber Güvenlik' : 'Cybersecurity'}
      eyebrowIcon={<HiShieldCheck className="w-4 h-4" />}
      titleNode={cyberTitle}
      subtitle={
        isTurkish
          ? 'Güvenli yazılım geliştirme, ağ güvenliği ve kriptografi alanlarında kendimi geliştirmeye devam ediyorum.'
          : 'I continue to develop myself in secure software development, network security, and cryptography.'
      }
    >
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised overflow-hidden mb-8 p-6 sm:p-8">
          <div className="mb-8">
            <h3 className="text-h4 text-sand-900 dark:text-zinc-50 mb-4">
              {isTurkish ? 'Çalıştığım Alanlar' : "Areas I'm Studying"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {learningAreas.map((area, i) => (
                <SpotlightCard
                  key={i}
                  spotlightColor={isDark ? 'rgba(248,113,113,0.18)' : 'rgba(239,68,68,0.10)'}
                  className="card-flat p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                      {area.icon}
                    </div>
                    <div>
                      <h4 className="text-h4 text-sand-900 dark:text-zinc-50">{area.title}</h4>
                      <p className="text-body-sm text-sand-700 dark:text-zinc-300 mt-1">{area.desc}</p>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-h4 text-sand-900 dark:text-zinc-50 mb-4">
              {isTurkish ? 'Projeler' : 'Projects'}
            </h3>

            <ElectricBorder
              color={isDark ? '#ff9a5c' : '#ef4444'}
              speed={0.4}
              chaos={0.06}
              borderRadius={16}
              className="w-full"
            >
              <div className="card-flat p-5 bg-sand-100/60 dark:bg-zinc-900/40">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
                      <HiLightningBolt className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-h4 text-sand-900 dark:text-zinc-50 leading-tight">msscan</p>
                      <p className="text-caption text-sand-600 dark:text-zinc-400 mt-1">
                        github.com/MertSoylu/msscan
                      </p>
                    </div>
                  </div>
                  <motion.a
                    href="https://github.com/MertSoylu/msscan"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
                  >
                    <HiExternalLink className="w-3.5 h-3.5" />
                    GitHub
                  </motion.a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SitePreview
                    url="https://github.com/MertSoylu/msscan"
                    type="terminal"
                    title="msscan"
                    gradient="from-red-500 to-orange-500"
                    terminalContent={terminalContent}
                    expandable={false}
                  />

                  <div className="flex flex-col justify-between">
                    <p className="text-body-sm text-sand-700 dark:text-zinc-300 mb-3">
                      {isTurkish
                        ? 'Python kullanarak geliştirdiğim terminal tabanlı bir web güvenlik tarayıcısıdır. XSS, SQLi, CSRF ve subdomain tespiti dahil 7 farklı güvenlik modülü içerir. İstek hızı ve zaman aşımı ayarlanabilir; tarama sonrası HTML raporu üretir.'
                        : 'A terminal-based web security scanner I developed using Python. It includes 7 security modules covering XSS, SQLi, CSRF, and subdomain enumeration. Request rate and timeout are configurable; produces an HTML report after scanning.'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['XSS', 'SQLi', 'CSRF', 'SSRF', 'Open Redirect', 'Headers', 'Subdomains'].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20"
                          >
                            {tag}
                          </span>
                        ),
                      )}
                    </div>
                    <Link
                      to="/case-study/msscan"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors mt-3"
                    >
                      <HiBookOpen className="w-3.5 h-3.5" />
                      {isTurkish ? 'Case Study' : 'Case Study'}
                    </Link>
                  </div>
                </div>
              </div>
            </ElectricBorder>
          </div>
        </div>
      </FadeContent>

      <FadeContent duration={700} delay={100} threshold={0.1}>
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
              <HiAcademicCap className="w-6 h-6" />
            </div>
            <h2 className="text-h2 text-sand-900 dark:text-zinc-50">
              {isTurkish ? 'Sertifikalar' : 'Certificates'}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <StarBorder
              as="div"
              color={isDark ? '#ff9a5c' : '#ef4444'}
              speed="5s"
              thickness={2}
              className="rounded-2xl w-full"
            >
              <div className="card-raised overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 p-5 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <HiShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-caption">Cisco</p>
                    <p className="text-white font-semibold leading-tight">Introduction to Cybersecurity</p>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-body-sm text-sand-700 dark:text-zinc-300 mb-5">
                    {isTurkish
                      ? 'Cisco NetAcad tarafından verilen, temel siber güvenlik kavramlarını kapsayan sertifika.'
                      : 'Certificate issued by Cisco NetAcad covering fundamental cybersecurity concepts.'}
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="/certificates/Introduction_to_Cybersecurity_certificate.pdf"
                      download
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent-500/10 text-accent-700 dark:text-accent-300 border border-accent-500/20 hover:bg-accent-500/20 transition-colors text-sm font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <HiDownload className="w-4 h-4" />
                      {isTurkish ? 'İndir' : 'Download'}
                    </a>
                    <a
                      href="/certificates/Introduction_to_Cybersecurity_certificate.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-sand-100 dark:bg-zinc-800 text-sand-800 dark:text-zinc-200 border border-sand-200 dark:border-zinc-700 hover:border-accent-500/40 transition-colors text-sm font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <HiExternalLink className="w-4 h-4" />
                      {isTurkish ? 'Görüntüle' : 'View'}
                    </a>
                  </div>
                </div>
              </div>
            </StarBorder>
          </div>
        </div>
      </FadeContent>
    </SpecialtyPageLayout>
  );
};

export default CyberSecurityPage;
