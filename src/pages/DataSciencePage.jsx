import { useLanguage } from '../context/LanguageContext';
import SpecialtyPageLayout, { InfoCard, PageSection } from '../components/SpecialtyPageLayout';
import Reveal from '../components/ui/Reveal';
import { LEARNING_LEVELS, areaById } from '../data/areas';
import { pick } from '../data/projects';

const area = areaById('data-science');
const { statement, learning, outputs } = area.page;

// Text level of a learning topic: a filled marker for what I am studying now, a hollow one for what is planned.
const LevelMark = ({ level, label }) => (
  <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-fg">
    <span
      aria-hidden="true"
      className={`h-2 w-2 shrink-0 rounded-full ${
        level === 'learning' ? 'bg-accent' : 'border border-muted bg-transparent'
      }`}
    />
    {label}
  </span>
);

const DataSciencePage = () => {
  const { isTurkish } = useLanguage();
  const t = (value) => pick(value, isTurkish);

  return (
    <SpecialtyPageLayout areaId={area.id}>
      <PageSection id="ds-status-heading" index="01" label={t(statement.label)} title={t(statement.title)}>
        <Reveal className="card p-6 sm:p-8">
          <p className="max-w-3xl text-lg text-fg sm:text-xl">{t(statement.body)}</p>
        </Reveal>
      </PageSection>

      <PageSection id="ds-learning-heading" index="02" label={t(learning.label)} title={t(learning.title)}>
        <ul className="grid gap-4 md:grid-cols-3">
          {learning.items.map((item, index) => (
            <Reveal as="li" key={item.title.en} delay={index * 0.06} className="h-full">
              <InfoCard
                index={String(index + 1).padStart(2, '0')}
                title={t(item.title)}
                meta={<LevelMark level={item.level} label={t(LEARNING_LEVELS[item.level])} />}
              >
                {t(item.desc)}
              </InfoCard>
            </Reveal>
          ))}
        </ul>
      </PageSection>

      <PageSection id="ds-outputs-heading" index="03" label={t(outputs.label)} title={t(outputs.title)}>
        <Reveal>
          <ul className="border-b border-line/10">
            {outputs.items.map((item) => (
              <li key={item.en} className="flex gap-4 border-t border-line/10 py-4 text-base">
                <span aria-hidden="true" className="font-mono text-accent">
                  →
                </span>
                <span>{t(item)}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </PageSection>
    </SpecialtyPageLayout>
  );
};

export default DataSciencePage;
