const stripHost = (url = '') => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

const Dots = () => (
  <span className="flex gap-1.5" aria-hidden="true">
    <span className="h-2.5 w-2.5 rounded-full bg-line/20" />
    <span className="h-2.5 w-2.5 rounded-full bg-line/20" />
    <span className="h-2.5 w-2.5 rounded-full bg-line/20" />
  </span>
);

const Shot = ({ src, alt, title, eager = false }) =>
  src ? (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="h-full w-full object-cover object-top"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <span className="font-display text-2xl font-semibold text-muted">{title}</span>
    </div>
  );

/** Ekran görüntüsünün etrafına sade tarayıcı çerçevesi. */
export const BrowserFrame = ({ url = '', src, alt = '', title = '', className = '', eager }) => (
  <div className={`overflow-hidden rounded-2xl border border-line/12 bg-surface shadow-soft ${className}`}>
    <div className="flex items-center gap-3 border-b border-line/10 px-4 py-2.5">
      <Dots />
      {url && (
        <span className="truncate rounded-md bg-surface2 px-3 py-1 text-xs font-medium text-muted">
          {stripHost(url)}
        </span>
      )}
    </div>
    <div className="aspect-[16/10] overflow-hidden bg-surface2">
      <Shot src={src} alt={alt} title={title} eager={eager} />
    </div>
  </div>
);

/** Dikey ekran görüntüsü için telefon çerçevesi. */
export const PhoneFrame = ({ src, alt = '', title = '', className = '', eager }) => (
  <div
    className={`mx-auto w-[230px] max-w-full rounded-[2.3rem] border border-line/15 bg-ink-900 p-2.5 shadow-lift ${className}`}
  >
    <div className="relative aspect-[9/19] overflow-hidden rounded-[1.8rem] bg-ink-800">
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-black/80"
      />
      <Shot src={src} alt={alt} title={title} eager={eager} />
    </div>
  </div>
);

/** Kendi pencere çerçevesini içeren görsel (ör. NOBLE ekran görüntüleri): yalnızca köşe ve gölge. */
export const WindowShot = ({ src, alt = '', className = '', eager }) => (
  <div className={`overflow-hidden rounded-2xl border border-line/12 bg-[#0c0a07] shadow-lift ${className}`}>
    <div className="aspect-[16/10]">
      <Shot src={src} alt={alt} eager={eager} />
    </div>
  </div>
);

const TONES = {
  warn: 'text-amber-300',
  ok: 'text-emerald-300',
  accent: 'text-[#ef9069]',
};

/**
 * Ekran görüntüsü olmayan CLI araçları için metinden çizilen terminal. Tema ne olursa
 * olsun koyu kalır; satırlar ekran okuyucuya tek bir figür açıklaması olarak sunulur.
 */
export const TerminalPreview = ({ title = '', lines = [], className = '', compact = false }) => (
  <figure
    className={`flex flex-col overflow-hidden rounded-2xl border border-line/12 bg-[#14110e] shadow-soft ${className}`}
    aria-label={lines.map((line) => [line.prompt, line.text].filter(Boolean).join(' ')).join('. ')}
  >
    <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
      <span className="flex gap-1.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
      </span>
      <span className="font-mono text-xs text-white/50">{title}</span>
    </div>
    <pre
      aria-hidden="true"
      className={`flex-1 overflow-hidden whitespace-pre-wrap break-words font-mono leading-relaxed text-white/80 ${
        compact ? 'p-4 text-[11px]' : 'p-5 text-xs sm:text-sm'
      }`}
    >
      {lines.map((line, index) => (
        <span key={index} className="block">
          {line.prompt && <span className="text-[#ef9069]">{line.prompt} </span>}
          <span className={TONES[line.tone] || ''}>{line.text}</span>
        </span>
      ))}
    </pre>
  </figure>
);

/** Projenin `preview.kind` alanına göre doğru çerçeveyi seçer. */
export const ProjectPreview = ({ project, alt, eager, className = '' }) => {
  const { preview = {} } = project;
  const url = project.liveUrl || project.githubUrl;
  if (preview.kind === 'phone') {
    return (
      <PhoneFrame src={preview.src} alt={alt} title={project.title} eager={eager} className={className} />
    );
  }
  if (preview.kind === 'window') {
    return <WindowShot src={preview.src} alt={alt} eager={eager} className={className} />;
  }
  if (preview.kind === 'terminal') {
    return (
      <TerminalPreview
        title={preview.title || project.title}
        lines={preview.lines}
        className={`aspect-[16/10] ${className}`}
      />
    );
  }
  return (
    <BrowserFrame
      url={url}
      src={preview.src}
      alt={alt}
      title={project.title}
      eager={eager}
      className={className}
    />
  );
};

export default BrowserFrame;
