import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowsExpand, HiExternalLink, HiX } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';

/* ─── Preview Modal ─── */
const PreviewModal = ({ isOpen, onClose, url, title, type, terminalContent }) => {
  const { isTurkish } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-5xl bg-white dark:bg-dark-700 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-sand-100 dark:bg-dark-600 border-b border-sand-200 dark:border-dark-400">
              <span className="font-semibold text-sand-900 dark:text-dark-50 text-sm truncate">
                {title}
              </span>
              <div className="flex items-center gap-2">
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-warm-600 dark:text-warm-400 hover:underline flex items-center gap-1"
                  >
                    <HiExternalLink className="w-3.5 h-3.5" />
                    {isTurkish ? 'Yeni Sekmede Aç' : 'Open in New Tab'}
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-sand-200 dark:hover:bg-dark-500 transition-colors"
                >
                  <HiX className="w-5 h-5 text-sand-600 dark:text-dark-200" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="w-full" style={{ aspectRatio: '16/9' }}>
              {type === 'terminal' ? (
                <div className="w-full h-full bg-[#0d1117] p-4 sm:p-6 font-mono text-sm overflow-auto">
                  {terminalContent}
                </div>
              ) : (
                <iframe
                  src={url}
                  title={title}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─── Site Preview ─── */
const SitePreview = ({ url, type = 'web', title, gradient, terminalContent, expandable = true }) => {
  const { isTurkish } = useLanguage();
  const [isLoading, setIsLoading] = useState(type === 'web');
  const [modalOpen, setModalOpen] = useState(false);

  const handleIframeLoad = useCallback(() => setIsLoading(false), []);

  /* — Web preview — */
  if (type === 'web') {
    return (
      <>
        <div className="rounded-xl overflow-hidden border border-sand-200 dark:border-dark-400 shadow-lg">
          {/* Browser chrome */}
          <div className="bg-sand-100 dark:bg-dark-600 px-3 py-2 flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="ml-2 text-[10px] text-sand-500 dark:text-dark-300 font-mono truncate">
              {url.replace('https://', '')}
            </span>
          </div>

          {/* iframe container */}
          <div className="relative bg-white dark:bg-dark-700" style={{ aspectRatio: '16/9' }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-sand-50 dark:bg-dark-600 z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-sand-300 dark:border-dark-300 border-t-warm-500 rounded-full animate-spin" />
                  <span className="text-xs text-sand-500 dark:text-dark-300">
                    {isTurkish ? 'Yükleniyor...' : 'Loading...'}
                  </span>
                </div>
              </div>
            )}
            <div className="w-full h-full overflow-hidden">
              <iframe
                src={url}
                title={title}
                onLoad={handleIframeLoad}
                sandbox="allow-scripts allow-same-origin"
                loading="lazy"
                className="pointer-events-none border-0"
                style={{
                  width: '200%',
                  height: '200%',
                  transform: 'scale(0.5)',
                  transformOrigin: 'top left',
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="bg-sand-50 dark:bg-dark-600 px-3 py-2 flex items-center gap-2 border-t border-sand-200 dark:border-dark-400">
            {expandable && (
              <button
                onClick={() => setModalOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-sand-200/80 dark:bg-dark-500 text-sand-700 dark:text-dark-200 hover:bg-sand-300 dark:hover:bg-dark-400 transition-colors"
              >
                <HiArrowsExpand className="w-3.5 h-3.5" />
                {isTurkish ? 'Büyüt' : 'Expand'}
              </button>
            )}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-sand-200/80 dark:bg-dark-500 text-sand-700 dark:text-dark-200 hover:bg-sand-300 dark:hover:bg-dark-400 transition-colors"
            >
              <HiExternalLink className="w-3.5 h-3.5" />
              {isTurkish ? 'Siteyi Aç' : 'Open Site'}
            </a>
          </div>
        </div>

        {expandable && (
          <PreviewModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            url={url}
            title={title}
            type="web"
          />
        )}
      </>
    );
  }

  /* — Mobile preview — */
  if (type === 'mobile') {
    const playUrl = url;
    return (
      <>
        <div className="flex justify-center">
          <div className="w-full max-w-[260px]">
            <div className="rounded-[2rem] border-4 border-sand-300 dark:border-dark-400 overflow-hidden shadow-lg bg-white dark:bg-dark-700">
              {/* Phone notch */}
              <div className="bg-sand-100 dark:bg-dark-600 px-4 py-2 flex justify-center">
                <div className="w-20 h-1.5 rounded-full bg-sand-300 dark:bg-dark-400" />
              </div>

              {/* Content area */}
              <div className={`bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-6`} style={{ aspectRatio: '9/14' }}>
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-3xl">🐱</span>
                </div>
                <p className="text-white font-bold text-lg mb-1">WalkKittie</p>
                <p className="text-white/70 text-xs text-center">
                  {isTurkish ? "Google Play'de Görüntüle" : 'View on Google Play'}
                </p>
              </div>

              {/* Action buttons */}
              <div className="bg-sand-50 dark:bg-dark-600 px-3 py-2 flex items-center gap-2 border-t border-sand-200 dark:border-dark-400">
                {expandable && (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-[10px] font-medium rounded-lg bg-sand-200/80 dark:bg-dark-500 text-sand-700 dark:text-dark-200 hover:bg-sand-300 dark:hover:bg-dark-400 transition-colors"
                  >
                    <HiArrowsExpand className="w-3 h-3" />
                    {isTurkish ? 'Büyüt' : 'Expand'}
                  </button>
                )}
                <a
                  href={playUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-[10px] font-medium rounded-lg bg-sand-200/80 dark:bg-dark-500 text-sand-700 dark:text-dark-200 hover:bg-sand-300 dark:hover:bg-dark-400 transition-colors"
                >
                  <HiExternalLink className="w-3 h-3" />
                  {isTurkish ? "Play'de Aç" : 'Open Play'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {expandable && (
          <PreviewModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            url={playUrl}
            title={title}
            type="mobile"
          />
        )}
      </>
    );
  }

  /* — Terminal preview — */
  if (type === 'terminal') {
    return (
      <>
        <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-700/30">
          {/* Terminal chrome */}
          <div className="bg-[#2d333b] px-4 py-2.5 flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-3 text-xs text-gray-400 font-mono">terminal — bash</span>
          </div>

          {/* Terminal body */}
          <div className="bg-[#0d1117] p-4 sm:p-5 font-mono text-xs sm:text-sm min-h-[220px] space-y-1 overflow-x-auto">
            {terminalContent}
          </div>

          {/* Action buttons */}
          <div className="bg-[#2d333b] px-3 py-2 flex items-center gap-2 border-t border-gray-700/30">
            {expandable && (
              <button
                onClick={() => setModalOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <HiArrowsExpand className="w-3.5 h-3.5" />
                {isTurkish ? 'Büyüt' : 'Expand'}
              </button>
            )}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <HiExternalLink className="w-3.5 h-3.5" />
                GitHub
              </a>
            )}
          </div>
        </div>

        {expandable && (
          <PreviewModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            url={url}
            title={title}
            type="terminal"
            terminalContent={terminalContent}
          />
        )}
      </>
    );
  }

  return null;
};

export default SitePreview;
