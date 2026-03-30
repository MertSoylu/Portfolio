import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import SandBackground from './components/SandBackground';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import LoadingSpinner from './components/LoadingSpinner';

const AndroidPage = lazy(() => import('./pages/AndroidPage'));
const WebDevPage = lazy(() => import('./pages/WebDevPage'));
const CyberSecurityPage = lazy(() => import('./pages/CyberSecurityPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const SectionDivider = () => (
  <div className="h-12 bg-gradient-to-b from-transparent via-sand-200/20 dark:via-dark-500/20 to-transparent" />
);

const HomePage = () => (
  <>
    <Hero />
    <SectionDivider />
    <About />
    <SectionDivider />
    <Projects />
    <SectionDivider />
    <Contact />
  </>
);

/* Directional wipe transitions per route */
const ROUTE_DIRECTIONS = {
  '/': 'fade',
  '/android': 'left',
  '/web': 'right',
  '/cybersecurity': 'up',
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
  const isFade = direction === 'fade';

  return (
    <motion.div
      initial={{
        opacity: 0,
        clipPath: getClipPath(direction, 'initial'),
        ...(isFade && { y: 24, filter: 'blur(4px)', scale: 0.98 }),
      }}
      animate={{
        opacity: 1,
        clipPath: getClipPath(direction, 'animate'),
        ...(isFade && { y: 0, filter: 'blur(0px)', scale: 1 }),
        transition: { duration: isFade ? 0.55 : 0.5, ease: [0.22, 1, 0.36, 1] },
      }}
      exit={{
        opacity: 0,
        clipPath: getClipPath(direction, 'exit'),
        ...(isFade && { y: -16, filter: 'blur(2px)', scale: 1.01 }),
        transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] },
      }}
    >
      {children}
    </motion.div>
  );
};

/* Scroll to top or hash on route change */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const isInitialMount = React.useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = '';
      });
      return;
    }
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);
  return null;
};

const AppContent = () => {
  const { isDark } = useDarkMode();
  const location = useLocation();

  return (
    <div className={`overflow-x-hidden transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-warm-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      <SandBackground isDark={isDark} />
      <CustomCursor isDark={isDark} />
      <Navbar />
      <ScrollToTop />
      <main id="main">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition direction="fade"><HomePage /></PageTransition>} />
            <Route path="/android" element={<Suspense fallback={<LoadingSpinner />}><PageTransition direction="left"><AndroidPage /></PageTransition></Suspense>} />
            <Route path="/web" element={<Suspense fallback={<LoadingSpinner />}><PageTransition direction="right"><WebDevPage /></PageTransition></Suspense>} />
            <Route path="/cybersecurity" element={<Suspense fallback={<LoadingSpinner />}><PageTransition direction="up"><CyberSecurityPage /></PageTransition></Suspense>} />
            <Route path="*" element={<Suspense fallback={<LoadingSpinner />}><PageTransition direction="fade"><NotFoundPage /></PageTransition></Suspense>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

const scheduleNonCriticalTask = (callback) => {
  if ('requestIdleCallback' in window) {
    const idleId = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = window.setTimeout(callback, 1200);
  return () => window.clearTimeout(timeoutId);
};

const DeferredAnalytics = () => {
  const [AnalyticsComponent, setAnalyticsComponent] = useState(null);

  useEffect(() => {
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

function App() {
  return (
    <DarkModeProvider>
      <LanguageProvider>
        <AppContent />
        <DeferredAnalytics />
      </LanguageProvider>
    </DarkModeProvider>
  );
}

export default App;
