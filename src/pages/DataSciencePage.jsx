import React from 'react';
import { motion } from 'framer-motion';
import { HiAcademicCap, HiChartBar, HiChip, HiClock, HiSparkles } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import SitePreview from '../components/SitePreview';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';

const DataSciencePage = () => {
  const { isTurkish } = useLanguage();

  const learningFocus = isTurkish
    ? [
        {
          icon: <HiChartBar className="h-5 w-5" />,
          title: 'Veri analizi',
          desc: 'Pandas, NumPy, temizleme, keşifsel analiz ve görselleştirme temelleri.',
        },
        {
          icon: <HiSparkles className="h-5 w-5" />,
          title: 'Makine öğrenmesi',
          desc: 'Baseline model kurma, özellik mühendisliği ve değerlendirme metrikleri.',
        },
        {
          icon: <HiChip className="h-5 w-5" />,
          title: 'Derin öğrenme',
          desc: 'Sinir ağı temelleri, eğitim akışı ve küçük ölçekli deneyler.',
        },
      ]
    : [
        {
          icon: <HiChartBar className="h-5 w-5" />,
          title: 'Data analysis',
          desc: 'Pandas, NumPy, cleaning, exploratory analysis, and visualization basics.',
        },
        {
          icon: <HiSparkles className="h-5 w-5" />,
          title: 'Machine learning',
          desc: 'Baseline models, feature engineering, and evaluation metrics.',
        },
        {
          icon: <HiChip className="h-5 w-5" />,
          title: 'Deep learning',
          desc: 'Neural network basics, training flow, and small-scale experiments.',
        },
      ];

  const nextSteps = isTurkish
    ? [
        'Açık veri setiyle EDA notu',
        'Scikit-learn baseline sınıflandırma',
        'Küçük CNN görüntü sınıflandırma deneyi',
        'Model sonuçlarını okunur rapora çevirme',
      ]
    : [
        'EDA note on an open dataset',
        'Scikit-learn baseline classification',
        'Small CNN image-classification experiment',
        'Turn model results into readable reports',
      ];

  return (
    <SpecialtyPageLayout
      routePath="/data-science"
      accent="zinc"
      eyebrow={isTurkish ? 'AI ve veri bilimi' : 'AI & Data Science'}
      eyebrowIcon={<HiAcademicCap className="h-4 w-4" />}
      title={isTurkish ? 'Temeli güçlendirdiğim alan' : 'A field where I am building fundamentals'}
      subtitle={
        isTurkish
          ? 'Bu alanda henüz yayınladığım büyük bir ürün yok. Şu anda öğrenme notları, küçük deneyler ve temel projelerle ilerliyorum.'
          : 'I do not have a major published product in this area yet. I am currently progressing through notes, small experiments, and fundamentals-first projects.'
      }
      sideNode={<SitePreview title="AI notes system" variant="web" expandable={false} showActions={false} />}
    >
      <div className="grid gap-5">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55 }}
          className="card-prominent p-6 sm:p-8"
        >
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <p className="mb-2 text-caption text-cyan-700 dark:text-cyan-200">
                {isTurkish ? 'Durum' : 'Status'}
              </p>
              <h2 className="text-h2 text-ink-900 dark:text-white">
                {isTurkish ? 'Aktif öğrenme, abartısız vitrin.' : 'Active learning, honest presentation.'}
              </h2>
            </div>
            <span className="rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700 dark:border-amber-300/25 dark:bg-amber-300/10 dark:text-amber-200">
              {isTurkish ? 'Yolculuk aşaması' : 'Learning stage'}
            </span>
          </div>
          <p className="text-body text-ink-600 dark:text-ink-200">
            {isTurkish
              ? 'Buradaki amaç, hazır olmadığım bir alanı olduğundan büyük göstermek değil. Temel kavramları sistemli çalışıp, sonuçları okunabilir küçük projelerle paylaşmak.'
              : 'The goal here is not to overstate a field I am still building. I am studying core concepts systematically and will share results through small, readable projects.'}
          </p>
        </motion.article>

        <div className="grid gap-4 md:grid-cols-3">
          {learningFocus.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="card-raised p-5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/50 bg-cyan-50 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
                {item.icon}
              </div>
              <h3 className="mb-2 text-h4 text-ink-900 dark:text-white">{item.title}</h3>
              <p className="text-body-sm text-ink-600 dark:text-ink-200">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55 }}
          className="card-raised p-6 sm:p-8"
        >
          <div className="mb-4 flex items-center gap-2">
            <HiClock className="h-5 w-5 text-cyan-700 dark:text-cyan-200" />
            <h2 className="text-h3 text-ink-900 dark:text-white">
              {isTurkish ? 'Sıradaki küçük çıktılar' : 'Next small outputs'}
            </h2>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {nextSteps.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-lg border border-ink-200/70 bg-white/50 px-3 py-2 text-sm font-semibold text-ink-600 dark:border-white/10 dark:bg-white/10 dark:text-ink-200"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.article>
      </div>
    </SpecialtyPageLayout>
  );
};

export default DataSciencePage;
