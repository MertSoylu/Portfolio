import React from 'react';
import { motion } from 'framer-motion';
import { HiLightningBolt, HiShieldCheck, HiGlobe, HiUsers, HiClock, HiChip } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';
import { useDarkMode } from '../../context/DarkModeContext';
import CaseStudyLayout from '../../components/CaseStudyLayout';
import FadeContent from '../../components/FadeContent';
import SpotlightCard from '../../components/SpotlightCard';

const DertHaritasiCaseStudy = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();

  const metrics = isTurkish
    ? [
        { icon: <HiGlobe className="w-6 h-6" />, value: '81', label: 'İl Desteği' },
        { icon: <HiUsers className="w-6 h-6" />, value: '15+', label: 'Kategori' },
        { icon: <HiClock className="w-6 h-6" />, value: '<1.5s', label: 'İlk Yükleme' },
        { icon: <HiChip className="w-6 h-6" />, value: '100%', label: 'Responsive' },
      ]
    : [
        { icon: <HiGlobe className="w-6 h-6" />, value: '81', label: 'Provinces' },
        { icon: <HiUsers className="w-6 h-6" />, value: '15+', label: 'Categories' },
        { icon: <HiClock className="w-6 h-6" />, value: '<1.5s', label: 'First Load' },
        { icon: <HiChip className="w-6 h-6" />, value: '100%', label: 'Responsive' },
      ];

  const techStack = ['React', 'Vite', 'Tailwind CSS', 'SVG Maps', 'Vercel', 'Framer Motion'];

  const challenges = isTurkish
    ? [
        {
          title: 'SVG Harita Performansı',
          desc: "Türkiye'nin 81 ilini içeren interaktif SVG haritayı optimize ettim. Hover ve tıklama etkileşimleri için event delegation kullandım.",
        },
        {
          title: 'Kategori Yönetimi',
          desc: '15+ farklı kategoriyi dinamik olarak filtreleyebilmek için state yönetimini optimize ettim. URL parametreleri ile filtreleri paylaşılabilir hale getirdim.',
        },
        {
          title: 'Topluluk Entegrasyonu',
          desc: "BİZ Topluluğu'nun mevcut sistemleriyle entegrasyon için API katmanı oluşturdum. Kimlik doğrulama ve veri senkronizasyonunu sağladım.",
        },
      ]
    : [
        {
          title: 'SVG Map Performance',
          desc: 'Optimized an interactive SVG map containing all 81 provinces of Turkey. Used event delegation for hover and click interactions.',
        },
        {
          title: 'Category Management',
          desc: 'Optimized state management to dynamically filter 15+ categories. Made filters shareable via URL parameters.',
        },
        {
          title: 'Community Integration',
          desc: "Created an API layer for integration with BİZ Community's existing systems. Handled authentication and data synchronization.",
        },
      ];

  const features = isTurkish
    ? [
        'İnteraktif Türkiye haritası (81 il)',
        'Kategori bazlı şikayet sistemi',
        'Şehir istatistikleri ve karşılaştırma',
        'BİZ Topluluğu entegrasyonu',
        'URL tabanlı filtre paylaşımı',
      ]
    : [
        'Interactive Turkey map (81 provinces)',
        'Category-based complaint system',
        'City statistics and comparison',
        'BİZ Community integration',
        'URL-based filter sharing',
      ];

  return (
    <CaseStudyLayout
      routePath="/case-study/dert-haritasi"
      title={isTurkish ? 'Dert Haritası' : 'Dert Haritası'}
      subtitle={
        isTurkish
          ? 'BİZ Topluluğu için geliştirilen, kentsel sorunları görünür hale getiren interaktif şikayet haritası.'
          : 'An interactive complaint map developed for the BİZ Community to make urban problems visible.'
      }
      liveUrl="https://dert-haritasi.vercel.app"
      heroImage="https://image.thum.io/get/width/1600/https://dert-haritasi.vercel.app"
      currentId="dert-haritasi"
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
                  ? 'Kentsel sorunlar dağınık şekilde dile getiriliyor, veriler görselleştirilmiyor ve karar alıcılar sorunları haritalayamıyor. Topluluk odaklı çözümler için merkezi bir platform eksik.'
                  : 'Urban problems are voiced in a scattered way, data is not visualized, and decision makers cannot map the issues. A centralized platform for community-driven solutions is missing.'}
              </p>
            </div>
            <div>
              <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-4">
                {isTurkish ? 'Çözüm' : 'Solution'}
              </h2>
              <p className="text-body text-sand-700 dark:text-zinc-300">
                {isTurkish
                  ? 'İnteraktif Türkiye haritası üzerinde kategori bazlı şikayet toplayan bir platform oluşturdum. Şehir istatistikleri, karşılaştırmalar ve topluluk entegrasyonu sağladım.'
                  : 'Created a platform that collects category-based complaints on an interactive Turkey map. Provided city statistics, comparisons, and community integration.'}
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
                  {isTurkish ? 'SVG Tabanlı Harita' : 'SVG-Based Map'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? 'Harita kütüphanesi yerine optimize edilmiş SVG kullandım. Bu, dosya boyutunu %70 azalttı ve etkileşimleri tam kontrol etmemi sağladı.'
                    : 'Used optimized SVG instead of a map library. This reduced file size by 70% and gave me full control over interactions.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-600 dark:text-accent-400 font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-sand-900 dark:text-zinc-100 mb-1">
                  {isTurkish ? 'URL Durum Senkronizasyonu' : 'URL State Sync'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? 'Filtre ve kategori seçimlerini URL parametreleriyle senkronize ettim. Kullanıcılar filtrelenmiş görünümleri doğrudan paylaşabiliyor.'
                    : 'Synchronized filter and category selections with URL parameters. Users can directly share filtered views.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-600 dark:text-accent-400 font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-sand-900 dark:text-zinc-100 mb-1">
                  {isTurkish ? 'Vercel Edge Network' : 'Vercel Edge Network'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? "Vercel'in edge network'ü ile Türkiye'den erişimi optimize ettim. Statik export + CDN sayesinde <1.5s yükleme süresi sağladım."
                    : "Optimized access from Turkey using Vercel's edge network. Achieved <1.5s load time with static export + CDN."}
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
              ? "Dert Haritası, BİZ Topluluğu'nun kentsel sorunları görselleştirme çabasında merkezi bir araç haline geldi. Interaktif harita ve istatistikler sayesinde sorunlar daha görünür hale geldi."
              : "Dert Haritası became a central tool for the BİZ Community's efforts to visualize urban problems. The interactive map and statistics made issues more visible."}
          </p>
          <div className="flex flex-wrap gap-2">
            {['Lighthouse 96', '<1.5s Load', 'SEO Optimized', 'Accessible'].map((tag) => (
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

export default DertHaritasiCaseStudy;
