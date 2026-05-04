import React from 'react';
import { HiChartBar, HiSparkles, HiAcademicCap, HiChip, HiClock } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import FadeContent from '../components/FadeContent';
import SpotlightCard from '../components/SpotlightCard';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';

const DataSciencePage = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();

  const learningFocus = isTurkish
    ? [
        {
          icon: <HiChartBar className="h-6 w-6" />,
          title: 'Veri Analizi Temelleri',
          desc: 'Pandas ve NumPy ile veri temizleme, keşifsel analiz ve temel görselleştirme üzerine çalışıyorum.',
        },
        {
          icon: <HiSparkles className="h-6 w-6" />,
          title: 'Makine Öğrenmesi',
          desc: 'Model kurma, özellik mühendisliği ve değerlendirme metriklerini pratik örneklerle öğreniyorum.',
        },
        {
          icon: <HiChip className="h-6 w-6" />,
          title: 'Derin Öğrenme',
          desc: 'Yapay sinir ağları, eğitim süreçleri ve temel mimariler üzerinde düzenli olarak denemeler yapıyorum.',
        },
      ]
    : [
        {
          icon: <HiChartBar className="h-6 w-6" />,
          title: 'Data Analysis Fundamentals',
          desc: 'I am practicing with Pandas, NumPy, and core data visualization tools.',
        },
        {
          icon: <HiSparkles className="h-6 w-6" />,
          title: 'Machine Learning',
          desc: 'I am learning model logic, feature engineering, and evaluation metrics.',
        },
        {
          icon: <HiChip className="h-6 w-6" />,
          title: 'Deep Learning',
          desc: 'I am studying neural network basics, training workflows, and practical architectures.',
        },
      ];

  const upcoming = isTurkish
    ? [
        'EDA: Açık veri seti üzerinde keşifsel analiz',
        'Sınıflandırma: Scikit-learn ile baseline model',
        'Regresyon: Özellik mühendisliği denemeleri',
        'Görüntü Sınıflandırma: CNN ile küçük ölçekli proje',
      ]
    : [
        'EDA: exploratory analysis on an open dataset',
        'Classification: scikit-learn baseline model',
        'Regression: feature engineering experiments',
        'Image Classification: small-scale CNN project',
      ];

  return (
    <SpecialtyPageLayout
      routePath="/data-science"
      accent="zinc"
      eyebrow={isTurkish ? 'Veri Bilimi ve Derin Öğrenme' : 'Data Science & Deep Learning'}
      eyebrowIcon={<HiAcademicCap className="h-4 w-4" />}
      title={isTurkish ? 'Veri Bilimi Yolculuğundayım' : 'Data Science Learning Journey'}
      subtitle={
        isTurkish
          ? 'Bu alanda henüz yayınlanmış bir projem yok. Şu anda temel konuları sistemli biçimde öğreniyor, küçük deneyler yapıyor ve öğrendiklerimi notlandırıyorum. Hazır oldukça burada gerçek projeler paylaşacağım.'
          : 'I do not have a published project in this area yet. I am currently building strong fundamentals, running small experiments, and documenting what I learn. I will share real projects here as they become ready.'
      }
    >
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-raised p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-3 border-b border-sand-200/70 pb-4 dark:border-zinc-800/70">
            <h2 className="text-h3 text-sand-900 dark:text-zinc-50">
              {isTurkish ? 'Şu Anki Durum' : 'Current Status'}
            </h2>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
              {isTurkish ? 'Aktif Öğrenme' : 'Active Learning'}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {learningFocus.map((item) => (
              <SpotlightCard
                key={item.title}
                className="card-flat h-full p-5"
                spotlightColor={isDark ? 'rgba(249, 115, 22, 0.15)' : 'rgba(240, 125, 45, 0.10)'}
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent-500/20 bg-accent-500/10 text-accent-600 dark:text-accent-400">
                  {item.icon}
                </div>
                <h3 className="text-h4 text-sand-900 dark:text-zinc-50 mb-2">{item.title}</h3>
                <p className="text-body-sm text-sand-700 dark:text-zinc-300">{item.desc}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </FadeContent>

      <FadeContent duration={700} blur threshold={0.1} delay={150}>
        <div className="card-raised mt-6 p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <HiClock className="h-5 w-5 text-accent-600 dark:text-accent-400" />
            <h2 className="text-h3 text-sand-900 dark:text-zinc-50">
              {isTurkish ? 'Yakında Gelecek' : 'Coming Up'}
            </h2>
          </div>
          <p className="mb-4 text-body-sm text-sand-700 dark:text-zinc-300">
            {isTurkish
              ? 'Şu konularda mini projeler hazırlamayı planlıyorum:'
              : 'Mini projects I plan to ship around these topics:'}
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {upcoming.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-xl border border-sand-200/60 bg-sand-100/40 px-3 py-2 text-sm text-sand-700 dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:text-zinc-300"
              >
                <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </FadeContent>
    </SpecialtyPageLayout>
  );
};

export default DataSciencePage;
