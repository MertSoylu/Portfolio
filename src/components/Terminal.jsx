import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TECHNOLOGIES } from '../utils/constants';

const COMMANDS = {
  tr: {
    whoami: () => [
      '👋 Mert Soylu',
      '📍 İzmir, Türkiye',
      '🎓 Bilgisayar Programcılığı — Kütahya Dumlupınar Üniversitesi',
      '💼 Web & Mobil Geliştirici | Siber Güvenlik Meraklısı',
      '',
      'Teknoloji yolculuğum merakla başladı ve gerçek problemleri',
      'çözen uygulamalar geliştirme tutkusuna dönüştü.',
    ],
    skills: () => [
      '🌐 Web Geliştirme    — React, JavaScript, Tailwind CSS, Vite',
      '📱 Android Geliştirme — Java, Android Studio',
      '🔒 Siber Güvenlik    — Python, Network Security, Encryption',
    ],
    tech: () => {
      const lines = ['── Teknoloji Yığını ──', ''];
      lines.push(`Frontend : ${TECHNOLOGIES.frontend.join(', ')}`);
      lines.push(`Backend  : ${TECHNOLOGIES.backend.join(', ')}`);
      lines.push(`Mobil    : ${TECHNOLOGIES.mobile.join(', ')}`);
      lines.push(`Araçlar  : ${TECHNOLOGIES.tools.join(', ')}`);
      return lines;
    },
    education: () => [
      '🎓 Kütahya Dumlupınar Üniversitesi',
      '   Bilgisayar Programcılığı',
      '   Devam ediyor',
    ],
    contact: () => [
      '📧 s6ylumert@gmail.com',
      '🔗 github.com/MertSoylu',
      '💼 linkedin.com/in/mert-soylu-b8b6a1341',
    ],
    help: () => [
      'Kullanılabilir komutlar:',
      '',
      '  whoami     — Kim olduğumu öğren',
      '  skills     — Uzmanlık alanlarım',
      '  tech       — Teknoloji yığını',
      '  education  — Eğitim bilgisi',
      '  contact    — İletişim bilgileri',
      '  clear      — Terminali temizle',
      '  help       — Bu yardım mesajı',
    ],
  },
  en: {
    whoami: () => [
      '👋 Mert Soylu',
      '📍 İzmir, Turkey',
      '🎓 Computer Programming — Kütahya Dumlupınar University',
      '💼 Web & Mobile Developer | Cybersecurity Enthusiast',
      '',
      'My journey in tech started with curiosity and evolved into',
      'a passion for building apps that solve real-world problems.',
    ],
    skills: () => [
      '🌐 Web Development    — React, JavaScript, Tailwind CSS, Vite',
      '📱 Android Development — Java, Android Studio',
      '🔒 Cybersecurity      — Python, Network Security, Encryption',
    ],
    tech: () => {
      const lines = ['── Tech Stack ──', ''];
      lines.push(`Frontend : ${TECHNOLOGIES.frontend.join(', ')}`);
      lines.push(`Backend  : ${TECHNOLOGIES.backend.join(', ')}`);
      lines.push(`Mobile   : ${TECHNOLOGIES.mobile.join(', ')}`);
      lines.push(`Tools    : ${TECHNOLOGIES.tools.join(', ')}`);
      return lines;
    },
    education: () => [
      '🎓 Kütahya Dumlupınar University',
      '   Computer Programming',
      '   Currently enrolled',
    ],
    contact: () => [
      '📧 s6ylumert@gmail.com',
      '🔗 github.com/MertSoylu',
      '💼 linkedin.com/in/mert-soylu-b8b6a1341',
    ],
    help: () => [
      'Available commands:',
      '',
      '  whoami     — Learn who I am',
      '  skills     — My areas of expertise',
      '  tech       — Technology stack',
      '  education  — Education info',
      '  contact    — Contact information',
      '  clear      — Clear terminal',
      '  help       — Show this help message',
    ],
  },
};

const TerminalLine = ({ line, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.15, delay: index * 0.03 }}
    className="whitespace-pre-wrap break-words"
  >
    {line || '\u00A0'}
  </motion.div>
);

const Terminal = ({ isTurkish }) => {
  const lang = isTurkish ? 'tr' : 'en';
  const commands = COMMANDS[lang];
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const hasAutoRun = useRef(false);

  const executeCommand = useCallback((cmd) => {
    const trimmed = cmd.trim().toLowerCase();

    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }

    const entry = { command: cmd, output: [] };

    if (trimmed === '') {
      setHistory((prev) => [...prev, entry]);
      return;
    }

    if (commands[trimmed]) {
      entry.output = commands[trimmed]();
    } else {
      entry.output = [
        isTurkish
          ? `Komut bulunamadı: ${trimmed}. "help" yazarak komutları görebilirsin.`
          : `Command not found: ${trimmed}. Type "help" to see available commands.`,
      ];
    }

    setHistory((prev) => [...prev, entry]);
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
  }, [commands, isTurkish]);

  // Auto-run whoami on mount
  useEffect(() => {
    if (!hasAutoRun.current) {
      hasAutoRun.current = true;
      setTimeout(() => executeCommand('whoami'), 600);
    }
  }, [executeCommand]);

  // Auto-scroll terminal output to bottom (within container only, not the page)
  useEffect(() => {
    if (bottomRef.current) {
      const container = bottomRef.current.closest('[data-terminal-scroll]');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [history]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.trim().toLowerCase();
      if (partial) {
        const match = Object.keys(commands).find((c) => c.startsWith(partial));
        if (match) setInput(match);
      }
    }
  };

  const focusInput = () => inputRef.current?.focus();

  return (
    <div
      className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-sand-300/30 dark:border-dark-300/30"
      onClick={focusInput}
    >
      {/* Title bar */}
      <div className="bg-[#2d333b] dark:bg-[#161b22] px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="ml-3 text-xs text-gray-400 font-mono">mert@portfolio ~ </span>
      </div>

      {/* Terminal body */}
      <div data-terminal-scroll className="bg-[#1e293b] dark:bg-[#0d1117] p-4 font-mono text-sm leading-relaxed text-gray-200 max-h-[400px] overflow-y-auto min-h-[280px] cursor-text">
        {/* Welcome message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500 mb-3"
        >
          {isTurkish
            ? '// Komut yaz veya "help" ile başla'
            : '// Type a command or start with "help"'}
        </motion.div>

        {/* History */}
        {history.map((entry, i) => (
          <div key={i} className="mb-2">
            {entry.command && (
              <div className="flex items-center gap-2">
                <span className="text-green-400">❯</span>
                <span className="text-warm-400">{entry.command}</span>
              </div>
            )}
            <div className="pl-5 text-gray-300">
              {entry.output.map((line, j) => (
                <TerminalLine key={j} line={line} index={j} />
              ))}
            </div>
          </div>
        ))}

        {/* Input line */}
        <div className="flex items-center gap-2">
          <span className="text-green-400">❯</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-warm-400 caret-warm-500 font-mono"
            spellCheck={false}
            autoComplete="off"
            aria-label={isTurkish ? 'Terminal komutu gir' : 'Enter terminal command'}
          />
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
            className="inline-block w-[7px] h-4 bg-warm-500 rounded-[1px]"
          />
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default Terminal;
