import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiHome } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import DecryptedText from '../components/DecryptedText';

const NotFoundPage = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'dark' : ''}`}>
      <div className="text-center max-w-lg mx-auto">
        {/* Glitchy 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <DecryptedText
            text="404"
            speed={60}
            maxIterations={20}
            sequential={true}
            revealDirection="center"
            animateOn="view"
            characters="01!@#$%^&*{}[]<>/\|~`"
            className="text-[8rem] sm:text-[10rem] font-bold bg-gradient-to-r from-warm-600 via-warm-500 to-sand-500 bg-clip-text text-transparent leading-none"
            encryptedClassName="text-[8rem] sm:text-[10rem] font-bold text-warm-400/40 leading-none"
            parentClassName="leading-none"
          />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-sand-900 dark:text-dark-50 mb-3">
            {isTurkish ? 'Sayfa Bulunamadı' : 'Page Not Found'}
          </h2>
          <p className="text-sand-600 dark:text-dark-200 mb-8 leading-relaxed">
            {isTurkish
              ? 'Aradığın sayfa mevcut değil ya da taşınmış olabilir.'
              : "The page you're looking for doesn't exist or may have been moved."}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 btn-primary"
          >
            <HiHome className="w-5 h-5" />
            {isTurkish ? 'Ana Sayfa' : 'Go Home'}
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 btn-secondary"
          >
            <HiArrowLeft className="w-5 h-5" />
            {isTurkish ? 'Geri Dön' : 'Go Back'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
