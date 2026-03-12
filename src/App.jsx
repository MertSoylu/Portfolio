import React, { useEffect, lazy, Suspense } from 'react';
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
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import LoadingSpinner from './components/LoadingSpinner';

const AndroidPage = lazy(() => import('./pages/AndroidPage'));
const WebDevPage = lazy(() => import('./pages/WebDevPage'));
const CyberSecurityPage = lazy(() => import('./pages/CyberSecurityPage'));

const HomePage = () => (
  <>
    <Hero />
    <About />
    <Projects />
    <Contact />
  </>
);

const pageVariants = {
  initial: { opacity: 0, y: 24, filter: 'blur(4px)', scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: 'blur(2px)',
    scale: 1.01,
    transition: { duration: 0.22, ease: [0.55, 0, 1, 0.45] },
  },
};

const PageTransition = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

/* Scroll to top or hash on route change */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const isInitialMount = React.useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      window.scrollTo({ top: 0, behavior: 'instant' });
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
      <SandBackground isDark={isDark} />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <ScrollToTop />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/android" element={<Suspense fallback={<LoadingSpinner />}><PageTransition><AndroidPage /></PageTransition></Suspense>} />
            <Route path="/web" element={<Suspense fallback={<LoadingSpinner />}><PageTransition><WebDevPage /></PageTransition></Suspense>} />
            <Route path="/cybersecurity" element={<Suspense fallback={<LoadingSpinner />}><PageTransition><CyberSecurityPage /></PageTransition></Suspense>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <DarkModeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </DarkModeProvider>
  );
}

export default App;
