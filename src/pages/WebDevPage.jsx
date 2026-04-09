import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiExternalLink, HiGlobe } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import SitePreview from '../components/SitePreview';
import BlurText from '../components/BlurText';
import GlareHover from '../components/GlareHover';
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

const WebDevPage = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpanded = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const projects = [
    {
      id: 'typesprint',
      title: 'TypeSprint',
      url: 'https://typesprint.online',
      gradient: 'from-blue-500 to-indigo-600',
      accentLight: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      accentDark: 'dark:text-blue-400',
      description: isTurkish
        ? 'TypeSprint, gerçek zamanlı çalışan modern bir yazma hızı (WPM) testi uygulamasıdır. Akıcı bir arayüze ve birden fazla dil seçeneğine sahiptir. Yanlış tuşa bastığınızda ilerlemenizi durdurarak, her zaman en doğru ve ölçülebilir sonuçları almanızı sağlar.'
        : 'TypeSprint is a modern typing speed (WPM) test application featuring real-time validation, a smooth interface, and multiple language options. It halts your progress if you press the wrong key, ensuring that your results are always highly accurate and measurable.',
      longDesc: isTurkish
        ? 'İçerisinde Türkçe dahil farklı dillerin kelime havuzunu barındıran kapsamlı bir projedir. Günlük, haftalık ve tüm zamanların skor tabloları rekabet ortamı yaratırken, hile önleme sistemi adil bir test deneyimi sunar. İster telefondan ister bilgisayardan hızınızı ölçebilir ve sonuçlarınızı arkadaşlarınızla karşılaştırabilirsiniz.'
        : 'A comprehensive platform featuring word pools in multiple languages, including Turkish. Daily, weekly, and all-time leaderboards encourage competition, while the anti-cheat system ensures a fair testing experience. You can measure your speed from any device and easily compare your scores with friends.',
      tags: ['JavaScript', 'HTML/CSS', isTurkish ? 'Skor Tablosu' : 'Leaderboard', isTurkish ? 'Çok Dilli' : 'Multilingual'],
      features: isTurkish
        ? ['Gerçek zamanlı harf doğrulama', 'Çok dilli kelime havuzları', 'Skor tabloları ve sayfalama', 'Hile önleme sistemi']
        : ['Real-time letter validation', 'Multilingual word pools', 'Leaderboards with pagination', 'Anti-cheat system'],
    },
    {
      id: 'dert-haritasi',
      title: isTurkish ? 'Dert Haritası' : 'Dert Haritası (Complaint Map)',
      url: 'https://dert-haritasi.vercel.app',
      gradient: 'from-emerald-500 to-teal-600',
      accentLight: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      accentDark: 'dark:text-emerald-400',
      description: isTurkish
        ? 'BİZ Topluluğu için hazırladığım Dert Haritası, herkesin yaşadığı şehirle ilgili sorunları kolayca dile getirebildiği interaktif bir platformdur. Amacı, kentsel sorunları daha görünür hale getirmek ve topluluk odaklı çözümler üretilmesine yardımcı olmaktır.'
        : 'Dert Haritası (Complaint Map) is an interactive platform I developed for the BİZ Community, allowing anyone to easily voice issues regarding their city. Its goal is to make urban problems more visible and encourage community-driven solutions.',
      longDesc: isTurkish
        ? '"Şehrinin sesi ol!" sloganıyla hareket eden bu platform; altyapıdan ulaşıma, çevre sorunlarından eğitime kadar birçok farklı alanda şikayetleri bir araya getiriyor. Harita üzerinden istediğiniz şehre tıklayarak o bölgenin sorunlarını ve genel istatistiklerini doğrudan inceleyebilirsiniz.'
        : 'Guided by the motto "Be the voice of your city!", this platform gathers complaints across various fields—from infrastructure and transportation to the environment and education. By simply clicking on a city on the map, you can directly explore that area\'s reported issues and overall statistics.',
      tags: ['React', 'Vercel', isTurkish ? 'İnteraktif Harita' : 'Interactive Map', isTurkish ? 'Topluluk' : 'Community'],
      features: isTurkish
        ? ['İnteraktif Türkiye haritası', 'Kategori bazlı şikayet sistemi', 'Şehir istatistikleri', 'BİZ Topluluğu entegrasyon']
        : ['Interactive Turkey map', 'Category-based complaint system', 'City statistics', 'BİZ Community integration'],
    },
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
        {/* Back button */}
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
            <span className="hidden sm:inline">{isTurkish ? 'Ana Sayfaya Dön' : 'Back to Home'}</span>
          </Link>
        </motion.div>

        {/* Hero Section — framer-motion for above-the-fold */}
        <div className="text-center mb-8">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="inline-block px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-500/20 mb-4"
          >
            <HiGlobe className="w-4 h-4 inline-block mr-1" /> {isTurkish ? 'Web Geliştirme' : 'Web Development'}
          </motion.span>

          <BlurText
            text={isTurkish ? 'Web Projelerim' : 'Web Projects'}
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
              ? 'React, JavaScript ve modern web teknolojileri kullanarak kullanıcı odaklı, performanslı ve estetik web uygulamaları geliştiriyorum.'
              : 'I build user-focused, performant, and aesthetically pleasing web applications using React, JavaScript, and modern web technologies.'}
          </motion.p>
        </div>

        {/* Projects — one FadeContent per project card */}
        <div className="space-y-4">
          {projects.map((project, index) => (
            <FadeContent key={project.id} duration={700} delay={index * 150} blur={true} threshold={0.1}>
              <GlareHover
                width="100%"
                height="auto"
                background="transparent"
                borderRadius="16px"
                borderColor={isDark ? 'rgba(71,85,105,0.4)' : 'rgba(212,196,175,0.4)'}
                glareColor={isDark ? '#ff9a5c' : '#f07d2d'}
                glareOpacity={0.12}
                glareSize={300}
                transitionDuration={800}
                className="!grid !place-items-stretch"
              >
                <div className="bg-white/50 dark:bg-dark-600/50 backdrop-blur-md rounded-2xl overflow-hidden w-full p-4 sm:p-5">
                  {/* Ana satır: thumbnail + bilgi + buton */}
                  <div className="flex gap-4 items-start">
                    {/* Thumbnail */}
                    <div className={`flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden bg-gradient-to-r ${project.gradient} p-0.5`}>
                      <div className="w-full h-full rounded-[10px] overflow-hidden bg-white dark:bg-dark-600">
                        <SitePreview
                          url={project.url}
                          type="web"
                          title={project.title}
                          gradient={project.gradient}
                          expandable={false}
                        />
                      </div>
                    </div>

                    {/* Bilgi alanı */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div>
                          <h2 className="text-lg font-bold text-sand-900 dark:text-dark-50 leading-tight">
                            {project.title}
                          </h2>
                          <p className="text-xs text-sand-500 dark:text-dark-300">
                            {project.url.replace('https://', '')}
                          </p>
                        </div>

                        {/* Ziyaret Et butonu */}
                        <motion.a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.04, y: -1 }}
                          whileTap={{ scale: 0.97 }}
                          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${project.gradient} text-white rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-shadow`}
                        >
                          <HiExternalLink className="w-3.5 h-3.5" />
                          {isTurkish ? 'Ziyaret Et' : 'Visit'}
                        </motion.a>
                      </div>

                      {/* Kısa açıklama */}
                      <p className="text-sm text-sand-700 dark:text-dark-200 leading-relaxed mb-2 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Birleşik tag + özellik satırı */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 text-xs rounded-full border ${project.accentLight} ${project.accentDark}`}
                          >
                            {tag}
                          </span>
                        ))}
                        {project.features.map((feat) => (
                          <span
                            key={feat}
                            className="px-2 py-0.5 text-xs rounded-full border border-sand-200 dark:border-dark-400 text-sand-600 dark:text-dark-300"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>

                      {/* Daha fazla oku toggle */}
                      <button
                        onClick={() => toggleExpanded(project.id)}
                        className="flex items-center gap-1 text-xs font-medium text-sand-500 dark:text-dark-300 hover:text-sand-700 dark:hover:text-dark-100 transition-colors"
                      >
                        <motion.span
                          animate={{ rotate: expandedIds.has(project.id) ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="inline-block"
                        >
                          ▸
                        </motion.span>
                        {expandedIds.has(project.id)
                          ? (isTurkish ? 'Kapat' : 'Close')
                          : (isTurkish ? 'Daha fazla oku' : 'Read more')}
                      </button>
                    </div>
                  </div>

                  {/* Genişleyen longDesc */}
                  <AnimatePresence>
                    {expandedIds.has(project.id) && (
                      <motion.div
                        key="longdesc"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 pt-3 border-t border-sand-200/60 dark:border-dark-400/60 text-sm text-sand-600 dark:text-dark-300 leading-relaxed">
                          {project.longDesc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlareHover>
            </FadeContent>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WebDevPage;
