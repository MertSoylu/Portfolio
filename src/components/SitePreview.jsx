import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HiArrowsExpand,
  HiCursorClick,
  HiExternalLink,
  HiGlobe,
  HiHeart,
  HiShieldCheck,
  HiSparkles,
  HiX,
} from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';

const getPreviewKind = ({ title = '', url = '', type = 'web', variant }) => {
  if (variant) return variant;
  if (type === 'mobile') return 'mobile';
  if (type === 'terminal') return 'terminal';

  const key = `${title} ${url}`.toLowerCase();
  if (key.includes('mnemosyne') || key.includes('nemosyne')) return 'memory';
  if (key.includes('typesprint')) return 'typing';
  if (key.includes('portfolio')) return 'portfolio';
  return 'web';
};

const chromeDots = (
  <div className="flex items-center gap-1.5">
    <span className="h-2.5 w-2.5 rounded-full bg-accent-400" />
    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
    <span className="h-2.5 w-2.5 rounded-full bg-ink-300 dark:bg-white/40" />
  </div>
);

const PreviewShell = ({ children, title, url, compact = false, displayLabel }) => (
  <div className="preview-shell overflow-hidden rounded-lg border border-ink-200/70 bg-white/80 shadow-soft backdrop-blur-xl dark:border-white/15 dark:bg-ink-900/80">
    <div className="flex items-center justify-between gap-3 border-b border-ink-200/60 bg-white/60 px-3 py-2 dark:border-white/15 dark:bg-white/10">
      {chromeDots}
      <span className="min-w-0 truncate text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500 dark:text-ink-200">
        {(displayLabel || url || title || 'preview').replace('https://', '').replace('www.', '')}
      </span>
    </div>
    <div className={compact ? 'p-2.5 sm:p-3' : 'p-3 sm:p-5'}>{children}</div>
  </div>
);

const LIVE_PREVIEW_VIEWPORT = {
  width: 1366,
  height: 820,
};

const SnapshotWebsitePreview = ({ title, src, isTurkish }) => (
  <div className="relative min-h-[190px] overflow-hidden rounded-lg border border-ink-200/70 bg-ink-950 sm:min-h-[250px]">
    <img
      src={src}
      alt={`${title} ${isTurkish ? 'site önizlemesi' : 'site preview'}`}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />
  </div>
);

const LiveWebsitePreview = ({ title, url, isTurkish, fallbackSrc }) => {
  const [loaded, setLoaded] = useState(false);
  const [frameBlocked, setFrameBlocked] = useState(false);
  const frameWrapRef = useRef(null);
  const [frameWidth, setFrameWidth] = useState(0);

  useEffect(() => {
    const node = frameWrapRef.current;
    if (!node) return undefined;

    const updateFrameWidth = () => setFrameWidth(node.clientWidth);
    updateFrameWidth();

    const resizeObserver = new ResizeObserver(updateFrameWidth);
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, []);

  const scale = frameWidth ? Math.min(0.72, frameWidth / LIVE_PREVIEW_VIEWPORT.width) : 0.32;
  const minPreviewHeight = frameWidth && frameWidth < 480 ? 190 : 220;
  const previewHeight = Math.max(minPreviewHeight, Math.round(LIVE_PREVIEW_VIEWPORT.height * scale));
  const showFallback = fallbackSrc && (!loaded || frameBlocked);

  const handleFrameLoad = (event) => {
    const frame = event.currentTarget;
    window.setTimeout(() => {
      if (fallbackSrc && !frame.contentWindow) {
        setFrameBlocked(true);
        setLoaded(false);
        return;
      }
      setFrameBlocked(false);
      setLoaded(true);
    }, 120);
  };

  return (
    <div
      ref={frameWrapRef}
      className="relative overflow-hidden rounded-lg border border-ink-200/70 bg-ink-900"
      style={{ height: previewHeight }}
    >
      {showFallback && (
        <img
          src={fallbackSrc}
          alt={`${title} ${isTurkish ? 'site önizlemesi' : 'site preview'}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 z-[1] h-full w-full object-cover"
        />
      )}
      {!loaded && !fallbackSrc && (
        <div className="absolute inset-0 z-10 flex flex-col justify-between bg-gradient-to-br from-ink-900 via-ink-800 to-cyan-900 p-4 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              {isTurkish ? 'Canlı önizleme' : 'Live preview'}
            </p>
            <h4 className="mt-2 text-h3 text-white">{title}</h4>
          </div>
          <div className="space-y-2">
            <div className="h-2 rounded-full bg-white/20" />
            <div className="h-2 w-3/4 rounded-full bg-white/15" />
            <div className="h-2 w-1/2 rounded-full bg-cyan-200/30" />
          </div>
        </div>
      )}
      <iframe
        title={`${title} ${isTurkish ? 'canlı önizleme' : 'live preview'}`}
        src={url}
        loading="lazy"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={handleFrameLoad}
        className="absolute left-0 top-0 max-w-none origin-top-left border-0 bg-white"
        style={{
          width: LIVE_PREVIEW_VIEWPORT.width,
          height: LIVE_PREVIEW_VIEWPORT.height,
          transform: `scale(${scale})`,
          opacity: frameBlocked ? 0 : 1,
        }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />
    </div>
  );
};

const MemoryPreview = ({ title }) => (
  <div className="relative min-h-[190px] overflow-hidden rounded-lg bg-gradient-to-br from-ink-900 via-ink-800 to-cyan-900 p-4 text-white sm:min-h-[230px]">
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px]" />
    <div className="relative z-10 flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">Memory layer</p>
          <h4 className="text-h3 text-white">{title}</h4>
        </div>
        <HiGlobe className="h-7 w-7 text-cyan-200" />
      </div>
      <div className="grid flex-1 grid-cols-4 gap-2">
        {Array.from({ length: 12 }).map((_, index) => (
          <motion.div
            key={index}
            className={`rounded-lg border border-white/10 bg-white/10 p-2 backdrop-blur ${
              index === 2 || index === 7 ? 'col-span-2 row-span-2' : ''
            }`}
            animate={{ y: [0, index % 2 ? -5 : 5, 0] }}
            transition={{ duration: 3.5 + index * 0.15, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="mb-2 h-1.5 rounded-full bg-cyan-200/70" />
            <div className="h-1.5 w-2/3 rounded-full bg-white/40" />
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const TypingPreview = ({ isTurkish }) => {
  const words = isTurkish ? ['hız', 'doğruluk', 'ritim', 'odak'] : ['speed', 'accuracy', 'rhythm', 'focus'];
  return (
    <div className="min-h-[190px] rounded-lg bg-ink-900 p-4 text-white sm:min-h-[230px]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Typing engine</p>
          <h4 className="text-h3 text-white">TypeSprint</h4>
        </div>
        <div className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-right">
          <p className="text-xs text-cyan-100">WPM</p>
          <motion.p
            className="text-2xl font-extrabold text-cyan-200"
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            84
          </motion.p>
        </div>
      </div>
      <div className="space-y-3 font-mono text-sm">
        {words.map((word, index) => (
          <div key={word} className="flex items-center gap-2">
            <span className="text-cyan-300">{String(index + 1).padStart(2, '0')}</span>
            <span className={index < 2 ? 'text-white' : 'text-white/50'}>{word}</span>
            {index === 2 && (
              <motion.span
                className="h-5 w-2 bg-accent-400"
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {['TR', 'EN', 'FAIR'].map((item) => (
          <span
            key={item}
            className="rounded-lg border border-white/10 bg-white/10 px-2 py-2 text-center text-xs font-bold"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const PortfolioPreview = () => (
  <div className="min-h-[190px] rounded-lg bg-white p-4 dark:bg-ink-900 sm:min-h-[230px]">
    <div className="mb-5 flex items-center justify-between">
      <h4 className="text-h3 text-ink-900 dark:text-white">Portfolio system</h4>
      <HiSparkles className="h-7 w-7 text-accent-500" />
    </div>
    <div className="grid grid-cols-5 gap-2">
      <div className="col-span-3 h-28 rounded-lg bg-gradient-to-br from-accent-400 to-cyan-300" />
      <div className="col-span-2 space-y-2">
        <div className="h-8 rounded-lg bg-ink-100 dark:bg-white/10" />
        <div className="h-8 rounded-lg bg-ink-100 dark:bg-white/10" />
        <div className="h-8 rounded-lg bg-ink-100 dark:bg-white/10" />
      </div>
      <div className="col-span-2 h-14 rounded-lg bg-cyan-100 dark:bg-cyan-300/10" />
      <div className="col-span-3 h-14 rounded-lg bg-accent-100 dark:bg-accent-300/10" />
    </div>
  </div>
);

const MobilePreview = ({ isTurkish }) => (
  <div className="mx-auto flex min-h-[200px] max-w-[250px] justify-center sm:min-h-[260px]">
    <div className="w-[172px] rounded-[1.75rem] border-[7px] border-ink-900 bg-ink-900 p-2 shadow-elevation dark:border-white/20 sm:w-[190px]">
      <div className="mb-2 flex justify-center">
        <span className="h-1.5 w-16 rounded-full bg-white/25" />
      </div>
      <div className="overflow-hidden rounded-[1.1rem] bg-gradient-to-br from-accent-400 via-cyan-300 to-ink-900 p-3 text-white">
        <div className="mb-4 flex items-center justify-between">
          <HiHeart className="h-6 w-6" />
          <span className="rounded-lg bg-white/20 px-2 py-1 text-[10px] font-bold">WalkKittie</span>
        </div>
        <div className="rounded-lg bg-white/20 p-3 backdrop-blur">
          <p className="text-xs text-white/70">{isTurkish ? 'Bugün' : 'Today'}</p>
          <p className="text-2xl font-extrabold">6,420</p>
          <p className="text-xs text-white/70">{isTurkish ? 'adım' : 'steps'}</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <span className="rounded-lg bg-white/20 p-2 text-center text-xs font-bold">Water</span>
          <span className="rounded-lg bg-white/20 p-2 text-center text-xs font-bold">Shop</span>
        </div>
      </div>
    </div>
  </div>
);

const TerminalPreview = ({ terminalContent, isTurkish }) => (
  <div className="min-h-[190px] rounded-lg bg-[#050912] p-4 font-mono text-xs text-ink-100 sm:min-h-[230px] sm:text-sm">
    <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-accent-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
      </div>
      <span className="text-[10px] uppercase tracking-[0.14em] text-cyan-200">msscan</span>
    </div>
    <div className="space-y-1.5 overflow-x-auto">
      {terminalContent || (
        <>
          <p>
            <span className="text-cyan-300">msscan&gt;</span> set modules xss,sqli,headers
          </p>
          <p>
            <span className="text-cyan-300">msscan&gt;</span> set rate-limit 10
          </p>
          <p className="text-accent-300">[*] {isTurkish ? 'Tarama başladı' : 'Scan started'}</p>
          <p className="text-cyan-200">[+] XSS reflection context checked</p>
          <p className="text-emerald-300">[✓] HTML report ready</p>
        </>
      )}
    </div>
  </div>
);

const WebPreview = ({ title }) => (
  <div className="min-h-[190px] rounded-lg bg-gradient-to-br from-white to-cyan-50 p-4 dark:from-ink-900 dark:to-ink-800 sm:min-h-[230px]">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent-600 dark:text-accent-300">
          Product surface
        </p>
        <h4 className="text-h3 text-ink-900 dark:text-white">{title}</h4>
      </div>
      <HiCursorClick className="h-7 w-7 text-cyan-500" />
    </div>
    <div className="grid grid-cols-6 gap-2">
      <div className="col-span-4 h-28 rounded-lg bg-gradient-to-br from-accent-300 to-cyan-300" />
      <div className="col-span-2 space-y-2">
        <div className="h-8 rounded-lg bg-white dark:bg-white/10" />
        <div className="h-8 rounded-lg bg-white dark:bg-white/10" />
        <div className="h-8 rounded-lg bg-white dark:bg-white/10" />
      </div>
      <div className="col-span-2 h-12 rounded-lg bg-white dark:bg-white/10" />
      <div className="col-span-2 h-12 rounded-lg bg-white dark:bg-white/10" />
      <div className="col-span-2 h-12 rounded-lg bg-white dark:bg-white/10" />
    </div>
  </div>
);

const PreviewBody = ({ kind, title, url, terminalContent, isTurkish, snapshotSrc }) => {
  if (kind === 'snapshot')
    return <SnapshotWebsitePreview title={title} src={snapshotSrc} isTurkish={isTurkish} />;
  if (kind === 'live')
    return <LiveWebsitePreview title={title} url={url} isTurkish={isTurkish} fallbackSrc={snapshotSrc} />;
  if (kind === 'memory') return <MemoryPreview title={title} />;
  if (kind === 'typing') return <TypingPreview isTurkish={isTurkish} />;
  if (kind === 'mobile') return <MobilePreview isTurkish={isTurkish} />;
  if (kind === 'terminal') return <TerminalPreview terminalContent={terminalContent} isTurkish={isTurkish} />;
  if (kind === 'portfolio') return <PortfolioPreview />;
  return <WebPreview title={title} />;
};

const PreviewModal = ({
  isOpen,
  onClose,
  title,
  url,
  kind,
  terminalContent,
  isTurkish,
  displayLabel,
  snapshotSrc,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[1200] flex items-center justify-center bg-ink-900/70 p-4 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl"
          onClick={(event) => event.stopPropagation()}
        >
          <PreviewShell title={title} url={url} displayLabel={displayLabel}>
            <div className="relative">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-10 rounded-lg border border-white/20 bg-ink-900/70 p-2 text-white backdrop-blur hover:bg-ink-900"
                aria-label={isTurkish ? 'Önizlemeyi kapat' : 'Close preview'}
              >
                <HiX className="h-5 w-5" />
              </button>
              <PreviewBody
                kind={kind}
                title={title}
                url={url}
                terminalContent={terminalContent}
                isTurkish={isTurkish}
                snapshotSrc={snapshotSrc}
              />
            </div>
          </PreviewShell>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const SitePreview = ({
  url,
  type = 'web',
  title = 'Project',
  terminalContent,
  expandable = true,
  showActions = true,
  variant,
  livePreview = false,
  displayLabel,
  snapshotSrc,
  forceSnapshot = false,
}) => {
  const { isTurkish } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const kind = useMemo(() => {
    if (forceSnapshot && snapshotSrc) return 'snapshot';
    if (livePreview && url && type === 'web') return 'live';
    if (snapshotSrc) return 'snapshot';
    return getPreviewKind({ title, url, type, variant });
  }, [forceSnapshot, livePreview, snapshotSrc, title, url, type, variant]);
  const shellLabel = displayLabel || (type === 'mobile' ? title : undefined);
  const openModal = useCallback(() => setModalOpen(true), []);

  return (
    <>
      <PreviewShell title={title} url={url} compact displayLabel={shellLabel}>
        <PreviewBody
          kind={kind}
          title={title}
          url={url}
          terminalContent={terminalContent}
          isTurkish={isTurkish}
          snapshotSrc={snapshotSrc}
        />
        {showActions && (
          <div className="mt-3 flex flex-wrap gap-2">
            {expandable && (
              <button
                type="button"
                onClick={openModal}
                className="btn-secondary min-h-[42px] flex-1 px-3 py-2 text-xs"
              >
                <HiArrowsExpand className="h-4 w-4" />
                {isTurkish ? 'Büyüt' : 'Expand'}
              </button>
            )}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline min-h-[42px] flex-1 px-3 py-2 text-xs"
              >
                {kind === 'terminal' ? (
                  <HiShieldCheck className="h-4 w-4" />
                ) : (
                  <HiExternalLink className="h-4 w-4" />
                )}
                {kind === 'terminal' ? 'GitHub' : isTurkish ? 'Aç' : 'Open'}
              </a>
            )}
          </div>
        )}
      </PreviewShell>

      {expandable && (
        <PreviewModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={title}
          url={url}
          kind={kind}
          terminalContent={terminalContent}
          isTurkish={isTurkish}
          displayLabel={shellLabel}
          snapshotSrc={snapshotSrc}
        />
      )}
    </>
  );
};

export default SitePreview;
