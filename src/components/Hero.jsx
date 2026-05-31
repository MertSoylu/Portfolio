import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { HiArrowRight, HiChip, HiCode, HiDownload, HiShieldCheck } from 'react-icons/hi';
import { HiDevicePhoneMobile } from 'react-icons/hi2';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import { fetchGitHubRepos } from '../utils/githubApi';
import { CV_LABEL, CV_PATH, HERO_ROLES } from '../utils/constants';
import { MorphingRoles } from './SplitFlapText';
import TextPressure from './TextPressure';

const useMagneticButton = (strength = 0.22) => {
  const ref = React.useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18 });
  const springY = useSpring(y, { stiffness: 180, damping: 18 });

  const onMouseMove = (event) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, style: { x: springX, y: springY }, onMouseMove, onMouseLeave };
};

const ZoneCard = ({ icon, title, link, detail, delay }) => {
  return (
    <Link to={link} className="block h-full">
      <motion.div
        className="group relative h-full min-h-[124px] overflow-hidden rounded-lg border border-ink-200/70 bg-white/70 p-3 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:min-h-[142px] sm:p-4"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -8, scale: 1.02 }}
      >
        <div className="relative z-10 flex h-full flex-col">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200/70 bg-white/70 text-ink-800 dark:border-white/10 dark:bg-white/10 dark:text-white sm:mb-4 sm:h-11 sm:w-11">
            {icon}
          </div>
          <h3 className="text-base font-extrabold leading-snug text-ink-900 dark:text-white sm:text-h4">
            {title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[11px] font-semibold leading-relaxed text-ink-500 dark:text-ink-300 sm:mt-2 sm:text-xs">
            {detail}
          </p>
          <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-cyan-700 dark:text-cyan-200 sm:pt-4 sm:text-xs">
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

  const magBtn1 = useMagneticButton();
  const magBtn2 = useMagneticButton();
  const magBtn3 = useMagneticButton();
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

          <div className="mobile-hero-name-stage mb-4 h-[112px] w-full sm:mb-6 sm:h-[122px] md:h-[160px] lg:h-[200px]">
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
              textColor={isDark ? '#ff9687' : '#ff4f46'}
              className=""
              minFontSize={isCompactHero ? 46 : 36}
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
            className="mx-auto mb-8 grid w-full max-w-[22rem] grid-cols-2 gap-2 max-[360px]:grid-cols-1 sm:mb-12 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-3"
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
            <ZoneCard key={zone.id} {...zone} delay={1.55 + index * 0.12} />
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
