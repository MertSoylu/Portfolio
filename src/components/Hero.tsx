import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { HiArrowRight, HiSparkles, HiDownload } from 'react-icons/hi';
import { Link } from 'react-router-dom';
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
  const sectionRef = useRef<HTMLElement>(null);
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
  const yBadges = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const magBtn1 = useMagneticButton();
  const magBtn2 = useMagneticButton();
  const magBtn3 = useMagneticButton();

  const title = isTurkish ? 'Bilgisayar Programcılığı Öğrencisi' : 'Computer Programming Student';
  const roles = isTurkish
    ? ['Web Geliştirici', 'Android Geliştirici', 'Siber Güvenlik Meraklısı']
    : ['Web Developer', 'Android Developer', 'Cybersecurity Enthusiast'];
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [titleComplete, setTitleComplete] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const hasHeadingAnimated = useRef(false);
  const languageChangedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      hasHeadingAnimated.current = true;
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (languageChangedRef.current) {
      // On language toggle: jump directly to completed state, skip re-typing
      setDisplayedTitle(title);
      setTitleComplete(true);
      setCurrentRoleIndex(0);
      setDisplayedRole('');
      setIsDeleting(false);
    } else {
      languageChangedRef.current = true;
    }
  }, [isTurkish]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (displayedTitle.length < title.length) {
      const timeout = setTimeout(() => {
        setDisplayedTitle(title.slice(0, displayedTitle.length + 1));
      }, 60);
      return () => clearTimeout(timeout);
    } else {
      setTitleComplete(true);
    }
  }, [displayedTitle, title]);

  useEffect(() => {
    if (!titleComplete) return;
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
  }, [displayedRole, isDeleting, currentRoleIndex, titleComplete, roles]);

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
      className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4 relative"
    >
      <motion.div style={{ y, opacity, scale }} className="text-center max-w-4xl mx-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Animated greeting + Open to Work */}
          <motion.div variants={itemVariants} className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-sand-200 dark:bg-dark-600 text-sand-700 dark:text-dark-50 rounded-full text-sm font-semibold border border-warm-500/20 dark:border-warm-500/10">
              <HiSparkles className="w-4 h-4 text-warm-500" />
              {isTurkish ? 'Portfolyoma hoş geldin' : 'Welcome to my portfolio'}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold border border-green-300 dark:border-green-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              {isTurkish ? 'Fırsatlara Açık' : 'Open to Work'}
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-7xl font-bold text-sand-900 dark:text-dark-50 mb-6 leading-tight"
          >
            {headingText.split('').map((char, i) => (
              <motion.span
                key={`h-${isTurkish}-${i}`}
                initial={hasHeadingAnimated.current ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={hasHeadingAnimated.current ? { duration: 0 } : { delay: 0.5 + i * 0.04, duration: 0.3 }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
            {nameText.split('').map((char, i) => (
              <motion.span
                key={`n-${isTurkish}-${i}`}
                className="gradient-text"
                initial={hasHeadingAnimated.current ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  hasHeadingAnimated.current
                    ? { duration: 0 }
                    : { delay: 0.5 + (headingText.length + i) * 0.04, duration: 0.3 }
                }
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Typing subheading */}
          <motion.div style={{ y: yDesc }}>
          <motion.div
            variants={itemVariants}
            className="text-xl md:text-2xl text-sand-600 dark:text-dark-200 mb-2 min-h-9"
          >
            <span>{displayedTitle}</span>
            {!titleComplete && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.53, repeat: Infinity, repeatType: 'reverse' }}
                className="text-warm-500 font-light ml-0.5"
              >
                |
              </motion.span>
            )}
          </motion.div>

          {/* Role cycling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: titleComplete ? 1 : 0 }}
            className="text-lg md:text-xl text-warm-600 dark:text-warm-400 mb-4 min-h-9 font-semibold"
          >
            {titleComplete && (
              <>
                <span>{displayedRole}</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.53, repeat: Infinity, repeatType: 'reverse' }}
                  className="text-warm-500 font-light ml-0.5"
                >
                  |
                </motion.span>
              </>
            )}
          </motion.div>

          {/* University */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-sand-600 dark:text-dark-200 mb-4"
          >
            {isTurkish ? (
              <>
                Kütahya Dumlupınar{' '}
                <span className="font-semibold text-sand-700 dark:text-dark-100">Üniversitesi</span>
                {'\'nde'}
              </>
            ) : (
              <>
                at{' '}
                <span className="font-semibold text-sand-700 dark:text-dark-100">
                  Kütahya Dumlupınar University
                </span>
              </>
            )}
          </motion.p>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-sand-600 dark:text-dark-200 max-w-2xl mx-auto mb-8"
          >
            {isTurkish
                ? 'Güzel ve işlevsel web uygulamaları geliştirmeye, aynı zamanda siber güvenlik alanını keşfetmeye tutkuluyum. Web ve Android geliştirme deneyimimle fark yaratan çözümler üretmeye çalışıyorum.'
                : "I'm passionate about building beautiful, functional web applications and exploring cybersecurity. With expertise in web development and Android development, I strive to create solutions that make a difference."}
          </motion.p>
          </motion.div>

          {/* Skills */}
          <motion.div style={{ y: yBadges }}>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 justify-center mb-10">
            {(isTurkish
              ? [
                  { name: 'Web Geliştirme', path: '/web' },
                  { name: 'Android Geliştirme', path: '/android' },
                  { name: 'Siber Güvenlik', path: '/cybersecurity' },
                ]
              : [
                  { name: 'Web Development', path: '/web' },
                  { name: 'Android Development', path: '/android' },
                  { name: 'Cybersecurity', path: '/cybersecurity' },
                ]).map((skill) => (
              <Link
                key={skill.name}
                to={skill.path}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-warm-500/10 text-warm-600 dark:text-warm-400 rounded-full text-sm font-medium border border-warm-500/20 hover:bg-warm-500/20 hover:gap-2.5 transition-all duration-200 cursor-pointer group"
              >
                {skill.name}
                <HiArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
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
            <motion.a
              ref={magBtn3.ref}
              style={magBtn3.style}
              onMouseMove={magBtn3.onMouseMove}
              onMouseLeave={magBtn3.onMouseLeave}
              href="/cv.pdf"
              download
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-warm-500 text-warm-600 dark:text-warm-400 hover:bg-warm-500 hover:text-white transition-all duration-300"
              whileTap={{ scale: 0.95 }}
            >
              <HiDownload className="w-4 h-4" />
              {isTurkish ? 'CV İndir' : 'Download CV'}
            </motion.a>
          </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            style={{ opacity: scrollIndicatorOpacity, y: scrollIndicatorY }}
            className="mt-8 sm:mt-16 flex flex-col items-center"
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
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
