import React from 'react';
import { motion } from 'framer-motion';
import { HiMail } from 'react-icons/hi';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const footerGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const footerColumn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const Footer = () => {
  const { isTurkish } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', icon: <FiGithub className="h-5 w-5" />, href: 'https://github.com/MertSoylu' },
    {
      name: 'LinkedIn',
      icon: <FiLinkedin className="h-5 w-5" />,
      href: 'https://www.linkedin.com/in/mert-soylu-b8b6a1341/',
    },
    { name: 'Email', icon: <HiMail className="h-5 w-5" />, href: 'mailto:s6ylumert@gmail.com' },
  ];

  return (
    <footer className="mt-20 border-t border-ink-200/70 bg-white/50 px-4 py-12 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div className="mx-auto max-w-6xl">
        <div className="studio-rule mb-10" />

        <motion.div
          variants={footerGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]"
        >
          <motion.div variants={footerColumn}>
            <p className="mb-2 text-caption text-cyan-700 dark:text-cyan-200">Product studio portfolio</p>
            <h3 className="text-h2 gradient-text mb-3">Mert Soylu</h3>
            <p className="max-w-sm text-sm leading-relaxed text-ink-600 dark:text-ink-200">
              {isTurkish
                ? 'Web, Android, güvenlik ve yapay zeka alanlarında ürüne dönüşen projeler geliştiriyorum.'
                : 'Building product-minded projects across web, Android, security, and AI.'}
            </p>
          </motion.div>

          <motion.div variants={footerColumn}>
            <h4 className="mb-4 text-sm font-extrabold text-ink-900 dark:text-white">
              {isTurkish ? 'Sayfalar' : 'Pages'}
            </h4>
            <ul className="space-y-2">
              {[
                { name: isTurkish ? 'Hakkimda' : 'About', href: '#about' },
                { name: isTurkish ? 'Projeler' : 'Projects', href: '#projects' },
                { name: isTurkish ? 'İletişim' : 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="inline-flex rounded-lg px-1 py-1 text-sm font-semibold text-ink-600 hover:text-cyan-700 dark:text-ink-200 dark:hover:text-cyan-100"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={footerColumn}>
            <h4 className="mb-4 text-sm font-extrabold text-ink-900 dark:text-white">
              {isTurkish ? 'Baglantilar' : 'Connect'}
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink-200/70 bg-white/50 text-ink-600 shadow-soft hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-white/10 dark:text-ink-100 dark:hover:text-cyan-100"
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  title={link.name}
                  aria-label={link.name}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-ink-200/70 pt-6 text-sm text-ink-500 dark:border-white/10 dark:text-ink-300 md:flex-row">
          <p>
            {isTurkish
              ? `© ${currentYear} Mert Soylu. Tum haklari saklidir.`
              : `© ${currentYear} Mert Soylu. All rights reserved.`}
          </p>
          <p>
            {isTurkish
              ? 'React, Tailwind CSS ve Framer Motion ile gelistirildi'
              : 'Built with React, Tailwind CSS, and Framer Motion'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
