import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiAcademicCap, HiCode, HiShieldCheck, HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { fetchGitHubRepos } from '../utils/githubApi';
import { useLanguage } from '../context/LanguageContext';

interface CountUpProps {
  end: number;
  suffix?: string;
  label: string;
}

const CountUp = ({ end, suffix = '', label }: CountUpProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const duration = 2000;
    const step = (ts: number) => {
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

const AnimatedUnderline = () => (
  <motion.div
    className="h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-warm-500 to-sand-400"
    initial={{ width: 0 }}
    whileInView={{ width: 80 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
  />
);

interface Skill {
  icon: ReactNode;
  title: string;
  description: string;
  technologies: string[];
  link: string;
}

const About = () => {
  const { isTurkish } = useLanguage();
  const [repoCount, setRepoCount] = useState(0);

  useEffect(() => {
    fetchGitHubRepos()
      .then((repos) => setRepoCount(repos.length))
      .catch(() => setRepoCount(0));
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const skills: Skill[] = [
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

  const avatarVariants = {
    hidden: { clipPath: 'circle(0% at 50% 50%)' },
    visible: {
      clipPath: 'circle(75% at 50% 50%)',
      transition: { duration: 1, ease: 'easeOut', delay: 0.3 },
    },
  };

  const codeLines = [
    { num: 1, indent: 0, tokens: [{ text: 'import', color: 'text-purple-400' }, { text: ' React', color: 'text-sky-300' }, { text: ' from', color: 'text-purple-400' }, { text: " 'react'", color: 'text-emerald-400' }] },
    { num: 2, indent: 0, tokens: [] as { text: string; color: string }[] },
    { num: 3, indent: 0, tokens: [{ text: 'const', color: 'text-purple-400' }, { text: ' App', color: 'text-yellow-300' }, { text: ' = () => {', color: 'text-gray-300' }] },
    { num: 4, indent: 1, tokens: [{ text: 'return', color: 'text-purple-400' }, { text: ' (', color: 'text-gray-300' }] },
    { num: 5, indent: 2, tokens: [{ text: '<', color: 'text-gray-400' }, { text: 'div', color: 'text-red-400' }, { text: ' className=', color: 'text-sky-300' }, { text: '"app"', color: 'text-emerald-400' }, { text: '>', color: 'text-gray-400' }] },
    { num: 6, indent: 3, tokens: [{ text: '<', color: 'text-gray-400' }, { text: 'h1', color: 'text-red-400' }, { text: '>', color: 'text-gray-400' }, { text: 'Hello!', color: 'text-white' }, { text: '</', color: 'text-gray-400' }, { text: 'h1', color: 'text-red-400' }, { text: '>', color: 'text-gray-400' }] },
    { num: 7, indent: 2, tokens: [{ text: '</', color: 'text-gray-400' }, { text: 'div', color: 'text-red-400' }, { text: '>', color: 'text-gray-400' }] },
    { num: 8, indent: 1, tokens: [{ text: ')', color: 'text-gray-300' }] },
    { num: 9, indent: 0, tokens: [{ text: '}', color: 'text-gray-300' }] },
  ];

  return (
    <section id="about" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Section header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="section-title">{isTurkish ? 'Hakkımda' : 'About Me'}</h2>
            <AnimatedUnderline />
            <p className="section-subtitle mt-6">
              {isTurkish ? 'Tutkulu geliştirici ve ömür boyu öğrenen' : 'Passionate developer and lifelong learner'}
            </p>
          </motion.div>

          {/* Main about content */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 gap-12 mb-16 items-center"
          >
            {/* Left side */}
            <motion.div variants={sectionVariants}>
              <h3 className="text-3xl font-bold text-sand-900 dark:text-dark-50 mb-6">
                {isTurkish ? 'Bilgisayar Programcılığı Öğrencisi' : 'Computer Programming Student'}
              </h3>
              <p className="text-lg text-sand-600 dark:text-dark-200 mb-4">
                {isTurkish
                  ? 'Kütahya Dumlupınar Üniversitesi Bilgisayar Programcılığı öğrencisiyim; estetik tasarımı güçlü işlevsellikle birleştiren çözümler üretmeye odaklanıyorum.'
                  : "I'm a computer programming student at Kütahya Dumlupınar University, passionate about creating solutions that combine beautiful design with solid functionality."}
              </p>
              <p className="text-lg text-sand-600 dark:text-dark-200 mb-4">
                {isTurkish
                  ? 'Teknoloji yolculuğum merakla başladı ve gerçek problemleri çözen uygulamalar geliştirme tutkusuna dönüştü. Her projede temiz, sürdürülebilir ve iyi pratiklere uygun kod yazmayı önceliklendiriyorum.'
                  : 'My journey in tech started with curiosity about how things work, and it has evolved into a passion for building applications that solve real-world problems. I believe in writing clean, maintainable code and following best practices in every project.'}
              </p>
              <p className="text-lg text-sand-600 dark:text-dark-200">
                {isTurkish
                  ? 'Kod yazmadığım zamanlarda yeni teknolojileri keşfetmeyi, açık kaynak projelere katkı sunmayı ve web/mobil dünyasındaki güncel trendleri takip etmeyi seviyorum.'
                  : "When I'm not coding, I love exploring new technologies, contributing to open-source projects, and learning about the latest trends in web and mobile development."}
              </p>
            </motion.div>

            {/* Right side — Code editor illustration */}
            <motion.div className="flex justify-center">
              <motion.div
                variants={avatarVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative w-64 h-64 md:w-80 md:h-80"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-warm-500 to-sand-400 rounded-2xl shadow-2xl opacity-20" />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 flex items-center justify-center bg-gradient-sand dark:bg-gradient-to-br dark:from-dark-600 dark:to-dark-700 rounded-2xl shadow-xl border border-sand-300 dark:border-dark-400 overflow-hidden"
                >
                  <div className="relative w-full h-full flex items-center justify-center p-6">
                    <div className="absolute w-32 h-32 bg-warm-500/15 dark:bg-warm-500/10 rounded-full blur-3xl" />
                    <div className="w-full max-w-[240px] rounded-xl overflow-hidden shadow-2xl border border-sand-300/30 dark:border-dark-300/20">
                      <div className="bg-[#2d333b] dark:bg-[#161b22] px-3 py-2 flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        <span className="ml-2 text-[9px] text-gray-400 font-mono">App.tsx</span>
                      </div>
                      <div className="bg-[#1e293b] dark:bg-[#0d1117] px-3 py-3 font-mono text-[10px] md:text-[11px] leading-relaxed space-y-0.5 min-h-[140px]">
                        {codeLines.map((line, i) => (
                          <motion.div
                            key={line.num}
                            className="flex items-center"
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                          >
                            <span className="w-5 text-right text-gray-600 mr-3 select-none text-[9px]">{line.num}</span>
                            <span style={{ paddingLeft: `${line.indent * 10}px` }}>
                              {line.tokens.map((token, j) => (
                                <span key={j} className={token.color}>{token.text}</span>
                              ))}
                            </span>
                          </motion.div>
                        ))}
                        <div className="flex items-center">
                          <span className="w-5 text-right text-gray-600 mr-3 select-none text-[9px]">10</span>
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                            className="inline-block w-[5px] h-3 bg-warm-500 rounded-[1px]"
                          />
                        </div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute top-6 right-4 text-warm-500/70 dark:text-warm-400/60 font-mono font-bold text-sm"
                    >
                      {'</>'}
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, -5, 0], opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 3.5, repeat: Infinity, delay: 0.8 }}
                      className="absolute bottom-10 left-3 text-sky-500/60 dark:text-sky-400/50 font-mono font-bold text-xs"
                    >
                      {'{ }'}
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, -4, 0], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2.8, repeat: Infinity, delay: 1.2 }}
                      className="absolute bottom-6 right-6 text-emerald-500/60 dark:text-emerald-400/50 font-mono font-bold text-[10px]"
                    >
                      fn()
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Counters */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-6 md:gap-8 mb-16 max-w-md mx-auto"
          >
            <CountUp end={repoCount} suffix="+" label={isTurkish ? 'Projeler' : 'Projects'} />
            <CountUp end={3} label={isTurkish ? 'Odak Alanı' : 'Focus Areas'} />
          </motion.div>

          {/* Skills grid */}
          <motion.div variants={itemVariants}>
            <h3 className="text-3xl font-bold text-sand-900 dark:text-dark-50 mb-12 text-center">
              {isTurkish ? 'Uzmanlık Alanları' : 'Areas of Expertise'}
            </h3>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="bg-white/40 dark:bg-dark-600/40 backdrop-blur-md p-5 sm:p-8 rounded-2xl border border-sand-200 dark:border-dark-400 card-hover group"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="text-warm-600 mb-4 group-hover:text-warm-700 transition-colors inline-block"
                    initial={{ scale: 0, rotate: -30 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 260, damping: 15, delay: index * 0.15 }}
                    whileHover={{
                      rotate: [0, -10, 10, -10, 10, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    {skill.icon}
                  </motion.div>

                  <h4 className="text-xl font-bold text-sand-900 dark:text-dark-50 mb-3">
                    {skill.title}
                  </h4>
                  <p className="text-sand-600 dark:text-dark-200 mb-6">{skill.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
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
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-600 dark:text-warm-400 hover:text-warm-700 dark:hover:text-warm-300 group/link transition-colors py-2"
                    >
                      {isTurkish ? 'Detayları Gör' : 'View Details'}
                      <HiArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
