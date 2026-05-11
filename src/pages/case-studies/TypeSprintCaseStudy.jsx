import React from 'react';
import { motion } from 'framer-motion';
import { HiLightningBolt, HiShieldCheck, HiGlobe, HiUsers, HiClock, HiChip } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';
import { useDarkMode } from '../../context/DarkModeContext';
import CaseStudyLayout from '../../components/CaseStudyLayout';
import FadeContent from '../../components/FadeContent';
import SpotlightCard from '../../components/SpotlightCard';

const TypeSprintCaseStudy = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();

  const metrics = isTurkish
    ? [
        { icon: <HiGlobe className="w-6 h-6" />, value: '2,000+', label: 'Tamamlanan Test' },
        { icon: <HiUsers className="w-6 h-6" />, value: '5', label: 'Dil Desteği' },
        { icon: <HiClock className="w-6 h-6" />, value: '40ms', label: 'Tepki Süresi' },
        { icon: <HiChip className="w-6 h-6" />, value: '99.9%', label: 'Hile Önleme' },
      ]
    : [
        { icon: <HiGlobe className="w-6 h-6" />, value: '2,000+', label: 'Tests Completed' },
        { icon: <HiUsers className="w-6 h-6" />, value: '5', label: 'Languages' },
        { icon: <HiClock className="w-6 h-6" />, value: '40ms', label: 'Response Time' },
        { icon: <HiChip className="w-6 h-6" />, value: '99.9%', label: 'Anti-Cheat' },
      ];

  const techStack = ['JavaScript', 'HTML5', 'CSS3', 'LocalStorage', 'Web Workers', 'Canvas API'];

  const challenges = isTurkish
    ? [
        {
          title: 'Gerçek Zamanlı Doğrulama',
          desc: 'Yanlış tuşa basıldığında anında durdurma mantığını implemente ettim. Bu, kullanıcı deneyimini zorlaştırmadan doğruluk sağlıyor.',
        },
        {
          title: 'Çok Dilli Kelime Havuzları',
          desc: 'Her dil için optimize edilmiş kelime listeleri oluşturdum. Türkçe dahil 5 farklı dilde tutarlı WPM ölçümü sağladım.',
        },
        {
          title: 'Hile Önleme Sistemi',
          desc: "Paste event'lerini engelleyerek, kopyala-yapıştır ile hile yapılmasını önledim. Ayrıca anormal yazım hızlarını tespit eden bir algoritma ekledim.",
        },
      ]
    : [
        {
          title: 'Real-Time Validation',
          desc: 'Implemented instant stop logic on wrong keypress. This ensures accuracy without degrading the user experience.',
        },
        {
          title: 'Multilingual Word Pools',
          desc: 'Created optimized word lists for each language. Achieved consistent WPM measurement across 5 languages including Turkish.',
        },
        {
          title: 'Anti-Cheat System',
          desc: 'Prevented copy-paste cheating by blocking paste events. Added an algorithm that detects abnormal typing speeds.',
        },
      ];

  const features = isTurkish
    ? [
        'Gerçek zamanlı harf doğrulama',
        'Çok dilli kelime havuzları (Türkçe dahil)',
        'Günlük, haftalık ve tüm zamanların skor tabloları',
        'Hile önleme sistemi',
        'Responsive tasarım (mobil + masaüstü)',
      ]
    : [
        'Real-time letter validation',
        'Multilingual word pools (including Turkish)',
        'Daily, weekly, and all-time leaderboards',
        'Anti-cheat system',
        'Responsive design (mobile + desktop)',
      ];

  return (
    <CaseStudyLayout
      routePath="/case-study/typesprint"
      title="TypeSprint"
      subtitle={
        isTurkish
          ? 'Gerçek zamanlı çalışan modern bir yazma hızı (WPM) testi uygulaması. Akıcı arayüz, çok dilli destek ve adil test deneyimi.'
          : 'A modern real-time typing speed (WPM) test application. Smooth interface, multilingual support, and fair testing experience.'
      }
      liveUrl="https://typesprint.online"
      heroImage="https://image.thum.io/get/width/1600/https://typesprint.online"
      currentId="typesprint"
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
                  ? 'Mevcut yazma hızı testleri ya hatalı ölçüm yapıyor ya da hileye açık. Çok dilli destek genellikle eksik ve kullanıcı deneyimi düşük kalitede.'
                  : 'Existing typing speed tests either measure inaccurately or are vulnerable to cheating. Multilingual support is usually lacking and the user experience is low quality.'}
              </p>
            </div>
            <div>
              <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-4">
                {isTurkish ? 'Çözüm' : 'Solution'}
              </h2>
              <p className="text-body text-sand-700 dark:text-zinc-300">
                {isTurkish
                  ? 'Yanlış tuşa basıldığında duran, 5 dil destekleyen ve hile önleyici sistemle donatılmış bir WPM testi oluşturdum. Skor tabloları rekabet ortamı yaratıyor.'
                  : 'Created a WPM test that stops on wrong keypress, supports 5 languages, and is equipped with an anti-cheat system. Leaderboards create a competitive environment.'}
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
                  {isTurkish ? 'Vanilla JS ile Sıfır Bağımlılık' : 'Zero Dependency Vanilla JS'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? 'React veya framework kullanmadan saf JavaScript ile geliştirdim. Bu, sayfa yükleme süresini minimize etti ve performansı artırdı.'
                    : 'Built with pure JavaScript without React or any framework. This minimized page load time and improved performance.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-600 dark:text-accent-400 font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-sand-900 dark:text-zinc-100 mb-1">
                  {isTurkish ? 'Web Workers ile Hesaplama' : 'Web Workers for Computation'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? "WPM hesaplamalarını ve istatistikleri Web Worker'da yaparak ana thread'i bloke etmiyorum. Kullanıcı yazarken bile akıcı deneyim sağlanıyor."
                    : 'Perform WPM calculations and statistics in a Web Worker to avoid blocking the main thread. Ensures a smooth experience even while the user is typing.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-600 dark:text-accent-400 font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-sand-900 dark:text-zinc-100 mb-1">
                  {isTurkish ? 'Canvas API ile Render' : 'Canvas API Rendering'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? 'Yazı alanını Canvas API ile render ettim. Bu, binlerce karakterin aynı anda akıcı şekilde gösterilmesini sağlıyor.'
                    : 'Rendered the typing area with Canvas API. This allows thousands of characters to be displayed smoothly at the same time.'}
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
              ? 'TypeSprint, hızlı yükleme süresi ve adil test deneyimi ile kullanıcılar tarafından olumlu karşılandı. Canvas API ile akıcı karakter render etme, Web Workers ile hesaplama performansı artırıldı.'
              : 'TypeSprint was well received by users for its fast load time and fair testing experience. Canvas API enables smooth character rendering, while Web Workers improve computational performance.'}
          </p>
          <div className="flex flex-wrap gap-2">
            {['Lighthouse 98', '<100KB JS', 'Zero Dependencies', 'Mobile Optimized'].map((tag) => (
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

export default TypeSprintCaseStudy;
