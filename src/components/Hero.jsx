import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight, HiMail } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import { fetchGitHubRepos } from '../utils/githubApi';
import { HERO_ROLES } from '../utils/constants';
import ASCIIText from './ui/ASCIIText';
import RotatingText from './RotatingText';
import GradientText from './ui/GradientText';

const EASE = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const Hero = () => {
  const { isTurkish } = useLanguage();
  const [repoCount, setRepoCount] = useState(null);
  const roles = isTurkish ? HERO_ROLES.tr : HERO_ROLES.en;

  useEffect(() => {
    fetchGitHubRepos()
      .then((repos) => setRepoCount(repos.length))
      .catch(() => setRepoCount(null));
  }, []);

  const handleProjectJump = (event) => {
    event.preventDefault();
    const target = document.getElementById('projects');
    if (!target) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.history.pushState(null, '', '#projects');
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const handleContactJump = (event) => {
    event.preventDefault();
    const target = document.getElementById('contact');
    if (!target) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.history.pushState(null, '', '#contact');
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-5 pt-24 pb-16 sm:pt-28 sm:pb-20">
      <div className="container-wide">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p variants={item} className="eyebrow mb-4 text-accent sm:mb-6">
            {isTurkish ? 'Merhaba, ben' : "Hi, I'm"}
          </motion.p>

          <motion.div variants={item} className="mb-1 w-full sm:mb-2">
            <h1 className="sr-only">Mert Soylu</h1>
            {/* Mobile: crisp, legible serif wordmark. sm+: ASCII signature. */}
            <p
              aria-hidden="true"
              className="text-center font-display text-[2.65rem] font-semibold leading-[1.04] tracking-tight text-fg sm:hidden"
            >
              Mert Soylu
            </p>
            <div aria-hidden="true" className="hidden justify-center sm:flex">
              <ASCIIText
                text="Mert Soylu"
                asciiFontSize={10}
                enableWaves
                className="w-full max-w-2xl h-32 sm:h-40"
              />
            </div>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-3 font-display text-xl font-medium sm:mt-4 sm:text-2xl lg:text-3xl"
          >
            <RotatingText
              texts={roles}
              rotationInterval={3000}
              mainClassName="text-accent"
              splitBy="characters"
              staggerDuration={0.02}
              staggerFrom="last"
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            />
          </motion.p>

          <motion.p variants={item} className="mt-4 mx-auto max-w-xl text-body-lg text-muted sm:mt-6">
            {isTurkish
              ? 'Web, Android, güvenlik ve yapay zeka alanlarında çalışıyorum; fikirleri hızlı, okunur ve gerçekten çalışan arayüzlere dönüştürüyorum.'
              : 'I work across web, Android, security, and AI — turning ideas into fast, readable interfaces that actually ship.'}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10 sm:gap-4">
            <a
              href="#projects"
              onClick={handleProjectJump}
              className="group relative inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-6 py-3 text-sm font-semibold text-fg transition-all duration-300 hover:border-accent/60 hover:bg-accent/10 hover:shadow-[0_0_20px_rgba(194,86,47,0.15)]"
            >
              <GradientText
                colors={['#C2562F', '#FF9FFC', '#C2562F']}
                animationSpeed={6}
                className="!text-sm !font-semibold"
              >
                {isTurkish ? 'Projeleri incele' : 'View projects'}
              </GradientText>
              <HiArrowRight className="h-4 w-4 text-accent transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              onClick={handleContactJump}
              className="group inline-flex items-center gap-2 rounded-full border border-line/20 bg-surface px-6 py-3 text-sm font-semibold text-muted transition-all duration-300 hover:border-line/40 hover:text-fg hover:shadow-soft"
            >
              <HiMail className="h-4 w-4" />
              {isTurkish ? 'İletişime geç' : 'Get in touch'}
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-muted sm:mt-8"
          >
            {repoCount != null && (
              <span className="inline-flex items-center gap-2">
                <span className="font-display text-base font-semibold text-fg">{repoCount}+</span>
                {isTurkish ? 'public repo' : 'public repos'}
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {isTurkish ? 'Remote / hibrit çalışmaya açık' : 'Open to remote / hybrid'}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
