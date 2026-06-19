import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion';
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import PageMeta from './components/PageMeta';
import { DiReact, DiNodejsSmall, DiPython, DiAndroid, DiGit, DiDocker } from 'react-icons/di';
import { SiTypescript, SiTailwindcss, SiKotlin, SiPostgresql, SiFigma, SiFirebase } from 'react-icons/si';
import Aurora from './components/ui/Aurora';
import ClickSpark from './components/ui/ClickSpark';
import Noise from './components/ui/Noise';
import LogoLoop from './components/ui/LogoLoop';
import { Toaster } from 'react-hot-toast';

const lazyWithRetry = (importer, cacheKey) =>
  lazy(async () => {
    try {
      const module = await importer();
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(cacheKey);
      }
      return module;
    } catch (error) {
      if (typeof window !== 'undefined') {
        const hasRetried = window.sessionStorage.getItem(cacheKey) === '1';
        if (!hasRetried) {
          window.sessionStorage.setItem(cacheKey, '1');
          window.location.reload();
          return { default: () => null };
        }
      }
      throw error;
    }
  });

const WebDevPage = lazyWithRetry(() => import('./pages/WebDevPage'), 'lazy-retry-web');
const AndroidPage = lazyWithRetry(() => import('./pages/AndroidPage'), 'lazy-retry-android');
const CyberSecurityPage = lazyWithRetry(() => import('./pages/CyberSecurityPage'), 'lazy-retry-cyber');
const DataSciencePage = lazyWithRetry(() => import('./pages/DataSciencePage'), 'lazy-retry-data');
const About = lazyWithRetry(() => import('./components/About'), 'lazy-retry-about');
const Certificates = lazyWithRetry(() => import('./components/Certificates'), 'lazy-retry-certificates');
const Projects = lazyWithRetry(() => import('./components/Projects'), 'lazy-retry-projects');
const Contact = lazyWithRetry(() => import('./components/Contact'), 'lazy-retry-contact');
const MnemosyneCaseStudy = lazyWithRetry(
  () => import('./pages/case-studies/MnemosyneCaseStudy'),
  'lazy-retry-mnemosyne-case',
);
const TypeSprintCaseStudy = lazyWithRetry(
  () => import('./pages/case-studies/TypeSprintCaseStudy'),
  'lazy-retry-typesprint-case',
);
const WalkKittieCaseStudy = lazyWithRetry(
  () => import('./pages/case-studies/WalkKittieCaseStudy'),
  'lazy-retry-walkkittie-case',
);
const MsscanCaseStudy = lazyWithRetry(
  () => import('./pages/case-studies/MsscanCaseStudy'),
  'lazy-retry-msscan-case',
);
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage'), 'lazy-retry-404');

const SectionDivider = () => (
  <div className="container-wide py-2">
    <div className="rule" />
  </div>
);

const techLogos = [
  <DiReact key="react" className="text-[#61DAFB]" />,
  <DiNodejsSmall key="node" className="text-[#339933]" />,
  <SiTypescript key="ts" className="text-[#3178C6]" />,
  <SiTailwindcss key="tw" className="text-[#06B6D4]" />,
  <DiPython key="py" className="text-[#3776AB]" />,
  <DiAndroid key="android" className="text-[#3DDC84]" />,
  <SiKotlin key="kotlin" className="text-[#7F52FF]" />,
  <DiGit key="git" className="text-[#F05032]" />,
  <DiDocker key="docker" className="text-[#2496ED]" />,
  <SiPostgresql key="pg" className="text-[#4169E1]" />,
  <SiFigma key="figma" className="text-[#F24E1E]" />,
  <SiFirebase key="firebase" className="text-[#FFCA28]" />,
];

const HomePage = () => (
  <>
    <PageMeta route="/" />
    <Hero />
    <Suspense fallback={null}>
      <About />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <section className="py-9 sm:py-10">
        <div className="container-wide">
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted sm:mb-6">
            Tech stack
          </p>
          <LogoLoop
            logos={techLogos}
            speed={70}
            direction="right"
            logoHeight={30}
            gap={36}
            hoverSpeed={18}
            fadeOut
            scaleOnHover
          />
        </div>
      </section>
      <SectionDivider />
      <Certificates />
      <SectionDivider />
      <Contact />
    </Suspense>
  </>
);

const EASE = [0.22, 1, 0.36, 1];

const PageTransition = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.25, ease: EASE } }}
    >
      {children}
    </motion.div>
  );
};

const getHashTargetId = (hash) => {
  if (!hash || hash === '#') return '';
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return hash.slice(1);
  }
};

const scrollToHashTarget = (hash, behavior = 'smooth', attempts = 10) => {
  const targetId = getHashTargetId(hash);
  if (!targetId) return undefined;

  let frameId = 0;
  let timeoutId = 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBehavior = prefersReducedMotion ? 'auto' : behavior;

  const run = (remaining) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
      return;
    }

    if (remaining <= 0) return;
    timeoutId = window.setTimeout(() => {
      frameId = window.requestAnimationFrame(() => run(remaining - 1));
    }, 70);
  };

  frameId = window.requestAnimationFrame(() => run(attempts));

  return () => {
    window.cancelAnimationFrame(frameId);
    window.clearTimeout(timeoutId);
  };
};

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const isInitialMount = React.useRef(true);

  useEffect(() => {
    const isFirstRender = isInitialMount.current;
    isInitialMount.current = false;

    if (hash) {
      return scrollToHashTarget(hash, isFirstRender ? 'auto' : 'smooth', isFirstRender ? 16 : 10);
    }

    if (isFirstRender) {
      window.scrollTo(0, 0);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);
  return null;
};

const AppContent = () => {
  const { isDark } = useDarkMode();
  const location = useLocation();

  return (
    <div className={`relative overflow-x-hidden ${isDark ? 'dark' : ''}`}>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 max-h-[65vh]">
          <Aurora />
        </div>
        <div className="absolute inset-x-0 top-[50vh] h-[40vh] bg-gradient-to-b from-transparent to-canvas pointer-events-none" />
      </div>
      <Noise />
      <ClickSpark>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white focus:shadow-lift"
        >
          Skip to main content
        </a>
        <Navbar />
        <ScrollToTop />
        <main id="main">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <HomePage />
                  </PageTransition>
                }
              />
              <Route
                path="/android"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition>
                      <AndroidPage />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="/web"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition>
                      <WebDevPage />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="/cybersecurity"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition>
                      <CyberSecurityPage />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="/data-science"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition>
                      <DataSciencePage />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="/case-study/mnemosyne"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition>
                      <MnemosyneCaseStudy />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="/case-study/typesprint"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition>
                      <TypeSprintCaseStudy />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="/case-study/walkkittie"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition>
                      <WalkKittieCaseStudy />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="/case-study/msscan"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition>
                      <MsscanCaseStudy />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="*"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition>
                      <NotFoundPage />
                    </PageTransition>
                  </Suspense>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </ClickSpark>
    </div>
  );
};

const scheduleNonCriticalTask = (callback) => {
  let idleId = 0;
  const timeoutId = window.setTimeout(() => {
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(callback, { timeout: 2000 });
      return;
    }
    callback();
  }, 2200);

  return () => {
    window.clearTimeout(timeoutId);
    if (idleId) window.cancelIdleCallback(idleId);
  };
};

const shouldLoadVercelInsights = () => !['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

const DeferredAnalytics = () => {
  const [AnalyticsComponent, setAnalyticsComponent] = useState(null);

  useEffect(() => {
    if (!shouldLoadVercelInsights()) return undefined;

    let cancelled = false;
    let removeLoadListener = null;
    let cancelScheduledLoad = null;

    const loadAnalytics = () => {
      import('@vercel/analytics/react')
        .then(({ Analytics }) => {
          if (!cancelled) {
            setAnalyticsComponent(() => Analytics);
          }
        })
        .catch((error) => {
          console.error('Failed to load Vercel Analytics:', error);
        });
    };

    const scheduleLoad = () => {
      cancelScheduledLoad = scheduleNonCriticalTask(loadAnalytics);
    };

    if (document.readyState === 'complete') {
      scheduleLoad();
    } else {
      const handleLoad = () => {
        scheduleLoad();
      };
      window.addEventListener('load', handleLoad, { once: true });
      removeLoadListener = () => window.removeEventListener('load', handleLoad);
    }

    return () => {
      cancelled = true;
      if (removeLoadListener) removeLoadListener();
      if (cancelScheduledLoad) cancelScheduledLoad();
    };
  }, []);

  if (!AnalyticsComponent) return null;
  return <AnalyticsComponent />;
};

const DeferredSpeedInsights = () => {
  const [SpeedInsightsComponent, setSpeedInsightsComponent] = useState(null);

  useEffect(() => {
    if (!shouldLoadVercelInsights()) return undefined;

    let cancelled = false;
    let removeLoadListener = null;
    let cancelScheduledLoad = null;

    const loadSpeedInsights = () => {
      import('@vercel/speed-insights/react')
        .then(({ SpeedInsights }) => {
          if (!cancelled) {
            setSpeedInsightsComponent(() => SpeedInsights);
          }
        })
        .catch((error) => {
          console.error('Failed to load Vercel Speed Insights:', error);
        });
    };

    const scheduleLoad = () => {
      cancelScheduledLoad = scheduleNonCriticalTask(loadSpeedInsights);
    };

    if (document.readyState === 'complete') {
      scheduleLoad();
    } else {
      const handleLoad = () => {
        scheduleLoad();
      };
      window.addEventListener('load', handleLoad, { once: true });
      removeLoadListener = () => window.removeEventListener('load', handleLoad);
    }

    return () => {
      cancelled = true;
      if (removeLoadListener) removeLoadListener();
      if (cancelScheduledLoad) cancelScheduledLoad();
    };
  }, []);

  if (!SpeedInsightsComponent) return null;
  return <SpeedInsightsComponent />;
};

function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <DarkModeProvider>
          <LanguageProvider>
            <AppContent />
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'rgb(var(--surface))',
                  color: 'rgb(var(--fg))',
                  border: '1px solid rgb(var(--line) / 0.16)',
                  borderRadius: '0.85rem',
                  fontSize: '0.875rem',
                  boxShadow: '0 18px 48px -22px rgba(20,16,12,0.28)',
                },
              }}
            />
            <DeferredAnalytics />
            <DeferredSpeedInsights />
          </LanguageProvider>
        </DarkModeProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
