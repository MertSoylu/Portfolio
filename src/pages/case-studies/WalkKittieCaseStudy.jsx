import React from 'react';
import { motion } from 'framer-motion';
import { HiLightningBolt, HiShieldCheck, HiGlobe, HiUsers, HiClock, HiChip } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';
import { useDarkMode } from '../../context/DarkModeContext';
import CaseStudyLayout from '../../components/CaseStudyLayout';
import FadeContent from '../../components/FadeContent';
import SpotlightCard from '../../components/SpotlightCard';

const WalkKittieCaseStudy = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();

  const metrics = isTurkish
    ? [
        { icon: <HiGlobe className="w-6 h-6" />, value: '4', label: 'Özellik Modülü' },
        { icon: <HiUsers className="w-6 h-6" />, value: 'Google Play', label: 'Yayında' },
        { icon: <HiClock className="w-6 h-6" />, value: 'Adım', label: 'Sensör Entegrasyonu' },
        { icon: <HiChip className="w-6 h-6" />, value: 'Kotlin', label: 'Native Android' },
      ]
    : [
        { icon: <HiGlobe className="w-6 h-6" />, value: '4', label: 'Feature Modules' },
        { icon: <HiUsers className="w-6 h-6" />, value: 'Google Play', label: 'Published' },
        { icon: <HiClock className="w-6 h-6" />, value: 'Step', label: 'Sensor Integration' },
        { icon: <HiChip className="w-6 h-6" />, value: 'Kotlin', label: 'Native Android' },
      ];

  const techStack = [
    'Kotlin',
    'Android Studio',
    'Room Database',
    'Sensor Manager',
    'MVVM',
    'Material Design',
  ];

  const challenges = isTurkish
    ? [
        {
          title: 'Adım Sayacı Doğruluğu',
          desc: 'Farklı cihazlarda sensör kalibrasyonunu optimize ettim. Background service ile günlük adımları kesintisiz takip ediyorum.',
        },
        {
          title: 'Sanal Kedi AI',
          desc: 'Kedinin açlık ve mutluluk seviyelerini yöneten bir state machine oluşturdum. Kullanıcı davranışlarına göre dinamik yanıtlar veriyor.',
        },
        {
          title: 'Pil Optimizasyonu',
          desc: 'Background sensör kullanımını optimize ederek pil tüketimini minimize ettim. Doze mode ve work manager ile denge kurdum.',
        },
      ]
    : [
        {
          title: 'Step Counter Accuracy',
          desc: 'Optimized sensor calibration across different devices. Track daily steps continuously via background service.',
        },
        {
          title: 'Virtual Cat AI',
          desc: "Created a state machine managing the cat's hunger and happiness levels. Provides dynamic responses based on user behavior.",
        },
        {
          title: 'Battery Optimization',
          desc: 'Minimized battery consumption by optimizing background sensor usage. Balanced with Doze mode and Work Manager.',
        },
      ];

  const features = isTurkish
    ? [
        'Adım sayacı ve günlük hedef takibi',
        'Sanal kedi bakımı ve besleme sistemi',
        'Oyun odası ile etkileşimli oyunlar',
        'Su tüketimi takibi ve hatırlatmaları',
        'Detaylı istatistik ve grafikler',
      ]
    : [
        'Step counter and daily goal tracking',
        'Virtual cat care and feeding system',
        'Interactive games in the game room',
        'Water intake tracking and reminders',
        'Detailed statistics and charts',
      ];

  return (
    <CaseStudyLayout
      routePath="/case-study/walkkittie"
      title="WalkKittie (PatiCat)"
      subtitle={
        isTurkish
          ? "Günlük yürüyüşlerinizi sanal bir evcil hayvan besleme deneyimiyle birleştiren sağlık uygulaması. Google Play'de yayında."
          : 'A health app that combines your daily walks with a virtual pet feeding experience. Published on Google Play.'
      }
      liveUrl="https://play.google.com/store/apps/details?id=com.mert.paticat"
      heroImage="https://play.google.com/store/apps/details?id=com.mert.paticat"
      currentId="walkkittie"
      isTurkish={isTurkish}
    >
      {/* Metrics */}
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-raised p-5 text-center"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent-500/10 text-accent-600 dark:text-accent-400 mb-3">
                {m.icon}
              </div>
              <div className="text-2xl font-bold text-sand-900 dark:text-zinc-50 mb-1">{m.value}</div>
              <div className="text-caption text-sand-600 dark:text-zinc-400">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </FadeContent>

      {/* Problem & Solution */}
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised p-6 sm:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-4">
                {isTurkish ? 'Problem' : 'Problem'}
              </h2>
              <p className="text-body text-sand-700 dark:text-zinc-300">
                {isTurkish
                  ? 'İnsanlar günlük yürüyüş hedeflerini takip etmekte zorlanıyor. Mevcut sağlık uygulamaları soğuk ve mekanik. Motivasyon sağlayan, eğlenceli bir deneyim eksik.'
                  : 'People struggle to track daily walking goals. Existing health apps feel cold and mechanical. A fun, motivating experience is missing.'}
              </p>
            </div>
            <div>
              <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-4">
                {isTurkish ? 'Çözüm' : 'Solution'}
              </h2>
              <p className="text-body text-sand-700 dark:text-zinc-300">
                {isTurkish
                  ? 'Yürüdükçe sanal kedinizi beslediğiniz bir uygulama geliştirdim. Adım sayacı, su takibi ve oyun odası ile sağlıklı alışkanlıkları eğlenceli hale getirdim.'
                  : 'Developed an app where you feed your virtual cat by walking. Made healthy habits fun with step counter, water tracking, and a game room.'}
              </p>
            </div>
          </div>
        </div>
      </FadeContent>

      {/* Tech Stack */}
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised p-6 sm:p-8">
          <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-6">
            {isTurkish ? 'Teknoloji Yığını' : 'Tech Stack'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-accent-500/10 text-accent-700 dark:text-accent-300 text-sm font-medium rounded-full border border-accent-500/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </FadeContent>

      {/* Architecture Decisions */}
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised p-6 sm:p-8">
          <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-6">
            {isTurkish ? 'Mimari Kararlar' : 'Architecture Decisions'}
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-600 dark:text-accent-400 font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-sand-900 dark:text-zinc-100 mb-1">
                  {isTurkish ? 'MVVM Mimarisi' : 'MVVM Architecture'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? "ViewModel, Repository ve Room Database katmanları ile temiz mimari oluşturdum. UI logic business logic'ten ayrıldı."
                    : 'Created clean architecture with ViewModel, Repository, and Room Database layers. UI logic is separated from business logic.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-600 dark:text-accent-400 font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-sand-900 dark:text-zinc-100 mb-1">
                  {isTurkish ? 'Background Service' : 'Background Service'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? 'Adım sayacı için foreground service kullandım. Uygulama kapalıyken bile günlük adımları kesintisiz sayıyor.'
                    : 'Used foreground service for step counting. Counts daily steps uninterrupted even when the app is closed.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-600 dark:text-accent-400 font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-sand-900 dark:text-zinc-100 mb-1">
                  {isTurkish ? 'Room Database' : 'Room Database'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? 'Günlük adım, su tüketimi ve oyun verilerini Room ile yerel olarak sakladım. Offline çalışma ve hızlı erişim sağladım.'
                    : 'Stored daily steps, water intake, and game data locally with Room. Enabled offline operation and fast access.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeContent>

      {/* Challenges */}
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised p-6 sm:p-8">
          <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-6">
            {isTurkish ? 'Karşılaşılan Zorluklar' : 'Challenges Faced'}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {challenges.map((c) => (
              <SpotlightCard
                key={c.title}
                className="card-flat p-5"
                spotlightColor={isDark ? 'rgba(249, 115, 22, 0.12)' : 'rgba(240, 125, 45, 0.08)'}
              >
                <h4 className="text-h4 text-sand-900 dark:text-zinc-50 mb-2">{c.title}</h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">{c.desc}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </FadeContent>

      {/* Features */}
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised p-6 sm:p-8">
          <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-6">
            {isTurkish ? 'Öne Çıkan Özellikler' : 'Key Features'}
          </h2>
          <ul className="grid md:grid-cols-2 gap-3">
            {features.map((feat) => (
              <li
                key={feat}
                className="flex items-start gap-3 rounded-xl border border-sand-200/60 dark:border-zinc-800/60 bg-sand-100/40 dark:bg-zinc-900/40 px-4 py-3"
              >
                <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-500" />
                <span className="text-body-sm text-sand-700 dark:text-zinc-300">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </FadeContent>

      {/* Results */}
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised p-6 sm:p-8">
          <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-6">
            {isTurkish ? 'Sonuçlar' : 'Results'}
          </h2>
          <p className="text-body text-sand-700 dark:text-zinc-300 mb-4">
            {isTurkish
              ? "WalkKittie, Google Play'de yayınlandı ve kullanıcılar tarafından olumlu karşılandı. Adım sayacı + sanal kedi mekaniği, sağlıklı alışkanlıkları eğlenceli hale getirdi."
              : 'WalkKittie was published on Google Play and received positive feedback from users. The step counter + virtual cat mechanic made healthy habits fun.'}
          </p>
          <div className="flex flex-wrap gap-2">
            {['Google Play', 'Native Kotlin', 'Material Design', 'Offline First'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-300 text-xs font-medium rounded-full border border-green-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </FadeContent>
    </CaseStudyLayout>
  );
};

export default WalkKittieCaseStudy;
