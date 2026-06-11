import React, { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowDown, HiArrowRight, HiBookOpen, HiExternalLink, HiGlobe } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import PageMeta from '../components/PageMeta';
import PageBackButton from '../components/ui/PageBackButton';

const EASE = [0.22, 1, 0.36, 1];

const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: 0.4 },
  },
};

const MARQUEE_ITEMS = [
  'React',
  'Vite',
  'PWA',
  'Framer Motion',
  'Tailwind CSS',
  'TypeScript',
  'Performance',
  'A11y',
  'SEO',
  'Web Vitals',
];

/* ----------------------------- Hero headline ----------------------------- */

const heroWordVariants = {
  hidden: { y: '115%', opacity: 0, skewY: 7 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    skewY: 0,
    transition: { delay: 0.22 + i * 0.08, duration: 0.8, ease: EASE },
  }),
};

const HeroTitle = ({ lines, label }) => {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <h1 className="text-display tracking-tight text-ink-900 dark:text-white">
        {lines.map((line, li) => (
          <span key={line} className={`block ${li === 1 ? 'gradient-text lg:pl-20' : ''}`}>
            {line}
          </span>
        ))}
      </h1>
    );
  }

  const lineOffsets = lines.map((_, li) =>
    lines.slice(0, li).reduce((sum, line) => sum + line.split(' ').length, 0),
  );

  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      aria-label={label}
      className="text-display tracking-tight text-ink-900 dark:text-white"
    >
      {lines.map((line, li) => (
        <span key={line} className={`block ${li === 1 ? 'lg:pl-20' : ''}`}>
          {line.split(' ').map((word, wi) => {
            const i = lineOffsets[li] + wi;
            return (
              <React.Fragment key={`${word}-${wi}`}>
                <span
                  aria-hidden="true"
                  className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-baseline"
                >
                  <motion.span
                    custom={i}
                    variants={heroWordVariants}
                    className={`inline-block will-change-transform ${li === 1 ? 'gradient-text' : ''}`}
                  >
                    {word}
                  </motion.span>
                </span>
                {wi < line.split(' ').length - 1 ? ' ' : ''}
              </React.Fragment>
            );
          })}
        </span>
      ))}
    </motion.h1>
  );
};

/* ----------------------------- Marquee ribbon ---------------------------- */

const MarqueeRow = ({ hidden }) => (
  <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-7 pr-7 sm:gap-10 sm:pr-10">
    {MARQUEE_ITEMS.map((item, i) => (
      <span key={item} className="flex items-center gap-7 sm:gap-10">
        <span className="text-caption whitespace-nowrap text-ink-600 dark:text-ink-200">{item}</span>
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${i % 2 === 0 ? 'bg-cyan-400' : 'bg-violet-400'}`}
        />
      </span>
    ))}
  </div>
);

const MarqueeRibbon = () => {
  const reduce = useReducedMotion();

  return (
    <div className="border-y border-ink-200/60 bg-white/40 py-4 dark:border-white/10 dark:bg-white/[0.04]">
      {reduce ? (
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 px-4">
          {MARQUEE_ITEMS.map((item) => (
            <span key={item} className="text-caption text-ink-600 dark:text-ink-200">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden">
          <motion.div
            className="flex w-max will-change-transform"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
          >
            <MarqueeRow />
            <MarqueeRow hidden />
          </motion.div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------ Browser frame ---------------------------- */

const frameTiltVariants = (flip) => ({
  rest: { rotateX: 0, rotateY: 0, y: 0 },
  hover: {
    rotateX: 2,
    rotateY: flip ? 2.4 : -2.4,
    y: -6,
    transition: { type: 'spring', stiffness: 170, damping: 18 },
  },
});

const imgPanVariants = {
  rest: { y: '0%', transition: { duration: 1.1, ease: EASE } },
  hover: { y: '-11%', transition: { duration: 1.6, ease: EASE } },
};

const BrowserFrame = ({ title, url, src, alt, flip }) => {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const host = url.replace(/^https?:\/\//, '');

  return (
    <motion.div
      variants={reduce ? undefined : frameTiltVariants(flip)}
      initial="rest"
      animate="rest"
      whileHover={reduce ? undefined : 'hover'}
      style={{ transformPerspective: 1100 }}
      className="overflow-hidden rounded-2xl border border-ink-200/70 bg-white/80 shadow-elevation backdrop-blur-xl dark:border-white/10 dark:bg-ink-800/80"
    >
      <div className="flex items-center gap-3 border-b border-ink-200/60 px-4 py-2.5 dark:border-white/10">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="lab-mono flex-1 truncate rounded-md border border-ink-200/60 bg-ink-100/60 px-3 py-1 text-[11px] text-ink-600 dark:border-white/10 dark:bg-white/5 dark:text-ink-200">
          {host}
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/10">
        {failed ? (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-h3 gradient-text">{title}</span>
          </div>
        ) : (
          <motion.img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            variants={reduce ? undefined : imgPanVariants}
            className="absolute inset-x-0 top-0 h-[115%] w-full object-cover object-top will-change-transform"
          />
        )}
      </div>
    </motion.div>
  );
};

/* ------------------------------- Case rail ------------------------------- */

const RailNumeral = ({ progress, index, total, label, reduce }) => {
  const start = index / total;
  const opacity = useTransform(progress, [start, start + 0.14], [0.3, 1]);
  const x = useTransform(progress, [start, start + 0.14], [0, 6]);

  return (
    <motion.div style={reduce ? undefined : { opacity, x }}>
      <span className="lab-mono block text-sm font-bold text-ink-900 dark:text-white">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="lab-mono block text-[10px] uppercase tracking-[0.2em] text-ink-500 dark:text-ink-300">
        {label}
      </span>
    </motion.div>
  );
};

const CaseRail = ({ progress, items, reduce }) => {
  const fill = useSpring(progress, { stiffness: 90, damping: 24, mass: 0.4 });

  return (
    <div className="hidden lg:block" aria-hidden="true">
      <div className="sticky top-28 flex h-[68vh] gap-5">
        <div className="relative w-px overflow-hidden rounded-full bg-ink-900/10 dark:bg-white/10">
          <motion.div
            className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-violet-500 via-cyan-400 to-cyan-300"
            style={{ scaleY: reduce ? 1 : fill }}
          />
        </div>
        <div className="flex flex-col justify-between py-1">
          {items.map((label, i) => (
            <RailNumeral
              key={label}
              progress={progress}
              index={i}
              total={items.length}
              label={label}
              reduce={reduce}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ Case panel ------------------------------- */

const CasePanel = ({ project, index, isTurkish }) => {
  const reduce = useReducedMotion();
  const flip = index % 2 === 1;

  const panelVariants = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.05 } },
      }
    : {
        hidden: { clipPath: 'inset(16% 5% 16% 5%)', y: 64, opacity: 0 },
        visible: {
          clipPath: 'inset(0% 0% 0% 0%)',
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.9,
            ease: EASE,
            when: 'beforeChildren',
            staggerChildren: 0.08,
            delayChildren: 0.1,
          },
        },
      };

  const childVariants = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      };

  return (
    <motion.article
      id={`case-${project.id}`}
      variants={panelVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="relative scroll-mt-32"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-10 select-none text-[5.5rem] font-extrabold leading-none text-ink-900/[0.06] dark:text-white/[0.06] sm:-top-16 sm:text-[9rem] lg:-top-20 lg:text-[12rem] ${
          flip ? 'left-0' : 'right-0'
        }`}
        style={{ fontFamily: "'Syne', 'Bricolage Grotesque', system-ui, sans-serif" }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="relative grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
        <motion.div variants={childVariants} className={`lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
          <BrowserFrame
            title={project.title}
            url={project.url}
            src={project.snapshotSrc}
            alt={
              isTurkish
                ? `${project.title} canlı site ekran görüntüsü`
                : `${project.title} live site screenshot`
            }
            flip={flip}
          />
        </motion.div>

        <div className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
          <motion.p variants={childVariants} className="mb-3 text-caption text-cyan-700 dark:text-cyan-300">
            Case {String(index + 1).padStart(2, '0')}
          </motion.p>
          <motion.h2 variants={childVariants} className="mb-3 text-h2 text-ink-900 dark:text-white">
            {project.title}
          </motion.h2>
          <motion.p variants={childVariants} className="mb-4 text-body-sm text-ink-600 dark:text-ink-200">
            {project.description}
          </motion.p>
          <motion.p
            variants={childVariants}
            className="mb-4 border-l-2 border-violet-400/70 pl-4 text-sm font-semibold leading-relaxed text-ink-700 dark:border-cyan-300/50 dark:text-ink-100"
          >
            {project.decision}
          </motion.p>
          <motion.div variants={childVariants} className="mb-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-ink-200/70 bg-white/50 px-2.5 py-1 text-xs font-bold text-ink-600 dark:border-white/10 dark:bg-white/10 dark:text-ink-200"
              >
                {tag}
              </span>
            ))}
          </motion.div>
          <motion.div variants={childVariants} className="flex flex-wrap gap-3">
            <Link to={project.caseStudyPath} className="btn-primary min-h-[44px] px-4 py-2 text-xs">
              <HiBookOpen className="h-4 w-4" />
              Case Study
            </Link>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary min-h-[44px] px-4 py-2 text-xs"
            >
              <HiExternalLink className="h-4 w-4" />
              {isTurkish ? 'Canlı aç' : 'Open live'}
            </a>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

/* ---------------------------- Magnetic button ---------------------------- */

const MagneticLink = ({ href, children, className = '' }) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 260, damping: 20, mass: 0.5 });
  const y = useSpring(0, { stiffness: 260, damping: 20, mass: 0.5 });

  const handleMove = (e) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * 14);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * 10);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={reduce ? undefined : { x, y }}
      className={className}
    >
      {children}
    </motion.a>
  );
};

/* --------------------------------- Page ---------------------------------- */

const WebDevPage = () => {
  const { isTurkish } = useLanguage();
  const reduce = useReducedMotion();
  const projectsRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: projectsRef,
    offset: ['start 0.75', 'end 0.55'],
  });

  const projects = [
    {
      id: 'mnemosyne',
      caseStudyPath: '/case-study/mnemosyne',
      title: 'Mnemosyne',
      url: 'https://m-nemosyne.live',
      snapshotSrc: '/previews/mnemosyne-live.png',
      description: isTurkish
        ? 'Konumlara bırakılan anılar fikrini, harita ve zaman katmanlarıyla çalışan canlı web deneyimine dönüştürdüm.'
        : 'Turned location-based memories into a live web experience built around maps and time layers.',
      tags: [
        'React',
        'PWA',
        isTurkish ? 'Konum' : 'Location',
        isTurkish ? 'Zaman katmanları' : 'Time layers',
      ],
      decision: isTurkish
        ? 'Odak: anı paylaşımını klasik galeri yerine mekan ve zaman bağlamıyla okutmak.'
        : 'Focus: make memory sharing readable through place and time, not a plain gallery.',
    },
    {
      id: 'typesprint',
      caseStudyPath: '/case-study/typesprint',
      title: 'TypeSprint',
      url: 'https://typesprint.online',
      snapshotSrc: '/previews/typesprint-live.png',
      description: isTurkish
        ? 'Yazma hızı ölçümünü doğruluk, ritim ve çok dilli kelime havuzu üzerinden kurgulayan WPM uygulaması.'
        : 'A WPM app designed around accuracy, rhythm, and multilingual word pools.',
      tags: ['JavaScript', 'WPM', isTurkish ? 'Çok dilli' : 'Multilingual', 'Leaderboard'],
      decision: isTurkish
        ? 'Odak: yanlış girişte akışı durdurarak ölçümü daha dürüst hale getirmek.'
        : 'Focus: make measurement more honest by stopping progress on wrong input.',
    },
  ];

  const heroLines = isTurkish ? ['Canlı web', 'ürünleri'] : ['Live web', 'products'];
  const heroLabel = isTurkish ? 'Canlı web ürünleri' : 'Live web products';

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen overflow-hidden"
    >
      <PageMeta route="/web" />
      <PageBackButton />

      {/* Hero — asymmetric editorial split */}
      <section className="relative px-4 pb-14 pt-28 sm:pt-32 lg:pb-20 lg:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-12%] top-[6%] -z-10 h-[36vh] w-[36vh] rounded-full bg-gradient-to-br from-violet-500/15 to-cyan-400/15 blur-3xl"
        />
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="lab-kicker mb-6"
              >
                <HiGlobe className="h-4 w-4" />
                {isTurkish ? 'Web geliştirme' : 'Web development'}
              </motion.span>

              <HeroTitle lines={heroLines} label={heroLabel} />

              <motion.span
                aria-hidden="true"
                initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
                className="mt-5 block h-[3px] w-44 origin-left rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 sm:w-64 lg:ml-20"
              />

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-6 max-w-xl text-body-lg text-ink-600 dark:text-ink-200"
              >
                {isTurkish
                  ? 'React, Vite ve ürün odaklı arayüz kararlarıyla geliştirdiğim web projeleri.'
                  : 'Web projects built with React, Vite, and product-minded interface decisions.'}
              </motion.p>
            </div>

            <motion.nav
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
              aria-label={isTurkish ? 'Proje dizini' : 'Project index'}
              className="lg:mb-2 lg:text-right"
            >
              <p className="mb-3 text-caption text-ink-500 dark:text-ink-300">
                {isTurkish ? 'Dizin' : 'Index'}
              </p>
              <ul className="space-y-2">
                {projects.map((project, i) => (
                  <li key={project.id}>
                    <a
                      href={`#case-${project.id}`}
                      className="group inline-flex items-center gap-3 rounded-md text-sm font-bold text-ink-700 transition-colors hover:text-violet-600 dark:text-ink-100 dark:hover:text-cyan-300"
                    >
                      <span className="lab-mono text-xs text-ink-400 dark:text-ink-400">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {project.title}
                      <HiArrowDown className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </div>
        </div>
      </section>

      {/* Tech keyword ribbon */}
      <MarqueeRibbon />

      {/* Case panels with sticky progress rail */}
      <section ref={projectsRef} className="px-4 pb-24 pt-20 sm:pt-24 lg:pt-32">
        <div className="mx-auto w-full max-w-6xl lg:grid lg:grid-cols-[96px_minmax(0,1fr)] lg:gap-10">
          <CaseRail progress={scrollYProgress} items={projects.map((p) => p.title)} reduce={reduce} />
          <div className="space-y-24 sm:space-y-32 lg:space-y-40">
            {projects.map((project, index) => (
              <CasePanel key={project.id} project={project} index={index} isTurkish={isTurkish} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA strip */}
      <section className="px-4 pb-24">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="card-prominent relative mx-auto w-full max-w-6xl overflow-hidden p-8 sm:p-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/15 to-cyan-400/15 blur-3xl"
          />
          <p className="mb-3 text-caption text-violet-700 dark:text-cyan-300">
            {isTurkish ? 'Sıradaki' : 'Next up'}
          </p>
          <h2 className="mb-6 max-w-2xl text-h2 text-ink-900 dark:text-white">
            {isTurkish
              ? 'Tüm sistem, tasarım kararları ve kaynak: mertsoylu.dev'
              : 'The full system, design decisions, and source: mertsoylu.dev'}
          </h2>
          <div className="flex flex-wrap gap-3">
            <MagneticLink href="https://mertsoylu.dev" className="btn-primary">
              <HiExternalLink className="h-4 w-4" />
              mertsoylu.dev
            </MagneticLink>
            <Link to="/" className="btn-secondary">
              <HiArrowRight className="h-4 w-4" />
              {isTurkish ? 'Ana sayfaya dön' : 'Back to home'}
            </Link>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default WebDevPage;
