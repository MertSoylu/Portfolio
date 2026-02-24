import React from 'react';
import { motion } from 'framer-motion';
import { HiMail } from 'react-icons/hi';
import { FiGithub } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

/* ── Animated wave SVG separator ── */
const WaveSeparator = () => (
  <div className="relative w-full overflow-hidden leading-[0] -mb-1">
    <div className="wave-separator w-[200%]">
      <svg
        className="w-full h-16 md:h-24"
        viewBox="0 0 2880 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,40 C320,80 640,0 960,40 C1280,80 1600,0 1920,40 C2240,80 2560,0 2880,40 L2880,80 L0,80 Z"
          className="fill-sand-100/50 dark:fill-dark-700/50"
        />
        <path
          d="M0,50 C320,20 640,70 960,50 C1280,20 1600,70 1920,50 C2240,20 2560,70 2880,50 L2880,80 L0,80 Z"
          className="fill-sand-100/80 dark:fill-dark-700/80"
        />
      </svg>
    </div>
  </div>
);

const Footer = () => {
  const { isTurkish } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <FiGithub className="w-6 h-6" />,
      href: 'https://github.com/MertSoylu',
    },
    {
      name: 'Email',
      icon: <HiMail className="w-6 h-6" />,
      href: 'mailto:s6ylumert@gmail.com',
    },
  ];

  return (
    <div className="mt-20">
      {/* Wave separator */}
      <WaveSeparator />

      <footer className="bg-sand-100/50 dark:bg-dark-700/50 backdrop-blur-md border-t border-sand-200 dark:border-dark-500 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold gradient-text mb-2">Mert Soylu</h3>
              <p className="text-sand-600 dark:text-dark-200 text-sm">
                {isTurkish ? 'Bilgisayar Programcılığı Öğrencisi & Geliştirici' : 'Computer Programming Student & Developer'}
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="font-semibold text-sand-900 dark:text-dark-50 mb-4">{isTurkish ? 'Hızlı Linkler' : 'Quick Links'}</h4>
              <ul className="space-y-2">
                {[
                  { name: isTurkish ? 'Hakkımda' : 'About', href: '#about' },
                  { name: isTurkish ? 'Projeler' : 'Projects', href: '#projects' },
                  { name: isTurkish ? 'İletişim' : 'Contact', href: '#contact' },
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sand-600 dark:text-dark-200 hover:text-warm-600 dark:hover:text-warm-400 transition-colors text-sm py-1.5 inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="font-semibold text-sand-900 dark:text-dark-50 mb-4">{isTurkish ? 'Bağlantılar' : 'Connect'}</h4>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 flex items-center justify-center rounded-lg text-sand-600 dark:text-dark-200 hover:text-warm-600 dark:hover:text-warm-400 hover:bg-sand-200/50 dark:hover:bg-dark-500/50 transition-colors"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    title={link.name}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="border-t border-sand-200 dark:border-dark-500 my-8" />

          {/* Bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col md:flex-row justify-between items-center text-center md:text-left"
          >
            <p className="text-sm text-sand-600 dark:text-dark-200">
              {isTurkish ? `© ${currentYear} Mert Soylu. Tüm hakları saklıdır.` : `© ${currentYear} Mert Soylu. All rights reserved.`}
            </p>
            <p className="text-sm text-sand-600 dark:text-dark-200 mt-4 md:mt-0">
              {isTurkish ? 'React, Tailwind CSS ve Framer Motion ile geliştirildi' : 'Built with React, Tailwind CSS & Framer Motion'}
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
