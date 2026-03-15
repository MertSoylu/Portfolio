import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { HiArrowRight, HiSparkles, HiCode } from 'react-icons/hi';
import { fetchGitHubRepos } from '../utils/githubApi';
import { useLanguage } from '../context/LanguageContext';

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

const Hero = () => {
  const { isTurkish } = useLanguage();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.92]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const scrollIndicatorY = useTransform(scrollYProgress, [0, 0.18], [0, 10]);
  const yHeading = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const yDesc = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const yActions = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const magBtn1 = useMagneticButton();
  const magBtn2 = useMagneticButton();

  // Role cycling state
  const roles = isTurkish
    ? ['Web Geliştirici', 'Android Geliştirici', 'Siber Güvenlik Meraklısı']
    : ['Web Developer', 'Android Developer', 'Cybersecurity Enthusiast'];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const hasHeadingAnimated = useRef(false);
  const languageChangedRef = useRef(false);

  // GitHub repo count for stats strip
  const [repoCount, setRepoCount] = useState(null);

  useEffect(() => {
    fetchGitHubRepos()
      .then((repos) => setRepoCount(repos.length))
      .catch(() => setRepoCount(null));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      hasHeadingAnimated.current = true;
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (languageChangedRef.current) {
      setCurrentRoleIndex(0);
      setDisplayedRole('');
      setIsDeleting(false);
    } else {
      languageChangedRef.current = true;
    }
  }, [isTurkish]);

  // Role cycling effect — starts immediately on mount
  useEffect(() => {
    const currentRole = roles[currentRoleIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayedRole.length < currentRole.length) {
            setDisplayedRole(currentRole.slice(0, displayedRole.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayedRole.length > 0) {
            setDisplayedRole(displayedRole.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );

    return () => clearTimeout(timeout);
  }, [displayedRole, isDeleting, currentRoleIndex]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const headingText = isTurkish ? 'Merhaba, ben ' : "Hi, I'm ";
  const nameText = 'Mert Soylu';

  return (
    <section
      ref={sectionRef}
      className="h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
    >
      {/* Parallax content wrapper */}
      <motion.div style={{ y, opacity, scale }} className="w-full flex flex-col items-center z-10 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-2xl mx-auto w-full"
        >
          {/* Welcome badge */}
          <motion.div variants={itemVariants} className="mb-6 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-sand-200 dark:bg-dark-600 text-sand-700 dark:text-dark-50 rounded-full text-sm font-semibold border border-warm-500/20 dark:border-warm-500/10">
              <HiSparkles className="w-4 h-4 text-warm-500" />
              {isTurkish ? 'Portfolyoma hoş geldin' : 'Welcome to my portfolio'}
            </span>
          </motion.div>

          {/* Main heading — word-level mask reveal */}
          <motion.div style={{ y: yHeading }}>
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-sand-900 dark:text-dark-50 mb-6 leading-tight"
            >
              {headingText.trim().split(/\s+/).map((word, i) => (
                <React.Fragment key={`h-${isTurkish}-${i}`}>
                  <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
                    <motion.span
                      style={{ display: 'inline-block' }}
                      initial={hasHeadingAnimated.current ? false : { y: '110%' }}
                      animate={{ y: 0 }}
                      transition={hasHeadingAnimated.current ? { duration: 0 } : { delay: 0.3 + i * 0.1, duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                    >
                      {word}
                    </motion.span>
                  </span>
                  {'\u00A0'}
                </React.Fragment>
              ))}
              {nameText.trim().split(/\s+/).map((word, i, arr) => (
                <React.Fragment key={`n-${isTurkish}-${i}`}>
                  <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
                    <motion.span
                      className="hero-name"
                      style={{ display: 'inline-block' }}
                      initial={hasHeadingAnimated.current ? false : { y: '110%' }}
                      animate={{ y: 0 }}
                      transition={hasHeadingAnimated.current ? { duration: 0 } : { delay: 0.3 + (headingText.trim().split(/\s+/).length + i) * 0.1, duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                    >
                      {word}
                    </motion.span>
                  </span>
                  {i < arr.length - 1 ? '\u00A0' : ''}
                </React.Fragment>
              ))}
            </motion.h1>
          </motion.div>

          {/* Subtitle + Role cycling */}
          <motion.div style={{ y: yDesc }}>
            {/* Static subtitle with university */}
            <motion.div
              variants={itemVariants}
              className="text-xl md:text-2xl text-sand-600 dark:text-dark-200 mb-2"
            >
              {isTurkish ? 'Bilgisayar Programcılığı Öğrencisi' : 'Computer Programming Student'}
              <span className="text-sand-400 dark:text-dark-400 mx-2">·</span>
              <span className="font-semibold text-sand-700 dark:text-dark-100">DPU</span>
            </motion.div>

            {/* Role cycling — starts immediately */}
            <motion.div
              variants={itemVariants}
              className="text-lg md:text-xl text-warm-600 dark:text-warm-400 mb-4 min-h-9 font-semibold"
            >
              <span>{displayedRole}</span>
              <motion.span
                animate={{ opacity: [1, 0], textShadow: ['0 0 8px rgba(240,125,45,0.8)', '0 0 0px rgba(240,125,45,0)'] }}
                transition={{ duration: 0.53, repeat: Infinity, repeatType: 'reverse' }}
                className="text-warm-500 font-light ml-0.5"
              >
                |
              </motion.span>
            </motion.div>

            {/* Micro-description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-sand-600 dark:text-dark-200 max-w-lg mx-auto mb-8"
            >
              {isTurkish
                ? 'Web ve mobil uygulamalar geliştiriyor, siber güvenliği keşfediyorum.'
                : 'I build web & mobile apps and explore cybersecurity.'}
            </motion.p>
          </motion.div>

          {/* CTAs + Stats */}
          <motion.div style={{ y: yActions }}>
            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center mb-8">
              <motion.a
                ref={magBtn1.ref}
                style={magBtn1.style}
                onMouseMove={magBtn1.onMouseMove}
                onMouseLeave={magBtn1.onMouseLeave}
                href="#projects"
                className="btn-primary flex items-center gap-2 group"
                whileTap={{ scale: 0.95 }}
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
                whileTap={{ scale: 0.95 }}
              >
                {isTurkish ? 'İletişime Geç' : 'Get In Touch'}
              </motion.a>
            </motion.div>

            {/* TODO(human): Stats strip */}
            <motion.div variants={itemVariants}>
              {/* Stats strip - display repoCount, focus areas, and open to work status */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-sand-500 dark:text-dark-300">
                {/* Implement: 3 metrics separated by dot dividers */}
                {/* Available data: repoCount (number|null), isTurkish (boolean) */}
                {/* Metric 1: Project count from repoCount (show nothing if null) */}
                {/* Metric 2: "3 Odak Alanı" / "3 Focus Areas" */}
                {/* Metric 3: Open to Work with green ping dot */}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — pinned to section bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{ opacity: scrollIndicatorOpacity, y: scrollIndicatorY }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <div className="text-sand-400 dark:text-dark-300 text-sm mb-3">
          {isTurkish ? 'Keşfetmek için kaydır' : 'Scroll to explore'}
        </div>
        <div className="w-6 h-10 border-2 border-sand-400 dark:border-dark-300 rounded-full relative flex justify-center">
          <motion.div
            animate={{ y: [2, 14, 2] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-warm-500 rounded-full mt-1.5"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
