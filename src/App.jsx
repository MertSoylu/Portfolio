import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, matchPath, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion';
import { DarkModeProvider } from './context/DarkModeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import PageMeta from './components/PageMeta';
import { getProject } from './data/projects';
import { afterLoad } from './components/field/defer';
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
const Stack = lazyWithRetry(() => import('./components/Stack'), 'lazy-retry-stack');
const CaseStudyPage = lazyWithRetry(() => import('./pages/CaseStudyPage'), 'lazy-retry-case-study');
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage'), 'lazy-retry-404');

// Signal Field: loaded only after the page has loaded (never on the LCP path). If the chunk or WebGL is
// unavailable the CSS `.site-bg` fallback simply stays visible.
const AsciiField = lazy(() => import('./components/field/AsciiField').catch(() => ({ default: () => null })));

// Ana sayfa dışındaki tüm sayfalar aynı Suspense + geçiş sarmalayıcısını kullanır.
// `mood` drives the Signal Field background per route: home = flowing, area = steadier grid drift,
// case = calm and sparse, notfound = TV static.
const HOME_MOOD = 'home';
const LAZY_ROUTES = [
  { path: '/web', Component: WebDevPage, mood: 'area' },
  { path: '/android', Component: AndroidPage, mood: 'area' },
  { path: '/cybersecurity', Component: CyberSecurityPage, mood: 'area' },
  { path: '/data-science', Component: DataSciencePage, mood: 'area' },
  { path: '/case-study/:id', Component: CaseStudyPage, mood: 'case' },
  { path: '*', Component: NotFoundPage, mood: 'notfound' },
];

export const moodForPath = (pathname) => {
  if (matchPath('/', pathname)) return HOME_MOOD;
  for (const { path, mood } of LAZY_ROUTES) {
    if (path === '*') continue;
    const match = matchPath(path, pathname);
    if (!match) continue;
    // An unknown case-study id renders the 404 page, so it gets the 404 mood too.
    if (mood === 'case' && !getProject(match.params.id)) break;
    return mood;
  }
  return 'notfound';
};

// Mounts the field once the window has loaded and the browser is idle, then keeps it for the whole session.
const DeferredField = ({ mood }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => afterLoad(() => setReady(true)), []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <AsciiField mood={mood} />
    </Suspense>
  );
};

// Reserves roughly the height of the lazy sections so the footer does not jump while they load.
const HomeFallback = () => <div aria-hidden="true" className="min-h-[120vh]" />;

const HomePage = () => (
  <>
    <PageMeta route="/" />
    <Hero />
    <Suspense fallback={<HomeFallback />}>
      <About />
      <Projects />
      <Stack />
      <Certificates />
      <Contact />
    </Suspense>
  </>
);

const PageTransition = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <motion.div
        data-page-transition=""
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
      data-page-transition=""
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } }}
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
  const { isTurkish } = useLanguage();
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="site-bg" aria-hidden="true" />
      <DeferredField mood={moodForPath(location.pathname)} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:bg-signal focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-signal-fg"
      >
        {isTurkish ? 'Ana içeriğe geç' : 'Skip to main content'}
      </a>
      <Navbar />
      <ScrollToTop />
      <main id="main" className="flex-1">
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
            {LAZY_ROUTES.map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PageTransition>
                      <Component />
                    </PageTransition>
                  </Suspense>
                }
              />
            ))}
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
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

// Vercel Analytics / Speed Insights'ı sayfa yüklendikten ve tarayıcı boşa çıktıktan sonra getirir.
const DeferredVercelComponent = ({ load, label }) => {
  const [LoadedComponent, setLoadedComponent] = useState(null);

  useEffect(() => {
    if (!shouldLoadVercelInsights()) return undefined;

    let cancelled = false;
    let cancelScheduledLoad = null;

    const scheduleLoad = () => {
      cancelScheduledLoad = scheduleNonCriticalTask(() => {
        load()
          .then((Component) => {
            if (!cancelled) setLoadedComponent(() => Component);
          })
          .catch((error) => {
            console.error(`Failed to load ${label}:`, error);
          });
      });
    };

    if (document.readyState === 'complete') {
      scheduleLoad();
      return () => {
        cancelled = true;
        if (cancelScheduledLoad) cancelScheduledLoad();
      };
    }

    window.addEventListener('load', scheduleLoad, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', scheduleLoad);
      if (cancelScheduledLoad) cancelScheduledLoad();
    };
  }, [load, label]);

  if (!LoadedComponent) return null;
  return <LoadedComponent />;
};

const loadAnalytics = () => import('@vercel/analytics/react').then((module) => module.Analytics);
const loadSpeedInsights = () => import('@vercel/speed-insights/react').then((module) => module.SpeedInsights);

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
                  border: '1px solid rgb(var(--line) / 0.2)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  boxShadow: 'none',
                },
                success: { iconTheme: { primary: 'rgb(var(--ok))', secondary: 'rgb(var(--surface))' } },
                error: { iconTheme: { primary: 'rgb(var(--danger))', secondary: 'rgb(var(--surface))' } },
              }}
            />
            <DeferredVercelComponent load={loadAnalytics} label="Vercel Analytics" />
            <DeferredVercelComponent load={loadSpeedInsights} label="Vercel Speed Insights" />
          </LanguageProvider>
        </DarkModeProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
