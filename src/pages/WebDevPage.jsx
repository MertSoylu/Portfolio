import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiExternalLink, HiGlobe } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import SitePreview from '../components/SitePreview';
import GlareHover from '../components/GlareHover';
import FadeContent from '../components/FadeContent';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';

const WebDevPage = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const projects = [
    {
      id: 'mnemosyne',
      title: 'Mnemosyne',
      url: 'https://m-nemosyne.live',
      previewImage: 'https://image.thum.io/get/width/1600/https://m-nemosyne.live',
      gradient: 'from-zinc-700 to-zinc-900',
      accentLight: 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20',
      accentDark: 'dark:text-zinc-300',
      description: isTurkish
        ? 'Mnemosyne, konum bazlı bir hafıza ağıdır. Dünyanın herhangi bir noktasına fotoğraf bırakabilir, o konumdaki anıları keşfedebilir ve zaman içinde mekanların nasıl değiştiğini görebilirsiniz.'
        : 'Mnemosyne is a location-based memory network where you can drop photos on real-world places, discover moments left by others, and observe how locations evolve over time.',
      longDesc: isTurkish
        ? 'Platform; harita üzerinde fotoğraf bırakma, aynı noktadaki farklı yılları karşılaştırma (before/after), topluluk etkileşimi ve PWA deneyimi gibi güçlü özellikler sunuyor. Özellikle "Time Layers" yaklaşımıyla bir mekanın geçmişten bugüne dönüşümünü tek bir akışta anlatabilmesi, projeyi klasik galeri uygulamalarından ayırıyor.'
        : 'The platform combines map-based photo drops, before/after comparison from the same spot, community interaction, and a PWA experience. Its "Time Layers" approach is the standout: instead of being a simple gallery, it tells how places transform across time through user-generated memories.',
      tags: [
        'PWA',
        isTurkish ? 'Konum Bazlı' : 'Location Based',
        isTurkish ? 'Zaman Katmanları' : 'Time Layers',
        isTurkish ? 'Topluluk' : 'Community',
      ],
      features: isTurkish
        ? [
            'Harita üzerinde anı bırakma',
            'Before/After zaman karşılaştırması',
            'Yorum ve keşif akışı',
            'PWA kurulum ve çok cihaz desteği',
          ]
        : [
            'Drop memories on a world map',
            'Before/after time comparison',
            'Comments and discovery feed',
            'PWA install with cross-device support',
          ],
    },
    {
      id: 'typesprint',
      title: 'TypeSprint',
      url: 'https://typesprint.online',
      gradient: 'from-zinc-700 to-black',
      accentLight: 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20',
      accentDark: 'dark:text-zinc-300',
      description: isTurkish
        ? 'TypeSprint, gerçek zamanlı çalışan modern bir yazma hızı (WPM) testi uygulamasıdır. Akıcı bir arayüze ve birden fazla dil seçeneğine sahiptir. Yanlış tuşa bastığınızda ilerlemenizi durdurarak, her zaman en doğru ve ölçülebilir sonuçları almanızı sağlar.'
        : 'TypeSprint is a modern typing speed (WPM) test application featuring real-time validation, a smooth interface, and multiple language options. It halts your progress if you press the wrong key, ensuring that your results are always highly accurate and measurable.',
      longDesc: isTurkish
        ? 'İçerisinde Türkçe dahil farklı dillerin kelime havuzunu barındıran kapsamlı bir projedir. Günlük, haftalık ve tüm zamanların skor tabloları rekabet ortamı yaratırken, hile önleme sistemi adil bir test deneyimi sunar. İster telefondan ister bilgisayardan hızınızı ölçebilir ve sonuçlarınızı arkadaşlarınızla karşılaştırabilirsiniz.'
        : 'A comprehensive platform featuring word pools in multiple languages, including Turkish. Daily, weekly, and all-time leaderboards encourage competition, while the anti-cheat system ensures a fair testing experience. You can measure your speed from any device and easily compare your scores with friends.',
      tags: [
        'JavaScript',
        'HTML/CSS',
        isTurkish ? 'Skor Tablosu' : 'Leaderboard',
        isTurkish ? 'Çok Dilli' : 'Multilingual',
      ],
      features: isTurkish
        ? [
            'Gerçek zamanlı harf doğrulama',
            'Çok dilli kelime havuzları',
            'Skor tabloları ve sayfalama',
            'Hile önleme sistemi',
          ]
        : [
            'Real-time letter validation',
            'Multilingual word pools',
            'Leaderboards with pagination',
            'Anti-cheat system',
          ],
    },
    {
      id: 'dert-haritasi',
      title: isTurkish ? 'Dert Haritası' : 'Dert Haritası (Complaint Map)',
      url: 'https://dert-haritasi.vercel.app',
      gradient: 'from-emerald-500 to-teal-600',
      accentLight: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
      accentDark: 'dark:text-emerald-300',
      description: isTurkish
        ? 'BİZ Topluluğu için hazırladığım Dert Haritası, herkesin yaşadığı şehirle ilgili sorunları kolayca dile getirebildiği interaktif bir platformdur. Amacı, kentsel sorunları daha görünür hale getirmek ve topluluk odaklı çözümler üretilmesine yardımcı olmaktır.'
        : 'Dert Haritası (Complaint Map) is an interactive platform I developed for the BİZ Community, allowing anyone to easily voice issues regarding their city. Its goal is to make urban problems more visible and encourage community-driven solutions.',
      longDesc: isTurkish
        ? '"Şehrinin sesi ol!" sloganıyla hareket eden bu platform; altyapıdan ulaşıma, çevre sorunlarından eğitime kadar birçok farklı alanda şikayetleri bir araya getiriyor. Harita üzerinden istediğiniz şehre tıklayarak o bölgenin sorunlarını ve genel istatistiklerini doğrudan inceleyebilirsiniz.'
        : 'Guided by the motto "Be the voice of your city!", this platform gathers complaints across various fields—from infrastructure and transportation to the environment and education. By simply clicking on a city on the map, you can directly explore that area\'s reported issues and overall statistics.',
      tags: [
        'React',
        'Vercel',
        isTurkish ? 'İnteraktif Harita' : 'Interactive Map',
        isTurkish ? 'Topluluk' : 'Community',
      ],
      features: isTurkish
        ? [
            'İnteraktif Türkiye haritası',
            'Kategori bazlı şikayet sistemi',
            'Şehir istatistikleri',
            'BİZ Topluluğu entegrasyon',
          ]
        : [
            'Interactive Turkey map',
            'Category-based complaint system',
            'City statistics',
            'BİZ Community integration',
          ],
    },
  ];

  return (
    <SpecialtyPageLayout
      routePath="/web"
      accent="zinc"
      eyebrow={isTurkish ? 'Web Geliştirme' : 'Web Development'}
      eyebrowIcon={<HiGlobe className="w-4 h-4" />}
      title={isTurkish ? 'Web Projelerim' : 'Web Projects'}
      subtitle={
        isTurkish
          ? 'React, JavaScript ve modern web teknolojileri kullanarak kullanıcı odaklı, performanslı ve estetik web uygulamaları geliştiriyorum.'
          : 'I build user-focused, performant, and aesthetically pleasing web applications using React, JavaScript, and modern web technologies.'
      }
    >
      <div className="space-y-6">
        {projects.map((project, index) => (
          <FadeContent key={project.id} duration={700} delay={index * 150} blur threshold={0.1}>
            <GlareHover
              width="100%"
              height="auto"
              background="transparent"
              borderRadius="16px"
              borderColor={isDark ? 'rgba(63,63,70,0.5)' : 'rgba(212,196,175,0.4)'}
              glareColor={isDark ? '#ff9a5c' : '#f07d2d'}
              glareOpacity={0.12}
              glareSize={300}
              transitionDuration={800}
              className="!grid !place-items-stretch"
            >
              <div className="card-raised w-full p-6 sm:p-8">
                <div className="space-y-4">
                  <div
                    className={`hidden sm:block rounded-xl overflow-hidden bg-gradient-to-r ${project.gradient} p-0.5`}
                  >
                    <div className="rounded-[10px] overflow-hidden bg-white dark:bg-zinc-900">
                      {project.previewImage ? (
                        <div
                          className="relative w-full overflow-hidden bg-sand-100 dark:bg-zinc-900"
                          style={{ aspectRatio: '16 / 9' }}
                        >
                          <img
                            src={project.previewImage}
                            alt={`${project.title} preview`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <SitePreview
                          url={project.url}
                          type="web"
                          title={project.title}
                          gradient={project.gradient}
                          expandable={false}
                          showActions={false}
                        />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-h4 text-sand-900 dark:text-zinc-50 leading-tight">
                          {project.title}
                        </h2>
                        <p className="text-caption text-sand-600 dark:text-zinc-400 mt-1">
                          {project.url.replace('https://', '')}
                        </p>
                      </div>

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

                    <p className="text-body-sm text-sand-700 dark:text-zinc-300 mb-3 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2.5 py-1 text-xs font-medium rounded-full border ${project.accentLight} ${project.accentDark}`}
                        >
                          {tag}
                        </span>
                      ))}
                      {project.features.map((feat) => (
                        <span
                          key={feat}
                          className="px-2.5 py-1 text-xs font-medium rounded-full border border-sand-200 dark:border-zinc-700 text-sand-700 dark:text-zinc-400"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => toggleExpanded(project.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-sand-600 dark:text-zinc-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors"
                    >
                      <motion.span
                        animate={{ rotate: expandedIds.has(project.id) ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-block"
                      >
                        ▸
                      </motion.span>
                      {expandedIds.has(project.id)
                        ? isTurkish
                          ? 'Kapat'
                          : 'Close'
                        : isTurkish
                          ? 'Daha fazla oku'
                          : 'Read more'}
                    </button>
                  </div>
                </div>

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
                      <p className="mt-4 pt-4 border-t border-sand-200/60 dark:border-zinc-800/60 text-body-sm text-sand-700 dark:text-zinc-300">
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
    </SpecialtyPageLayout>
  );
};

export default WebDevPage;
