import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiCode, HiShieldCheck, HiArrowRight } from 'react-icons/hi';
import { HiAcademicCap } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { fetchGitHubRepos } from '../utils/githubApi';
import { TECHNOLOGIES } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import ScrollFloat from './ScrollFloat';
import ScrollReveal from './ScrollReveal';
import SpotlightCard from './SpotlightCard';
import { useDarkMode } from '../context/DarkModeContext';

/* ── Counter component ── */
const CountUp = ({ end, suffix = '', label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const duration = 2000;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-text mb-1">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-sand-600 dark:text-dark-200">{label}</div>
    </div>
  );
};

const About = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();
  const [repoCount, setRepoCount] = useState(0);

  useEffect(() => {
    fetchGitHubRepos()
      .then((repos) => setRepoCount(repos.length))
      .catch((error) => {
        console.warn('About repo count fetch failed:', error);
        setRepoCount(0);
      });
  }, []);

  const slideUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.12 },
    }),
  };

  const skills = [
    {
      icon: <HiCode className="w-8 h-8" />,
      title: isTurkish ? 'Web Geliştirme' : 'Web Development',
      description:
        isTurkish
          ? 'React, Tailwind CSS ve modern JavaScript ekosistemi ile modern ve duyarlı web siteleri geliştiriyorum.'
          : 'Building modern, responsive websites using React, Tailwind CSS, and contemporary JavaScript frameworks.',
      technologies: ['React', 'JavaScript', 'Tailwind CSS', 'HTML/CSS'],
      link: '/web',
    },
    {
      icon: <HiAcademicCap className="w-8 h-8" />,
      title: isTurkish ? 'Android Geliştirme' : 'Android Development',
      description:
        isTurkish
          ? 'Temiz mimari ve sezgisel kullanıcı deneyimiyle sağlam Android uygulamaları geliştiriyorum.'
          : 'Creating robust Android applications with clean architecture and intuitive user interfaces.',
      technologies: ['Kotlin', 'React Native', 'Android Studio', 'Mobile UI/UX'],
      link: '/android',
    },
    {
      icon: <HiShieldCheck className="w-8 h-8" />,
      title: isTurkish ? 'Siber Güvenlik' : 'Cybersecurity',
      description:
        isTurkish
          ? 'Güvenli kodlama, şifreleme ve uygulamaları zafiyetlere karşı koruma konularında çalışıyorum.'
          : 'Understanding security best practices, encryption, and protecting applications from vulnerabilities.',
      technologies: ['Python', 'Network Security', 'Encryption', 'Secure Coding'],
      link: '/cybersecurity',
    },
  ];

  return (
    <section id="about" className="py-12 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <ScrollFloat
            containerClassName="overflow-hidden"
            textClassName="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-warm-600 via-warm-500 to-sand-500 bg-clip-text text-transparent"
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            {isTurkish ? 'Hakkımda' : 'About Me'}
          </ScrollFloat>
          <ScrollReveal
            containerClassName="mt-4"
            textClassName="text-lg text-sand-700 dark:text-dark-200 font-normal"
            enableBlur={true}
            baseOpacity={0.1}
            baseRotation={3}
            blurStrength={4}
          >
            {isTurkish ? 'Tutkulu geliştirici ve ömür boyu öğrenen' : 'Passionate developer and lifelong learner'}
          </ScrollReveal>
        </div>

        {/* Main about content */}
        <motion.div
          className="max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-3xl font-bold text-sand-900 dark:text-dark-50 mb-6 text-center">
            {isTurkish ? 'Bilgisayar Programcılığı Öğrencisi' : 'Computer Programming Student'}
          </h3>
          <p className="text-lg text-sand-600 dark:text-dark-200 mb-4 text-center">
            {isTurkish
              ? 'Kütahya Dumlupınar Üniversitesi\'nde Bilgisayar Programcılığı öğrencisiyim; estetik tasarımı güçlü işlevsellikle birleştiren çözümler üretmeye odaklanıyorum.'
              : "I'm a computer programming student at Kütahya Dumlupınar University, passionate about creating solutions that combine beautiful design with solid functionality."}
          </p>
          <p className="text-lg text-sand-600 dark:text-dark-200 mb-4 pl-4 border-l-2 border-warm-500/40">
            {isTurkish
              ? 'Teknoloji yolculuğum merakla başladı ve gerçek problemleri çözen uygulamalar geliştirme tutkusuna dönüştü.'
              : 'My journey in tech started with curiosity about how things work, and it has evolved into a passion for building applications that solve real-world problems.'}
          </p>
          <p className="text-lg text-sand-600 dark:text-dark-200 pl-4 border-l-2 border-warm-500/20">
            {isTurkish
              ? 'Kod yazmadığım zamanlarda yeni teknolojileri keşfetmeyi ve açık kaynak projelere katkı sunmayı seviyorum.'
              : "When I'm not coding, I love exploring new technologies and contributing to open-source projects."}
          </p>
        </motion.div>

        {/* ── Counters ── */}
        <motion.div
          className="grid grid-cols-2 gap-6 md:gap-8 mb-16 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <CountUp end={repoCount} suffix="+" label={isTurkish ? 'Projeler' : 'Projects'} />
          <CountUp end={3} label={isTurkish ? 'Odak Alanı' : 'Focus Areas'} />
        </motion.div>

        {/* Tech stack row */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-center text-sm font-semibold text-sand-500 dark:text-dark-300 uppercase tracking-widest mb-6">
            {isTurkish ? 'Teknolojiler' : 'Technologies'}
          </h4>
          <motion.div
            className="flex flex-wrap gap-2 justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
          >
            {[...TECHNOLOGIES.frontend, ...TECHNOLOGIES.mobile, ...TECHNOLOGIES.tools].map((tech, i) => (
              <motion.span
                key={tech}
                custom={i}
                variants={slideUpVariants}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-white/50 dark:bg-dark-500/50 border border-sand-200 dark:border-dark-400 text-sand-700 dark:text-dark-200 hover:bg-warm-500/10 hover:border-warm-500/30 hover:text-warm-600 dark:hover:text-warm-400 transition-all duration-150 cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Skills — SpotlightCard grid */}
        <div>
          <h3 className="text-3xl font-bold text-sand-900 dark:text-dark-50 mb-12 text-center">
            {isTurkish ? 'Uzmanlık Alanları' : 'Areas of Expertise'}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                <SpotlightCard
                  className="bg-white/60 dark:bg-dark-600/60 backdrop-blur-md border border-sand-200 dark:border-dark-400 rounded-2xl p-6 h-full flex flex-col"
                  spotlightColor={isDark ? 'rgba(255, 154, 92, 0.15)' : 'rgba(240, 125, 45, 0.12)'}
                >
                  <div className="w-12 h-12 rounded-xl bg-warm-500/10 border border-warm-500/20 text-warm-600 dark:text-warm-400 mb-4 flex items-center justify-center">
                    {skill.icon}
                  </div>
                  <h4 className="text-xl font-bold text-sand-900 dark:text-dark-50 mb-3">
                    {skill.title}
                  </h4>
                  <p className="text-sand-600 dark:text-dark-200 mb-4 text-sm leading-relaxed">{skill.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skill.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-warm-500/10 text-warm-600 dark:text-warm-400 text-xs rounded-full border border-warm-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {skill.link && (
                    <Link
                      to={skill.link}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-600 dark:text-warm-400 hover:text-warm-700 dark:hover:text-warm-300 mt-auto"
                    >
                      {isTurkish ? 'Detayları Gör' : 'View Details'}
                      <HiArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
