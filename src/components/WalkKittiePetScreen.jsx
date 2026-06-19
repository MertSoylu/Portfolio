import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiHeart, HiSparkles } from 'react-icons/hi';

const clamp = (value) => Math.max(0, Math.min(100, value));

const Bubble = ({ className = '', delay = 0, reduce }) => (
  <motion.span
    aria-hidden="true"
    className={`absolute rounded-full border border-cyan-100/80 bg-cyan-100/35 ${className}`}
    animate={reduce ? undefined : { y: [12, -22, 12], opacity: [0, 0.85, 0] }}
    transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

export const PixelOctopusPet = ({ isTurkish, compact = false }) => {
  const reduce = useReducedMotion();
  const sizeClass = compact ? 'h-20 w-28' : 'h-24 w-36 sm:h-28 sm:w-40';
  const bodyMotion = reduce
    ? undefined
    : {
        y: [0, -0.25, 0],
        rotate: [-1, 1, -1],
      };

  return (
    <motion.div
      className="relative inline-flex flex-col items-center"
      animate={reduce ? undefined : { y: [0, -7, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.svg
        viewBox="0 0 14 10"
        role="img"
        aria-label={isTurkish ? 'Animasyonlu piksel ahtapot' : 'Animated pixel octopus'}
        shapeRendering="crispEdges"
        className={`${sizeClass} drop-shadow-[0_16px_22px_rgba(216,117,85,0.32)]`}
      >
        <motion.g animate={bodyMotion} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
          <rect x="3" y="1" width="8" height="2" fill="#d87555" />
          <rect x="1" y="3" width="12" height="2" fill="#d87555" />
          <rect x="3" y="5" width="8" height="1" fill="#d87555" />
          <rect x="2" y="4" width="10" height="1" fill="#cf6d4d" opacity="0.45" />
          <motion.rect
            x="4"
            y="2"
            width="1"
            height="1"
            fill="#050505"
            animate={reduce ? undefined : { scaleY: [1, 1, 0.15, 1, 1] }}
            transition={{ duration: 3.8, repeat: Infinity, times: [0, 0.66, 0.7, 0.74, 1] }}
            style={{ transformOrigin: '4.5px 2.5px' }}
          />
          <motion.rect
            x="9"
            y="2"
            width="1"
            height="1"
            fill="#050505"
            animate={reduce ? undefined : { scaleY: [1, 1, 0.15, 1, 1] }}
            transition={{ duration: 3.8, repeat: Infinity, times: [0, 0.66, 0.7, 0.74, 1] }}
            style={{ transformOrigin: '9.5px 2.5px' }}
          />
          <rect x="6" y="4" width="2" height="1" fill="#c76546" opacity="0.55" />
        </motion.g>

        {[3, 5, 8, 10].map((x, index) => (
          <motion.rect
            key={x}
            x={x}
            y="6"
            width="1"
            height="2"
            fill={index % 2 ? '#cf6d4d' : '#d87555'}
            animate={reduce ? undefined : { y: [0, index % 2 ? 0.18 : -0.18, 0] }}
            transition={{ duration: 1.4 + index * 0.16, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </motion.svg>
      <motion.span
        aria-hidden="true"
        className="mt-[-0.35rem] h-2 w-24 rounded-full bg-ink-950/18 blur-[1px] dark:bg-black/35"
        animate={reduce ? undefined : { scaleX: [1, 0.78, 1], opacity: [0.28, 0.14, 0.28] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};

const StatBar = ({ label, value, tone }) => (
  <div className="min-w-0">
    <div className="mb-1 flex items-center justify-between gap-2 text-[9px] font-bold uppercase tracking-[0.08em] text-white/70">
      <span className="truncate">{label}</span>
      <span className="shrink-0 text-white">{value}%</span>
    </div>
    <div className="h-1.5 overflow-hidden rounded-full bg-white/12">
      <motion.div
        className={`h-full rounded-full ${tone}`}
        animate={{ width: `${value}%` }}
        transition={{ type: 'spring', stiffness: 180, damping: 24 }}
      />
    </div>
  </div>
);

const CareButton = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="min-h-[34px] rounded-xl border border-white/12 bg-white/10 px-2.5 py-1.5 text-[10px] font-extrabold text-white shadow-[0_8px_20px_-16px_rgba(0,0,0,0.7)] backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-200/60 hover:bg-cyan-200/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
  >
    {children}
  </button>
);

const WalkKittiePetScreen = ({ isTurkish, compact = false }) => {
  const reduce = useReducedMotion();
  const [stats, setStats] = useState({ fullness: 42, energy: 68, mood: 76 });
  const [lastAction, setLastAction] = useState(isTurkish ? 'hazır' : 'ready');

  const status = useMemo(() => {
    const score = Math.round((stats.fullness + stats.energy + stats.mood) / 3);
    if (score >= 78) return isTurkish ? 'mutlu' : 'happy';
    if (score >= 55) return isTurkish ? 'meraklı' : 'curious';
    return isTurkish ? 'ilgi istiyor' : 'needs care';
  }, [isTurkish, stats]);

  const care = (type) => {
    setStats((current) => {
      if (type === 'feed') {
        setLastAction(isTurkish ? 'beslendi' : 'fed');
        return {
          fullness: clamp(current.fullness + 18),
          energy: clamp(current.energy + 2),
          mood: clamp(current.mood + 6),
        };
      }
      if (type === 'play') {
        setLastAction(isTurkish ? 'oynadı' : 'played');
        return {
          fullness: clamp(current.fullness - 5),
          energy: clamp(current.energy - 8),
          mood: clamp(current.mood + 16),
        };
      }
      setLastAction(isTurkish ? 'dinlendi' : 'rested');
      return {
        fullness: clamp(current.fullness - 2),
        energy: clamp(current.energy + 18),
        mood: clamp(current.mood + 4),
      };
    });
  };

  return (
    <div
      data-testid="walkkittie-octopus-pet"
      className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#140d1f] px-3 py-4 text-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(39,224,196,0.22),transparent_30%),radial-gradient(circle_at_50%_58%,rgba(216,117,85,0.18),transparent_34%),linear-gradient(180deg,#171023_0%,#0b0812_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:18px_18px]"
      />

      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-extrabold leading-tight">
            {isTurkish ? 'Pixel Ahtapot' : 'Pixel Octopus'}
          </p>
          <p className="text-[10px] font-bold text-[#ff9f7f]">
            Lv. 3 · {isTurkish ? 'evcil pet' : 'pet mode'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-full border border-emerald-200/20 bg-emerald-300/16 px-2 py-1 text-[10px] font-extrabold text-emerald-100">
          <HiSparkles className="h-3.5 w-3.5" />
          +15 XP
        </div>
      </div>

      <div
        className={`relative z-10 flex min-h-0 flex-1 items-center justify-center ${compact ? 'py-2' : 'py-4'}`}
      >
        <Bubble className="left-[16%] top-[28%] h-3 w-3" delay={0.2} reduce={reduce} />
        <Bubble className="right-[20%] top-[18%] h-2.5 w-2.5" delay={1.1} reduce={reduce} />
        <Bubble className="right-[12%] top-[45%] h-4 w-4" delay={2.0} reduce={reduce} />
        <div className="relative rounded-[1.35rem] border border-white/45 bg-[#ecece6] px-5 py-4 shadow-[0_22px_58px_-34px_rgba(236,236,230,0.7)]">
          <PixelOctopusPet isTurkish={isTurkish} compact={compact} />
          <span className="absolute -right-2 top-3 rounded-full border border-white/40 bg-pink-500 px-1.5 py-0.5 text-[10px] shadow-lg">
            <HiHeart className="h-3 w-3" />
          </span>
        </div>
      </div>

      <div className="relative z-10 space-y-3 rounded-[1.4rem] border border-white/10 bg-white/[0.075] p-3 shadow-[0_24px_56px_-36px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-cyan-100/80">
              {isTurkish ? 'Durum' : 'Status'}
            </p>
            <p className="text-sm font-extrabold text-white">{status}</p>
          </div>
          <div className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-white/75">
            {lastAction}
          </div>
        </div>
        <div className="grid gap-2">
          <StatBar label={isTurkish ? 'Tokluk' : 'Fullness'} value={stats.fullness} tone="bg-[#ff9f7f]" />
          <StatBar label={isTurkish ? 'Enerji' : 'Energy'} value={stats.energy} tone="bg-cyan-300" />
          <StatBar label={isTurkish ? 'Mutluluk' : 'Mood'} value={stats.mood} tone="bg-pink-400" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <CareButton onClick={() => care('feed')}>{isTurkish ? 'Besle' : 'Feed'}</CareButton>
          <CareButton onClick={() => care('play')}>{isTurkish ? 'Oyna' : 'Play'}</CareButton>
          <CareButton onClick={() => care('rest')}>{isTurkish ? 'Dinlen' : 'Rest'}</CareButton>
        </div>
      </div>
    </div>
  );
};

export default WalkKittiePetScreen;
