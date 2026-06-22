import { motion, useReducedMotion } from 'framer-motion';
import { HiAcademicCap, HiChartBar, HiChip, HiClock, HiSparkles } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';
import Reveal from '../components/ui/Reveal';

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

const SkillMeter = ({ pct, levelLabel, reduce, delay = 0 }) => (
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
      aria-label={levelLabel}
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

  const learningFocus = isTurkish
    ? [
        {
          icon: <HiChartBar className="h-5 w-5" />,
          title: 'Veri analizi',
          desc: 'Pandas, NumPy, temizleme, keşifsel analiz ve görselleştirme temelleri.',
          pct: 55,
          level: 'Gelişiyor',
        },
        {
          icon: <HiSparkles className="h-5 w-5" />,
          title: 'Makine öğrenmesi',
          desc: 'Baseline model kurma, özellik mühendisliği ve değerlendirme metrikleri.',
          pct: 40,
          level: 'Temel',
        },
        {
          icon: <HiChip className="h-5 w-5" />,
          title: 'Derin öğrenme',
          desc: 'Sinir ağı temelleri, eğitim akışı ve küçük ölçekli deneyler.',
          pct: 25,
          level: 'Başlangıç',
        },
      ]
    : [
        {
          icon: <HiChartBar className="h-5 w-5" />,
          title: 'Data analysis',
          desc: 'Pandas, NumPy, cleaning, exploratory analysis, and visualization basics.',
          pct: 55,
          level: 'Developing',
        },
        {
          icon: <HiSparkles className="h-5 w-5" />,
          title: 'Machine learning',
          desc: 'Baseline models, feature engineering, and evaluation metrics.',
          pct: 40,
          level: 'Foundations',
        },
        {
          icon: <HiChip className="h-5 w-5" />,
          title: 'Deep learning',
          desc: 'Neural network basics, training flow, and small-scale experiments.',
          pct: 25,
          level: 'Early',
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
      eyebrow={isTurkish ? 'AI ve veri bilimi' : 'AI & Data Science'}
      eyebrowIcon={<HiAcademicCap className="h-4 w-4" />}
      title={isTurkish ? 'Temeli güçlendirdiğim alan' : 'A field where I am building fundamentals'}
      subtitle={
        isTurkish
          ? 'Bu alanda henüz yayınladığım büyük bir ürün yok. Şu anda öğrenme notları, küçük deneyler ve temel projelerle ilerliyorum.'
          : 'I do not have a major published product in this area yet. I am currently progressing through notes, small experiments, and fundamentals-first projects.'
      }
      sideNode={
        <figure className="card w-full p-5">
          <LearningCurveChart reduce={reduce} isTurkish={isTurkish} />
          <figcaption className="mt-2 text-center text-[11px] text-muted">
            {isTurkish ? 'şekil 1 — öğrenme eğrisi' : 'fig. 1 — the learning curve'}
          </figcaption>
        </figure>
      }
    >
      <Reveal className="card mb-6 p-6 sm:p-8">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="eyebrow mb-2 text-accent">{isTurkish ? 'Durum' : 'Status'}</p>
            <h2 className="text-h2 text-fg">
              {isTurkish ? 'Aktif öğrenme, abartısız vitrin.' : 'Active learning, honest presentation.'}
            </h2>
          </div>
          <span className="self-start rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            {isTurkish ? 'Yolculuk aşaması' : 'Learning stage'}
          </span>
        </div>
        <p className="text-body text-muted">
          {isTurkish
            ? 'Buradaki amaç, hazır olmadığım bir alanı olduğundan büyük göstermek değil. Temel kavramları sistemli çalışıp, sonuçları okunabilir küçük projelerle paylaşmak.'
            : 'The goal here is not to overstate a field I am still building. I am studying core concepts systematically and will share results through small, readable projects.'}
        </p>
      </Reveal>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {learningFocus.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.08} className="h-full">
            <div className="card card-hover h-full p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface2 text-accent">
                {item.icon}
              </div>
              <h3 className="mb-2 text-h4 text-fg">{item.title}</h3>
              <p className="mb-4 text-body-sm text-muted">{item.desc}</p>
              <SkillMeter pct={item.pct} levelLabel={item.level} reduce={reduce} delay={0.2 + index * 0.12} />
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="card p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <HiClock className="h-5 w-5 text-accent" />
          <h2 className="text-h3 text-fg">{isTurkish ? 'Sıradaki küçük çıktılar' : 'Next small outputs'}</h2>
        </div>
        <ul className="grid gap-2">
          {nextSteps.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-xl border border-line/10 bg-surface2 px-4 py-3"
            >
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              <span className="text-sm font-medium text-fg">{item}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </SpecialtyPageLayout>
  );
};

export default DataSciencePage;
