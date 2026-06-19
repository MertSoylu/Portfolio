import PageMeta from './PageMeta';
import PageBackButton from './ui/PageBackButton';
import Reveal from './ui/Reveal';

/**
 * Shared layout for specialty pages (Web, Android, Cyber, Data). Owns the back
 * link, the editorial header (eyebrow + serif title + subtitle + optional side
 * slot), and the content slot. A `centered` variant backs the 404 page.
 */
const SpecialtyPageLayout = ({
  routePath,
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  sideNode,
  centered = false,
  hideBackButton = false,
  children,
}) => {
  if (centered) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-5 py-28">
        {routePath && <PageMeta route={routePath} />}
        <div className="mx-auto w-full max-w-lg text-center">{children}</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-5 pb-16 pt-24 sm:pt-32">
      {routePath && <PageMeta route={routePath} />}
      <div className="container-wide">
        {!hideBackButton && <PageBackButton className="mb-8" />}

        {(eyebrow || title || subtitle || sideNode) && (
          <header
            className={`mb-8 grid items-end gap-6 sm:mb-12 sm:gap-8 md:mb-16 ${
              sideNode ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-12' : ''
            }`}
          >
            <div className="max-w-3xl">
              {eyebrow && (
                <Reveal as="div" className="mb-4">
                  <span className="eyebrow text-accent">
                    {eyebrowIcon}
                    {eyebrow}
                  </span>
                </Reveal>
              )}
              {title && (
                <Reveal as="h1" delay={0.05} className="text-h1 text-fg">
                  {title}
                </Reveal>
              )}
              {subtitle && (
                <Reveal as="p" delay={0.1} className="mt-5 max-w-2xl text-body-lg text-muted">
                  {subtitle}
                </Reveal>
              )}
            </div>
            {sideNode && (
              <Reveal delay={0.15} className="w-full">
                {sideNode}
              </Reveal>
            )}
          </header>
        )}

        {children}
      </div>
    </div>
  );
};

export default SpecialtyPageLayout;
