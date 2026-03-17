import React from 'react';
import { motion } from 'framer-motion';
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
      <div className="max-w-5xl mx-auto">
        {/* Back button — lightweight CSS animation, no ScrollTrigger */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="fixed top-4 left-4 sm:left-20 z-50"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-dark-600/80 backdrop-blur-md border border-sand-200/60 dark:border-dark-400/60 text-warm-600 dark:text-warm-400 hover:text-warm-700 dark:hover:text-warm-300 font-medium group transition-colors shadow-md hover:shadow-lg"
          >
            <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {isTurkish ? 'Ana Sayfaya Dön' : 'Back to Home'}
          </Link>
        </motion.div>

        {/* Hero Section — above the fold, use framer-motion instead of ScrollTrigger */}
        <div className="text-center mb-16">
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
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-sand-900 dark:text-dark-50 mb-6 justify-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-sand-600 dark:text-dark-200 max-w-2xl mx-auto"
          >
            {isTurkish
              ? 'Kotlin ve React Native kullanarak modern, kullanıcı odaklı Android uygulamaları geliştiriyorum. Temiz mimari ve sezgisel arayüz tasarımı önceliğimdir.'
              : 'I build modern, user-focused Android applications using Kotlin and React Native. Clean architecture and intuitive UI design are my priorities.'}
          </motion.p>
        </div>

        {/* WalkKittie App Showcase — single FadeContent for the whole card */}
        <FadeContent duration={700} blur={true} threshold={0.1}>
          <div className="bg-white/50 dark:bg-dark-600/50 backdrop-blur-md rounded-3xl border border-sand-200 dark:border-dark-400 overflow-hidden mb-16">
            {/* App Header */}
            <div className="bg-gradient-to-r from-warm-500 to-orange-500 p-5 sm:p-8 md:p-10 text-white">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, -5, 0], scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                  className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl cursor-pointer"
                >
                  <HiHeart className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">WalkKittie (PatiCat)</h2>
                  <p className="text-white/70 text-sm mt-1">
                    {isTurkish
                      ? 'Adımlarını eğlenceye dönüştür, sanal kedine bak!'
                      : 'Turn your steps into fun, care for your virtual cat!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content: Preview + Details */}
            <div className="p-5 sm:p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Mobile Preview */}
                <div className="flex items-start justify-center">
                  <SitePreview
                    url={playUrl}
                    type="mobile"
                    title="WalkKittie (PatiCat)"
                    gradient="from-warm-500 to-orange-500"
                    expandable={false}
                  />
                </div>

                {/* Right: Details */}
                <div>
                  <h3 className="text-2xl font-bold text-sand-900 dark:text-dark-50 mb-4">
                    {isTurkish ? 'Uygulama Hakkında' : 'About the App'}
                  </h3>
                  <p className="text-sand-600 dark:text-dark-200 mb-4 leading-relaxed">
                    {isTurkish
                      ? 'WalkKittie, günlük fiziksel aktiviteyi eğlenceli bir sanal evcil hayvan deneyimiyle birleştiren yenilikçi bir sağlık uygulamasıdır. Uygulama, adım sayacınızı kullanarak yürüyüşlerinizi takip eder ve attığınız adımları mama puanlarına dönüştürür. Bu puanlarla sanal kedinizi besleyebilir, onunla oyunlar oynayabilir ve bağınızı güçlendirebilirsiniz.'
                      : 'WalkKittie is an innovative health app that combines daily physical activity with a fun virtual pet experience. The app tracks your walks using the step counter and converts your steps into food points. You can use these points to feed your virtual cat, play games with it, and strengthen your bond.'}
                  </p>
                  <p className="text-sand-600 dark:text-dark-200 mb-6 leading-relaxed">
                    {isTurkish
                      ? 'Ayrıca günlük su tüketimi takibi, haftalık ve aylık istatistikler gibi özelliklerle sağlıklı alışkanlıklar edinmenize yardımcı olur. Karmaşık kurulumlar yok — sadece yürü, oyna ve kedine bak!'
                      : 'It also helps you build healthy habits with features like daily water intake tracking, weekly and monthly statistics. No complex setup needed — just walk, play, and take care of your cat!'}
                  </p>

                  {/* Features Grid — SpotlightCards without individual FadeContent */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {features.map((feature, i) => (
                      <SpotlightCard
                        key={i}
                        spotlightColor={isDark ? 'rgba(255,154,92,0.15)' : 'rgba(240,125,45,0.12)'}
                        className="flex items-start gap-4 p-4 rounded-xl bg-sand-100/80 dark:bg-dark-500/50 border border-sand-200/60 dark:border-dark-400/40"
                      >
                        <div className="w-12 h-12 rounded-xl bg-warm-500/10 flex items-center justify-center text-warm-600 dark:text-warm-400 flex-shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sand-900 dark:text-dark-50">{feature.title}</h4>
                          <p className="text-sm text-sand-600 dark:text-dark-300">{feature.desc}</p>
                        </div>
                      </SpotlightCard>
                    ))}
                  </div>

                  {/* Google Play Button */}
                  <motion.a
                    href={playUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex"
                    aria-label={isTurkish ? "Google Play'den indir" : 'Get it on Google Play'}
                  >
                    <img
                      src={googlePlayBadgeSrc}
                      alt={isTurkish ? "Google Play'den al" : 'Get it on Google Play'}
                      width="646"
                      height="250"
                      className="h-16 w-auto"
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
              </div>
            </div>
          </div>
        </FadeContent>
      </div>
    </motion.div>
  );
};

export default AndroidPage;
