import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeft, HiDeviceMobile, HiStar, HiHeart, HiTrendingUp } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import SitePreview from '../components/SitePreview';
import BlurText from '../components/BlurText';
import SpotlightCard from '../components/SpotlightCard';
import FadeContent from '../components/FadeContent';

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

const AndroidPage = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();
  const [expanded, setExpanded] = useState(false);
  const googlePlayBadgeSrc = isTurkish
    ? 'https://play.google.com/intl/en_us/badges/static/images/badges/tr_badge_web_generic.png'
    : 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png';

  const playUrl = 'https://play.google.com/store/apps/details?id=com.mert.paticat';

  const features = isTurkish
    ? [
        { icon: <HiTrendingUp className="w-6 h-6" />, title: 'Adım Sayacı', desc: 'Günlük adımlarını otomatik olarak takip et' },
        { icon: <HiHeart className="w-6 h-6" />, title: 'Sanal Kedi Bakımı', desc: 'Adımlarını mama puanına çevir ve kedini besle' },
        { icon: <HiStar className="w-6 h-6" />, title: 'Oyun Odası', desc: 'Kedinle eğlenceli oyunlar oyna ve bağını güçlendir' },
        { icon: <HiDeviceMobile className="w-6 h-6" />, title: 'Su Takibi', desc: 'Günlük su tüketimini izle ve hedefine ulaş' },
      ]
    : [
        { icon: <HiTrendingUp className="w-6 h-6" />, title: 'Step Counter', desc: 'Automatically track your daily steps' },
        { icon: <HiHeart className="w-6 h-6" />, title: 'Virtual Cat Care', desc: 'Convert steps into food points and feed your cat' },
        { icon: <HiStar className="w-6 h-6" />, title: 'Game Room', desc: 'Play fun games with your cat and strengthen your bond' },
        { icon: <HiDeviceMobile className="w-6 h-6" />, title: 'Water Tracking', desc: 'Monitor daily water intake and reach your goals' },
      ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`min-h-screen pt-24 pb-16 px-4 ${isDark ? 'dark' : ''}`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Back button — lightweight CSS animation, no ScrollTrigger */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="fixed top-4 left-[4.25rem] z-50 sm:top-5 sm:left-[4.5rem] lg:top-8 lg:left-[5rem]"
        >
          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-0 rounded-xl border border-sand-200/60 bg-white/80 p-2.5 font-medium text-warm-600 shadow-md backdrop-blur-md transition-colors hover:text-warm-700 hover:shadow-lg dark:border-dark-400/60 dark:bg-dark-600/80 dark:text-warm-400 dark:hover:text-warm-300 sm:justify-start sm:gap-2 sm:px-4 sm:py-2"
          >
            <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">{isTurkish ? 'Ana Sayfaya Dön' : 'Back to Home'}</span>
          </Link>
        </motion.div>

        {/* Hero Section — above the fold, use framer-motion instead of ScrollTrigger */}
        <div className="text-center mb-8">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="inline-block px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/20 mb-4"
          >
            <HiDeviceMobile className="w-4 h-4 inline-block mr-1" /> {isTurkish ? 'Android Geliştirme' : 'Android Development'}
          </motion.span>

          <BlurText
            text={isTurkish ? 'Mobil Uygulama Projelerim' : 'Mobile App Projects'}
            delay={80}
            animateBy="words"
            direction="top"
            className="text-2xl sm:text-3xl md:text-5xl font-bold text-sand-900 dark:text-dark-50 mb-6 justify-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-base text-sand-600 dark:text-dark-200 max-w-2xl mx-auto"
          >
            {isTurkish
              ? 'Kotlin ve React Native kullanarak modern, kullanıcı odaklı Android uygulamaları geliştiriyorum. Temiz mimari ve sezgisel arayüz tasarımı önceliğimdir.'
              : 'I build modern, user-focused Android applications using Kotlin and React Native. Clean architecture and intuitive UI design are my priorities.'}
          </motion.p>
        </div>

        {/* WalkKittie App Showcase — single FadeContent for the whole card */}
        <FadeContent duration={700} blur={true} threshold={0.1}>
          <div className="bg-white/50 dark:bg-dark-600/50 backdrop-blur-md rounded-2xl overflow-hidden p-4 sm:p-5">
            {/* Ana satır: thumbnail + bilgi */}
            <div className="flex gap-4 items-start">
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden bg-gradient-to-r from-warm-500 to-orange-500 p-0.5">
                <div className="w-full h-full rounded-[10px] overflow-hidden bg-white dark:bg-dark-600">
                  <SitePreview
                    url={playUrl}
                    type="mobile"
                    title="WalkKittie (PatiCat)"
                    gradient="from-warm-500 to-orange-500"
                    expandable={false}
                  />
                </div>
              </div>

              {/* Bilgi alanı */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <h2 className="text-lg font-bold text-sand-900 dark:text-dark-50 leading-tight">
                      WalkKittie (PatiCat)
                    </h2>
                    <p className="text-xs text-sand-500 dark:text-dark-300">play.google.com</p>
                  </div>
                  {/* Google Play Badge */}
                  <motion.a
                    href={playUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex flex-shrink-0"
                    aria-label={isTurkish ? "Google Play'den indir" : 'Get it on Google Play'}
                  >
                    <img
                      src={googlePlayBadgeSrc}
                      alt={isTurkish ? "Google Play'den al" : 'Get it on Google Play'}
                      width="646"
                      height="250"
                      className="h-8 w-auto"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      referrerPolicy="no-referrer"
                      onError={(event) => {
                        event.currentTarget.src = 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png';
                      }}
                    />
                  </motion.a>
                </div>

                {/* Kısa açıklama */}
                <p className="text-sm text-sand-700 dark:text-dark-200 leading-relaxed mb-2 line-clamp-2">
                  {isTurkish
                    ? 'WalkKittie, günlük yürüyüşlerinizi sanal bir evcil hayvan besleme deneyimiyle birleştirerek daha eğlenceli hale getiren bir sağlık uygulamasıdır. Attığınız her adım mama puanına dönüşür.'
                    : 'WalkKittie is a health app that makes your daily walks more enjoyable by combining them with a virtual pet experience. Every step you take is converted into food points.'}
                </p>

                {/* Özellik tag'ları */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {features.map((feat) => (
                    <span
                      key={feat.title}
                      className="px-2 py-0.5 text-xs rounded-full border bg-warm-500/10 text-warm-600 dark:text-warm-400 border-warm-500/20"
                    >
                      {feat.title}
                    </span>
                  ))}
                </div>

                {/* Daha fazla oku toggle */}
                <button
                  onClick={() => setExpanded(prev => !prev)}
                  className="flex items-center gap-1 text-xs font-medium text-sand-500 dark:text-dark-300 hover:text-sand-700 dark:hover:text-dark-100 transition-colors"
                >
                  <motion.span
                    animate={{ rotate: expanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    ▸
                  </motion.span>
                  {expanded
                    ? (isTurkish ? 'Kapat' : 'Close')
                    : (isTurkish ? 'Daha fazla oku' : 'Read more')}
                </button>
              </div>
            </div>

            {/* Genişleyen detaylar */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  key="details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 pt-3 border-t border-sand-200/60 dark:border-dark-400/60 text-sm text-sand-600 dark:text-dark-300 leading-relaxed">
                    {isTurkish
                      ? 'Sadece yürüyüş değil, günlük su tüketimi takibi ve detaylı istatistiklerle de sağlıklı alışkanlıklar kazanmanızı destekler. Karmaşık ayarlarla uğraşmanıza gerek yoktur; tek yapmanız gereken yürümek, kedinizle ilgilenmek ve sağlıklı kalmaktır.'
                      : 'Beyond walking, it supports you in building healthy habits through daily water tracking and detailed statistics. There are no complicated settings to deal with—just walk, take care of your cat, and stay healthy.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeContent>
      </div>
    </motion.div>
  );
};

export default AndroidPage;
