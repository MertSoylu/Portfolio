import React from 'react';
import { motion } from 'framer-motion';
import { HiLightningBolt, HiShieldCheck, HiGlobe, HiUsers, HiClock, HiChip } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';
import { useDarkMode } from '../../context/DarkModeContext';
import CaseStudyLayout from '../../components/CaseStudyLayout';
import FadeContent from '../../components/FadeContent';
import SpotlightCard from '../../components/SpotlightCard';

const MnemosyneCaseStudy = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();

  const metrics = isTurkish
    ? [
        { icon: <HiGlobe className="w-6 h-6" />, value: '500+', label: 'Bırakılan Anı' },
        { icon: <HiUsers className="w-6 h-6" />, value: '50+', label: 'Şehir' },
        { icon: <HiClock className="w-6 h-6" />, value: '<2s', label: 'PWA Yükleme' },
        { icon: <HiChip className="w-6 h-6" />, value: '100%', label: 'Offline Desteği' },
      ]
    : [
        { icon: <HiGlobe className="w-6 h-6" />, value: '500+', label: 'Memories Dropped' },
        { icon: <HiUsers className="w-6 h-6" />, value: '50+', label: 'Cities' },
        { icon: <HiClock className="w-6 h-6" />, value: '<2s', label: 'PWA Load Time' },
        { icon: <HiChip className="w-6 h-6" />, value: '100%', label: 'Offline Support' },
      ];

  const techStack = ['React', 'PWA', 'Geolocation API', 'IndexedDB', 'Service Workers', 'Tailwind CSS'];

  const challenges = isTurkish
    ? [
        {
          title: 'Konum Doğruluğu',
          desc: 'Farklı cihazlarda GPS sapmalarını minimize etmek için geolocation kalibrasyonu ve harita zoom seviyelerini optimize ettim.',
        },
        {
          title: 'Offline Deneyim',
          desc: 'Service Workers ve IndexedDB ile anıları yerel depolayarak çevrimdışı erişimi sağladım. Background sync ile bağlantı geri geldiğinde senkronizasyon yapılıyor.',
        },
        {
          title: 'Zaman Katmanları Performansı',
          desc: 'Aynı konumdaki yüzlerce anının geçmişten bugüne sıralanması için virtualized list ve lazy loading implementasyonu yaptım.',
        },
      ]
    : [
        {
          title: 'Location Accuracy',
          desc: 'Minimized GPS drift across devices by calibrating geolocation and optimizing map zoom thresholds.',
        },
        {
          title: 'Offline Experience',
          desc: 'Used Service Workers and IndexedDB to store memories locally. Background sync handles synchronization when connectivity returns.',
        },
        {
          title: 'Time Layers Performance',
          desc: 'Implemented virtualized lists and lazy loading to handle hundreds of memories at the same location ordered from past to present.',
        },
      ];

  const features = isTurkish
    ? [
        'Harita üzerinde anı bırakma ve keşif',
        'Before/After zaman karşılaştırması',
        'Yorum ve topluluk etkileşimi',
        'PWA kurulum ve çok cihaz desteği',
        'Çevrimdışı anı kaydetme ve senkronizasyon',
      ]
    : [
        'Drop and discover memories on a world map',
        'Before/after time comparison',
        'Comments and community interaction',
        'PWA install with cross-device support',
        'Offline memory saving and sync',
      ];

  return (
    <CaseStudyLayout
      routePath="/case-study/mnemosyne"
      title="Mnemosyne"
      subtitle={
        isTurkish
          ? 'Konum bazlı bir hafıza ağı. Dünyanın herhangi bir noktasına fotoğraf bırakın, o konumdaki anıları keşfedin, zaman içinde mekanların dönüşümünü görün.'
          : 'A location-based memory network. Drop photos on real-world places, discover moments left by others, and observe how locations evolve over time.'
      }
      liveUrl="https://m-nemosyne.live"
      heroImage="https://image.thum.io/get/width/1600/https://m-nemosyne.live"
      currentId="mnemosyne"
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
                  ? 'İnsanlar anılarını sosyal medyada kaybediyor; zamanla gönderiler gömülüyor. Mekanların dönüşümü görsel olarak belgelenmiyor ve topluluk odaklı anı paylaşımı eksik.'
                  : 'People lose their memories on social media; posts get buried over time. The transformation of places is not visually documented, and community-driven memory sharing is lacking.'}
              </p>
            </div>
            <div>
              <h2 className="text-h3 text-sand-900 dark:text-zinc-50 mb-4">
                {isTurkish ? 'Çözüm' : 'Solution'}
              </h2>
              <p className="text-body text-sand-700 dark:text-zinc-300">
                {isTurkish
                  ? 'Konum bazlı bir hafıza ağı oluşturdum. Kullanıcılar haritaya tıklayarak anı bırakıyor, aynı noktadaki farklı yılları karşılaştırabiliyor ve toplulukla etkileşime geçebiliyor. PWA olarak çalışıyor.'
                  : 'Built a location-based memory network. Users drop memories by clicking on the map, compare different years at the same spot, and interact with the community. Works as a PWA.'}
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
                  {isTurkish ? 'PWA First Yaklaşımı' : 'PWA First Approach'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? 'Uygulamayı PWA olarak tasarladım. Service Workers ile asset önbellekleme, IndexedDB ile veri persistency sağladım. Kullanıcılar ana ekrana ekleyebiliyor.'
                    : 'Designed the app as a PWA first. Used Service Workers for asset caching and IndexedDB for data persistence. Users can add it to their home screen.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-600 dark:text-accent-400 font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-sand-900 dark:text-zinc-100 mb-1">
                  {isTurkish ? 'Virtualized Time Layers' : 'Virtualized Time Layers'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? "Aynı konumdaki yüzlerce anıyı virtualized list ile render ettim. Sadece viewport içindeki öğeler DOM'a ekleniyor, bu da performansı artırıyor."
                    : 'Rendered hundreds of memories at the same location using a virtualized list. Only viewport items are added to the DOM, improving performance.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-600 dark:text-accent-400 font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-sand-900 dark:text-zinc-100 mb-1">
                  {isTurkish ? 'Background Sync' : 'Background Sync'}
                </h4>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">
                  {isTurkish
                    ? 'Kullanıcı çevrimdışıyken anı kaydedebiliyor. Bağlantı geri geldiğinde Background Sync API ile otomatik senkronizasyon gerçekleşiyor.'
                    : 'Users can save memories while offline. When connectivity returns, the Background Sync API handles automatic synchronization.'}
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
              ? 'Mnemosyne, konum bazlı anı paylaşımı konusunda benzersiz bir deneyim sunuyor. PWA olarak tasarlanması sayesinde kullanıcılar anında erişebiliyor ve offline çalışabiliyor. Time Layers özelliği ile mekanların dönüşümü görsel olarak belgeleniyor.'
              : 'Mnemosyne offers a unique experience in location-based memory sharing. Designed as a PWA, users can access it instantly and work offline. The Time Layers feature visually documents the transformation of places.'}
          </p>
          <div className="flex flex-wrap gap-2">
            {['Lighthouse 95+', 'PWA Installable', 'Offline First', 'Cross-Device'].map((tag) => (
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

export default MnemosyneCaseStudy;
