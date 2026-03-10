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

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

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
            <Route path="/" element={<HomePage />} />
            <Route
              path="/android"
              element={
                <Suspense fallback={<PageFallback />}>
                  <AndroidPage />
                </Suspense>
              }
            />
            <Route
              path="/web"
              element={
                <Suspense fallback={<PageFallback />}>
                  <WebDevPage />
                </Suspense>
              }
            />
            <Route
              path="/cybersecurity"
              element={
                <Suspense fallback={<PageFallback />}>
                  <CyberSecurityPage />
                </Suspense>
              }
            />
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
