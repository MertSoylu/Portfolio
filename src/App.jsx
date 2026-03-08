import React, { useEffect } from 'react';
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
import AndroidPage from './pages/AndroidPage';
import WebDevPage from './pages/WebDevPage';
import CyberSecurityPage from './pages/CyberSecurityPage';

const HomePage = () => (
  <>
    <Hero />
    <About />
    <Projects />
    <Contact />
  </>
);

const pageVariants = {
  initial: { x: 50, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    x: -50,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.55, 0, 1, 0.45] },
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
  useEffect(() => {
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
            <Route path="/android" element={<PageTransition><AndroidPage /></PageTransition>} />
            <Route path="/web" element={<PageTransition><WebDevPage /></PageTransition>} />
            <Route path="/cybersecurity" element={<PageTransition><CyberSecurityPage /></PageTransition>} />
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
