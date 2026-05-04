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
        className="group inline-flex items-center justify-center gap-0 rounded-2xl border border-sand-200/60 bg-white/80 p-2.5 font-medium text-warm-600 shadow-soft backdrop-blur-md transition-colors hover:text-warm-700 hover:shadow-elevation dark:border-zinc-800/60 dark:bg-zinc-900/80 dark:text-accent-400 dark:hover:text-accent-300 sm:justify-start sm:gap-2 sm:px-4 sm:py-2"
      >
        <HiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span className="hidden sm:inline text-sm">{isTurkish ? 'Ana Sayfaya Dön' : 'Back to Home'}</span>
      </Link>
    </motion.div>
  );
};

export default PageBackButton;
