import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiChip, HiCode, HiShieldCheck, HiSparkles } from 'react-icons/hi';
import { HiAcademicCap } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { fetchGitHubRepos } from '../utils/githubApi';
import { useLanguage } from '../context/LanguageContext';
import { SKILLS_DESCRIPTIONS } from '../utils/constants';
import ScrollScene from './motion/ScrollScene';
import SectionHeader from './home/SectionHeader';
import NumberedCard from './home/NumberedCard';

const EASE = [0.22, 1, 0.36, 1];

const CountStat = ({ end, suffix = '', label }) => {
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
    <div ref={ref} className="text-left lg:text-right">
      <div className="gradient-text text-4xl font-extrabold leading-none md:text-5xl">
        {count}
        {suffix}
      </div>
      <div className="lab-mono mt-2 text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300">
        {label}
      </div>
    </div>
  );
};

const About = () => {
  const { isTurkish } = useLanguage();
  const reduce = useReducedMotion();
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
      icon: <HiCode className="h-6 w-6" />,
      title: isTurkish ? SKILLS_DESCRIPTIONS.web.title.tr : SKILLS_DESCRIPTIONS.web.title.en,
      description: isTurkish
        ? 'React ve Tailwind ile hızlı, bakımı kolay, görsel olarak güçlü web arayüzleri geliştiriyorum.'
        : 'Building fast, maintainable, visually strong web interfaces with React and Tailwind.',
      technologies: SKILLS_DESCRIPTIONS.web.technologies,
      link: SKILLS_DESCRIPTIONS.web.link,
      tone: 'text-cyan-600 dark:text-cyan-200',
    },
    {
      icon: <HiAcademicCap className="h-6 w-6" />,
      title: isTurkish ? SKILLS_DESCRIPTIONS.android.title.tr : SKILLS_DESCRIPTIONS.android.title.en,
      description: isTurkish
        ? 'Yayınlanabilir mobil ürünler için native Android, Compose ve kullanıcı akışlarına odaklanıyorum.'
        : 'Focusing on native Android, Compose, and user flows for shippable mobile products.',
      technologies: SKILLS_DESCRIPTIONS.android.technologies,
      link: SKILLS_DESCRIPTIONS.android.link,
      tone: 'text-emerald-600 dark:text-emerald-200',
    },
    {
      icon: <HiShieldCheck className="h-6 w-6" />,
      title: isTurkish ? SKILLS_DESCRIPTIONS.security.title.tr : SKILLS_DESCRIPTIONS.security.title.en,
      description: isTurkish
        ? 'Güvenli kodlama, web açıkları ve otomasyon araçlarını pratik projelerle çalışıyorum.'
        : 'Practicing secure coding, web vulnerabilities, and automation tools through real projects.',
      technologies: SKILLS_DESCRIPTIONS.security.technologies,
      link: SKILLS_DESCRIPTIONS.security.link,
      tone: 'text-accent-600 dark:text-accent-200',
    },
    {
      icon: <HiChip className="h-6 w-6" />,
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
    <section id="about" className="relative px-4 py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="01"
          kicker={isTurkish ? 'Profil' : 'Profile'}
          kickerIcon={<HiSparkles className="h-4 w-4" />}
          title={isTurkish ? 'Hakkımda' : 'About me'}
          lead={
            isTurkish
              ? 'Öğrenmeyi bekleme odasında tutmadan, her yeni konuyu çalışan bir ürün parçasına çeviriyorum.'
              : 'I turn new topics into working product pieces instead of keeping learning separate from shipping.'
          }
          aside={
            <div className="flex items-end gap-8 lg:flex-col lg:items-end lg:gap-6">
              <CountStat end={repoCount} suffix="+" label={isTurkish ? 'Public repo' : 'Public repos'} />
              <CountStat end={4} suffix="" label={isTurkish ? 'Odak alanı' : 'Focus areas'} />
            </div>
          }
        />

        {/* Working style — asymmetric statement + activity panel */}
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            className="card-prominent relative overflow-hidden p-7 sm:p-9"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32, clipPath: 'inset(10% 0% 10% 0%)' }}
            whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-gradient-to-br from-violet-500/15 to-aqua-300/15 blur-3xl"
            />
            <p className="lab-mono mb-4 text-[11px] uppercase tracking-[0.2em] text-cyan-700 dark:text-aqua-200">
              {isTurkish ? '> calisma_tarzi' : '> working_style'}
            </p>
            <h3 className="mb-6 max-w-md text-h2 leading-tight text-ink-900 dark:text-white">
              {isTurkish ? 'Fikirden kullanılabilir arayüze.' : 'From idea to usable interface.'}
            </h3>
            <div className="space-y-5 text-body text-ink-600 dark:text-ink-200">
              <p className="border-l-2 border-violet-400/70 pl-4 dark:border-aqua-300/50">
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

          <ScrollScene blurReveal className="h-full">
            <div className="studio-panel flex h-full flex-col p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3 border-b border-ink-200/60 pb-3 dark:border-white/10">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-ember-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-aqua-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
                </span>
                <span className="lab-mono flex-1 text-[11px] text-ink-500 dark:text-ink-300">
                  contrib --graph · @MertSoylu
                </span>
              </div>
              <div className="flex flex-1 items-center overflow-x-auto">
                <img
                  src={githubChartUrl}
                  alt={isTurkish ? 'Mert Soylu GitHub katkı grafiği' : 'Mert Soylu GitHub contribution chart'}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto w-full min-w-full max-w-3xl sm:min-w-[480px]"
                />
              </div>
            </div>
          </ScrollScene>
        </div>

        {/* Focus areas */}
        <div className="mb-7 mt-16 flex items-center gap-3">
          <p className="lab-mono text-[11px] uppercase tracking-[0.18em] text-violet-700 dark:text-aqua-200">
            {isTurkish ? 'Odak alanları' : 'Focus areas'}
          </p>
          <div className="studio-rule flex-1" />
          <p className="lab-mono hidden text-[11px] uppercase tracking-[0.18em] text-ink-400 dark:text-ink-300 sm:block">
            04 / {isTurkish ? 'disiplin' : 'disciplines'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {skills.map((skill, index) => (
            <NumberedCard key={skill.title} index={index + 1} delay={index * 0.08} className="p-6">
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-ink-200/70 bg-white/70 transition-transform duration-500 group-hover:-rotate-6 dark:border-white/10 dark:bg-white/10 ${skill.tone}`}
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
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-extrabold text-cyan-700 transition-colors hover:text-accent-600 dark:text-cyan-200 dark:hover:text-accent-200"
                >
                  {isTurkish ? 'Detayları gör' : 'View details'}
                  <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </NumberedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
