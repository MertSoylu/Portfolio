import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight, HiBookOpen, HiExternalLink } from 'react-icons/hi';
import { HiComputerDesktop, HiCommandLine, HiDevicePhoneMobile } from 'react-icons/hi2';

/**
 * MorphDeviceShowcase — featured projects shown inside a single device frame that
 * morphs between platforms (laptop → phone → terminal). It auto-advances over time,
 * sliding the active project right→left while the device silhouette springs between
 * shapes. Web (laptop) projects get a lid open/close (rotateX) on enter/exit.
 * Left/right arrows drive manual navigation; reduced-motion falls back to a stack.
 */

const DEVICE_BY_PREVIEW = {
  web: 'laptop',
  mobile: 'phone',
  terminal: 'terminal',
};

// Visual geometry of the morphing frame per device (px).
const GEO = {
  laptop: { w: 540, h: 338, radius: 18 },
  phone: { w: 220, h: 452, radius: 42 },
  terminal: { w: 520, h: 332, radius: 16 },
};

const DEVICE_META = {
  laptop: { icon: HiComputerDesktop },
  phone: { icon: HiDevicePhoneMobile },
  terminal: { icon: HiCommandLine },
};

const FRAME_SPRING = { type: 'spring', stiffness: 130, damping: 22, mass: 0.9 };
const AUTOPLAY_MS = 4500;

// ---------------------------------------------------------------------------
// Screen content per platform
// ---------------------------------------------------------------------------

const LaptopScreen = ({ project, isTurkish }) => {
  if (project.snapshotSrc) {
    return (
      <div className="flex h-full flex-col bg-ink-950">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-3 py-2">
          <span className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent-400" />
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            <span className="h-2 w-2 rounded-full bg-white/40" />
          </span>
          <span className="ml-1 truncate rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
            {(project.url || '').replace('https://', '').replace('www.', '')}
          </span>
        </div>
        <img
          src={project.snapshotSrc}
          alt={`${project.title} ${isTurkish ? 'önizleme' : 'preview'}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full flex-1 object-cover object-top"
        />
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-white to-cyan-50 dark:from-ink-900 dark:to-ink-800">
      <div className="flex items-center gap-2 border-b border-ink-200/60 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-accent-400" />
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
          <span className="h-2 w-2 rounded-full bg-ink-300 dark:bg-white/40" />
        </span>
        <span className="ml-1 truncate rounded-md bg-ink-100 px-2 py-0.5 text-[10px] font-bold text-ink-500 dark:bg-white/10 dark:text-white/70">
          {(project.url || '').replace('https://', '').replace('www.', '')}
        </span>
      </div>
      <div className="flex-1 p-4">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-accent-600 dark:text-accent-300">
          Product surface
        </p>
        <h4 className="mb-3 text-lg font-extrabold text-ink-900 dark:text-white">{project.title}</h4>
        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-4 h-20 rounded-lg bg-gradient-to-br from-violet-400 to-cyan-300" />
          <div className="col-span-2 space-y-2">
            <div className="h-6 rounded-md bg-white dark:bg-white/10" />
            <div className="h-6 rounded-md bg-white dark:bg-white/10" />
          </div>
          <div className="col-span-2 h-10 rounded-md bg-white dark:bg-white/10" />
          <div className="col-span-2 h-10 rounded-md bg-white dark:bg-white/10" />
          <div className="col-span-2 h-10 rounded-md bg-white dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
};

const PhoneScreen = ({ project, isTurkish }) => {
  if (project.snapshotSrc) {
    return (
      <div className="relative h-full w-full bg-ink-950">
        <img
          src={project.snapshotSrc}
          alt={`${project.title} ${isTurkish ? 'uygulama önizlemesi' : 'app preview'}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>
    );
  }
  return <PhoneScreenMock project={project} isTurkish={isTurkish} />;
};

const PhoneScreenMock = ({ project, isTurkish }) => (
  <div className="flex h-full flex-col bg-gradient-to-br from-violet-500 via-cyan-400 to-ink-900 p-3 text-white">
    <div className="mb-3 mt-4 flex items-center justify-between">
      <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/80">
        {project.title}
      </span>
      <span className="rounded-md bg-white/20 px-2 py-0.5 text-[9px] font-bold">{project.status}</span>
    </div>
    <div className="rounded-xl bg-white/20 p-3 backdrop-blur">
      <p className="text-[10px] text-white/70">{isTurkish ? 'Bugün' : 'Today'}</p>
      <p className="text-2xl font-extrabold">6,420</p>
      <p className="text-[10px] text-white/70">{isTurkish ? 'adım' : 'steps'}</p>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-2">
      <span className="rounded-lg bg-white/20 p-2 text-center text-[10px] font-bold">Water</span>
      <span className="rounded-lg bg-white/20 p-2 text-center text-[10px] font-bold">Shop</span>
    </div>
    <div className="mt-auto space-y-1.5 pb-2">
      <div className="h-1.5 rounded-full bg-white/40" />
      <div className="h-1.5 w-3/4 rounded-full bg-white/25" />
    </div>
  </div>
);

const TerminalScreen = ({ project, isTurkish }) => (
  <div className="flex h-full flex-col bg-[#08080c] p-3 font-mono text-[11px] text-ink-100 sm:text-xs">
    <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
      <span className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-accent-400" />
        <span className="h-2 w-2 rounded-full bg-cyan-300" />
        <span className="h-2 w-2 rounded-full bg-white/40" />
      </span>
      <span className="text-[9px] uppercase tracking-[0.14em] text-cyan-200">{project.title}</span>
    </div>
    <div className="space-y-1">
      <p>
        <span className="text-cyan-300">msscan&gt;</span> set modules xss,sqli,headers
      </p>
      <p>
        <span className="text-cyan-300">msscan&gt;</span> set rate-limit 10
      </p>
      <p className="text-accent-300">[*] {isTurkish ? 'Tarama başladı' : 'Scan started'}</p>
      <p className="text-cyan-200">[+] XSS reflection context checked</p>
      <p className="text-emerald-300">[✓] HTML report ready</p>
      <p className="flex items-center gap-1">
        <span className="text-cyan-300">msscan&gt;</span>
        <motion.span
          className="inline-block h-3 w-1.5 bg-accent-400"
          animate={{ opacity: [1, 0.1, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      </p>
    </div>
  </div>
);

const ScreenContent = ({ project, isTurkish }) => {
  if (project.device === 'phone') return <PhoneScreen project={project} isTurkish={isTurkish} />;
  if (project.device === 'terminal') return <TerminalScreen project={project} isTurkish={isTurkish} />;
  return <LaptopScreen project={project} isTurkish={isTurkish} />;
};

// ---------------------------------------------------------------------------
// Device frame (morphs via animate when `device` prop changes)
// ---------------------------------------------------------------------------

const DeviceFrame = ({ device, children, animateMorph = true, scale = 1 }) => {
  const g = GEO[device];
  const isPhone = device === 'phone';
  const isLaptop = device === 'laptop';
  const w = g.w * scale;
  const h = g.h * scale;
  const radius = g.radius * scale;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={false}
        animate={{ width: w, height: h, borderRadius: radius }}
        transition={animateMorph ? FRAME_SPRING : { duration: 0 }}
        className="relative max-w-full border border-white/10 bg-[linear-gradient(145deg,#1b1b24,#0b0b11)] p-[10px] shadow-elevation"
      >
        {/* phone notch */}
        <motion.span
          className="pointer-events-none absolute left-1/2 top-[10px] z-20 h-1.5 w-14 -translate-x-1/2 rounded-full bg-black"
          animate={{ opacity: isPhone ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />
        {/* laptop webcam */}
        <motion.span
          className="pointer-events-none absolute left-1/2 top-[4px] z-20 h-1 w-1 -translate-x-1/2 rounded-full bg-white/40"
          animate={{ opacity: isLaptop ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />
        <div className="relative h-full w-full overflow-hidden rounded-[inherit] bg-black [perspective:1000px]">
          {children}
        </div>
      </motion.div>
      {/* laptop base / hinge */}
      <motion.div
        initial={false}
        animate={{
          height: isLaptop ? 12 * scale : 0,
          width: isLaptop ? w + 64 * scale : w,
          opacity: isLaptop ? 1 : 0,
        }}
        transition={FRAME_SPRING}
        className="-mt-px max-w-full rounded-b-2xl border border-white/10 bg-[linear-gradient(180deg,#15151c,#0a0a0f)] shadow-lg"
      />
    </div>
  );
};

// Largest device footprint (laptop frame + padding) used as the fit reference.
const FIT_REFERENCE = 560;

// Measures an element's width and returns a downscale factor so the widest
// device frame fits inside it (never upscales past 1). Keeps device proportions
// intact on narrow screens instead of letting max-w-full squish the frame.
const useFitScale = (ref) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const update = () => setScale(Math.min(1, node.clientWidth / FIT_REFERENCE));
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return scale;
};

// Self-measuring frame for the static (reduced-motion) layout.
const ResponsiveDeviceFrame = ({ device, project, isTurkish }) => {
  const wrapRef = useRef(null);
  const scale = useFitScale(wrapRef);

  return (
    <div ref={wrapRef} className="flex w-full justify-center">
      <DeviceFrame device={device} animateMorph={false} scale={scale}>
        <ScreenContent project={project} isTurkish={isTurkish} />
      </DeviceFrame>
    </div>
  );
};

// slide direction-aware flow; laptop screens also open/close (rotateX) like a lid
const screenVariants = {
  enter: ({ device, dir }) => ({
    x: dir >= 0 ? 120 : -120,
    opacity: 0,
    rotateX: device === 'laptop' ? -78 : 0,
  }),
  center: { x: 0, opacity: 1, rotateX: 0 },
  exit: ({ device, dir }) => ({
    x: dir >= 0 ? -120 : 120,
    opacity: 0,
    rotateX: device === 'laptop' ? -78 : 0,
  }),
};

const metaVariants = {
  enter: ({ dir }) => ({ x: dir >= 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: ({ dir }) => ({ x: dir >= 0 ? -50 : 50, opacity: 0 }),
};

const ProjectMeta = ({ project, isTurkish }) => (
  <div className="max-w-md">
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <span className={`rounded-lg border px-3 py-1 text-xs font-extrabold ${project.badgeClass}`}>
        {project.category}
      </span>
      <span className="rounded-lg border border-ink-200/70 bg-white/50 px-3 py-1 text-xs font-extrabold text-ink-500 dark:border-white/10 dark:bg-white/10 dark:text-ink-300">
        {project.status}
      </span>
    </div>
    <h3 className="mb-3 text-2xl font-extrabold leading-tight text-ink-900 dark:text-white sm:text-3xl">
      {project.title}
    </h3>
    <p className="mb-4 text-body-sm leading-relaxed text-ink-600 dark:text-ink-200">{project.description}</p>
    <div className="mb-5 flex flex-wrap gap-2">
      {project.tags.map((tag) => (
        <span
          key={tag}
          className="rounded-lg border border-ink-200/70 bg-white/50 px-2.5 py-1 text-xs font-bold text-ink-600 dark:border-white/10 dark:bg-white/10 dark:text-ink-200"
        >
          {tag}
        </span>
      ))}
    </div>
    <div className="flex flex-wrap gap-3">
      {project.caseStudyPath && (
        <Link to={project.caseStudyPath} className="btn-primary min-h-[44px] px-4 py-2 text-xs">
          <HiBookOpen className="h-4 w-4" />
          Case Study
        </Link>
      )}
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary min-h-[44px] px-4 py-2 text-xs"
      >
        <HiExternalLink className="h-4 w-4" />
        {isTurkish ? 'Aç' : 'Open'}
      </a>
    </div>
  </div>
);

const ArrowButton = ({ direction, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200/70 bg-white/70 text-ink-700 shadow-soft backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:text-violet-700 hover:shadow-elevation dark:border-white/10 dark:bg-white/10 dark:text-ink-100 dark:hover:border-aqua-300/50 dark:hover:text-aqua-200"
  >
    {direction === 'prev' ? <HiChevronLeft className="h-5 w-5" /> : <HiChevronRight className="h-5 w-5" />}
  </button>
);

// ---------------------------------------------------------------------------

const MorphDeviceShowcase = ({ projects, isTurkish }) => {
  const reduce = useReducedMotion();
  const deviceProjects = projects.map((project) => ({
    ...project,
    device: DEVICE_BY_PREVIEW[project.previewType] || 'laptop',
  }));
  const count = deviceProjects.length;

  const [[active, dir], setState] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef(null);
  const stageScale = useFitScale(stageRef);

  const paginate = useCallback(
    (nextDir) => {
      setState(([current]) => [(current + nextDir + count) % count, nextDir]);
    },
    [count],
  );

  const goTo = useCallback((index) => {
    setState(([current]) => [index, index >= current ? 1 : -1]);
  }, []);

  useEffect(() => {
    if (reduce || paused) return undefined;
    const id = window.setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduce, paused, paginate, active]);

  // reduced-motion: simple stacked list, no animation
  if (reduce) {
    return (
      <div className="grid gap-8">
        {deviceProjects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col items-center gap-6 rounded-3xl border border-ink-200/60 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5 sm:flex-row"
          >
            <div className="w-full sm:w-[56%] sm:shrink-0">
              <ResponsiveDeviceFrame device={project.device} project={project} isTurkish={isTurkish} />
            </div>
            <ProjectMeta project={project} isTurkish={isTurkish} />
          </div>
        ))}
      </div>
    );
  }

  const activeProject = deviceProjects[active];

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* device stage */}
        <div
          ref={stageRef}
          className="relative flex min-h-[300px] items-center justify-center [perspective:1400px] sm:min-h-[420px]"
        >
          <DeviceFrame device={activeProject.device} scale={stageScale}>
            <AnimatePresence custom={{ device: activeProject.device, dir }} initial={false}>
              <motion.div
                key={activeProject.id}
                custom={{ device: activeProject.device, dir }}
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'center bottom' }}
                className="absolute inset-0"
              >
                <ScreenContent project={activeProject} isTurkish={isTurkish} />
              </motion.div>
            </AnimatePresence>
          </DeviceFrame>
        </div>

        {/* meta */}
        <div className="relative min-h-[300px] lg:min-h-[280px]">
          <AnimatePresence custom={{ dir }} initial={false}>
            <motion.div
              key={activeProject.id}
              custom={{ dir }}
              variants={metaVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <ProjectMeta project={activeProject} isTurkish={isTurkish} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* controls: arrows + platform dots */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <ArrowButton
          direction="prev"
          onClick={() => paginate(-1)}
          label={isTurkish ? 'Önceki' : 'Previous'}
        />
        <div className="flex items-center gap-2">
          {deviceProjects.map((project, index) => {
            const Icon = DEVICE_META[project.device].icon;
            const isActive = index === active;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={project.title}
                aria-current={isActive ? 'true' : undefined}
                className={`flex items-center justify-center rounded-full border transition-all ${
                  isActive
                    ? 'h-9 w-9 border-violet-400/70 bg-white/70 text-violet-600 shadow-soft dark:border-aqua-300/40 dark:bg-white/10 dark:text-aqua-200'
                    : 'h-8 w-8 border-ink-200/60 bg-white/30 text-ink-400 hover:border-violet-300 dark:border-white/10 dark:bg-white/5 dark:text-ink-300'
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
        <ArrowButton direction="next" onClick={() => paginate(1)} label={isTurkish ? 'Sonraki' : 'Next'} />
      </div>
    </div>
  );
};

export default MorphDeviceShowcase;
