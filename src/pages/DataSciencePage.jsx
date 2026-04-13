import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiChartBar, HiSparkles, HiAcademicCap, HiChip } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import FadeContent from '../components/FadeContent';
import SpotlightCard from '../components/SpotlightCard';

const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: 0.4 },
  },
};

const DataSciencePage = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();

  const learningFocus = isTurkish
    ? [
        {
          icon: <HiChartBar className="h-6 w-6" />,
          title: 'Veri Analizi Temelleri',
          desc: 'Pandas ve NumPy ile veri temizleme, keşifsel analiz ve temel görselleştirme üzerine çalışıyorum.',
        },
        {
          icon: <HiSparkles className="h-6 w-6" />,
          title: 'Makine Öğrenmesi',
          desc: 'Model kurma, özellik mühendisliği ve değerlendirme metriklerini pratik örneklerle öğreniyorum.',
        },
        {
          icon: <HiChip className="h-6 w-6" />,
          title: 'Derin Öğrenme',
          desc: 'Yapay sinir ağları, eğitim süreçleri ve temel mimariler üzerinde düzenli olarak denemeler yapıyorum.',
        },
      ]
    : [
        {
          icon: <HiChartBar className="h-6 w-6" />,
          title: 'Data Analysis Fundamentals',
          desc: 'I am practicing with Pandas, NumPy, and core data visualization tools.',
        },
        {
          icon: <HiSparkles className="h-6 w-6" />,
          title: 'Machine Learning',
          desc: 'I am learning model logic, feature engineering, and evaluation metrics.',
        },
        {
          icon: <HiChip className="h-6 w-6" />,
          title: 'Deep Learning',
          desc: 'I am studying neural network basics, training workflows, and practical architectures.',
        },
      ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`min-h-screen px-4 pb-16 pt-24 ${isDark ? 'dark' : ''}`}
    >
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="fixed left-[4.25rem] top-4 z-50 sm:left-[4.5rem] sm:top-5 lg:left-[5rem] lg:top-8"
        >
          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-0 rounded-xl border border-sand-200/60 bg-white/80 p-2.5 font-medium text-warm-600 shadow-md backdrop-blur-md transition-colors hover:text-warm-700 hover:shadow-lg dark:border-dark-400/60 dark:bg-dark-600/80 dark:text-warm-400 dark:hover:text-warm-300 sm:justify-start sm:gap-2 sm:px-4 sm:py-2"
          >
            <HiArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">{isTurkish ? 'Ana Sayfaya Dön' : 'Back to Home'}</span>
          </Link>
        </motion.div>

        <div className="mb-8 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-4 inline-block rounded-full border border-zinc-500/20 bg-zinc-700/10 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            <HiAcademicCap className="mr-1 inline-block h-4 w-4" />
            {isTurkish ? 'Veri Bilimi ve Derin Öğrenme' : 'Data Science & Deep Learning'}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mb-4 text-2xl font-bold text-sand-900 dark:text-dark-50 sm:text-3xl md:text-5xl"
          >
            {isTurkish ? 'Veri Bilimi Yolculuğundayım' : 'Data Science Learning Journey'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mx-auto max-w-2xl text-base text-sand-600 dark:text-dark-200"
          >
            {isTurkish
              ? 'Bu alanda henüz yayınlanmış bir projem yok. Şu anda temel konuları sistemli biçimde öğreniyor, küçük deneyler yapıyor ve öğrendiklerimi notlandırıyorum. Hazır oldukça burada gerçek projeler paylaşacağım.'
              : 'I do not have a published project in this area yet. I am currently building strong fundamentals, running small experiments, and documenting what I learn. I will share real projects here as they become ready.'}
          </motion.p>
        </div>

        <FadeContent duration={700} blur={true} threshold={0.1}>
          <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white/50 p-4 backdrop-blur-md dark:border-dark-400 dark:bg-dark-600/50 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-sand-200/70 pb-4 dark:border-dark-400/70">
              <h2 className="text-lg font-bold text-sand-900 dark:text-dark-50 sm:text-xl">
                {isTurkish ? 'Şu Anki Durum' : 'Current Status'}
              </h2>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                {isTurkish ? 'Aktif Öğrenme' : 'Active Learning'}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              {learningFocus.map((item) => (
                <SpotlightCard
                  key={item.title}
                  className="h-full rounded-xl border border-sand-200/70 bg-sand-100/70 p-4 dark:border-dark-400/60 dark:bg-dark-500/60"
                  spotlightColor={isDark ? 'rgba(255, 154, 92, 0.12)' : 'rgba(240, 125, 45, 0.10)'}
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-warm-500/20 bg-warm-500/10 text-warm-600 dark:text-warm-400">
                    {item.icon}
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-sand-900 dark:text-dark-50 sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-sand-600 dark:text-dark-200 sm:text-sm">
                    {item.desc}
                  </p>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </FadeContent>
      </div>
    </motion.div>
  );
};

export default DataSciencePage;
