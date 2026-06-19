import Reveal from '../ui/Reveal';
import ShinyText from '../ui/ShinyText';

/**
 * SectionHeader — shared, calm section intro: a small uppercase eyebrow, a serif
 * title, an optional lead paragraph, and an optional aside slot (stats). Left
 * aligned and reduced-motion aware via Reveal.
 */
const SectionHeader = ({ kicker, kickerIcon, title, lead, aside, className = '' }) => (
  <div className={`mb-8 sm:mb-12 md:mb-16 ${className}`}>
    <div className="grid items-end gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
      <div className="min-w-0">
        {kicker && (
          <Reveal as="div" className="mb-4">
            <span className="eyebrow">
              {kickerIcon}
              <ShinyText
                text={kicker}
                speed={4}
                color="rgb(var(--accent))"
                shineColor="rgb(var(--accent-strong))"
                spread={80}
              />
            </span>
          </Reveal>
        )}

        <Reveal as="h2" delay={0.05} className="section-title max-w-3xl">
          {title}
        </Reveal>

        {lead && (
          <Reveal as="p" delay={0.1} className="section-subtitle mt-5 max-w-2xl">
            {lead}
          </Reveal>
        )}
      </div>

      {aside && (
        <Reveal delay={0.15} className="min-w-0 lg:pb-2">
          {aside}
        </Reveal>
      )}
    </div>
  </div>
);

export default SectionHeader;
