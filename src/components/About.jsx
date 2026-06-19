import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { HiArrowRight, HiCode, HiShieldCheck, HiChip, HiSparkles, HiAcademicCap } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { fetchGitHubRepos } from '../utils/githubApi';
import { useLanguage } from '../context/LanguageContext';
import { SKILLS_DESCRIPTIONS } from '../utils/constants';
import MagicBento from './ui/MagicBento';

const CountStat = ({ end, suffix = '', label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    let frameId = null;
    const duration = 1300;
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
    <div ref={ref}>
      <div className="font-display text-3xl font-semibold leading-none text-fg md:text-4xl">
        {count}
        {suffix}
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</div>
    </div>
  );
};

const About = () => {
  const { isTurkish } = useLanguage();
  const [repoCount, setRepoCount] = useState(0);

  const githubChartUrl = useMemo(() => {
    const date = new Date().toISOString().split('T')[0];
    return `https://ghchart.rshah.org/c2562f/MertSoylu?t=${date}`;
  }, []);

  useEffect(() => {
    fetchGitHubRepos()
      .then((repos) => setRepoCount(repos.length))
      .catch(() => setRepoCount(0));
  }, []);

  const skills = [
    {
      icon: <HiCode className="h-5 w-5" />,
      title: isTurkish ? SKILLS_DESCRIPTIONS.web.title.tr : SKILLS_DESCRIPTIONS.web.title.en,
      description: isTurkish
        ? 'React ve Tailwind ile hızlı, bakımı kolay arayüzler.'
        : 'Fast, maintainable interfaces built with React and Tailwind.',
      technologies: SKILLS_DESCRIPTIONS.web.technologies,
      link: SKILLS_DESCRIPTIONS.web.link,
    },
    {
      icon: <HiAcademicCap className="h-5 w-5" />,
      title: isTurkish ? SKILLS_DESCRIPTIONS.android.title.tr : SKILLS_DESCRIPTIONS.android.title.en,
      description: isTurkish
        ? 'Native Android ve Compose ile yayınlanabilir mobil ürünler.'
        : 'Shippable mobile products with native Android and Compose.',
      technologies: SKILLS_DESCRIPTIONS.android.technologies,
      link: SKILLS_DESCRIPTIONS.android.link,
    },
    {
      icon: <HiShieldCheck className="h-5 w-5" />,
      title: isTurkish ? SKILLS_DESCRIPTIONS.security.title.tr : SKILLS_DESCRIPTIONS.security.title.en,
      description: isTurkish
        ? 'Güvenli kodlama, web açıkları ve güvenlik otomasyonu araçları.'
        : 'Secure coding, web vulnerabilities, and security automation tools.',
      technologies: SKILLS_DESCRIPTIONS.security.technologies,
      link: SKILLS_DESCRIPTIONS.security.link,
    },
    {
      icon: <HiChip className="h-5 w-5" />,
      title: isTurkish ? SKILLS_DESCRIPTIONS.datascience.title.tr : SKILLS_DESCRIPTIONS.datascience.title.en,
      description: isTurkish
        ? 'Küçük deneylerle veri bilimi ve derin öğrenme temelleri.'
        : 'Data science and deep learning fundamentals through small experiments.',
      technologies: SKILLS_DESCRIPTIONS.datascience.technologies,
      link: SKILLS_DESCRIPTIONS.datascience.link,
    },
  ];

  const bentoItems = [
    {
      className: 'bento-profile',
      content: (
        <div className="p-6">
          <HiSparkles className="mb-3 h-5 w-5 text-accent" />
          <h2 className="font-display text-2xl font-semibold text-fg">
            {isTurkish ? 'Hakkımda' : 'About me'}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {isTurkish
              ? 'Öğrendiğim her yeni konuyu bekletmeden çalışan bir ürün parçasına dönüştürüyorum.'
              : 'I turn what I learn into a working piece of product, instead of letting it sit on a shelf.'}
          </p>
        </div>
      ),
    },
    {
      className: 'bento-philosophy',
      content: (
        <div className="p-6 h-full flex flex-col justify-center">
          <h3 className="font-display text-xl font-semibold text-fg">
            {isTurkish ? 'Fikirden kullanılabilir arayüze.' : 'From idea to usable interface.'}
          </h3>
          <p className="mt-3 text-sm text-muted border-l-2 border-accent/60 pl-4">
            {isTurkish
              ? 'Web, Android, güvenlik ve yapay zeka tarafında yaklaşımım aynı: problemi anla, küçük ama eksiksiz bir çözüm kur, sonra arayüzü okunur ve hızlı hale getir.'
              : 'Across web, Android, security, and AI, my approach stays the same: understand the problem, build a small but complete solution, then make the interface readable and fast.'}
          </p>
        </div>
      ),
    },
    {
      className: 'bento-github',
      content: (
        <div className="p-5 h-full flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-display text-base font-semibold text-fg">GitHub</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              @MertSoylu
            </span>
          </div>
          <div className="flex-1 flex items-center overflow-hidden">
            <img
              src={githubChartUrl}
              alt={isTurkish ? 'GitHub katkı grafiği' : 'GitHub contribution chart'}
              loading="lazy"
              decoding="async"
              className="w-full object-contain"
            />
          </div>
        </div>
      ),
    },
    {
      className: 'bento-stats',
      content: (
        <div className="p-6 flex items-center gap-8">
          <CountStat end={repoCount} suffix="+" label={isTurkish ? 'Public repo' : 'Public repos'} />
          <CountStat end={4} label={isTurkish ? 'Odak alanı' : 'Focus areas'} />
        </div>
      ),
    },
    ...skills.map((skill) => ({
      className: 'bento-skill',
      content: (
        <div className="flex h-full flex-col p-4 sm:p-5">
          <div className="mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface2 text-accent sm:h-10 sm:w-10">
            {skill.icon}
          </div>
          <h4 className="mb-1.5 font-display text-base font-semibold leading-snug text-fg sm:text-lg">
            {skill.title}
          </h4>
          <p className="mb-3 line-clamp-3 flex-1 text-xs leading-relaxed text-muted sm:text-sm">
            {skill.description}
          </p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {skill.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line/12 bg-surface2 px-2 py-0.5 text-[10px] font-medium text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
          {skill.link && (
            <Link
              to={skill.link}
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-strong"
            >
              {isTurkish ? 'Detaylar' : 'Details'}
              <HiArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      ),
    })),
  ];

  return (
    <section id="about" className="relative px-5 py-12 sm:py-20 md:py-24">
      <div className="container-wide">
        <style>{`
          .bento-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
          }
          .bento-card {
            position: relative;
            border-radius: 1rem;
            border: 1px solid rgb(var(--line) / 0.12);
            background: rgb(var(--surface));
            overflow: hidden;
            transition: all 0.3s ease;
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
          }
          .bento-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(400px circle at var(--glow-x) var(--glow-y),
              rgba(194, 86, 47, calc(var(--glow-intensity) * 0.15)) 0%,
              transparent 60%);
            pointer-events: none;
            z-index: 0;
          }
          .bento-card > * { position: relative; z-index: 1; }
          .bento-profile { grid-column: 1 / 3; }
          .bento-philosophy { grid-column: 3 / 5; grid-row: 1; }
          .bento-github { grid-column: 1 / 3; grid-row: 2; }
          .bento-stats { grid-column: 3 / 5; grid-row: 2; }
          .bento-skill { grid-column: span 1; }
          @media (max-width: 1024px) {
            .bento-grid { grid-template-columns: repeat(2, 1fr); }
            .bento-profile { grid-column: 1 / 3; }
            .bento-philosophy { grid-column: 1 / 3; grid-row: auto; }
            .bento-github { grid-column: 1 / 3; grid-row: auto; }
            .bento-stats { grid-column: 1 / 3; grid-row: auto; }
            .bento-skill { grid-column: span 1; }
          }
          @media (max-width: 640px) {
            .bento-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
            .bento-profile { grid-column: 1 / 3; }
            .bento-philosophy { grid-column: 1 / 3; grid-row: auto; }
            .bento-github { grid-column: 1 / 3; grid-row: auto; }
            .bento-stats { grid-column: 1 / 3; grid-row: auto; }
            .bento-skill { grid-column: span 1; }
          }
        `}</style>

        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          <HiSparkles className="mr-1 inline h-4 w-4" />
          {isTurkish ? 'Profil' : 'Profile'}
        </div>

        <MagicBento items={bentoItems} glowColor="194, 86, 47" />
      </div>
    </section>
  );
};

export default About;
