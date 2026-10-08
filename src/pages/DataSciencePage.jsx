import { motion, useReducedMotion } from 'framer-motion';
import { HiAcademicCap, HiChartBar, HiChip, HiSparkles } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';
import Reveal from '../components/ui/Reveal';
import { pick } from '../data/projects';

const EASE = [0.22, 1, 0.36, 1];

const CURVE_PATH =
  'M 10 168 C 40 160, 52 152, 78 146 C 104 140, 112 152, 134 144 C 162 134, 168 112, 196 104 C 224 96, 234 90, 258 72 C 280 56, 296 48, 310 40';
const AREA_PATH = `${CURVE_PATH} L 310 188 L 10 188 Z`;
const DATA_POINTS = [
  [10, 168],
  [78, 146],
  [134, 144],
  [196, 104],
  [258, 72],
  [310, 40],
];

// Öğrenme alanları; yüzdeler mevcut sayfadaki kendi değerlendirmemi temsil eder.
const LEARNING_AREAS = [
  {
    icon: HiChartBar,
    title: { tr: 'Veri analizi', en: 'Data analysis' },
    desc: {
      tr: 'Pandas ve NumPy ile veri temizleme, keşifsel analiz ve görselleştirme.',
      en: 'Cleaning, exploratory analysis and visualization with Pandas and NumPy.',
    },
    pct: 55,
    level: { tr: 'Gelişiyor', en: 'Developing' },
  },
  {
    icon: HiSparkles,
    title: { tr: 'Makine öğrenmesi', en: 'Machine learning' },
    desc: {
      tr: 'Baseline model kurma, özellik mühendisliği ve değerlendirme metrikleri.',
      en: 'Baseline models, feature engineering and evaluation metrics.',
    },
    pct: 40,
    level: { tr: 'Temel', en: 'Foundations' },
  },
  {
    icon: HiChip,
    title: { tr: 'Derin öğrenme', en: 'Deep learning' },
    desc: {
      tr: 'Sinir ağı temelleri, eğitim akışı ve küçük ölçekli deneyler.',
      en: 'Neural network basics, the training loop and small-scale experiments.',
    },
    pct: 25,
    level: { tr: 'Başlangıç', en: 'Early' },
  },
];

const NEXT_OUTPUTS = [
  {
    tr: 'Açık bir veri seti üzerinde EDA notu',
    en: 'An EDA note on an open dataset',
  },
  {
    tr: 'Scikit-learn ile baseline sınıflandırma modeli',
    en: 'A baseline classification model with Scikit-learn',
  },
  {
    tr: 'Küçük bir CNN ile görüntü sınıflandırma denemesi',
    en: 'A small CNN image-classification experiment',
  },
  {
    tr: 'Model sonuçlarını okunabilir bir rapora dönüştürmek',
    en: 'Turning model results into a readable report',
  },
];

// Öğrenme eğrisi şeklinin SVG çizimi; yalnızca dekoratif değil, ekran okuyucuya da açıklanır.
const LearningCurveChart = ({ reduce, isTurkish }) => (
  <svg
    viewBox="0 0 320 200"
    role="img"
    aria-label={
      isTurkish ? 'Zamanla yükselen öğrenme eğrisi grafiği' : 'Chart of a learning curve rising over time'
    }
    className="h-auto w-full text-accent"
  >
    <defs>
      <linearGradient id="ds-curve-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </linearGradient>
    </defs>

    {[58, 102, 146].map((y) => (
      <line
        key={y}
        x1="10"
        x2="310"
        y1={y}
        y2={y}
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1"
        strokeDasharray="3 5"
      />
    ))}
    <line x1="10" x2="310" y1="188" y2="188" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />

    <motion.path
      d={AREA_PATH}
      fill="url(#ds-curve-fill)"
      initial={reduce ? false : { opacity: 0 }}
      whileInView={reduce ? undefined : { opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 1.1 }}
    />
    <motion.path
      d={CURVE_PATH}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      initial={reduce ? false : { pathLength: 0 }}
      whileInView={reduce ? undefined : { pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
    />
    {DATA_POINTS.map(([cx, cy], i) => (
      <motion.circle
        key={`${cx}-${cy}`}
        cx={cx}
        cy={cy}
        r="4"
        fill="currentColor"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 360, damping: 18, delay: 0.35 + i * 0.22 }}
      />
    ))}
    <text x="310" y="199" textAnchor="end" fontSize="9" fill="currentColor" fillOpacity="0.55">
      {isTurkish ? 'zaman →' : 'time →'}
    </text>
    <text x="10" y="14" fontSize="9" fill="currentColor" fillOpacity="0.55">
      {isTurkish ? '↑ kavrayış' : '↑ understanding'}
    </text>
  </svg>
);

// `label` ekran okuyucuya alanın adını ve seviyeyi birlikte okutur; `levelLabel` görünen metindir.
const SkillMeter = ({ pct, levelLabel, label, reduce, delay = 0 }) => (
  <div>
    <div className="mb-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{levelLabel}</span>
    </div>
    <div
      className="h-2 overflow-hidden rounded-full bg-surface2"
      role="meter"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <motion.div
        className="h-full origin-left rounded-full bg-accent"
        style={{ width: `${pct}%` }}
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ type: 'spring', stiffness: 55, damping: 15, delay }}
      />
    </div>
  </div>
);

const DataSciencePage = () => {
  const { isTurkish } = useLanguage();
  const reduce = useReducedMotion();
  const t = (value) => pick(value, isTurkish);

  return (
    <SpecialtyPageLayout
      routePath="/data-science"
      eyebrow={t({ tr: 'Yapay zeka ve veri bilimi', en: 'AI & Data Science' })}
      eyebrowIcon={<HiAcademicCap className="h-4 w-4" aria-hidden="true" />}
      title={t({ tr: 'Temelini attığım alan', en: 'A field where I am building fundamentals' })}
      subtitle={t({
        tr: 'Bu alanda henüz yayınladığım büyük bir ürün yok. Şu an öğrenme notları, küçük deneyler ve temel projelerle ilerliyorum.',
        en: 'I do not have a major published product in this area yet. For now I am progressing through study notes, small experiments and fundamentals-first projects.',
      })}
      sideNode={
        <figure className="card w-full p-5">
          <LearningCurveChart reduce={reduce} isTurkish={isTurkish} />
          <figcaption className="mt-2 text-center text-[11px] text-muted">
            {t({ tr: 'şekil 1 — öğrenme eğrisi', en: 'fig. 1 — the learning curve' })}
          </figcaption>
        </figure>
      }
    >
      <section aria-labelledby="status-heading">
        <Reveal className="card-prominent p-6 sm:p-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow mb-2 text-accent">{t({ tr: 'Durum', en: 'Status' })}</p>
              <h2 id="status-heading" className="text-h2 text-fg">
                {t({ tr: 'Aktif öğrenme, abartısız vitrin.', en: 'Active learning, honest presentation.' })}
              </h2>
            </div>
            <span className="self-start rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {t({ tr: 'Yolculuk aşaması', en: 'Learning stage' })}
            </span>
          </div>
          <p className="max-w-3xl text-body-lg text-muted">
            {t({
              tr: 'Amacım bu alanı olduğundan büyük göstermek değil. Temel kavramları düzenli biçimde çalışıyor ve öğrendiklerimi okunabilir, küçük projelerle paylaşıyorum.',
              en: 'The goal is not to make this field look bigger than it is. I study the core concepts consistently and share what I learn through small, readable projects.',
            })}
          </p>
        </Reveal>
      </section>

      <section aria-labelledby="learning-areas-heading" className="mt-16 sm:mt-24">
        <Reveal as="h2" id="learning-areas-heading" className="mb-8 text-h2 text-fg">
          {t({ tr: 'Öğrenme alanları', en: 'Learning areas' })}
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {LEARNING_AREAS.map((area, index) => {
            const Icon = area.icon;
            const title = t(area.title);
            const level = t(area.level);
            return (
              <Reveal key={area.title.en} delay={index * 0.08} className="h-full">
                <div className="card card-hover flex h-full flex-col p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface2 text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-h4 text-fg">{title}</h3>
                  <p className="mb-6 text-body-sm text-muted">{t(area.desc)}</p>
                  <div className="mt-auto">
                    <SkillMeter
                      pct={area.pct}
                      levelLabel={level}
                      label={`${title}: ${level}`}
                      reduce={reduce}
                      delay={0.2 + index * 0.12}
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="next-outputs-heading" className="mt-16 sm:mt-24">
        <Reveal as="h2" id="next-outputs-heading" className="mb-8 text-h2 text-fg">
          {t({ tr: 'Sıradaki küçük çıktılar', en: 'Next small outputs' })}
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="grid gap-2 md:grid-cols-2">
            {NEXT_OUTPUTS.map((item, index) => (
              <li
                key={item.en}
                className="flex items-center gap-4 rounded-xl border border-line/10 bg-surface2 px-4 py-3.5"
              >
                <span className="font-display text-sm font-semibold text-accent" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-medium text-fg">{t(item)}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>
    </SpecialtyPageLayout>
  );
};

export default DataSciencePage;
