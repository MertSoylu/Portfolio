import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiHome } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import DecryptedText from '../components/DecryptedText';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';

const NotFoundPage = () => {
  const { isTurkish } = useLanguage();

  const quickLinks = [
    { to: '/web', label: isTurkish ? 'Web Geliştirme' : 'Web Development' },
    { to: '/android', label: isTurkish ? 'Android' : 'Android' },
    { to: '/cybersecurity', label: isTurkish ? 'Siber Güvenlik' : 'Cybersecurity' },
    { to: '/data-science', label: isTurkish ? 'Veri Bilimi' : 'Data Science' },
  ];

  return (
    <SpecialtyPageLayout routePath="/404" accent="warm" centered hideBackButton>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <DecryptedText
          text="404"
          speed={60}
          maxIterations={20}
          sequential
          revealDirection="center"
          animateOn="view"
          characters="01!@#$%^&*{}[]<>/\|~`"
          className="text-[8rem] sm:text-[10rem] font-bold gradient-text leading-none"
          encryptedClassName="text-[8rem] sm:text-[10rem] font-bold text-warm-400/40 leading-none"
          parentClassName="leading-none"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-h2 text-sand-900 dark:text-zinc-50 mb-4">
          {isTurkish ? 'Sayfa Bulunamadı' : 'Page Not Found'}
        </h2>
        <p className="text-body text-sand-700 dark:text-zinc-300 mb-8">
          {isTurkish
            ? 'Aradığın sayfa mevcut değil ya da taşınmış olabilir.'
            : "The page you're looking for doesn't exist or may have been moved."}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2">
          <HiHome className="w-5 h-5" />
          {isTurkish ? 'Ana Sayfa' : 'Go Home'}
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary inline-flex items-center justify-center gap-2"
        >
          <HiArrowLeft className="w-5 h-5" />
          {isTurkish ? 'Geri Dön' : 'Go Back'}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="mt-12"
      >
        <p className="text-caption text-sand-600 dark:text-zinc-400 mb-4">
          {isTurkish ? 'Belki şunu mu arıyordun?' : 'Maybe you were looking for'}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {quickLinks.map((quick) => (
            <Link
              key={quick.to}
              to={quick.to}
              className="rounded-full border border-sand-200 bg-white/50 px-4 py-2 text-sm font-medium text-sand-700 transition-colors hover:border-accent-500/60 hover:text-accent-700 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-200 dark:hover:border-accent-500/60 dark:hover:text-accent-300"
            >
              {quick.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </SpecialtyPageLayout>
  );
};

export default NotFoundPage;
