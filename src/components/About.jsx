import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiCode, HiShieldCheck, HiArrowRight } from 'react-icons/hi';
import { HiAcademicCap, HiChip } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { fetchGitHubRepos } from '../utils/githubApi';
import { useLanguage } from '../context/LanguageContext';
import { SKILLS_DESCRIPTIONS } from '../utils/constants';
import ScrollFloat from './ScrollFloat';
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
      <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-caption text-sand-600 dark:text-zinc-400">{label}</div>
    </div>
  );
};

const About = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();
  const [repoCount, setRepoCount] = useState(0);

  const githubChartUrl = useMemo(() => {
    const date = new Date().toISOString().split('T')[0];
    return `https://ghchart.rshah.org/f07d2d/MertSoylu?t=${date}`;
  }, []);

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
      title: isTurkish ? SKILLS_DESCRIPTIONS.web.title.tr : SKILLS_DESCRIPTIONS.web.title.en,
      description: isTurkish
        ? SKILLS_DESCRIPTIONS.web.description.tr
        : SKILLS_DESCRIPTIONS.web.description.en,
      technologies: SKILLS_DESCRIPTIONS.web.technologies,
      proficiency: SKILLS_DESCRIPTIONS.web.proficiency,
      link: SKILLS_DESCRIPTIONS.web.link,
    },
    {
      icon: <HiAcademicCap className="w-8 h-8" />,
      title: isTurkish ? SKILLS_DESCRIPTIONS.android.title.tr : SKILLS_DESCRIPTIONS.android.title.en,
      description: isTurkish
        ? SKILLS_DESCRIPTIONS.android.description.tr
        : SKILLS_DESCRIPTIONS.android.description.en,
      technologies: SKILLS_DESCRIPTIONS.android.technologies,
      proficiency: SKILLS_DESCRIPTIONS.android.proficiency,
      link: SKILLS_DESCRIPTIONS.android.link,
    },
    {
      icon: <HiShieldCheck className="w-8 h-8" />,
      title: isTurkish ? SKILLS_DESCRIPTIONS.security.title.tr : SKILLS_DESCRIPTIONS.security.title.en,
      description: isTurkish
        ? SKILLS_DESCRIPTIONS.security.description.tr
        : SKILLS_DESCRIPTIONS.security.description.en,
      technologies: SKILLS_DESCRIPTIONS.security.technologies,
      proficiency: SKILLS_DESCRIPTIONS.security.proficiency,
      link: SKILLS_DESCRIPTIONS.security.link,
    },
    {
      icon: <HiChip className="w-8 h-8" />,
      title: isTurkish ? SKILLS_DESCRIPTIONS.datascience.title.tr : SKILLS_DESCRIPTIONS.datascience.title.en,
      description: isTurkish
        ? SKILLS_DESCRIPTIONS.datascience.description.tr
        : SKILLS_DESCRIPTIONS.datascience.description.en,
      technologies: SKILLS_DESCRIPTIONS.datascience.technologies,
      proficiency: SKILLS_DESCRIPTIONS.datascience.proficiency,
      link: SKILLS_DESCRIPTIONS.datascience.link,
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <ScrollFloat
            containerClassName="overflow-hidden"
            textClassName="text-3xl sm:text-4xl md:text-5xl font-bold heading-gradient"
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            {isTurkish ? 'Hakkımda' : 'About Me'}
          </ScrollFloat>
        </div>

        {/* Main about content */}
        <motion.div
          className="max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-h2 text-sand-900 dark:text-zinc-50 mb-6 text-center">
            {isTurkish ? 'Full-Stack Developer & AI Developer' : 'Full-Stack Developer & AI Developer'}
          </h3>
          <p className="text-body-lg text-sand-700 dark:text-zinc-300 mb-4 text-center">
            {isTurkish
              ? 'Full-Stack Developer ve AI Developer olarak web, mobil ve güvenlik alanlarında projeler geliştiriyorum. Teknolojileri keşfederek öğreniyor, öğrendiklerimi ürüne dönüştürüyorum.'
              : 'Full-Stack Developer & AI Developer building projects across web, mobile, and security. I learn by exploring, and turn what I learn into shipped products.'}
          </p>
          <p className="text-body-lg text-sand-700 dark:text-zinc-300 mb-4 pl-4 border-l-2 border-accent-500/40">
            {isTurkish
              ? 'Yazılımın en değerli yanı, karmaşık bir problemi basit, kullanılabilir bir çözüme dönüştürebilmesi. Bu yüzden her projeye sadece "kod yazmak" değil, "gerçek bir sorunu çözmek" gözüyle bakıyorum.'
              : 'What I value most in software is its ability to turn complex problems into simple, usable solutions. That\'s why I approach every project not just as "writing code," but as solving a real problem.'}
          </p>
          <p className="text-body-lg text-sand-700 dark:text-zinc-300 pl-4 border-l-2 border-accent-500/20">
            {isTurkish
              ? 'Boş zamanlarımda öğrendiğim yeni teknolojileri küçük ama tamamlanmış side projelerde deniyorum. Açık kaynak topluluğundan faydalandığım kadar, fayda sağlamaya da çalışıyorum.'
              : 'In my free time, I experiment with new technologies through small but complete side projects. I try to give back to the open-source community as much as I benefit from it.'}
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

        {/* GitHub contribution heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h4 className="text-center text-caption text-sand-600 dark:text-zinc-400 mb-4">
            {isTurkish ? 'GitHub Aktivitesi' : 'GitHub Activity'}
          </h4>
          <div className="card-raised p-4 overflow-x-auto">
            <img
              src={githubChartUrl}
              alt={isTurkish ? 'Mert Soylu GitHub katkı grafiği' : 'Mert Soylu GitHub contribution chart'}
              loading="lazy"
              decoding="async"
              className="w-full max-w-3xl mx-auto"
            />
          </div>
        </motion.div>

        {/* Skills — SpotlightCard grid */}
        <div>
          <h3 className="text-h2 text-sand-900 dark:text-zinc-50 mb-12 text-center">
            {isTurkish ? 'Uzmanlık Alanları' : 'Areas of Expertise'}
          </h3>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                <SpotlightCard
                  className="card-raised p-6 sm:p-8 h-full flex flex-col"
                  spotlightColor={isDark ? 'rgba(249, 115, 22, 0.18)' : 'rgba(240, 125, 45, 0.12)'}
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-600 dark:text-accent-400 mb-4 flex items-center justify-center">
                    {skill.icon}
                  </div>
                  <h4 className="text-h4 text-sand-900 dark:text-zinc-100 mb-3">{skill.title}</h4>
                  <p className="text-body-sm text-sand-700 dark:text-zinc-300 mb-4">{skill.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {skill.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-accent-500/10 text-accent-700 dark:text-accent-300 text-xs font-medium rounded-full border border-accent-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {skill.link && (
                    <Link
                      to={skill.link}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 mt-auto"
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
