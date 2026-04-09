import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiExternalLink, HiGlobe, HiCode } from 'react-icons/hi';
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

  const projects = [
    {
      id: 'typesprint',
      title: 'TypeSprint',
      url: 'https://typesprint.online',
      gradient: 'from-blue-500 to-indigo-600',
      accentLight: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      accentDark: 'dark:text-blue-400',
      icon: <HiCode className="w-10 h-10 text-white" />,
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
      icon: <HiGlobe className="w-10 h-10 text-white" />,
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
            {isTurkish ? 'Ana Sayfaya Dön' : 'Back to Home'}
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
                borderRadius="24px"
                borderColor={isDark ? 'rgba(71,85,105,0.4)' : 'rgba(212,196,175,0.4)'}
                glareColor={isDark ? '#ff9a5c' : '#f07d2d'}
                glareOpacity={0.12}
                glareSize={300}
                transitionDuration={800}
                className="!grid !place-items-stretch"
              >
                <div className="bg-white/50 dark:bg-dark-600/50 backdrop-blur-md rounded-3xl overflow-hidden w-full">
                  {/* Project Header */}
                  <div className={`bg-gradient-to-r ${project.gradient} p-5 sm:p-8 md:p-10`}>
                    <div className="flex items-center gap-4">
                      <motion.span
                        whileHover={{ scale: 1.2, rotate: 8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      >
                        {project.icon}
                      </motion.span>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">{project.title}</h2>
                        <p className="text-white/70 text-sm mt-1">{project.url.replace('https://', '')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content: Preview + Details */}
                  <div className="p-5 sm:p-8 md:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <SitePreview
                          url={project.url}
                          type="web"
                          title={project.title}
                          gradient={project.gradient}
                        />
                      </div>

                      <div>
                        <div className="mb-6">
                          <p className="text-sand-700 dark:text-dark-200 leading-relaxed text-lg mb-3">
                            {project.description}
                          </p>
                          <p className="text-sand-600 dark:text-dark-300 leading-relaxed">
                            {project.longDesc}
                          </p>
                        </div>

                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-sand-900 dark:text-dark-50 mb-4">
                            {isTurkish ? 'Öne Çıkan Özellikler' : 'Key Features'}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {project.features.map((feat, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-lg bg-sand-100/60 dark:bg-dark-500/40 hover:translate-x-1 transition-transform"
                              >
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${project.gradient} flex-shrink-0`} />
                                <span className="text-sand-700 dark:text-dark-200 text-sm">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-3 py-1 text-xs rounded-full border ${project.accentLight} ${project.accentDark}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <motion.a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.04, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${project.gradient} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow`}
                        >
                          <HiExternalLink className="w-5 h-5" />
                          {isTurkish ? 'Siteyi Ziyaret Et' : 'Visit Website'}
                        </motion.a>
                      </div>
                    </div>
                  </div>
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
