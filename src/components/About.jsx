import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiCode, HiShieldCheck, HiArrowRight } from 'react-icons/hi';
import { HiAcademicCap, HiChip } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { fetchGitHubRepos } from '../utils/githubApi';
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

  const skills = [
    {
      icon: <HiCode className="w-8 h-8" />,
      title: isTurkish ? 'Web Geliştirme' : 'Web Development',
      description:
        isTurkish
          ? 'React, Tailwind CSS ve JavaScript kullanarak modern, hızlı ve her cihaza uyumlu web projeleri geliştiriyorum.'
          : 'Developing fast, modern, and fully responsive web projects using React, Tailwind CSS, and JavaScript.',
      technologies: ['React', 'JavaScript', 'Tailwind CSS', 'HTML/CSS'],
      link: '/web',
    },
    {
      icon: <HiAcademicCap className="w-8 h-8" />,
      title: isTurkish ? 'Android Geliştirme' : 'Android Development',
      description:
        isTurkish
          ? 'Temiz bir kod mimarisi ve kullanıcı dostu arayüzlere sahip sağlam Android uygulamaları tasarlıyorum.'
          : 'Designing and building robust Android applications with a focus on clean architecture and user-friendly interfaces.',
      technologies: ['Kotlin', 'React Native', 'Android Studio', 'Mobile UI/UX'],
      link: '/android',
    },
    {
      icon: <HiShieldCheck className="w-8 h-8" />,
      title: isTurkish ? 'Siber Güvenlik' : 'Cybersecurity',
      description:
        isTurkish
          ? 'Güvenli kod geliştirme, veri şifreleme ve uygulamaları olası güvenlik açıklarına karşı koruma konuları üzerine çalışmalar yapıyorum.'
          : 'Focusing on secure coding practices, data encryption, and actively protecting applications from potential vulnerabilities.',
      technologies: ['Python', 'Network Security', 'Encryption', 'Secure Coding'],
      link: '/cybersecurity',
    },
    {
      icon: <HiChip className="w-8 h-8" />,
      title: isTurkish ? 'Veri Bilimi ve Derin Öğrenme' : 'Data Science & Deep Learning',
      description:
        isTurkish
          ? 'Bu alanda şu an öğrenme odaklı ilerliyorum; temelleri güçlendirip küçük deneylerle pratik yapıyorum.'
          : 'I am currently in the learning phase in this area, strengthening fundamentals and building small experiments.',
      technologies: ['Python', 'NumPy', 'Pandas', 'Deep Learning'],
      link: '/data-science',
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
            baseOpacity={0.75}
            baseRotation={3}
            blurStrength={1.5}
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
              ? 'Kütahya Dumlupınar Üniversitesi\'nde Bilgisayar Programcılığı okuyorum. Amacım, modern tasarımı yüksek performansla buluşturan sağlam çözümler geliştirmek.'
              : "I'm a Computer Programming student at Kütahya Dumlupınar University. My goal is to build reliable solutions that bring together modern design and strong performance."}
          </p>
          <p className="text-lg text-sand-600 dark:text-dark-200 mb-4 pl-4 border-l-2 border-warm-500/40">
            {isTurkish
              ? 'Teknolojiye olan ilgim sistemlerin nasıl çalıştığını merak etmemle başladı. Zamanla bu merak, gerçek hayattaki problemleri çözen faydalı uygulamalar geliştirme hedefine dönüştü.'
              : "My interest in tech started simply by wondering how systems work behind the scenes. Over time, it grew into a focused goal to build useful applications that solve real-world problems."}
          </p>
          <p className="text-lg text-sand-600 dark:text-dark-200 pl-4 border-l-2 border-warm-500/20">
            {isTurkish
              ? 'Kod yazmaktan arta kalan zamanlarımda ise yeni teknolojileri incelemeyi ve açık kaynaklı projelere destek olmayı seviyorum.'
              : "When I'm away from the keyboard, I enjoy exploring new technologies and contributing to open-source projects."}
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

        {/* Skills — SpotlightCard grid */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-sand-900 dark:text-dark-50 mb-8 sm:mb-12 text-center">
            {isTurkish ? 'Uzmanlık Alanları' : 'Areas of Expertise'}
          </h3>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                <SpotlightCard
                  className="bg-white/60 dark:bg-black/70 backdrop-blur-md border border-sand-200 dark:border-zinc-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full flex flex-col"
                  spotlightColor={isDark ? 'rgba(255, 154, 92, 0.15)' : 'rgba(240, 125, 45, 0.12)'}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-warm-500/10 border border-warm-500/20 text-warm-600 dark:text-warm-400 mb-3 sm:mb-4 flex items-center justify-center">
                    {skill.icon}
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-sand-900 dark:text-zinc-100 mb-2 sm:mb-3">
                    {skill.title}
                  </h4>
                  <p className="text-sand-600 dark:text-zinc-300 mb-3 sm:mb-4 text-[13px] sm:text-sm leading-relaxed">{skill.description}</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {skill.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-warm-500/10 text-warm-600 dark:text-warm-400 text-[11px] sm:text-xs rounded-full border border-warm-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {skill.link && (
                    <Link
                      to={skill.link}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-warm-600 dark:text-warm-400 hover:text-warm-700 dark:hover:text-warm-300 mt-auto"
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
