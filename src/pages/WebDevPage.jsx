import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiExternalLink, HiGlobe, HiCode, HiTemplate } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';

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

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
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
      icon: '⌨️',
      description: isTurkish
        ? 'TypeSprint, gerçek zamanlı harf doğrulaması, akıcı arayüzü ve çok dilli kelime setleriyle modern bir yazma hızı (WPM) testidir. Yanlış harfe bastığında ilerleyemezsin — bu sayede sonuçlar net ve tekrar edilebilir olur.'
        : 'TypeSprint is a modern typing speed (WPM) test with real-time letter validation, smooth UI, and multilingual word sets. You can\'t proceed when hitting wrong keys — making results clean and repeatable.',
      longDesc: isTurkish
        ? 'Türkçe ve Avrupa dillerinde kelime havuzları, gün/hafta/ay/genel skor tabloları, mobil uyumlu tasarım ve hile önleme sistemiyle donatılmış kapsamlı bir platform. Kullanıcılar yazma hızlarını ölçebilir, geliştirebilir ve arkadaşlarıyla kıyaslayabilir.'
        : 'A comprehensive platform equipped with word pools in Turkish and European languages, daily/weekly/monthly/all-time leaderboards, mobile-friendly design, and anti-cheat system. Users can measure their typing speed, improve it, and compare with friends.',
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
      icon: '🗺️',
      description: isTurkish
        ? 'BİZ Topluluğu için geliştirdiğim Dert Haritası, insanların şehirleriyle ilgili şikayetlerini ve sorunlarını paylaşabildiği interaktif bir harita platformudur. Şehirlerdeki sorunların daha görünür olması ve topluluk odaklı çözümler üretilmesi amaçlanmıştır.'
        : 'Dert Haritası (Complaint Map) is an interactive map platform I built for BİZ Community, where people can share complaints and problems about their cities. It aims to make urban issues more visible and produce community-driven solutions.',
      longDesc: isTurkish
        ? '"Şehrinin sesi ol!" sloganıyla yola çıkan platform, yol/altyapı, toplu taşıma, güvenlik, çevre, konut, sağlık, eğitim ve ekonomi gibi birçok kategoride şikayetleri toplar. Kullanıcılar haritadan şehir seçerek o şehre ait istatistikleri ve şikayetleri görüntüleyebilir.'
        : 'With the motto "Be the voice of your city!", the platform collects complaints in categories like roads/infrastructure, public transport, security, environment, housing, health, education, and economy. Users can select a city from the map to view statistics and complaints.',
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
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <motion.div variants={fadeUp} initial="initial" animate="animate">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-warm-600 dark:text-warm-400 hover:text-warm-700 dark:hover:text-warm-300 font-medium mb-8 group transition-colors"
          >
            <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {isTurkish ? 'Ana Sayfaya Dön' : 'Back to Home'}
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="inline-block mb-4">
            <span className="px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-500/20">
              🌐 {isTurkish ? 'Web Geliştirme' : 'Web Development'}
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-sand-900 dark:text-dark-50 mb-6"
          >
            {isTurkish ? 'Web' : 'Web'}{' '}
            <span className="gradient-text">{isTurkish ? 'Projelerim' : 'Projects'}</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg text-sand-600 dark:text-dark-200 max-w-2xl mx-auto"
          >
            {isTurkish
              ? 'React, JavaScript ve modern web teknolojileri kullanarak kullanıcı odaklı, performanslı ve estetik web uygulamaları geliştiriyorum.'
              : 'I build user-focused, performant, and aesthetically pleasing web applications using React, JavaScript, and modern web technologies.'}
          </motion.p>
        </motion.div>

        {/* Projects */}
        <div className="space-y-20">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-80px' }}
              className="bg-white/50 dark:bg-dark-600/50 backdrop-blur-md rounded-3xl border border-sand-200 dark:border-dark-400 overflow-hidden"
            >
              {/* Project Header */}
              <motion.div
                variants={index % 2 === 0 ? slideInLeft : slideInRight}
                className={`bg-gradient-to-r ${project.gradient} p-5 sm:p-8 md:p-10`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{project.icon}</span>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">{project.title}</h2>
                    <p className="text-white/70 text-sm mt-1">{project.url.replace('https://', '')}</p>
                  </div>
                </div>
              </motion.div>

              <div className="p-5 sm:p-8 md:p-10">
                {/* Description */}
                <motion.div variants={fadeUp} className="mb-6">
                  <p className="text-sand-700 dark:text-dark-200 leading-relaxed text-lg mb-3">
                    {project.description}
                  </p>
                  <p className="text-sand-600 dark:text-dark-300 leading-relaxed">
                    {project.longDesc}
                  </p>
                </motion.div>

                {/* Features */}
                <motion.div variants={fadeUp} className="mb-8">
                  <h4 className="text-lg font-semibold text-sand-900 dark:text-dark-50 mb-4">
                    {isTurkish ? 'Öne Çıkan Özellikler' : 'Key Features'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.features.map((feat, i) => (
                      <motion.div
                        key={i}
                        variants={fadeUp}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-sand-100/60 dark:bg-dark-500/40"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${project.gradient} flex-shrink-0`} />
                        <span className="text-sand-700 dark:text-dark-200 text-sm">{feat}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Tags */}
                <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 text-xs rounded-full border ${project.accentLight} ${project.accentDark}`}
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.div variants={fadeUp}>
                  <motion.a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${project.gradient} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow`}
                  >
                    <HiExternalLink className="w-5 h-5" />
                    {isTurkish ? 'Siteyi Ziyaret Et' : 'Visit Website'}
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WebDevPage;
