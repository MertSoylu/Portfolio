import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { HiArrowRight, HiCode, HiShieldCheck, HiChip } from 'react-icons/hi';
import { HiDevicePhoneMobile } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { fetchGitHubRepos } from '../utils/githubApi';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import { MorphingRoles } from './SplitFlapText';
import TextPressure from './TextPressure';

const useMagneticButton = (strength = 0.35) => {
  const ref = React.useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18 });
  const springY = useSpring(y, { stiffness: 200, damping: 18 });

  const onMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const onMouseLeave = () => { x.set(0); y.set(0); };

  return { ref, style: { x: springX, y: springY }, onMouseMove, onMouseLeave };
};

/* ── Mouse-driven 3D tilt hook ── */
const useIsometricTilt = (intensity = 15) => {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const pctX = (e.clientX - centerX) / (rect.width / 2);
    const pctY = (e.clientY - centerY) / (rect.height / 2);
    rotateY.set(pctX * intensity);
    rotateX.set(-pctY * intensity);
  };

  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return { springRotateX, springRotateY, onMouseMove, onMouseLeave };
};

/* ── Zone Card — isometric 3D interactive entry point ── */
const ZoneCard = ({ icon, title, link, color, delay }) => {
  const [hovered, setHovered] = useState(false);
  const tilt = useIsometricTilt(20);

  return (
    <Link to={link} className="h-full" style={{ perspective: '800px', display: 'block' }}>
      <motion.div
        className="relative group h-full min-h-[150px] cursor-pointer overflow-hidden rounded-xl border border-sand-200/50 bg-white/20 p-4 backdrop-blur-sm sm:min-h-[170px] sm:rounded-2xl sm:p-6 dark:border-dark-400/50 dark:bg-dark-600/20"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -8, scale: 1.02 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={(e) => { setHovered(false); tilt.onMouseLeave(); }}
        onMouseMove={tilt.onMouseMove}
        style={{
          rotateX: tilt.springRotateX,
          rotateY: tilt.springRotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${color}`}
          style={{ filter: 'blur(40px)' }}
        />
        <motion.div
          className="absolute -bottom-2 left-2 right-2 h-8 rounded-2xl bg-black/10 dark:bg-black/20 blur-xl"
          style={{ transform: 'translateZ(-30px)' }}
          animate={hovered ? { opacity: 0.6, scale: 1.05 } : { opacity: 0.3, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="relative z-10 flex flex-col items-center text-center" style={{ transform: 'translateZ(20px)' }}>
          <motion.div
            className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/30 text-warm-600 dark:border-dark-300/20 dark:bg-dark-500/30 dark:text-warm-400 sm:mb-4 sm:h-12 sm:w-12 sm:rounded-xl"
            animate={hovered ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ transform: 'translateZ(10px)' }}
          >
            {icon}
          </motion.div>
          <h3 className="mb-2 whitespace-nowrap px-1 text-[13px] font-bold text-sand-900 dark:text-dark-50 sm:mb-4 sm:text-lg">{title}</h3>
          <motion.span
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-warm-600 dark:text-warm-400"
            animate={hovered ? { x: 4 } : { x: 0 }}
          >
            <HiArrowRight className="w-4 h-4" />
          </motion.span>
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

  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.92]);

  const heroRotateX = useMotionValue(0);
  const heroRotateY = useMotionValue(0);
  const springHeroRX = useSpring(heroRotateX, { stiffness: 80, damping: 25 });
  const springHeroRY = useSpring(heroRotateY, { stiffness: 80, damping: 25 });

  const onHeroMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const pctX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const pctY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    heroRotateY.set(pctX * 5);
    heroRotateX.set(-pctY * 3);
  };
  const onHeroMouseLeave = () => {
    heroRotateX.set(0);
    heroRotateY.set(0);
  };

  const magBtn1 = useMagneticButton();
  const magBtn2 = useMagneticButton();

  const roles = isTurkish
    ? ['Web Geliştirici', 'Android Geliştirici', 'Siber Güvenlik Meraklısı']
    : ['Web Developer', 'Android Developer', 'Cybersecurity Enthusiast'];

  const [repoCount, setRepoCount] = useState(null);

  useEffect(() => {
    fetchGitHubRepos()
      .then((repos) => setRepoCount(repos.length))
      .catch((error) => {
        console.warn('Hero repo count fetch failed:', error);
        setRepoCount(null);
      });
  }, []);

  const headingText = isTurkish ? 'Merhaba, ben' : "Hi, I'm";

  const zones = [
    {
      id: 'web',
      icon: <HiCode className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'Web',
      link: '/web',
      color: 'bg-zinc-900/20',
    },
    {
      id: 'android',
      icon: <HiDevicePhoneMobile className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'Android',
      link: '/android',
      color: 'bg-green-500/10',
    },
    {
      id: 'security',
      icon: <HiShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: isTurkish ? 'Güvenlik' : 'Security',
      link: '/cybersecurity',
      color: 'bg-red-500/10',
    },
    {
      id: 'data-science',
      icon: <HiChip className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: isTurkish ? 'Veri Bilimi' : 'Data Science',
      link: '/data-science',
      color: 'bg-zinc-900/20',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-[100svh] flex flex-col items-center justify-center pt-12 sm:pt-0 px-4 relative overflow-hidden"
      onMouseMove={onHeroMouseMove}
      onMouseLeave={onHeroMouseLeave}
      style={{ perspective: '1200px' }}
    >
      <motion.div style={{ y, opacity, scale, rotateX: springHeroRX, rotateY: springHeroRY, transformStyle: 'preserve-3d' }} className="w-full flex flex-col items-center z-10 relative">
        <div className="text-center max-w-3xl mx-auto w-full">
          {/* Greeting */}
          <motion.p
            className="text-lg md:text-xl text-sand-600 dark:text-dark-200 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {headingText}
          </motion.p>

          {/* Name — TextPressure */}
          <div className="mb-6 w-full h-[80px] sm:h-[120px] md:h-[160px] lg:h-[200px]" style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}>
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
              textColor={isDark ? '#ff9a5c' : '#f07d2d'}
              className=""
              minFontSize={36}
            />
          </div>

          {/* Role — Morphing text */}
          <div className="mb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <MorphingRoles
                roles={roles}
                interval={3500}
                className="text-xl md:text-2xl font-semibold text-warm-600 dark:text-warm-400 min-h-9"
              />
            </motion.div>
          </div>

          {/* University line */}
          <motion.div
            className="text-sand-500 dark:text-dark-300 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            {isTurkish ? 'Bilgisayar Programcılığı' : 'Computer Programming'}
            <span className="mx-2 opacity-40">·</span>
            <span className="font-semibold">DPU</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center mb-12"
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
              className="btn-primary flex items-center gap-2 group"
              whileTap={{ scale: 0.97 }}
            >
              {isTurkish ? 'Projelerimi Gör' : 'View My Work'}
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              ref={magBtn2.ref}
              style={magBtn2.style}
              onMouseMove={magBtn2.onMouseMove}
              onMouseLeave={magBtn2.onMouseLeave}
              href="#contact"
              className="btn-secondary"
              whileTap={{ scale: 0.97 }}
            >
              {isTurkish ? 'İletişime Geç' : 'Get In Touch'}
            </motion.a>
          </motion.div>

          {/* Zone Cards */}
          <motion.div
            className="mx-auto grid max-w-md grid-cols-2 items-stretch gap-3 sm:max-w-2xl sm:grid-cols-4 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
          >
            {zones.map((zone, i) => (
              <ZoneCard key={zone.id} {...zone} delay={1.6 + i * 0.15} />
            ))}
          </motion.div>

          {/* Stats strip */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-sand-500 dark:text-dark-300 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.5 }}
          >
            {repoCount && (
              <>
                <span className="font-semibold">{repoCount}+ {isTurkish ? 'Proje' : 'Projects'}</span>
                <span className="opacity-30">·</span>
              </>
            )}
            <span>3 {isTurkish ? 'Odak Alanı' : 'Focus Areas'}</span>
            <span className="opacity-30">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              {isTurkish ? 'İşe Açık' : 'Open to Work'}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
