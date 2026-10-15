import { useLanguage } from '../../context/LanguageContext';
import { previewAlt } from '../../data/projects';

const stripHost = (url = '') => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

// Ekran görüntüsü çerçevenin en-boy oranına yerleşir: <img> yüklenene kadar yer ayrılır, sayfa kaymaz.
const Shot = ({ src, alt, eager = false }) => (
  <img
    src={src}
    alt={alt}
    loading={eager ? 'eager' : 'lazy'}
    decoding="async"
    className="h-full w-full object-cover object-top"
  />
);

/** Ekran görüntüsünün etrafına sade tarayıcı çerçevesi: ince üst çubuk, üç nokta ve mono adres. */
export const BrowserFrame = ({ url = '', src, alt = '', className = '', eager }) => (
  <div className={`overflow-hidden rounded-lg border border-line/10 bg-surface ${className}`}>
    {/* Çubuk yalnızca süs; adres zaten proje bağlantılarında var. */}
    <div className="flex items-center gap-3 border-b border-line/10 px-3 py-2.5" aria-hidden="true">
      <span className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-line/20" />
        <span className="h-2 w-2 rounded-full bg-line/20" />
        <span className="h-2 w-2 rounded-full bg-line/20" />
      </span>
      {url && <span className="min-w-0 truncate font-mono text-xs text-muted">{stripHost(url)}</span>}
    </div>
    <div className="aspect-[16/10] overflow-hidden bg-surface2">
      <Shot src={src} alt={alt} eager={eager} />
    </div>
  </div>
);

/** Dikey ekran görüntüsü için telefon çerçevesi. Çerçeve iki temada da koyu kalır. */
export const PhoneFrame = ({ src, alt = '', className = '', eager }) => (
  <div
    className={`mx-auto w-[230px] max-w-full rounded-[2rem] border border-line/20 bg-[#0A0B0D] p-2 ${className}`}
  >
    <div className="relative aspect-[9/19] overflow-hidden rounded-[1.5rem] bg-[#181B1F]">
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-2 z-10 h-3.5 w-16 -translate-x-1/2 rounded-full bg-[#0A0B0D]"
      />
      <Shot src={src} alt={alt} eager={eager} />
    </div>
  </div>
);

/** Kendi pencere çerçevesini içeren görsel (ör. NOBLE ekran görüntüleri): yalnızca köşe ve ince kenarlık. */
export const WindowShot = ({ src, alt = '', className = '', eager }) => (
  <div className={`overflow-hidden rounded-lg border border-line/10 bg-surface2 ${className}`}>
    <div className="aspect-[16/10]">
      <Shot src={src} alt={alt} eager={eager} />
    </div>
  </div>
);

// Terminal her iki temada da koyu kalır; renkler #0A0B0D üzerinde AA kontrastı (en düşüğü ~6.5:1) verir.
const TONES = {
  danger: 'text-[#F87171]',
  warn: 'text-[#FBBF24]',
  ok: 'text-[#4ADE80]',
  accent: 'text-[#D97757]',
};

/**
 * Ekran görüntüsü olmayan CLI araçları için metinden çizilen terminal. Tema ne olursa
 * olsun koyu kalır; satırlar ekran okuyucuya tek bir figür açıklaması olarak sunulur.
 * `compact` kart küçük resimleri içindir: daha küçük yazı ve dolgu.
 */
export const TerminalPreview = ({ title = '', lines = [], className = '', compact = false }) => (
  <figure
    className={`flex flex-col overflow-hidden rounded-lg border border-line/10 bg-[#0A0B0D] ${className}`}
    aria-label={lines.map((line) => [line.prompt, line.text].filter(Boolean).join(' ')).join('. ')}
  >
    <div className="flex items-center gap-3 border-b border-white/10 px-3 py-2.5" aria-hidden="true">
      <span className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
      </span>
      <span className="min-w-0 truncate font-mono text-xs text-[#8F949C]">{title}</span>
    </div>
    <pre
      aria-hidden="true"
      className={`flex-1 overflow-hidden whitespace-pre-wrap break-words font-mono text-[#ECEDEF] ${
        compact ? 'micro p-4 leading-relaxed' : 'p-4 text-xs leading-relaxed sm:p-5 sm:text-sm'
      }`}
    >
      {lines.map((line, index) => (
        <span key={index} className="block">
          {line.prompt && <span className="text-[#D97757]">{line.prompt} </span>}
          <span className={TONES[line.tone] || ''}>{line.text}</span>
        </span>
      ))}
    </pre>
  </figure>
);

/**
 * Projenin `preview.kind` alanına göre doğru çerçeveyi seçer. `alt` verilmezse projenin
 * özetinden üretilir (`previewAlt`); dışarıdan verilen alt metin önceliklidir.
 */
export const ProjectPreview = ({ project, alt, eager, className = '' }) => {
  const { isTurkish } = useLanguage();
  const { preview = {} } = project;
  const url = project.liveUrl || project.githubUrl;
  const imageAlt = alt ?? previewAlt(project, isTurkish);

  if (preview.kind === 'phone') {
    return <PhoneFrame src={preview.src} alt={imageAlt} eager={eager} className={className} />;
  }
  if (preview.kind === 'window') {
    return <WindowShot src={preview.src} alt={imageAlt} eager={eager} className={className} />;
  }
  if (preview.kind === 'terminal') {
    // Dar ekranda yükseklik içeriğe göre büyür (satırlar kırpılmasın); sm ve üstünde 16:10 oranı korunur.
    return (
      <TerminalPreview
        title={preview.title || project.title}
        lines={preview.lines}
        className={`sm:aspect-[16/10] ${className}`}
      />
    );
  }
  return <BrowserFrame url={url} src={preview.src} alt={imageAlt} eager={eager} className={className} />;
};
