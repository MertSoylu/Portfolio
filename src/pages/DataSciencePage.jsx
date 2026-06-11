import { motion, useReducedMotion } from 'framer-motion';
import { HiAcademicCap, HiChartBar, HiChip, HiClock, HiSparkles } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import PageMeta from '../components/PageMeta';
import PageBackButton from '../components/ui/PageBackButton';
import KineticHeadline from '../components/motion/KineticHeadline';

const EASE = [0.22, 1, 0.36, 1];

const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.4 } },
};

/* ---------------------------------------------------------------- */
/* Ambient math glyphs — slow drifting symbols behind the notebook   */
/* ---------------------------------------------------------------- */

const AMBIENT_GLYPHS = [
  { char: 'Σ', top: '8%', left: '4%', size: 'text-6xl', duration: 14, delay: 0 },
  { char: 'μ', top: '22%', right: '6%', size: 'text-5xl', duration: 17, delay: 1.2 },
  { char: 'σ', top: '48%', left: '2%', size: 'text-7xl', duration: 19, delay: 0.6 },
  { char: '∇', top: '64%', right: '3%', size: 'text-6xl', duration: 15, delay: 2 },
  { char: 'π', top: '84%', left: '8%', size: 'text-5xl', duration: 16, delay: 0.3 },
  { char: 'λ', top: '38%', right: '14%', size: 'text-4xl', duration: 21, delay: 1.6 },
];

const AmbientGlyphs = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    {AMBIENT_GLYPHS.map((glyph) => (
      <motion.span
        key={glyph.char}
        className={`absolute select-none font-mono font-bold text-cyan-700/[0.06] dark:text-cyan-200/[0.07] ${glyph.size}`}
        style={{ top: glyph.top, left: glyph.left, right: glyph.right }}
        animate={{ y: [0, -26, 0], x: [0, 12, 0], rotate: [0, 7, 0] }}
        transition={{
          duration: glyph.duration,
          delay: glyph.delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {glyph.char}
      </motion.span>
    ))}
  </div>
);

/* ---------------------------------------------------------------- */
/* NotebookCell — gutter label + body that "executes" on scroll       */
/* ---------------------------------------------------------------- */

const NotebookCell = ({ label, reduce, delay = 0, plain = false, children, bodyClassName = '' }) => {
  const cellVariants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      ...(reduce ? {} : { y: 0 }),
      transition: { duration: 0.6, ease: EASE, delay },
    },
  };

  /* Shimmer rides the parent's whileInView variants — its own observer would
     never fire because the translated strip is fully clipped by overflow-hidden. */
  const shimmerVariants = {
    hidden: { x: '-130%' },
    visible: { x: '460%', transition: { duration: 1, ease: 'easeInOut', delay: delay + 0.15 } },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={cellVariants}
      viewport={{ once: true, margin: '-60px' }}
      className="grid gap-2 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-4"
    >
      <div className="hidden pt-6 text-right sm:block" aria-hidden="true">
        <span className="font-mono text-xs font-bold tracking-tight text-cyan-700/80 dark:text-cyan-200/70">
          {label}
        </span>
      </div>
      <div
        className={`relative ${
          plain
            ? ''
            : 'overflow-hidden rounded-2xl border border-ink-200/70 bg-white/70 shadow-soft backdrop-blur-xl transition-colors duration-300 hover:border-cyan-400/60 focus-within:border-cyan-400/60 dark:border-white/10 dark:bg-ink-800/75 dark:hover:border-cyan-300/40'
        } ${bodyClassName}`}
      >
        {!reduce && !plain && (
          <motion.span
            aria-hidden="true"
            variants={shimmerVariants}
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/4 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent dark:via-cyan-300/10"
          />
        )}
        {children}
      </div>
    </motion.section>
  );
};

/* ---------------------------------------------------------------- */
/* LearningCurveChart — SVG line chart that draws itself on view      */
/* ---------------------------------------------------------------- */

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
    className="h-auto w-full text-cyan-600 dark:text-cyan-300"
  >
    <defs>
      <linearGradient id="ds-curve-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
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
        className="text-cyan-500 dark:text-cyan-200"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 360, damping: 18, delay: 0.35 + i * 0.22 }}
      />
    ))}

    <text
      x="310"
      y="199"
      textAnchor="end"
      className="font-mono"
      fontSize="9"
      fill="currentColor"
      fillOpacity="0.55"
    >
      {isTurkish ? 'zaman →' : 'time →'}
    </text>
    <text x="10" y="14" className="font-mono" fontSize="9" fill="currentColor" fillOpacity="0.55">
      {isTurkish ? '↑ kavrayış' : '↑ understanding'}
    </text>
  </svg>
);

/* ---------------------------------------------------------------- */
/* SkillMeter — honest percentage bar with spring fill                */
/* ---------------------------------------------------------------- */

const SkillMeter = ({ pct, levelLabel, reduce, delay = 0 }) => (
  <div>
    <div className="mb-1.5 flex items-baseline justify-between">
      <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink-500 dark:text-ink-300">
        {levelLabel}
      </span>
      <span className="font-mono text-xs font-extrabold text-cyan-700 dark:text-cyan-200">{pct}%</span>
    </div>
    <div
      className="h-2 overflow-hidden rounded-full bg-ink-200/60 dark:bg-white/10"
      role="meter"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={levelLabel}
    >
      <motion.div
        className="h-full origin-left rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-cyan-400 dark:to-cyan-200"
        style={{ width: `${pct}%` }}
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ type: 'spring', stiffness: 55, damping: 15, delay }}
      />
    </div>
  </div>
);

/* ---------------------------------------------------------------- */
/* QueueRow — next-step checklist row with morphing bullet            */
/* ---------------------------------------------------------------- */

const QueueRow = ({ item, index, reduce }) => (
  <motion.li
    initial={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, ease: EASE, delay: index * 0.1 }}
    whileHover="hover"
    className="group flex items-center gap-3 rounded-lg border border-ink-200/70 bg-white/50 px-3 py-2.5 transition-colors hover:border-cyan-400/50 dark:border-white/10 dark:bg-white/10 dark:hover:border-cyan-300/35"
  >
    <span
      aria-hidden="true"
      className="hidden w-14 shrink-0 font-mono text-[11px] font-bold text-cyan-700/70 dark:text-cyan-200/60 sm:block"
    >
      {`In [${index + 4}]`}
    </span>
    <motion.span
      aria-hidden="true"
      variants={{
        hover: {
          scale: 1.6,
          rotate: 45,
          borderRadius: '3px',
          transition: { type: 'spring', stiffness: 380, damping: 14 },
        },
      }}
      className="h-2 w-2 shrink-0 rounded-full bg-cyan-500 transition-colors group-hover:bg-amber-500 dark:bg-cyan-300 dark:group-hover:bg-amber-400"
    />
    <span className="text-sm font-semibold text-ink-600 dark:text-ink-200">{item}</span>
  </motion.li>
);

/* ---------------------------------------------------------------- */
/* Page                                                               */
/* ---------------------------------------------------------------- */

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
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen overflow-hidden px-4 pb-16 pt-24 sm:pb-20"
    >
      <PageMeta route="/data-science" />
      <PageBackButton />
      {!reduce && <AmbientGlyphs />}

      <div className="relative mx-auto w-full max-w-5xl">
        {/* ---------- Hero cell — In [1] ---------- */}
        <NotebookCell label="In [1]:" reduce={reduce} bodyClassName="mb-5 p-6 sm:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mb-4 inline-flex items-center gap-2 rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-4 py-1.5 text-caption text-cyan-700 dark:text-cyan-200 sm:mb-6"
              >
                <HiAcademicCap className="h-4 w-4" />
                {isTurkish ? 'AI ve veri bilimi' : 'AI & Data Science'}
              </motion.span>

              <KineticHeadline
                as="h1"
                text={isTurkish ? 'Temeli güçlendirdiğim alan' : 'A field where I am building fundamentals'}
                className="mb-4 text-h1 text-ink-900 dark:text-white sm:mb-6"
              />

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="max-w-2xl text-body-lg text-ink-600 dark:text-ink-200"
              >
                {isTurkish
                  ? 'Bu alanda henüz yayınladığım büyük bir ürün yok. Şu anda öğrenme notları, küçük deneyler ve temel projelerle ilerliyorum.'
                  : 'I do not have a major published product in this area yet. I am currently progressing through notes, small experiments, and fundamentals-first projects.'}
              </motion.p>
            </div>

            <motion.figure
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="mx-auto w-full max-w-sm rounded-xl border border-ink-200/60 bg-white/40 p-4 dark:border-white/10 dark:bg-white/5 lg:mx-0"
            >
              <LearningCurveChart reduce={reduce} isTurkish={isTurkish} />
              <figcaption className="mt-2 text-center font-mono text-[11px] text-ink-500 dark:text-ink-300">
                {isTurkish ? 'şekil 1 — öğrenme eğrisi' : 'fig. 1 — the learning curve'}
              </figcaption>
            </motion.figure>
          </div>
        </NotebookCell>

        {/* ---------- Status cell — Out [1] ---------- */}
        <NotebookCell label="Out [1]:" reduce={reduce} bodyClassName="mb-5 p-6 sm:p-8">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <p className="mb-2 text-caption text-cyan-700 dark:text-cyan-200">
                {isTurkish ? 'Durum' : 'Status'}
              </p>
              <h2 className="text-h2 text-ink-900 dark:text-white">
                {isTurkish ? 'Aktif öğrenme, abartısız vitrin.' : 'Active learning, honest presentation.'}
              </h2>
            </div>
            <motion.span
              animate={reduce ? undefined : { opacity: [1, 0.7, 1], scale: [1, 1.04, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="self-start rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700 dark:border-amber-300/25 dark:bg-amber-300/10 dark:text-amber-200"
            >
              {isTurkish ? 'Yolculuk aşaması' : 'Learning stage'}
            </motion.span>
          </div>
          <p className="text-body text-ink-600 dark:text-ink-200">
            {isTurkish
              ? 'Buradaki amaç, hazır olmadığım bir alanı olduğundan büyük göstermek değil. Temel kavramları sistemli çalışıp, sonuçları okunabilir küçük projelerle paylaşmak.'
              : 'The goal here is not to overstate a field I am still building. I am studying core concepts systematically and will share results through small, readable projects.'}
          </p>
        </NotebookCell>

        {/* ---------- Learning focus — In [2] ---------- */}
        <NotebookCell label="In [2]:" reduce={reduce} delay={0.05} plain bodyClassName="mb-5">
          <h2 className="sr-only">{isTurkish ? 'Öğrenme odakları' : 'Learning focus'}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {learningFocus.map((item, index) => (
              <motion.div
                key={item.title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: EASE, delay: index * 0.1 }}
                whileHover={
                  reduce
                    ? undefined
                    : {
                        y: -6,
                        rotate: index % 2 === 0 ? -0.7 : 0.7,
                        transition: { type: 'spring', stiffness: 280, damping: 18 },
                      }
                }
                className="card-raised p-5 transition-colors hover:border-cyan-400/50 dark:hover:border-cyan-300/35"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/50 bg-cyan-50 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
                  {item.icon}
                </div>
                <h3 className="mb-2 text-h4 text-ink-900 dark:text-white">{item.title}</h3>
                <p className="mb-4 text-body-sm text-ink-600 dark:text-ink-200">{item.desc}</p>
                <SkillMeter
                  pct={item.pct}
                  levelLabel={item.level}
                  reduce={reduce}
                  delay={0.2 + index * 0.12}
                />
              </motion.div>
            ))}
          </div>
        </NotebookCell>

        {/* ---------- Next steps queue — In [3] ---------- */}
        <NotebookCell label="In [3]:" reduce={reduce} delay={0.05} bodyClassName="p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <HiClock className="h-5 w-5 text-cyan-700 dark:text-cyan-200" />
            <h2 className="text-h3 text-ink-900 dark:text-white">
              {isTurkish ? 'Sıradaki küçük çıktılar' : 'Next small outputs'}
            </h2>
          </div>
          <ul className="grid gap-2">
            {nextSteps.map((item, index) => (
              <QueueRow key={item} item={item} index={index} reduce={reduce} />
            ))}
          </ul>
        </NotebookCell>
      </div>
    </motion.div>
  );
};

export default DataSciencePage;
