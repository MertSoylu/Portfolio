import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

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
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  // Typing effect state
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

  useEffect(() => {
    // Mark heading as animated after initial render
    const timer = setTimeout(() => {
      hasHeadingAnimated.current = true;
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setDisplayedTitle('');
    setTitleComplete(false);
    setCurrentRoleIndex(0);
    setDisplayedRole('');
    setIsDeleting(false);
  }, [title, isTurkish]);

  // Typing effect for main title
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

  // Role cycling effect
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
  }, [displayedRole, isDeleting, currentRoleIndex, titleComplete]);

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
          {/* Animated greeting */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 bg-sand-200 dark:bg-dark-600 text-sand-700 dark:text-dark-50 rounded-full text-sm font-semibold">
              {isTurkish ? '👋 Portfolyoma hoş geldin' : '👋 Welcome to my portfolio'}
            </span>
          </motion.div>

          {/* Main heading — stagger each letter */}
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
          <motion.div
            variants={itemVariants}
            className="text-xl md:text-2xl text-sand-600 dark:text-dark-200 mb-2 min-h-9"
          >
            <span>{displayedTitle}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.53, repeat: Infinity, repeatType: 'reverse' }}
              className="text-warm-500 font-light ml-0.5"
            >
              |
            </motion.span>
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
            {isTurkish ? 'öğrencisi, ' : 'at '}
            <span className="font-semibold text-sand-700 dark:text-dark-100">
              Kütahya Dumlupınar University
            </span>
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

          {/* Skills */}
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
                className="px-4 py-2.5 bg-warm-500/10 text-warm-600 dark:text-warm-400 rounded-full text-sm font-medium border border-warm-500/20 hover:bg-warm-500/20 hover:scale-105 transition-all cursor-pointer"
              >
                {skill.name}
              </Link>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
            <motion.a
              href="#projects"
              className="btn-primary flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isTurkish ? 'Projelerimi Gör' : 'View My Work'}
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="#contact"
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isTurkish ? 'İletişime Geç' : 'Get In Touch'}
            </motion.a>
          </motion.div>

          {/* Scroll indicator — animated mouse icon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            style={{ opacity: scrollIndicatorOpacity }}
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
