import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiStar, HiCode, HiExternalLink } from 'react-icons/hi';
import {
  fetchGitHubRepos,
  getGitHubProfileUrl,
  getGitHubUsername,
} from '../utils/githubApi';
import { FALLBACK_PROJECTS } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import TiltCard from './TiltCard';

/* ── Skeleton card for loading state ── */
const ProjectSkeleton = () => (
  <div className="relative h-full bg-white/40 dark:bg-dark-600/40 backdrop-blur-md rounded-xl border border-sand-200 dark:border-dark-400 overflow-hidden flex flex-col animate-pulse">
    <div className="h-1 bg-sand-200 dark:bg-dark-500 w-full" />
    <div className="p-6 flex flex-col flex-grow gap-3">
      <div className="h-6 bg-sand-200 dark:bg-dark-500 rounded-md w-3/4" />
      <div className="h-4 bg-sand-100 dark:bg-dark-600 rounded w-full" />
      <div className="h-4 bg-sand-100 dark:bg-dark-600 rounded w-5/6" />
      <div className="h-4 bg-sand-100 dark:bg-dark-600 rounded w-2/3" />
      <div className="mt-auto flex gap-3">
        <div className="h-4 bg-sand-200 dark:bg-dark-500 rounded-full w-16" />
        <div className="h-4 bg-sand-200 dark:bg-dark-500 rounded-full w-20" />
      </div>
    </div>
  </div>
);

/* ── Animated section underline ── */
const AnimatedUnderline = () => (
  <motion.div
    className="h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-warm-500 to-sand-400"
    initial={{ width: 0 }}
    whileInView={{ width: 80 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
  />
);


const Projects = () => {
  const { isTurkish } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const githubProfileUrl = getGitHubProfileUrl();
  const githubUsername = getGitHubUsername();

  useEffect(() => {
    const getProjects = async () => {
      try {
        setLoading(true);
        const repos = await fetchGitHubRepos();
        setProjects(repos);
        setIsUsingFallback(false);
        setError(repos.length === 0 ? 'empty' : null);
      } catch (err) {
        setProjects([]);
        setIsUsingFallback(false);
        setError('fetch_error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  /* Fan-open animation: each card comes from below with a slight rotation */
  const fanVariants = (index) => ({
    hidden: {
      opacity: 0,
      y: 80,
      rotate: (index % 2 === 0 ? -1 : 1) * (3 + index),
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: 'easeOut',
        delay: index * 0.08,
      },
    },
  });

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: 'from-yellow-400 to-yellow-600',
      TypeScript: 'from-blue-400 to-blue-600',
      Python: 'from-cyan-400 to-cyan-600',
      Java: 'from-orange-400 to-orange-600',
      HTML: 'from-red-400 to-red-600',
      CSS: 'from-pink-400 to-pink-600',
      React: 'from-cyan-400 to-blue-600',
      null: 'from-gray-400 to-gray-600',
    };
    return colors[language] || colors.null;
  };

  const languages = ['All', ...Array.from(new Set(projects.map((p) => p.language).filter(Boolean)))];
  const filteredProjects = activeFilter === 'All' ? projects : projects.filter((p) => p.language === activeFilter);

  return (
    <section id="projects" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="section-title">{isTurkish ? 'Projelerim' : 'My Projects'}</h2>
            <AnimatedUnderline />
            <p className="section-subtitle mt-6">
              {isTurkish ? 'GitHub profilimdeki repolar' : 'Repositories from my GitHub profile'}
            </p>
          </motion.div>

          {/* Language filter buttons */}
          {!loading && projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap gap-2 justify-center mb-10"
            >
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveFilter(lang)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
                    activeFilter === lang
                      ? 'bg-warm-500 text-white border-warm-500 shadow-md'
                      : 'bg-white/40 dark:bg-dark-600/40 text-sand-700 dark:text-dark-200 border-sand-200 dark:border-dark-400 hover:border-warm-500/50 hover:text-warm-600 dark:hover:text-warm-400'
                  }`}
                >
                  {lang === 'All' ? (isTurkish ? 'Tümü' : 'All') : lang}
                </button>
              ))}
            </motion.div>
          )}

          {/* Error state */}
          {!loading && error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-lg text-center mb-8"
            >
              {error === 'empty'
                ? (isTurkish ? 'Herkese açık repo bulunamadı.' : 'No public repositories found.')
                : (isTurkish ? 'Repolar alınamadı.' : 'Failed to fetch repositories.')}
            </motion.div>
          )}

          {/* Skeleton loading — only when no data yet */}
          {loading && projects.length === 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ProjectSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Projects grid */}
          {!loading && (
            <>
              {filteredProjects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-container">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      variants={fanVariants(index)}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-40px' }}
                      className="group h-full"
                    >
                      <TiltCard className="relative h-full bg-white/40 dark:bg-dark-600/40 backdrop-blur-md rounded-xl border border-sand-200 dark:border-dark-400 overflow-hidden flex flex-col transition-shadow duration-300 group-hover:shadow-xl/20">
                        {/* Language badge */}
                        {project.language && (
                          <div className={`bg-gradient-to-r ${getLanguageColor(project.language)} p-px`}>
                            <div className="bg-white/95 dark:bg-dark-700/95 px-3 py-1">
                              <span className={`text-xs font-semibold bg-gradient-to-r ${getLanguageColor(project.language)} bg-clip-text text-transparent`}>
                                {project.language}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow relative z-10">
                          <h3 className="text-xl font-bold text-sand-900 dark:text-dark-50 mb-2 group-hover:text-warm-600 dark:group-hover:text-warm-400 transition-colors duration-300">
                            {project.name}
                          </h3>

                          <p className="text-sand-600 dark:text-dark-200 text-sm mb-4 flex-grow line-clamp-3">
                            {project.description || (isTurkish ? 'Açıklama yok' : 'No description available')}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center gap-4 mb-6 text-sm text-sand-600 dark:text-dark-200">
                            {project.stargazers_count > 0 && (
                              <div className="flex items-center gap-1">
                                <HiStar className="text-warm-500" />
                                <span>{project.stargazers_count}</span>
                              </div>
                            )}
                            {project.language && (
                              <div className="flex items-center gap-1">
                                <HiCode className="text-warm-500" />
                                <span>{project.language}</span>
                              </div>
                            )}
                          </div>

                          {/* CTA Button */}
                          <motion.a
                            href={project.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-warm-600 dark:text-warm-400 font-semibold hover:text-warm-700 dark:hover:text-warm-300 group/link"
                            whileHover={{ x: 6 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                          >
                            {isTurkish ? 'GitHub\'da Gör' : 'View on GitHub'}
                            <HiExternalLink className="group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
                          </motion.a>
                        </div>
                      </TiltCard>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sand-600 dark:text-dark-200 py-12"
                >
                  {activeFilter !== 'All'
                    ? (isTurkish ? `"${activeFilter}" dilinde proje bulunamadı.` : `No projects found in ${activeFilter}.`)
                    : (isTurkish ? 'Gösterilecek proje yok.' : 'No projects to display.')}
                </motion.div>
              )}
            </>
          )}

          {/* View all projects link */}
          {!loading && projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mt-12"
            >
              <motion.a
                href={githubProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isTurkish
                  ? `GitHub'da ${isUsingFallback ? `${githubUsername} kullanıcısının` : 'Tüm'} Projelerini Gör`
                  : `View ${isUsingFallback ? `${githubUsername}'s` : 'All'} Projects on GitHub`}
              </motion.a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
