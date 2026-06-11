import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  HiBookOpen,
  HiExternalLink,
  HiFingerPrint,
  HiShieldCheck,
  HiShieldExclamation,
  HiTerminal,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import DecryptedText from '../components/DecryptedText';
import PageMeta from '../components/PageMeta';
import PageBackButton from '../components/ui/PageBackButton';

const EASE = [0.22, 1, 0.36, 1];

const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.4 } },
};

const heroStagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const heroItem = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const TERMINAL_HOLD_MS = 3400;
const CMD_CHAR_MS = 38;
const OUT_CHAR_MS = 14;
const CMD_LINE_PAUSE_MS = 360;
const OUT_LINE_PAUSE_MS = 540;

/** Types a scripted command/output sequence char by char, loops forever. */
const useTypedScript = (lines, active) => {
  const [pos, setPos] = useState({ line: 0, char: 0 });

  useEffect(() => {
    setPos({ line: 0, char: 0 });
  }, [lines]);

  useEffect(() => {
    if (!active) return undefined;
    let id;
    if (pos.line >= lines.length) {
      id = setTimeout(() => setPos({ line: 0, char: 0 }), TERMINAL_HOLD_MS);
    } else {
      const current = lines[pos.line];
      if (pos.char < current.text.length) {
        id = setTimeout(
          () => setPos((p) => ({ ...p, char: p.char + 1 })),
          current.type === 'cmd' ? CMD_CHAR_MS : OUT_CHAR_MS,
        );
      } else {
        id = setTimeout(
          () => setPos((p) => ({ line: p.line + 1, char: 0 })),
          current.type === 'cmd' ? CMD_LINE_PAUSE_MS : OUT_LINE_PAUSE_MS,
        );
      }
    }
    return () => clearTimeout(id);
  }, [pos, lines, active]);

  return pos;
};

const BlockCursor = ({ reduced }) => (
  <span
    aria-hidden="true"
    className={`ml-1 inline-block h-[1.05em] w-[0.55em] translate-y-[0.2em] bg-accent-400 ${
      reduced ? 'opacity-70' : 'animate-blink'
    }`}
  />
);

const TerminalLine = ({ line, text, withCursor, reduced }) => (
  <p className="whitespace-pre-wrap break-words leading-relaxed">
    {line.type === 'cmd' && <span className="select-none text-cyan-600 dark:text-cyan-300">msscan&gt; </span>}
    <span className={line.className}>{text}</span>
    {withCursor && <BlockCursor reduced={reduced} />}
  </p>
);

const TerminalHero = ({ lines, reduced, isTurkish }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2 });
  const pos = useTypedScript(lines, !reduced && inView);
  const done = pos.line >= lines.length;

  return (
    <motion.div
      ref={ref}
      variants={heroItem}
      className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-ink-300/60 bg-ink-900/95 shadow-elevation dark:border-white/10 dark:bg-ink-900/80 dark:backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-4 py-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-accent-500/90" />
          <span className="h-3 w-3 rounded-full bg-accent-300/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        </span>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-200">
          msscan — {isTurkish ? 'canlı oturum' : 'live session'}
        </p>
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${reduced ? '' : 'animate-badge-pulse'}`}
          />
          {isTurkish ? 'Çevrimiçi' : 'Online'}
        </span>
      </div>
      <div className="min-h-[16rem] px-4 py-5 font-mono text-[13px] text-ink-100 sm:min-h-[17rem] sm:px-6 sm:text-sm">
        {reduced
          ? lines.map((line) => <TerminalLine key={line.text} line={line} text={line.text} reduced />)
          : lines
              .slice(0, Math.min(pos.line + 1, lines.length))
              .map((line, i) => (
                <TerminalLine
                  key={line.text}
                  line={line}
                  text={i === pos.line ? line.text.slice(0, pos.char) : line.text}
                  withCursor={i === pos.line}
                  reduced={false}
                />
              ))}
        {(done || reduced) && (
          <p className="leading-relaxed">
            <span className="select-none text-cyan-600 dark:text-cyan-300">msscan&gt; </span>
            <BlockCursor reduced={reduced} />
          </p>
        )}
      </div>
    </motion.div>
  );
};

const StatusTicker = ({ items, reduced }) => {
  const row = (hidden) => (
    <div aria-hidden={hidden} className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((item) => (
        <span key={item} className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent-500" />
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-ink-300/50 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500 dark:border-white/10 dark:text-ink-300">
      {reduced ? (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-1 px-1">
          {items.map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent-500" />
              {item}
            </span>
          ))}
        </div>
      ) : (
        <motion.div
          className="flex w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
        >
          {row(false)}
          {row(true)}
        </motion.div>
      )}
    </div>
  );
};

const RADAR_BLIPS = [
  { top: '28%', left: '62%', delay: 0 },
  { top: '58%', left: '34%', delay: 1.4 },
  { top: '42%', left: '74%', delay: 2.6 },
];

const RadarSweep = ({ reduced }) => (
  <div
    aria-hidden="true"
    className="relative h-28 w-28 shrink-0 rounded-full border border-accent-500/30 bg-accent-500/[0.04] dark:border-accent-300/25 dark:bg-accent-300/[0.05] sm:h-36 sm:w-36"
  >
    <span className="absolute inset-[22%] rounded-full border border-accent-500/25 dark:border-accent-300/20" />
    <span className="absolute inset-[42%] rounded-full border border-accent-500/25 dark:border-accent-300/20" />
    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent-500/15 dark:bg-accent-300/15" />
    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-accent-500/15 dark:bg-accent-300/15" />
    {!reduced && (
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, rgba(255, 90, 54, 0.4) 0deg, transparent 75deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
      />
    )}
    {RADAR_BLIPS.map((blip) =>
      reduced ? (
        <span
          key={blip.delay}
          className="absolute h-1.5 w-1.5 rounded-full bg-accent-500/70 dark:bg-accent-300/70"
          style={{ top: blip.top, left: blip.left }}
        />
      ) : (
        <motion.span
          key={blip.delay}
          className="absolute h-1.5 w-1.5 rounded-full bg-accent-500 dark:bg-accent-300"
          style={{ top: blip.top, left: blip.left }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, delay: blip.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ),
    )}
    <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500 dark:bg-accent-300" />
  </div>
);

const THREAT_ICONS = [HiShieldExclamation, HiTerminal, HiFingerPrint];
const THREAT_OFFSETS = ['lg:mt-0', 'lg:mt-10', 'lg:mt-20'];

const ThreatCard = ({ area, index }) => {
  const Icon = THREAT_ICONS[index] ?? HiShieldExclamation;
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: EASE }}
      className={THREAT_OFFSETS[index] ?? ''}
    >
      <div className="cyb-threat card-raised group relative h-full overflow-hidden p-5 sm:p-6">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-accent-700/80 dark:text-accent-200/80">
          {`THREAT-0${index + 1}`}
        </p>
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-accent-300/50 bg-accent-50 text-accent-700 dark:border-accent-300/20 dark:bg-accent-300/10 dark:text-accent-200">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="cyb-glitch mb-2 text-h4 text-ink-900 dark:text-white">{area.title}</h3>
        <p className="text-body-sm text-ink-600 dark:text-ink-200">{area.desc}</p>
      </div>
    </motion.div>
  );
};

const consoleStyles = `
@keyframes cybGlitchSlice {
  0% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
  20% { clip-path: inset(14% 0 56% 0); transform: translate(-4px, 1px); }
  45% { clip-path: inset(52% 0 16% 0); transform: translate(4px, -1px); }
  70% { clip-path: inset(72% 0 2% 0); transform: translate(-3px, 0); }
  100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
}
@keyframes cybChromatic {
  0%, 100% { text-shadow: none; }
  25% { text-shadow: -2px 0 rgba(255, 90, 54, 0.85), 2px 0 rgba(39, 224, 196, 0.85); }
  60% { text-shadow: 2px 0 rgba(255, 90, 54, 0.7), -2px 0 rgba(124, 92, 255, 0.7); }
}
.cyb-threat {
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.cyb-threat:hover {
  border-color: rgba(255, 90, 54, 0.55);
  box-shadow: 0 0 0 1px rgba(255, 90, 54, 0.22), 0 14px 40px -14px rgba(255, 90, 54, 0.4);
  transform: translateY(-4px);
}
.cyb-motion .cyb-threat:hover .cyb-glitch {
  animation: cybGlitchSlice 0.3s steps(2, jump-none) 1, cybChromatic 0.3s linear 1;
}
`;

const CyberSecurityPage = () => {
  const { isTurkish } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const terminalLines = useMemo(
    () => [
      { type: 'cmd', text: 'set url https://example.com', className: 'text-ink-100' },
      { type: 'cmd', text: 'set modules xss,sqli,headers', className: 'text-ink-100' },
      { type: 'cmd', text: 'set rate-limit 10', className: 'text-ink-100' },
      {
        type: 'out',
        text: `[*] ${isTurkish ? 'Async tarama başladı' : 'Async scan started'}`,
        className: 'text-accent-300',
      },
      {
        type: 'out',
        text: `[+] ${isTurkish ? 'XSS bağlam kontrolleri tamamlandı' : 'XSS context checks completed'}`,
        className: 'text-cyan-200',
      },
      {
        type: 'out',
        text: `[✓] ${isTurkish ? 'HTML rapor oluşturuldu' : 'HTML report generated'}`,
        className: 'text-emerald-300',
      },
    ],
    [isTurkish],
  );

  const tickerItems = isTurkish
    ? [
        'SİSTEM ÇEVRİMİÇİ',
        'MODÜL 7',
        'ASYNC MOTOR',
        'HIZ SINIRI 10/SN',
        'XSS · SQLI · CSRF · SSRF',
        'HTML RAPOR HAZIR',
      ]
    : [
        'SYSTEM ONLINE',
        'MODULES 7',
        'ASYNC ENGINE',
        'RATE-LIMITED 10/S',
        'XSS · SQLI · CSRF · SSRF',
        'HTML REPORT READY',
      ];

  const focusAreas = isTurkish
    ? [
        { title: 'Web açıklıkları', desc: 'XSS, SQLi, CSRF, SSRF, open redirect ve header kontrolleri.' },
        { title: 'CLI otomasyon', desc: 'Terminal tabanlı araçlarla tekrarlanabilir güvenlik kontrolleri.' },
        {
          title: 'Güvenli kodlama',
          desc: 'Uygulama geliştirirken saldırgan bakışını tasarım kararlarına katmak.',
        },
      ]
    : [
        { title: 'Web vulnerabilities', desc: 'XSS, SQLi, CSRF, SSRF, open redirect, and header checks.' },
        { title: 'CLI automation', desc: 'Repeatable security checks through terminal-based tooling.' },
        { title: 'Secure coding', desc: 'Bringing an attacker mindset into everyday product decisions.' },
      ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`relative min-h-screen overflow-hidden px-4 pb-16 pt-24 sm:pb-20 ${
        prefersReducedMotion ? '' : 'cyb-motion'
      }`}
    >
      <PageMeta route="/cybersecurity" />
      <PageBackButton />
      <style>{consoleStyles}</style>

      {/* Scanline texture — tuned per theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 dark:hidden"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(21, 19, 28, 0.045) 0px, rgba(21, 19, 28, 0.045) 1px, transparent 1px, transparent 3px)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden dark:block"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(244, 241, 233, 0.04) 0px, rgba(244, 241, 233, 0.04) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Occasional horizontal scan sweep */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-transparent via-accent-500/5 to-transparent dark:via-aqua-300/10"
          animate={{ y: ['-15vh', '115vh'] }}
          transition={{ duration: 7, ease: 'linear', repeat: Infinity, repeatDelay: 5 }}
        />
      )}

      <div className="relative mx-auto w-full max-w-6xl">
        <motion.div variants={heroStagger} initial="initial" animate="animate">
          <motion.div variants={heroItem} className="mb-10 sm:mb-12">
            <StatusTicker items={tickerItems} reduced={prefersReducedMotion} />
          </motion.div>

          <div className="mb-10 text-center sm:mb-14">
            <motion.span
              variants={heroItem}
              className="mb-4 inline-flex items-center gap-2 rounded-lg border border-accent-500/25 bg-accent-500/10 px-4 py-1.5 text-caption text-accent-700 dark:text-accent-200 sm:mb-6"
            >
              <HiShieldCheck className="h-4 w-4" />
              {isTurkish ? 'Siber güvenlik' : 'Cybersecurity'}
            </motion.span>

            <motion.h1 variants={heroItem} className="mb-4 sm:mb-6">
              <DecryptedText
                text={isTurkish ? 'Siber Güvenlik' : 'Cyber Security'}
                speed={40}
                maxIterations={15}
                sequential
                revealDirection="center"
                animateOn="view"
                characters="01!@#$%^&*{}[]<>/\\|~`"
                className="text-h1 text-ink-900 dark:text-white"
                encryptedClassName="text-h1 text-accent-500/60 dark:text-accent-300/60"
                parentClassName="text-h1 inline-block"
              />
            </motion.h1>

            <motion.p
              variants={heroItem}
              className="mx-auto max-w-2xl text-body-lg text-ink-600 dark:text-ink-200"
            >
              {isTurkish
                ? 'Güvenlik tarafında odağım, öğrenilen kavramları küçük ama çalışır araçlara dönüştürmek.'
                : 'My security focus is turning learned concepts into small but working tools.'}
            </motion.p>
          </div>

          <TerminalHero lines={terminalLines} reduced={prefersReducedMotion} isTurkish={isTurkish} />
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: EASE }}
          className="card-prominent mt-14 p-6 sm:mt-20 sm:p-8"
        >
          <p className="mb-2 text-caption text-accent-700 dark:text-accent-200">msscan</p>
          <h2 className="mb-4 text-h2 text-ink-900 dark:text-white">
            {isTurkish ? 'Async Python web güvenlik tarayıcısı.' : 'Async Python web security scanner.'}
          </h2>
          <p className="mb-5 text-body text-ink-600 dark:text-ink-200">
            {isTurkish
              ? 'msscan; XSS, SQL injection, CSRF, SSRF, open redirect, HTTP security headers ve subdomain enumeration kontrolleri için geliştirdiğim terminal aracıdır. README’de belirtilen odak: async execution, rate limiting, context-aware detection ve HTML rapor üretimi.'
              : 'msscan is my terminal tool for XSS, SQL injection, CSRF, SSRF, open redirect, HTTP security headers, and subdomain enumeration checks. The README focus is async execution, rate limiting, context-aware detection, and HTML reporting.'}
          </p>
          <div className="mb-6 flex flex-wrap gap-2">
            {['Python', 'Async', 'Rate limiting', 'HTML reports', 'Security headers'].map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-ink-200/70 bg-white/50 px-2.5 py-1 text-xs font-bold text-ink-600 dark:border-white/10 dark:bg-white/10 dark:text-ink-200"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/MertSoylu/msscan"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <HiExternalLink className="h-4 w-4" />
              GitHub
            </a>
            <Link to="/case-study/msscan" className="btn-secondary">
              <HiBookOpen className="h-4 w-4" />
              Case Study
            </Link>
          </div>
        </motion.article>

        <section className="mt-14 sm:mt-20" aria-labelledby="focus-areas-heading">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mb-8 flex items-end justify-between gap-6 sm:mb-10"
          >
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-accent-700/80 dark:text-accent-200/80">
                {isTurkish ? 'Tehdit istihbaratı' : 'Threat intel'}
              </p>
              <h2 id="focus-areas-heading" className="text-h2 text-ink-900 dark:text-white">
                {isTurkish ? 'Odak alanları' : 'Focus areas'}
              </h2>
            </div>
            <RadarSweep reduced={prefersReducedMotion} />
          </motion.div>

          <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
            {focusAreas.map((area, index) => (
              <ThreatCard key={area.title} area={area} index={index} />
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default CyberSecurityPage;
