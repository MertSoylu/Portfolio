import React, { useEffect, useMemo, useState, lazy, Suspense } from 'react';
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
import CommandPaletteProvider from './components/CommandPalette';
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

const LazyFluidParticlesBackground = lazyWithRetry(
  () =>
    import('@/components/ui/fluid-particles-background').then((module) => ({
      default: module.FluidParticlesBackground,
    })),
  'lazy-retry-fluid-particles',
);
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
  <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4">
    <div className="studio-rule w-full" />
  </div>
);

const HomePage = () => (
  <>
    <PageMeta route="/" />
    <Hero />
    <Suspense fallback={null}>
      <SectionDivider />
      <About />
      <SectionDivider />
      <Certificates />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <Contact />
    </Suspense>
  </>
);

/* Directional wipe transitions per route */
const ROUTE_DIRECTIONS = {
  '/': 'fade',
  '/android': 'left',
  '/web': 'right',
  '/cybersecurity': 'up',
  '/data-science': 'left',
  '/case-study/mnemosyne': 'right',
  '/case-study/typesprint': 'right',
  '/case-study/walkkittie': 'left',
  '/case-study/msscan': 'up',
};

const ROUTE_OVERLAYS = {
  '/': 'from-white/75 via-cyan-50/50 to-white/75 dark:from-ink-900/90 dark:via-ink-800/75 dark:to-ink-900/90',
  '/web':
    'from-white/70 via-cyan-50/40 to-white/70 dark:from-ink-900/80 dark:via-ink-800/70 dark:to-ink-900/80',
  '/android':
    'from-white/70 via-emerald-50/40 to-white/70 dark:from-ink-900/80 dark:via-emerald-950/30 dark:to-ink-900/80',
  '/cybersecurity':
    'from-white/75 via-accent-50/40 to-white/75 dark:from-ink-900/90 dark:via-accent-950/25 dark:to-ink-900/90',
  '/data-science':
    'from-white/70 via-ink-50/40 to-white/70 dark:from-ink-900/90 dark:via-ink-800/70 dark:to-ink-900/90',
  '/case-study/mnemosyne':
    'from-white/70 via-cyan-50/40 to-white/70 dark:from-ink-900/80 dark:via-cyan-950/25 dark:to-ink-900/80',
  '/case-study/typesprint':
    'from-white/70 via-accent-50/40 to-white/70 dark:from-ink-900/80 dark:via-accent-950/20 dark:to-ink-900/80',
  '/case-study/walkkittie':
    'from-white/70 via-cyan-50/40 to-white/70 dark:from-ink-900/80 dark:via-cyan-950/20 dark:to-ink-900/80',
  '/case-study/msscan':
    'from-white/75 via-ink-50/40 to-white/75 dark:from-ink-900/90 dark:via-ink-800/75 dark:to-ink-900/90',
};

const ROUTE_PARTICLES = {
  '/': { particleCount: 950, noiseIntensity: 0.0024 },
  '/web': { particleCount: 780, noiseIntensity: 0.0021 },
  '/android': { particleCount: 900, noiseIntensity: 0.0023 },
  '/cybersecurity': { particleCount: 1150, noiseIntensity: 0.0028 },
  '/data-science': { particleCount: 720, noiseIntensity: 0.0018 },
  '/case-study/mnemosyne': { particleCount: 820, noiseIntensity: 0.0022 },
  '/case-study/typesprint': { particleCount: 820, noiseIntensity: 0.0022 },
  '/case-study/walkkittie': { particleCount: 880, noiseIntensity: 0.0024 },
  '/case-study/msscan': { particleCount: 1050, noiseIntensity: 0.0027 },
};

const getClipPath = (direction, state) => {
  const clips = {
    left: {
      initial: 'inset(0 100% 0 0)',
      animate: 'inset(0 0% 0 0)',
      exit: 'inset(0 0 0 100%)',
    },
    right: {
      initial: 'inset(0 0 0 100%)',
      animate: 'inset(0 0 0 0%)',
      exit: 'inset(0 100% 0 0)',
    },
    up: {
      initial: 'inset(100% 0 0 0)',
      animate: 'inset(0% 0 0 0)',
      exit: 'inset(0 0 100% 0)',
    },
    fade: {
      initial: 'inset(0 0 0 0)',
      animate: 'inset(0 0 0 0)',
      exit: 'inset(0 0 0 0)',
    },
  };
  return clips[direction]?.[state] || clips.fade[state];
};

const PageTransition = ({ children, direction = 'fade' }) => {
  const prefersReducedMotion = useReducedMotion();
  const isFade = direction === 'fade';

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
      initial={{
        opacity: 0,
        clipPath: getClipPath(direction, 'initial'),
        ...(isFade && { y: 24, scale: 0.98 }),
      }}
      animate={{
        opacity: 1,
        clipPath: getClipPath(direction, 'animate'),
        ...(isFade && { y: 0, scale: 1 }),
        transition: { duration: isFade ? 0.55 : 0.5, ease: [0.22, 1, 0.36, 1] },
      }}
      exit={{
        opacity: 0,
        clipPath: getClipPath(direction, 'exit'),
        ...(isFade && { y: -16, scale: 1.01 }),
        transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] },
      }}
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

/* Scroll to top or hash on route change */
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

const DeferredParticlesBackground = ({ particleCount, ...props }) => {
  const prefersReducedMotion = useReducedMotion();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || particleCount <= 0) return undefined;

    let cancelled = false;
    let removeLoadListener = null;
    let cancelScheduledLoad = null;

    const enableParticles = () => {
      if (!cancelled) setShouldRender(true);
    };

    const scheduleLoad = () => {
      const timeoutId = window.setTimeout(enableParticles, 1800);
      cancelScheduledLoad = () => window.clearTimeout(timeoutId);
    };

    if (document.readyState === 'complete') {
      scheduleLoad();
    } else {
      const handleLoad = () => scheduleLoad();
      window.addEventListener('load', handleLoad, { once: true });
      removeLoadListener = () => window.removeEventListener('load', handleLoad);
    }

    return () => {
      cancelled = true;
      if (removeLoadListener) removeLoadListener();
      if (cancelScheduledLoad) cancelScheduledLoad();
    };
  }, [particleCount, prefersReducedMotion]);

  if (!shouldRender) return null;

  return (
    <Suspense fallback={null}>
      <LazyFluidParticlesBackground particleCount={particleCount} {...props} />
    </Suspense>
  );
};

const AppContent = () => {
  const { isDark } = useDarkMode();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const overlayClass = ROUTE_OVERLAYS[location.pathname] || ROUTE_OVERLAYS['/'];
  const routeDirection = ROUTE_DIRECTIONS[location.pathname] || 'fade';
  const particleSettings = ROUTE_PARTICLES[location.pathname] || ROUTE_PARTICLES['/'];
  const particleCount = prefersReducedMotion
    ? 0
    : isMobile
      ? Math.max(180, Math.min(220, Math.round(particleSettings.particleCount * 0.22)))
      : particleSettings.particleCount;
  const particleNoiseIntensity = prefersReducedMotion
    ? 0
    : isMobile
      ? particleSettings.noiseIntensity * 0.75
      : particleSettings.noiseIntensity;
  const particleSize = useMemo(
    () => (isMobile ? { min: 0.45, max: 1.05 } : { min: 0.5, max: 2 }),
    [isMobile],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return (
    <div className={`relative overflow-x-hidden transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <DeferredParticlesBackground
        particleCount={particleCount}
        noiseIntensity={particleNoiseIntensity}
        particleSize={particleSize}
        className="pointer-events-none fixed inset-0 z-0 h-full bg-transparent dark:bg-transparent"
      />
      <div className={`pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b ${overlayClass}`} />
      <div className="relative z-10">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-accent-500 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
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
                  <PageTransition direction={routeDirection}>
                    <HomePage />
                  </PageTransition>
                }
              />
              <Route
                path="/android"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition direction={routeDirection}>
                      <AndroidPage />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="/web"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition direction={routeDirection}>
                      <WebDevPage />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="/cybersecurity"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition direction={routeDirection}>
                      <CyberSecurityPage />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="/data-science"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition direction={routeDirection}>
                      <DataSciencePage />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="/case-study/mnemosyne"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition direction={routeDirection}>
                      <MnemosyneCaseStudy />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="/case-study/typesprint"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition direction={routeDirection}>
                      <TypeSprintCaseStudy />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="/case-study/walkkittie"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition direction={routeDirection}>
                      <WalkKittieCaseStudy />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="/case-study/msscan"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition direction={routeDirection}>
                      <MsscanCaseStudy />
                    </PageTransition>
                  </Suspense>
                }
              />
              <Route
                path="*"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition direction={routeDirection}>
                      <NotFoundPage />
                    </PageTransition>
                  </Suspense>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
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
            <CommandPaletteProvider>
              <AppContent />
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: 'rgba(20, 20, 20, 0.92)',
                    color: '#fafafa',
                    border: '1px solid rgba(240, 125, 45, 0.4)',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                  },
                }}
              />
            </CommandPaletteProvider>
            <DeferredAnalytics />
            <DeferredSpeedInsights />
          </LanguageProvider>
        </DarkModeProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
