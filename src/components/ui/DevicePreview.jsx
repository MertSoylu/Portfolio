const stripHost = (url = '') => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

const Dots = () => (
  <span className="flex gap-1.5" aria-hidden="true">
    <span className="h-2.5 w-2.5 rounded-full bg-line/20" />
    <span className="h-2.5 w-2.5 rounded-full bg-line/20" />
    <span className="h-2.5 w-2.5 rounded-full bg-line/20" />
  </span>
);

/** Clean browser chrome around a screenshot. */
export const BrowserFrame = ({ url = '', src, alt = '', title = '', className = '' }) => (
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
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-2xl font-semibold text-muted">{title}</span>
        </div>
      )}
    </div>
  </div>
);

/** Clean phone bezel around a portrait screenshot. */
export const PhoneFrame = ({ src, alt = '', title = '', className = '' }) => (
  <div
    className={`mx-auto w-[230px] max-w-full rounded-[2.3rem] border border-line/15 bg-ink-900 p-2.5 shadow-lift ${className}`}
  >
    <div className="relative aspect-[9/19] overflow-hidden rounded-[1.8rem] bg-ink-800">
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-black/80"
      />
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-4 text-center">
          <span className="font-display text-lg font-semibold text-ink-100">{title}</span>
        </div>
      )}
    </div>
  </div>
);

export default BrowserFrame;
