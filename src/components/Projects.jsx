import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiStar, HiCode, HiExternalLink, HiRefresh, HiX } from 'react-icons/hi';
import {
  fetchGitHubRepos,
  fetchRepositoryReadme,
  getGitHubProfileUrl,
  getGitHubUsername,
  clearRateLimitState,
  resolveGitHubRepoReference,
  onReposUpdate,
} from '../utils/githubApi';
import { FALLBACK_PROJECTS } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import ScrollFloat from './ScrollFloat';
import ScrollReveal from './ScrollReveal';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

const INITIAL_README_STATE = {
  status: 'idle',
  content: '',
  errorMessage: '',
};

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

const ProjectDetailsSection = ({ project, isTurkish, getLanguageColor }) => {
  const formatDate = (dateValue) => {
    if (!dateValue) return isTurkish ? 'Belirtilmemiş' : 'Not available';
    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) return isTurkish ? 'Belirtilmemiş' : 'Not available';
    return parsedDate.toLocaleDateString(isTurkish ? 'tr-TR' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const projectDescription = project.description || (isTurkish ? 'Açıklama yok' : 'No description available');
  const topics = Array.isArray(project.topics) ? project.topics.filter(Boolean) : [];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-sand-200 dark:border-dark-400 bg-white/70 dark:bg-dark-600/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-sand-500 dark:text-dark-300">
          {isTurkish ? 'Açıklama' : 'Description'}
        </p>
        <p className="mt-2 text-sm text-sand-700 dark:text-dark-100 leading-relaxed">{projectDescription}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-sand-200 dark:border-dark-400 bg-white/70 dark:bg-dark-600/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-sand-500 dark:text-dark-300">{isTurkish ? 'Dil' : 'Language'}</p>
          {project.language ? (
            <span className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getLanguageColor(project.language)} text-white`}>
              {project.language}
            </span>
          ) : (
            <p className="mt-2 text-sm font-medium text-sand-800 dark:text-dark-100">{isTurkish ? 'Belirtilmemiş' : 'Not available'}</p>
          )}
        </div>
        <div className="rounded-xl border border-sand-200 dark:border-dark-400 bg-white/70 dark:bg-dark-600/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-sand-500 dark:text-dark-300">Stars</p>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-sand-800 dark:text-dark-100">
            <HiStar className="text-warm-500" />
            <span>{project.stargazers_count ?? 0}</span>
          </div>
        </div>
        <div className="rounded-xl border border-sand-200 dark:border-dark-400 bg-white/70 dark:bg-dark-600/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-sand-500 dark:text-dark-300">{isTurkish ? 'Fork Sayısı' : 'Forks'}</p>
          <p className="mt-2 text-sm font-semibold text-sand-800 dark:text-dark-100">{project.forks_count ?? 0}</p>
        </div>
        <div className="rounded-xl border border-sand-200 dark:border-dark-400 bg-white/70 dark:bg-dark-600/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-sand-500 dark:text-dark-300">{isTurkish ? 'Son Güncelleme' : 'Last Updated'}</p>
          <p className="mt-2 text-sm font-semibold text-sand-800 dark:text-dark-100">{formatDate(project.updated_at)}</p>
        </div>
      </div>
      {topics.length > 0 && (
        <div className="rounded-xl border border-sand-200 dark:border-dark-400 bg-white/70 dark:bg-dark-600/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-sand-500 dark:text-dark-300 mb-3">Topics</p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <span key={topic} className="px-2.5 py-1 rounded-full text-xs font-medium bg-sand-200/70 dark:bg-dark-500/70 text-sand-700 dark:text-dark-100">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectModal = ({ project, onClose, isTurkish, getLanguageColor, readmeState, activeModalTab, onTabChange, onRetryReadme }) => {
  if (typeof document === 'undefined') return null;

  const isReadmeUnavailable = readmeState.status === 'error' || readmeState.status === 'empty';
  const projectIdentity = project.full_name || (project.owner && project.repo ? `${project.owner}/${project.repo}` : null);

  const renderReadmePanel = () => {
    if (readmeState.status === 'loading' || readmeState.status === 'idle') {
      return (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="w-10 h-10 border-2 border-warm-300 border-t-warm-600 rounded-full animate-spin mb-4" />
          <p className="text-sm text-sand-600 dark:text-dark-200">{isTurkish ? 'README yükleniyor...' : 'Loading README...'}</p>
        </div>
      );
    }
    if (readmeState.status === 'error') {
      return (
        <div className="rounded-xl border border-red-300 dark:border-red-500/70 bg-red-50/70 dark:bg-red-900/30 p-4">
          <p className="text-sm text-red-700 dark:text-red-200 mb-3">{isTurkish ? 'README yüklenemedi.' : 'README could not be loaded.'}</p>
          <p className="text-xs text-red-700/90 dark:text-red-200/90 mb-4">{readmeState.errorMessage}</p>
          <button type="button" onClick={onRetryReadme} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-800/40 border border-red-300 dark:border-red-600 hover:bg-red-200 dark:hover:bg-red-700/40 text-red-700 dark:text-red-200 transition-colors">
            <HiRefresh className="w-4 h-4" />{isTurkish ? 'README Tekrar Dene' : 'Retry README'}
          </button>
        </div>
      );
    }
    if (readmeState.status === 'empty') {
      return (
        <div className="rounded-xl border border-amber-300 dark:border-amber-500/70 bg-amber-50/70 dark:bg-amber-900/30 p-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            {isTurkish ? 'Bu repo için README bulunamadı.' : 'No README was found for this repository.'}
          </p>
        </div>
      );
    }
    return (
      <div className="rounded-xl border border-sand-200 dark:border-dark-400 bg-white/70 dark:bg-dark-600/50 p-4">
        <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed font-sans text-sand-700 dark:text-dark-100">{readmeState.content}</pre>
      </div>
    );
  };

  const tabButtonClass = (isActive) => `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
    isActive ? 'bg-warm-500 text-white shadow-sm' : 'text-sand-700 dark:text-dark-200 hover:text-warm-600 dark:hover:text-warm-400 hover:bg-sand-100 dark:hover:bg-dark-600'
  }`;

  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 24 }} transition={{ type: 'spring', stiffness: 280, damping: 26 }} className="relative w-full max-w-4xl max-h-[90vh] bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-400 rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-sand-200 dark:border-dark-400">
          <button type="button" onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-sand-500 hover:text-sand-700 dark:text-dark-200 dark:hover:text-dark-50 hover:bg-sand-100 dark:hover:bg-dark-600 transition-colors" aria-label={isTurkish ? 'Modalı kapat' : 'Close modal'}>
            <HiX className="w-5 h-5" />
          </button>
          {project.language && (
            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mb-3 bg-gradient-to-r ${getLanguageColor(project.language)} text-white`}>{project.language}</span>
          )}
          <h3 className="text-2xl font-bold text-sand-900 dark:text-dark-50 pr-10">{project.name}</h3>
          {projectIdentity && <p className="mt-1 text-xs text-sand-500 dark:text-dark-300">{projectIdentity}</p>}
        </div>
        <div className="px-6 pt-4 border-b border-sand-200 dark:border-dark-400">
          <div className="inline-flex gap-2 p-1 bg-sand-100/80 dark:bg-dark-600/80 rounded-xl">
            <button type="button" className={tabButtonClass(activeModalTab === 'readme')} onClick={() => onTabChange('readme')}>README</button>
            <button type="button" className={tabButtonClass(activeModalTab === 'details')} onClick={() => onTabChange('details')}>{isTurkish ? 'Detay' : 'Details'}</button>
          </div>
        </div>
        <div className="px-6 py-5 overflow-y-auto">
          {activeModalTab === 'readme' ? (
            <>
              {renderReadmePanel()}
              {isReadmeUnavailable && (
                <div className="mt-6 pt-6 border-t border-sand-200 dark:border-dark-400">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <h4 className="text-sm font-semibold text-sand-800 dark:text-dark-100">{isTurkish ? 'Detaylar (yedek görünüm)' : 'Details (fallback)'}</h4>
                    <button type="button" onClick={() => onTabChange('details')} className="text-xs font-semibold text-warm-600 dark:text-warm-400 hover:text-warm-700 dark:hover:text-warm-300">
                      {isTurkish ? 'Detay sekmesini aç' : 'Open details tab'}
                    </button>
                  </div>
                  <ProjectDetailsSection project={project} isTurkish={isTurkish} getLanguageColor={getLanguageColor} />
                </div>
              )}
            </>
          ) : (
            <ProjectDetailsSection project={project} isTurkish={isTurkish} getLanguageColor={getLanguageColor} />
          )}
        </div>
        <div className="px-6 py-4 border-t border-sand-200 dark:border-dark-400 flex flex-wrap gap-3">
          <motion.a href={project.html_url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2" whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <HiExternalLink className="w-4 h-4" />GitHub
          </motion.a>
          <motion.button type="button" onClick={onClose} className="btn-secondary" whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            {isTurkish ? 'Kapat' : 'Close'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

const Projects = () => {
  const { isTurkish } = useLanguage();
  const { isDark } = useDarkMode();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedProject, setExpandedProject] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('readme');
  const [readmeState, setReadmeState] = useState({ ...INITIAL_README_STATE });
  const [readmeRetryCount, setReadmeRetryCount] = useState(0);

  const githubProfileUrl = getGitHubProfileUrl();
  const githubUsername = getGitHubUsername();

  const getProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const repos = await fetchGitHubRepos();
      setProjects(repos);
      setIsUsingFallback(false);
      setError(repos.length === 0 ? 'empty' : null);
    } catch (err) {
      setProjects(FALLBACK_PROJECTS);
      setIsUsingFallback(true);
      setError(err instanceof Error ? err.message : 'fetch_error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { getProjects(); }, [getProjects]);

  // Stale-while-revalidate: update UI when fresh data arrives in background
  useEffect(() => {
    const unsubscribe = onReposUpdate((freshRepos) => {
      setProjects(freshRepos);
      setIsUsingFallback(false);
      setError(freshRepos.length === 0 ? 'empty' : null);
    });
    return unsubscribe;
  }, []);

  const closeProjectModal = useCallback(() => {
    setExpandedProject(null);
    setActiveModalTab('readme');
    setReadmeState({ ...INITIAL_README_STATE });
  }, []);

  const openProjectModal = useCallback((project) => {
    setExpandedProject(project);
    setActiveModalTab('readme');
    setReadmeState({ ...INITIAL_README_STATE });
  }, []);

  const retryReadme = useCallback(() => { setReadmeRetryCount((prev) => prev + 1); }, []);

  useEffect(() => {
    if (!expandedProject) return undefined;
    let isCancelled = false;
    const loadReadme = async () => {
      const repoReference = resolveGitHubRepoReference(expandedProject);
      if (!repoReference) {
        if (!isCancelled) setReadmeState({ status: 'empty', content: '', errorMessage: '' });
        return;
      }
      if (!isCancelled) setReadmeState({ status: 'loading', content: '', errorMessage: '' });
      try {
        const readmeContent = await fetchRepositoryReadme(repoReference);
        if (isCancelled) return;
        if (typeof readmeContent === 'string' && readmeContent.trim().length > 0) {
          setReadmeState({ status: 'success', content: readmeContent, errorMessage: '' });
          return;
        }
        setReadmeState({ status: 'empty', content: '', errorMessage: '' });
      } catch (err) {
        if (isCancelled) return;
        setReadmeState({ status: 'error', content: '', errorMessage: err instanceof Error ? err.message : (isTurkish ? 'README yüklenirken hata oluştu.' : 'Failed to load README.') });
      }
    };
    loadReadme();
    return () => { isCancelled = true; };
  }, [expandedProject, readmeRetryCount, isTurkish]);

  useEffect(() => {
    if (!expandedProject) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleEscape = (event) => { if (event.key === 'Escape') closeProjectModal(); };
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [expandedProject, closeProjectModal]);

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
    <section id="projects" className="py-12 px-4 relative">
      <AnimatePresence>
        {expandedProject && (
          <ProjectModal
            project={expandedProject}
            onClose={closeProjectModal}
            isTurkish={isTurkish}
            getLanguageColor={getLanguageColor}
            readmeState={readmeState}
            activeModalTab={activeModalTab}
            onTabChange={setActiveModalTab}
            onRetryReadme={retryReadme}
          />
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <ScrollFloat
            containerClassName="overflow-hidden"
            textClassName="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-warm-600 via-warm-500 to-sand-500 bg-clip-text text-transparent"
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            {isTurkish ? 'Projelerim' : 'My Projects'}
          </ScrollFloat>
          <ScrollReveal
            containerClassName="mt-4"
            textClassName="text-lg text-sand-700 dark:text-dark-200 font-normal"
            enableBlur={true}
            baseOpacity={0.1}
            baseRotation={3}
            blurStrength={4}
          >
            {isTurkish ? 'GitHub profilimdeki repolar' : 'Repositories from my GitHub profile'}
          </ScrollReveal>
        </div>

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
                className={`relative px-4 py-2 min-h-[44px] rounded-full text-sm font-medium border transition-colors duration-200 cursor-pointer flex items-center ${
                  activeFilter === lang
                    ? 'border-warm-500 shadow-md text-white'
                    : 'bg-white/40 dark:bg-dark-600/40 text-sand-700 dark:text-dark-200 border-sand-200 dark:border-dark-400 hover:border-warm-500/50 hover:text-warm-600 dark:hover:text-warm-400'
                }`}
              >
                {activeFilter === lang && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-warm-500 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {lang === 'All' ? (isTurkish ? 'Tümü' : 'All') : lang}
                </span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Error state */}
        {!loading && error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-lg text-center mb-8">
            {error === 'empty' ? (isTurkish ? 'Herkese açık repo bulunamadı.' : 'No public repositories found.') : error}
            {error !== 'empty' && (
              <motion.button onClick={() => { clearRateLimitState(); getProjects(); }} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-800/40 border border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-200 text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-700/40 transition-colors cursor-pointer" whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <HiRefresh className="w-4 h-4" />{isTurkish ? 'Tekrar Dene' : 'Try Again'}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Skeleton loading */}
        {loading && projects.length === 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <ProjectSkeleton key={i} />)}
          </div>
        )}

        {/* Projects — ScrollStack */}
        {!loading && filteredProjects.length > 0 && (
          <ScrollStack
            useWindowScroll={true}
            itemDistance={200}
            itemScale={0.03}
            itemStackDistance={30}
            stackPosition="20%"
            scaleEndPosition="10%"
            baseScale={0.85}
            rotationAmount={0}
            blurAmount={0}
          >
            {filteredProjects.map((project) => (
              <ScrollStackItem
                key={project.id || project.name}
                itemClassName="!h-auto !my-4 !p-0 !rounded-2xl !shadow-none"
              >
                <div
                  className="bg-white/80 dark:bg-dark-600/80 backdrop-blur-md border border-sand-200 dark:border-dark-400 rounded-2xl p-6 cursor-pointer hover:border-warm-500/50 transition-colors"
                  onClick={() => openProjectModal(project)}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      {project.language && (
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getLanguageColor(project.language)} text-white`}>
                          {project.language}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-sand-900 dark:text-dark-50">
                        {project.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-sand-500 dark:text-dark-300 shrink-0">
                      {project.stargazers_count > 0 && (
                        <div className="flex items-center gap-1">
                          <HiStar className="text-warm-500" />
                          <span>{project.stargazers_count}</span>
                        </div>
                      )}
                      {project.forks_count > 0 && (
                        <span>{project.forks_count} forks</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sand-600 dark:text-dark-200 text-sm mb-4 line-clamp-2">
                    {project.description || (isTurkish ? 'Açıklama yok' : 'No description available')}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(project.topics) && project.topics.slice(0, 4).map((topic) => (
                        <span key={topic} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-sand-200/70 dark:bg-dark-500/70 text-sand-600 dark:text-dark-200">
                          {topic}
                        </span>
                      ))}
                    </div>
                    <motion.a
                      href={project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-600 dark:text-warm-400 hover:text-warm-700"
                      whileHover={{ scale: 1.05 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub <HiExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        )}

        {!loading && filteredProjects.length === 0 && !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sand-600 dark:text-dark-200 py-12">
            {activeFilter !== 'All'
              ? (isTurkish ? `"${activeFilter}" dilinde proje bulunamadı.` : `No projects found in ${activeFilter}.`)
              : (isTurkish ? 'Gösterilecek proje yok.' : 'No projects to display.')}
          </motion.div>
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
              whileHover={{ scale: 1.06, y: -4, boxShadow: '0 8px 30px rgba(240, 125, 45, 0.45)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              {isTurkish
                ? `GitHub'da ${isUsingFallback ? `${githubUsername} kullanıcısının` : 'Tüm'} Projelerini Gör`
                : `View ${isUsingFallback ? `${githubUsername}'s` : 'All'} Projects on GitHub`}
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
