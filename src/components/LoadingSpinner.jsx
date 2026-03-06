import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const LoadingSpinner = () => {
  const { isTurkish } = useLanguage();

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const dotVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
      },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-center gap-2"
      variants={containerVariants}
      animate="animate"
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-warm-500 rounded-full"
          variants={dotVariants}
        />
      ))}
      <span className="ml-4 text-sand-700 dark:text-dark-200 font-medium">
        {isTurkish ? 'Yükleniyor...' : 'Loading...'}
      </span>
    </motion.div>
  );
};

export default LoadingSpinner;
