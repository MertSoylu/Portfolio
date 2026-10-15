import Reveal from '../ui/Reveal';

/**
 * SectionHeader — the only section header pattern. A full-width hairline rule carries a mono
 * `index / label` marker (`01 / Projeler`), followed by the h2, an optional lead paragraph and an
 * optional aside (stats, links) that sits to the right of the title from `lg` up.
 *
 * Props: `id` (put on the h2 so a section can use aria-labelledby), `index` ('01'), `label`, `title`,
 * `lead`, `aside`, `align` ('left' | 'center'), `className`.
 */
const SectionHeader = ({ id, index, label, title, lead, aside, align = 'left', className = '' }) => {
  const marker = [index, label].filter(Boolean).join(' / ');
  const centered = align === 'center';

  return (
    <div className={`mb-10 sm:mb-14 ${className}`}>
      <Reveal className="flex items-center gap-4">
        {centered && <span aria-hidden="true" className="h-px flex-1 bg-line/15" />}
        {marker && <span className="label shrink-0 text-muted">{marker}</span>}
        <span aria-hidden="true" className="h-px flex-1 bg-line/15" />
      </Reveal>

      <div
        className={`mt-6 grid items-end gap-6 sm:mt-8 sm:gap-8 lg:gap-12 ${
          aside ? 'lg:grid-cols-[minmax(0,1fr)_auto]' : ''
        } ${centered ? 'text-center' : ''}`}
      >
        <div className="min-w-0">
          <Reveal as="h2" id={id} delay={0.05} className={`text-h2 max-w-3xl ${centered ? 'mx-auto' : ''}`}>
            {title}
          </Reveal>

          {lead && (
            <Reveal as="p" delay={0.1} className={`text-lead mt-5 max-w-2xl ${centered ? 'mx-auto' : ''}`}>
              {lead}
            </Reveal>
          )}
        </div>

        {aside && (
          <Reveal delay={0.15} className="min-w-0 lg:pb-1">
            {aside}
          </Reveal>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
