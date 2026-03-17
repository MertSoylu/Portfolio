import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const LoadingSpinner = () => {
  const { isTurkish } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      {/* Spinner ring */}
      <div className="relative w-16 h-16">
        {/* Outer ring - rotating */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-sand-200 dark:border-dark-500"
          style={{ borderTopColor: '#f07d2d', borderRightColor: '#ff9a5c' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner pulsing glow */}
        <motion.div
          className="absolute inset-2 rounded-full bg-warm-500/10 dark:bg-warm-500/5"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Center monogram */}
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-sm font-bold gradient-text"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          MS
        </motion.span>
      </div>
      {/* Loading text */}
      <motion.p
        className="text-sand-500 dark:text-dark-300 text-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {isTurkish ? 'Yükleniyor...' : 'Loading...'}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
