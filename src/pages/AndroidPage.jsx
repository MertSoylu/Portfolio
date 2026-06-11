import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { HiBookOpen, HiDeviceMobile, HiExternalLink, HiHeart, HiTrendingUp } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import PageMeta from '../components/PageMeta';
import PageBackButton from '../components/ui/PageBackButton';

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.mert.paticat';
const EASE = [0.22, 1, 0.36, 1];

const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.4 } },
};

/* Headline words rise out of clipped line masks, staggered. */
const MaskedHeadline = ({ text, className = '' }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        {text}
      </motion.h1>
    );
  }

  return (
    <h1 className={className} aria-label={text}>
      {text.split(' ').map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: '115%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.75, delay: 0.25 + index * 0.07, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>{' '}
        </React.Fragment>
      ))}
    </h1>
  );
};

/* Faint dashed orbit rings, slowly counter-rotating. Decorative only. */
const OrbitRings = ({ prefersReducedMotion }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex"
  >
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute h-[620px] w-[620px] text-emerald-600/30 dark:text-emerald-300/25"
      animate={prefersReducedMotion ? undefined : { rotate: 360 }}
      transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
    >
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.25"
        strokeDasharray="1 3"
      />
    </motion.svg>
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute h-[440px] w-[440px] text-emerald-600/40 dark:text-emerald-300/30"
      animate={prefersReducedMotion ? undefined : { rotate: -360 }}
      transition={{ duration: 64, repeat: Infinity, ease: 'linear' }}
    >
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.3"
        strokeDasharray="0.5 4"
      />
    </motion.svg>
  </div>
);

/* The centerpiece: CSS phone frame with the real screenshot, idle float + scroll tilt. */
const OrbitPhone = ({ scrollYProgress, prefersReducedMotion, isTurkish }) => {
  const rotateX = useTransform(scrollYProgress, [0, 1], [7, -7]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  return (
    <div className="relative z-10 mx-auto w-[240px] sm:w-[280px]" style={{ perspective: 1200 }}>
      {/* Emerald halo */}
      <div
        aria-hidden="true"
        className="absolute -inset-14 -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.32)_0%,rgba(16,185,129,0.10)_45%,transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.30)_0%,rgba(52,211,153,0.08)_45%,transparent_70%)]"
      />
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="will-change-transform"
      >
        <motion.div
          style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="rounded-[40px] border border-white/10 bg-ink-900 p-2.5 shadow-elevation ring-1 ring-emerald-500/20 dark:bg-black"
        >
          <div className="relative aspect-[9/19] overflow-hidden rounded-[30px] bg-ink-800">
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black/90"
            />
            <img
              src="/previews/walkkittie.png"
              alt={isTurkish ? 'WalkKittie uygulama ekranı' : 'WalkKittie app screen'}
              className="h-full w-full object-cover object-top"
              fetchPriority="high"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-inset ring-white/10"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* Feature card orbiting the phone — own parallax speed + own idle float rhythm. */
const OrbitCard = ({ feature, index, scrollYProgress, prefersReducedMotion }) => {
  const depth = [34, -26, 48][index % 3];
  const parallaxY = useTransform(scrollYProgress, [0, 1], [depth, -depth]);

  const positions = [
    'lg:absolute lg:left-0 lg:top-[10%] lg:w-64',
    'lg:absolute lg:right-0 lg:top-[34%] lg:w-64',
    'lg:absolute lg:bottom-[6%] lg:left-[6%] lg:w-64',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: EASE }}
      style={prefersReducedMotion ? undefined : { y: parallaxY }}
      className={`z-20 ${positions[index % 3]}`}
    >
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5 + index * 1.3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.9 }}
        className="card-raised p-5 will-change-transform"
      >
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-300/50 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200">
          {feature.icon}
        </div>
        <h3 className="mb-2 text-h4 text-ink-900 dark:text-white">{feature.title}</h3>
        <p className="text-body-sm text-ink-600 dark:text-ink-200">{feature.desc}</p>
      </motion.div>
    </motion.div>
  );
};

/* Count-up number that animates once when scrolled into view. */
const StatNumber = ({ value, suffix = '', inView, prefersReducedMotion }) => {
  const [display, setDisplay] = useState(prefersReducedMotion ? value : 0);

  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReducedMotion) {
      setDisplay(value);
      return undefined;
    }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, prefersReducedMotion]);

  return (
    <span className="font-display text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 sm:text-4xl">
      {display}
      {suffix}
    </span>
  );
};

const StatsStrip = ({ isTurkish, prefersReducedMotion }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const stats = isTurkish
    ? [
        { value: 1, label: 'sanal kedi', sub: 'adımlarınla beslenen bakım döngüsü' },
        { value: 3, label: 'günlük döngü', sub: 'adım, su tüketimi, kedi bakımı' },
        { value: 100, suffix: '%', label: 'native Kotlin', sub: 'Jetpack Compose + Material 3' },
        { value: 1, label: 'mağaza yayını', sub: 'Google Play’de canlı' },
      ]
    : [
        { value: 1, label: 'virtual cat', sub: 'a care loop fed by your steps' },
        { value: 3, label: 'daily loops', sub: 'steps, water intake, cat care' },
        { value: 100, suffix: '%', label: 'native Kotlin', sub: 'Jetpack Compose + Material 3' },
        { value: 1, label: 'store release', sub: 'live on Google Play' },
      ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: EASE }}
      className="card-flat grid grid-cols-2 gap-x-4 gap-y-8 px-6 py-8 lg:grid-cols-4"
    >
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="mb-1">
            <StatNumber
              value={stat.value}
              suffix={stat.suffix}
              inView={inView}
              prefersReducedMotion={prefersReducedMotion}
            />
          </p>
          <p className="text-caption text-ink-900 dark:text-white">{stat.label}</p>
          <p className="mt-1 text-xs text-ink-500 dark:text-ink-300">{stat.sub}</p>
        </div>
      ))}
    </motion.div>
  );
};

const AndroidPage = () => {
  const { isTurkish } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'end start'] });

  const features = isTurkish
    ? [
        {
          icon: <HiTrendingUp className="h-5 w-5" />,
          title: 'Adım takibi',
          desc: 'Günlük hareketi uygulama içinde takip edilebilir hale getirir.',
        },
        {
          icon: <HiHeart className="h-5 w-5" />,
          title: 'Sanal kedi',
          desc: 'Adımları oyun motivasyonuna bağlayan bakım sistemi.',
        },
        {
          icon: <HiDeviceMobile className="h-5 w-5" />,
          title: 'Native Android',
          desc: 'Kotlin, Jetpack Compose ve Material 3 ile yayınlandı.',
        },
      ]
    : [
        {
          icon: <HiTrendingUp className="h-5 w-5" />,
          title: 'Step tracking',
          desc: 'Turns daily movement into visible in-app progress.',
        },
        {
          icon: <HiHeart className="h-5 w-5" />,
          title: 'Virtual cat',
          desc: 'Connects walking behavior to a pet-care motivation loop.',
        },
        {
          icon: <HiDeviceMobile className="h-5 w-5" />,
          title: 'Native Android',
          desc: 'Published with Kotlin, Jetpack Compose, and Material 3.',
        },
      ];

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-ink-900';

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen overflow-hidden px-4 pb-16 pt-24 sm:pb-20"
    >
      <PageMeta route="/android" />
      <PageBackButton />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* ORBIT hero — text first, then the product takes center stage */}
        <header className="mb-12 max-w-3xl md:mb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-4 inline-flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-caption text-emerald-700 dark:text-emerald-200 sm:mb-6"
          >
            <HiDeviceMobile className="h-4 w-4" />
            {isTurkish ? 'Android geliştirme' : 'Android development'}
          </motion.span>

          <MaskedHeadline
            text={isTurkish ? 'Google Play’de yayınlanan mobil iş' : 'Published mobile work on Google Play'}
            className="mb-4 text-h1 text-ink-900 dark:text-white sm:mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="max-w-2xl text-body-lg text-ink-600 dark:text-ink-200"
          >
            {isTurkish
              ? 'WalkKittie, sağlık takibini oyunlaştıran native Android ürünüm. Odak; sade akış, motivasyon ve günlük kullanım.'
              : 'WalkKittie is my native Android product that gamifies health tracking. Focus: simple flow, motivation, and daily use.'}
          </motion.p>
        </header>

        {/* Orbit stage — phone in the middle, feature cards in orbit on desktop */}
        <section
          ref={stageRef}
          aria-label={isTurkish ? 'WalkKittie öne çıkanlar' : 'WalkKittie highlights'}
          className="relative mb-12 lg:mb-16 lg:flex lg:min-h-[680px] lg:items-center lg:justify-center"
        >
          <OrbitRings prefersReducedMotion={prefersReducedMotion} />
          <OrbitPhone
            scrollYProgress={scrollYProgress}
            prefersReducedMotion={prefersReducedMotion}
            isTurkish={isTurkish}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:contents">
            {features.map((feature, index) => (
              <OrbitCard
                key={feature.title}
                feature={feature}
                index={index}
                scrollYProgress={scrollYProgress}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </section>

        {/* Honest, playful numbers from the product itself */}
        <div className="mb-12 lg:mb-16">
          <StatsStrip isTurkish={isTurkish} prefersReducedMotion={prefersReducedMotion} />
        </div>

        {/* Story block */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: EASE }}
          className="card-prominent p-6 sm:p-8"
        >
          <p className="mb-2 text-caption text-emerald-700 dark:text-emerald-200">WalkKittie</p>
          <h2 className="mb-4 text-h2 text-ink-900 dark:text-white">
            {isTurkish ? 'Yürü, puan kazan, kedine bak.' : 'Walk, earn points, care for your cat.'}
          </h2>
          <p className="mb-5 max-w-3xl text-body text-ink-600 dark:text-ink-200">
            {isTurkish
              ? 'Uygulama adım takibi, su tüketimi, sanal evcil hayvan bakımı ve küçük oyun akışlarını tek bir günlük rutin içinde birleştiriyor. Amacı sağlık uygulamasını soğuk bir sayaç olmaktan çıkarıp daha sıcak bir motivasyon sistemine çevirmek.'
              : 'The app combines step tracking, water intake, virtual pet care, and small game flows into one daily routine. Its goal is to make health tracking feel less mechanical and more motivating.'}
          </p>
          <div className="mb-6 flex flex-wrap gap-2">
            {['Kotlin', 'Jetpack Compose', 'Material 3', 'Google Play'].map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-ink-200/70 bg-white/50 px-2.5 py-1 text-xs font-bold text-ink-600 dark:border-white/10 dark:bg-white/10 dark:text-ink-200"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="relative inline-flex">
              {!prefersReducedMotion && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl border-2 border-emerald-400/70"
                  animate={{ scale: [1, 1.16, 1.16], opacity: [0.7, 0, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <a
                href={PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/60 bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevation ${focusRing}`}
              >
                <HiExternalLink className="h-4 w-4" />
                Google Play
              </a>
            </span>
            <Link to="/case-study/walkkittie" className={`btn-secondary ${focusRing}`}>
              <HiBookOpen className="h-4 w-4" />
              Case Study
            </Link>
          </div>
        </motion.article>
      </div>
    </motion.div>
  );
};

export default AndroidPage;
