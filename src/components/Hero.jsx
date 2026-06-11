import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { HiArrowRight, HiChip, HiCode, HiDownload, HiShieldCheck } from 'react-icons/hi';
import { HiDevicePhoneMobile } from 'react-icons/hi2';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import { fetchGitHubRepos } from '../utils/githubApi';
import { CV_LABEL, CV_PATH, HERO_ROLES } from '../utils/constants';
import { MorphingRoles } from './SplitFlapText';
import TextPressure from './TextPressure';
import MorphBlob from './motion/MorphBlob';
import { useMagnetic } from '../hooks/useMagnetic';

const ZoneCard = ({ icon, title, link, detail, index, delay }) => {
  const reduce = useReducedMotion();
  const cardRef = useRef(null);

  // pointer-tracked 3D tilt
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 150, damping: 18 });
  const springY = useSpring(rotY, { stiffness: 150, damping: 18 });

  // spotlight follow position (%)
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(170px circle at ${glowX}% ${glowY}%, rgba(124,92,255,0.22), rgba(39,224,196,0.12) 45%, transparent 70%)`;

  const handlePointerMove = (event) => {
    if (reduce) return;
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotY.set((px - 0.5) * 12);
    rotX.set(-(py - 0.5) * 12);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const handlePointerLeave = () => {
    rotX.set(0);
    rotY.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  return (
    <Link to={link} className="block h-full [perspective:900px]">
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX: springX, rotateY: springY, transformPerspective: 900 }}
        className="group relative h-full min-h-[120px] overflow-hidden rounded-2xl border border-ink-200/70 bg-white/65 p-3 shadow-soft backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-white/8 sm:min-h-[150px] sm:p-4"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, rotateX: -14 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={reduce ? undefined : { y: -8 }}
      >
        {/* spotlight that follows the pointer */}
        <motion.span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />
        {/* top accent bar grows on hover */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-violet-500 via-aqua-300 to-ember-400 transition-transform duration-500 group-hover:scale-x-100" />
        {/* lab index */}
        <span className="lab-mono pointer-events-none absolute right-3 top-2.5 text-[10px] font-bold tracking-[0.2em] text-ink-300 transition-colors group-hover:text-violet-500 dark:text-white/30 dark:group-hover:text-aqua-200">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="relative z-10 flex h-full flex-col [transform:translateZ(28px)]">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200/70 bg-white/70 text-violet-600 transition-all duration-500 group-hover:-rotate-6 group-hover:border-violet-300 group-hover:text-violet-700 dark:border-white/10 dark:bg-white/10 dark:text-aqua-200 dark:group-hover:border-aqua-300/50 sm:mb-4 sm:h-11 sm:w-11">
            {icon}
          </div>
          <h3 className="text-base font-extrabold leading-snug text-ink-900 dark:text-white sm:text-h4">
            {title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[11px] font-semibold leading-relaxed text-ink-500 dark:text-ink-300 sm:mt-2 sm:text-xs">
            {detail}
          </p>
          <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-700 dark:text-aqua-200 sm:pt-4 sm:text-xs">
            Open <HiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

const Hero = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.94]);

  const [repoCount, setRepoCount] = useState(null);
  const [isCompactHero, setIsCompactHero] = useState(false);

  useEffect(() => {
    fetchGitHubRepos()
      .then((repos) => setRepoCount(repos.length))
      .catch((error) => {
        console.warn('Hero repo count fetch failed:', error);
        setRepoCount(null);
      });
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');
    const handleChange = (event) => setIsCompactHero(event.matches);

    setIsCompactHero(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const magBtn1 = useMagnetic();
  const magBtn2 = useMagnetic();
  const magBtn3 = useMagnetic();
  const roles = isTurkish ? HERO_ROLES.tr : HERO_ROLES.en;

  const handleProjectJump = (event) => {
    event.preventDefault();
    const target = document.getElementById('projects');
    if (!target) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.history.pushState(null, '', '#projects');
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const zones = [
    {
      id: 'web',
      icon: <HiCode className="h-5 w-5" />,
      title: isTurkish ? 'Web ürünleri' : 'Web products',
      detail: isTurkish
        ? 'Canlı web uygulamaları ve case studyler'
        : 'Live web apps and product case studies',
      link: '/web',
    },
    {
      id: 'android',
      icon: <HiDevicePhoneMobile className="h-5 w-5" />,
      title: 'Android',
      detail: isTurkish
        ? 'Google Play yayını ve native mobil deneyim'
        : 'Published mobile work and native Android UI',
      link: '/android',
    },
    {
      id: 'security',
      icon: <HiShieldCheck className="h-5 w-5" />,
      title: isTurkish ? 'Güvenlik' : 'Security',
      detail: isTurkish
        ? 'CLI güvenlik aracı ve savunma odaklı kod'
        : 'CLI scanner work and defensive engineering',
      link: '/cybersecurity',
    },
    {
      id: 'data',
      icon: <HiChip className="h-5 w-5" />,
      title: isTurkish ? 'AI & Veri' : 'AI & Data',
      detail: isTurkish
        ? 'Sistemli öğrenme, deneyler ve notlar'
        : 'Structured learning, experiments, and notes',
      link: '/data-science',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-12 pt-20 sm:pt-16"
    >
      {/* Morphing duotone backdrop blobs */}
      <MorphBlob
        className="pointer-events-none absolute -left-[18%] top-[6%] h-[46vh] w-[46vh] -z-10"
        from="#7c5cff"
        to="#27e0c4"
        opacity={isDark ? 0.32 : 0.24}
        blur={36}
        duration={18}
      />
      <MorphBlob
        className="pointer-events-none absolute -right-[14%] bottom-[4%] h-[42vh] w-[42vh] -z-10"
        from="#27e0c4"
        to="#ff5a36"
        opacity={isDark ? 0.26 : 0.2}
        blur={42}
        duration={24}
      />
      <motion.div
        style={{
          y,
          opacity,
          scale,
        }}
        className="relative z-10 flex w-full max-w-6xl flex-col items-center"
      >
        <div className="mobile-hero-shell mx-auto w-full max-w-4xl text-center">
          <motion.p
            className="mb-3 text-base font-extrabold uppercase text-ink-600 dark:text-ink-200 sm:mb-4 sm:text-body-lg sm:normal-case"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isTurkish ? 'Merhaba, ben' : "Hi, I'm"}
          </motion.p>

          <div className="mobile-hero-name-stage mb-4 h-[clamp(100px,28vw,200px)] w-full sm:mb-6">
            <TextPressure
              text="Mert Soylu"
              fontFamily="Compressa VF"
              fontUrl="https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2"
              width={true}
              weight={true}
              italic={false}
              alpha={false}
              flex={true}
              stroke={false}
              scale={false}
              textColor={isDark ? '#ac94ff' : '#7c5cff'}
              className=""
              minFontSize={isCompactHero ? Math.max(40, window.innerWidth * 0.11) : 36}
              idleCenter={isCompactHero}
            />
          </div>

          <motion.div
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <MorphingRoles
              roles={roles}
              interval={3500}
              className="min-h-9 text-2xl font-extrabold leading-tight text-cyan-700 dark:text-cyan-200 sm:text-xl md:text-2xl"
            />
          </motion.div>

          <motion.p
            className="mx-auto mb-6 max-w-[32rem] text-[1.05rem] leading-relaxed text-ink-600 dark:text-ink-200 sm:mb-8 sm:max-w-2xl sm:text-body-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            {isTurkish
              ? 'Web, Android, güvenlik ve yapay zeka alanlarında öğrenerek üreten; fikirleri çalışan ürün arayüzlerine dönüştüren developer.'
              : 'Developer turning web, Android, security, and AI learning into working product surfaces.'}
          </motion.p>

          <motion.div
            className="mx-auto mb-8 grid w-full max-w-[min(22rem,calc(100vw-2rem))] grid-cols-2 gap-2 max-[360px]:grid-cols-1 sm:mb-12 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <motion.a
              ref={magBtn1.ref}
              style={magBtn1.style}
              onMouseMove={magBtn1.onMouseMove}
              onMouseLeave={magBtn1.onMouseLeave}
              href="#projects"
              onClick={handleProjectJump}
              className="btn-primary col-span-2 min-h-[50px] w-full whitespace-nowrap px-4 py-3 max-[360px]:col-span-1 sm:w-auto"
              whileTap={{ scale: 0.97 }}
            >
              {isTurkish ? 'Projeleri incele' : 'View projects'}
              <HiArrowRight className="h-4 w-4" />
            </motion.a>
            <motion.a
              ref={magBtn2.ref}
              style={magBtn2.style}
              onMouseMove={magBtn2.onMouseMove}
              onMouseLeave={magBtn2.onMouseLeave}
              href="#contact"
              className="btn-secondary min-h-[48px] w-full whitespace-nowrap px-3 py-3 sm:w-auto sm:px-5"
              whileTap={{ scale: 0.97 }}
            >
              {isTurkish ? 'İletişime geç' : 'Get in touch'}
            </motion.a>
            <motion.a
              ref={magBtn3.ref}
              style={magBtn3.style}
              onMouseMove={magBtn3.onMouseMove}
              onMouseLeave={magBtn3.onMouseLeave}
              href={CV_PATH}
              download
              className="btn-outline min-h-[48px] w-full whitespace-nowrap px-3 py-3 sm:w-auto sm:px-5"
              whileTap={{ scale: 0.97 }}
            >
              <HiDownload className="h-4 w-4" />
              {isTurkish ? CV_LABEL.tr : CV_LABEL.en}
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          className="grid w-full grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.45, duration: 0.5 }}
        >
          {zones.map((zone, index) => (
            <ZoneCard key={zone.id} {...zone} index={index} delay={1.55 + index * 0.12} />
          ))}
        </motion.div>

        <motion.div
          className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-ink-500 dark:text-ink-300 sm:mt-8 sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.95, duration: 0.5 }}
        >
          {repoCount && (
            <span className="rounded-lg border border-ink-200/70 bg-white/50 px-3 py-1.5 dark:border-white/10 dark:bg-white/10">
              {repoCount}+ {isTurkish ? 'public repo' : 'public repos'}
            </span>
          )}
          <span className="rounded-lg border border-ink-200/70 bg-white/50 px-3 py-1.5 dark:border-white/10 dark:bg-white/10">
            {isTurkish ? 'Remote / hibrit açık' : 'Open to remote / hybrid'}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
