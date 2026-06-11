import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiArrowRight, HiChip, HiCode, HiShieldCheck } from 'react-icons/hi';
import { HiAcademicCap } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { fetchGitHubRepos } from '../utils/githubApi';
import { useLanguage } from '../context/LanguageContext';
import { SKILLS_DESCRIPTIONS } from '../utils/constants';
import KineticHeadline from './motion/KineticHeadline';
import ScrollScene from './motion/ScrollScene';
import SpotlightCard from './SpotlightCard';
import { useDarkMode } from '../context/DarkModeContext';

const CountUp = ({ end, suffix = '', label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return undefined;
    let startTime = null;
    let frameId = null;
    const duration = 1400;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [inView, end]);

  return (
    <div ref={ref} className="card-flat p-5 text-center">
      <div className="gradient-text mb-1 text-3xl font-extrabold md:text-4xl">
        {count}
        {suffix}
      </div>
      <div className="text-caption text-ink-500 dark:text-ink-300">{label}</div>
    </div>
  );
};

const About = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();
  const [repoCount, setRepoCount] = useState(0);

  const githubChartUrl = useMemo(() => {
    const date = new Date().toISOString().split('T')[0];
    return `https://ghchart.rshah.org/7c5cff/MertSoylu?t=${date}`;
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
      icon: <HiCode className="h-7 w-7" />,
      title: isTurkish ? SKILLS_DESCRIPTIONS.web.title.tr : SKILLS_DESCRIPTIONS.web.title.en,
      description: isTurkish
        ? 'React ve Tailwind ile hızlı, bakımı kolay, görsel olarak güçlü web arayüzleri geliştiriyorum.'
        : 'Building fast, maintainable, visually strong web interfaces with React and Tailwind.',
      technologies: SKILLS_DESCRIPTIONS.web.technologies,
      link: SKILLS_DESCRIPTIONS.web.link,
      tone: 'text-cyan-600 dark:text-cyan-200',
    },
    {
      icon: <HiAcademicCap className="h-7 w-7" />,
      title: isTurkish ? SKILLS_DESCRIPTIONS.android.title.tr : SKILLS_DESCRIPTIONS.android.title.en,
      description: isTurkish
        ? 'Yayınlanabilir mobil ürünler için native Android, Compose ve kullanıcı akışlarına odaklanıyorum.'
        : 'Focusing on native Android, Compose, and user flows for shippable mobile products.',
      technologies: SKILLS_DESCRIPTIONS.android.technologies,
      link: SKILLS_DESCRIPTIONS.android.link,
      tone: 'text-emerald-600 dark:text-emerald-200',
    },
    {
      icon: <HiShieldCheck className="h-7 w-7" />,
      title: isTurkish ? SKILLS_DESCRIPTIONS.security.title.tr : SKILLS_DESCRIPTIONS.security.title.en,
      description: isTurkish
        ? 'Güvenli kodlama, web açıkları ve otomasyon araçlarını pratik projelerle çalışıyorum.'
        : 'Practicing secure coding, web vulnerabilities, and automation tools through real projects.',
      technologies: SKILLS_DESCRIPTIONS.security.technologies,
      link: SKILLS_DESCRIPTIONS.security.link,
      tone: 'text-accent-600 dark:text-accent-200',
    },
    {
      icon: <HiChip className="h-7 w-7" />,
      title: isTurkish ? SKILLS_DESCRIPTIONS.datascience.title.tr : SKILLS_DESCRIPTIONS.datascience.title.en,
      description: isTurkish
        ? 'Veri bilimi ve derin öğrenmeyi temelden ilerletiyor; küçük deneylerle notlandırıyorum.'
        : 'Building data science and deep learning fundamentals through small documented experiments.',
      technologies: SKILLS_DESCRIPTIONS.datascience.technologies,
      link: SKILLS_DESCRIPTIONS.datascience.link,
      tone: 'text-ink-700 dark:text-white',
    },
  ];

  return (
    <section id="about" className="relative px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <KineticHeadline
            as="h2"
            gradient
            className="section-title justify-center text-center"
            text={isTurkish ? 'Hakkımda' : 'About Me'}
          />
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-ink-600 dark:text-ink-200">
            {isTurkish
              ? 'Öğrenmeyi bekleme odasında tutmadan, her yeni konuyu çalışan bir ürün parçasına çeviriyorum.'
              : 'I turn new topics into working product pieces instead of keeping learning separate from shipping.'}
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_0.9fr]">
          <motion.div
            className="card-prominent p-6 sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-3 text-caption text-cyan-700 dark:text-cyan-200">
              {isTurkish ? 'Çalışma tarzı' : 'Working style'}
            </p>
            <h3 className="mb-5 text-h2 text-ink-900 dark:text-white">
              {isTurkish ? 'Fikirden kullanılabilir arayüze.' : 'From idea to usable interface.'}
            </h3>
            <div className="space-y-4 text-body text-ink-600 dark:text-ink-200">
              <p>
                {isTurkish
                  ? 'Web, Android, güvenlik ve yapay zeka tarafında ilerlerken odağım aynı: problemi anlamak, küçük ama tamamlanmış bir çözüm kurmak, sonra arayüzü okunur ve hızlı hale getirmek.'
                  : 'Across web, Android, security, and AI, my focus stays the same: understand the problem, build a small complete solution, then make the interface readable and fast.'}
              </p>
              <p>
                {isTurkish
                  ? 'Bu portfolio, bitmiş görünen vitrin yerine öğrenme sürecimi ve yayınladığım işleri beraber gösteriyor. Güçlü olduğum alanları net anlatıyor, gelişen alanları da abartmadan işaretliyor.'
                  : 'This portfolio shows both shipped work and the learning process behind it. Strong areas are stated clearly, and developing areas are described without exaggeration.'}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <CountUp end={repoCount} suffix="+" label={isTurkish ? 'Public repo' : 'Public repos'} />
            <CountUp end={4} label={isTurkish ? 'Odak alanı' : 'Focus areas'} />
          </motion.div>
        </div>

        <ScrollScene blurReveal className="mt-8">
          <h4 className="mb-4 text-center text-caption text-ink-500 dark:text-ink-300">
            {isTurkish ? 'GitHub aktivitesi' : 'GitHub activity'}
          </h4>
          <div className="card-raised overflow-x-auto p-4">
            <img
              src={githubChartUrl}
              alt={isTurkish ? 'Mert Soylu GitHub katkı grafiği' : 'Mert Soylu GitHub contribution chart'}
              loading="lazy"
              decoding="async"
              className="mx-auto w-full max-w-3xl"
            />
          </div>
        </ScrollScene>

        <div className="mt-14">
          <KineticHeadline
            as="h3"
            className="mb-8 text-center text-h2 text-ink-900 dark:text-white"
            text={isTurkish ? 'Odak alanları' : 'Focus areas'}
          />
        </div>
        <div className="mt-2">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SpotlightCard
                  className="card-raised card-border-glow flex h-full flex-col p-6"
                  spotlightColor={isDark ? 'rgba(124, 92, 255, 0.20)' : 'rgba(124, 92, 255, 0.14)'}
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-ink-200/70 bg-white/70 dark:border-white/10 dark:bg-white/10 ${skill.tone}`}
                  >
                    {skill.icon}
                  </div>
                  <h4 className="mb-3 text-h4 text-ink-900 dark:text-white">{skill.title}</h4>
                  <p className="mb-4 text-body-sm text-ink-600 dark:text-ink-200">{skill.description}</p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {skill.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-ink-200/70 bg-white/50 px-2.5 py-1 text-xs font-bold text-ink-600 dark:border-white/10 dark:bg-white/10 dark:text-ink-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {skill.link && (
                    <Link
                      to={skill.link}
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-extrabold text-cyan-700 hover:text-accent-600 dark:text-cyan-200 dark:hover:text-accent-200"
                    >
                      {isTurkish ? 'Detayları gör' : 'View details'}
                      <HiArrowRight className="h-4 w-4" />
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
