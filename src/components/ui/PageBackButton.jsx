import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';

const PageBackButton = ({ to = '/', className = '' }) => {
  const { isTurkish } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className={`fixed top-4 left-[4.25rem] z-50 sm:top-5 sm:left-[4.5rem] lg:top-8 lg:left-[5rem] ${className}`}
    >
      <Link
        to={to}
        className="group inline-flex items-center justify-center gap-0 rounded-lg border border-ink-200/70 bg-white/75 p-2.5 font-bold text-ink-700 shadow-soft backdrop-blur-xl transition-colors hover:border-cyan-300 hover:text-cyan-700 hover:shadow-elevation dark:border-white/10 dark:bg-white/10 dark:text-ink-100 dark:hover:border-cyan-300/40 dark:hover:text-cyan-100 sm:justify-start sm:gap-2 sm:px-4 sm:py-2"
      >
        <HiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span className="hidden sm:inline text-sm">{isTurkish ? 'Ana Sayfaya Dön' : 'Back to Home'}</span>
      </Link>
    </motion.div>
  );
};

export default PageBackButton;
