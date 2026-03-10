import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiShieldCheck, HiLightningBolt, HiBookOpen, HiChip, HiAcademicCap, HiDownload, HiExternalLink } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';

const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as number[] },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: 0.4 },
  },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as number[] },
  },
};

interface LearningArea {
  icon: ReactNode;
  title: string;
  desc: string;
}

interface TerminalLine {
  prompt: string;
  cmd: string;
  delay: number;
  isOutput?: boolean;
  isSuccess?: boolean;
}

const CyberSecurityPage = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();

  const learningAreas: LearningArea[] = isTurkish
    ? [
        { icon: <HiShieldCheck className="w-7 h-7" />, title: 'Ağ Güvenliği', desc: 'Ağ protokolleri, güvenlik duvarları ve sızma testi temelleri' },
        { icon: <HiLightningBolt className="w-7 h-7" />, title: 'Python ile Güvenlik', desc: 'Güvenlik araçları ve otomasyon scriptleri geliştirme' },
        { icon: <HiBookOpen className="w-7 h-7" />, title: 'Şifreleme', desc: 'Kriptografi temelleri, hash fonksiyonları ve şifreleme algoritmaları' },
        { icon: <HiChip className="w-7 h-7" />, title: 'Güvenli Kodlama', desc: 'OWASP standartları ve güvenli yazılım geliştirme pratikleri' },
      ]
    : [
        { icon: <HiShieldCheck className="w-7 h-7" />, title: 'Network Security', desc: 'Network protocols, firewalls, and penetration testing fundamentals' },
        { icon: <HiLightningBolt className="w-7 h-7" />, title: 'Security with Python', desc: 'Building security tools and automation scripts' },
        { icon: <HiBookOpen className="w-7 h-7" />, title: 'Encryption', desc: 'Cryptography fundamentals, hash functions, and encryption algorithms' },
        { icon: <HiChip className="w-7 h-7" />, title: 'Secure Coding', desc: 'OWASP standards and secure software development practices' },
      ];

  const terminalLines: TerminalLine[] = [
    { prompt: '~$', cmd: 'nmap -sV target.com', delay: 0 },
    { prompt: '', cmd: 'Starting Nmap 7.94...', delay: 0.3, isOutput: true },
    { prompt: '', cmd: 'PORT    STATE  SERVICE  VERSION', delay: 0.6, isOutput: true },
    { prompt: '', cmd: '22/tcp  open   ssh      OpenSSH 8.9', delay: 0.8, isOutput: true },
    { prompt: '', cmd: '80/tcp  open   http     nginx 1.24', delay: 1.0, isOutput: true },
    { prompt: '', cmd: '443/tcp open   https    nginx 1.24', delay: 1.2, isOutput: true },
    { prompt: '~$', cmd: 'python3 exploit_scanner.py', delay: 1.6 },
    { prompt: '', cmd: '[+] Scanning for vulnerabilities...', delay: 2.0, isOutput: true, isSuccess: true },
    { prompt: '', cmd: '[✓] Scan complete. 0 critical issues.', delay: 2.4, isOutput: true, isSuccess: true },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`min-h-screen pt-24 pb-16 px-4 ${isDark ? 'dark' : ''}`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <motion.div variants={fadeUp} initial="initial" animate="animate">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-warm-600 dark:text-warm-400 hover:text-warm-700 dark:hover:text-warm-300 font-medium mb-8 group transition-colors"
          >
            <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {isTurkish ? 'Ana Sayfaya Dön' : 'Back to Home'}
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="inline-block mb-4">
            <span className="px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-sm font-medium border border-red-500/20">
              🛡️ {isTurkish ? 'Siber Güvenlik' : 'Cybersecurity'}
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-sand-900 dark:text-dark-50 mb-6"
          >
            {isTurkish ? 'Siber' : 'Cyber'}{' '}
            <span className="gradient-text">{isTurkish ? 'Güvenlik' : 'Security'}</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg text-sand-600 dark:text-dark-200 max-w-2xl mx-auto"
          >
            {isTurkish
              ? 'Güvenli yazılım geliştirme, ağ güvenliği ve kriptografi alanlarında kendimi geliştirmeye devam ediyorum.'
              : 'I continue to develop myself in secure software development, network security, and cryptography.'}
          </motion.p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="bg-white/50 dark:bg-dark-600/50 backdrop-blur-md rounded-3xl border border-sand-200 dark:border-dark-400 overflow-hidden mb-16"
        >
          {/* Header */}
          <motion.div
            variants={fadeUp}
            className="bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 p-5 sm:p-8 md:p-10"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl shadow-lg"
              >
                🔐
              </motion.div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {isTurkish ? 'Öğrenme Yolculuğu' : 'Learning Journey'}
                </h2>
                <p className="text-white/70 mt-1">
                  {isTurkish ? 'Sürekli gelişim halinde' : 'Continuously evolving'}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="p-5 sm:p-8 md:p-10">
            {/* Learning Areas */}
            <motion.div variants={fadeUp} className="mb-8 sm:mb-10">
              <h3 className="text-xl font-bold text-sand-900 dark:text-dark-50 mb-6">
                {isTurkish ? 'Çalıştığım Alanlar' : "Areas I'm Studying"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {learningAreas.map((area, i) => (
                  <motion.div
                    key={i}
                    variants={scaleIn}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="p-5 rounded-xl bg-sand-100/80 dark:bg-dark-500/50 border border-sand-200/60 dark:border-dark-400/40 group transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 dark:text-red-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                        {area.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sand-900 dark:text-dark-50 mb-1">{area.title}</h4>
                        <p className="text-sm text-sand-600 dark:text-dark-300">{area.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Projects */}
            <motion.div variants={fadeUp}>
              <h3 className="text-xl font-bold text-sand-900 dark:text-dark-50 mb-6">
                {isTurkish ? 'Projeler' : 'Projects'}
              </h3>
              <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-700/30">
                <div className="bg-[#2d333b] px-4 py-2.5 flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-gray-400 font-mono">terminal — bash</span>
                </div>
                <div className="bg-[#0d1117] p-4 sm:p-5 font-mono text-xs sm:text-sm min-h-[220px] space-y-1 overflow-x-auto">
                  {terminalLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: line.delay, duration: 0.3 }}
                      className="flex items-center gap-2"
                    >
                      {line.prompt && (
                        <span className="text-emerald-400">{line.prompt}</span>
                      )}
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                      >
                        {tag}
                      </span>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 2.8 }}
                    className="flex items-center gap-2"
                  >
                    <HiExternalLink className="w-4 h-4" />
                    GitHub
                  </a>

                  {/* Terminal Simulation */}
                  <p className="text-xs font-semibold text-sand-500 dark:text-dark-300 uppercase tracking-wider mb-3">
                    {isTurkish ? 'Simülasyon' : 'Simulation'}
                  </p>
                  <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-700/30">
                    {/* Terminal title bar */}
                    <div className="bg-[#2d333b] px-4 py-2.5 flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <span className="ml-3 text-xs text-gray-400 font-mono">terminal — bash</span>
                    </div>
                    {/* Terminal body */}
                    <div className="bg-[#0d1117] p-4 sm:p-5 font-mono text-xs sm:text-sm min-h-[220px] space-y-1 overflow-x-auto">
                      {terminalLines.map((line, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: line.delay, duration: 0.3 }}
                          className="flex items-center gap-2"
                        >
                          {line.prompt && (
                            <span className="text-emerald-400">{line.prompt}</span>
                          )}
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
                      {/* Blinking cursor */}
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
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Certificates Section */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-8"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 dark:text-red-400">
              <HiAcademicCap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-sand-900 dark:text-dark-50">
              {isTurkish ? 'Sertifikalar' : 'Certificates'}
            </h2>
          </motion.div>

          <motion.div variants={scaleIn} className="grid sm:grid-cols-2 gap-5">
            {/* Introduction to Cybersecurity — Cisco */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-white/50 dark:bg-dark-600/50 backdrop-blur-md rounded-2xl border border-sand-200 dark:border-dark-400 overflow-hidden group cursor-pointer"
            >
              {/* Card header */}
              <div className="bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <HiShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-xs font-medium">Cisco</p>
                  <p className="text-white font-semibold text-sm leading-tight">
                    Introduction to Cybersecurity
                  </p>
                </div>
              </div>

              {/* Card body */}
              <div className="p-5">
                <p className="text-sm text-sand-600 dark:text-dark-200 mb-5 leading-relaxed">
                  {isTurkish
                    ? 'Cisco NetAcad tarafından verilen, temel siber güvenlik kavramlarını kapsayan sertifika.'
                    : 'Certificate issued by Cisco NetAcad covering fundamental cybersecurity concepts.'}
                </p>
                <div className="flex gap-3">
                  <a
                    href="/certificates/Introduction_to_Cybersecurity_certificate.pdf"
                    download
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-warm-500/10 text-warm-600 dark:text-warm-400 border border-warm-500/20 hover:bg-warm-500/20 transition-colors text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <HiDownload className="w-4 h-4" />
                    {isTurkish ? 'İndir' : 'Download'}
                  </a>
                  <a
                    href="/certificates/Introduction_to_Cybersecurity_certificate.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-sand-100 dark:bg-dark-500 text-sand-700 dark:text-dark-200 border border-sand-200 dark:border-dark-400 hover:border-warm-500/40 transition-colors text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <HiExternalLink className="w-4 h-4" />
                    {isTurkish ? 'Görüntüle' : 'View'}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default CyberSecurityPage;
