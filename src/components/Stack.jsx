import {
  SiAndroidstudio,
  SiDocker,
  SiFigma,
  SiFirebase,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJetpackcompose,
  SiKotlin,
  SiLinux,
  SiMaterialdesign,
  SiNextdotjs,
  SiNodedotjs,
  SiNumpy,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRust,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from 'react-icons/si';
import { useLanguage } from '../context/LanguageContext';
import SectionHeader from './home/SectionHeader';
import Reveal from './ui/Reveal';

// Everything here appears in a project, an area page or the old tech marquee: nothing aspirational.
const GROUPS = [
  {
    id: 'languages',
    title: { tr: 'Diller', en: 'Languages' },
    items: [
      { name: 'JavaScript', Icon: SiJavascript },
      { name: 'TypeScript', Icon: SiTypescript },
      { name: 'Kotlin', Icon: SiKotlin },
      { name: 'Python', Icon: SiPython },
      { name: 'Rust', Icon: SiRust },
      { name: 'HTML / CSS', Icon: SiHtml5 },
    ],
  },
  {
    id: 'frameworks',
    title: { tr: 'Framework ve kütüphaneler', en: 'Frameworks & libraries' },
    items: [
      { name: 'React', Icon: SiReact },
      { name: 'Next.js', Icon: SiNextdotjs },
      { name: 'Node.js', Icon: SiNodedotjs },
      { name: 'Tailwind CSS', Icon: SiTailwindcss },
      { name: 'Jetpack Compose', Icon: SiJetpackcompose },
      { name: 'Material 3', Icon: SiMaterialdesign },
      { name: 'NumPy', Icon: SiNumpy },
      { name: 'Pandas', Icon: SiPandas },
    ],
  },
  {
    id: 'tools',
    title: { tr: 'Araçlar', en: 'Tools' },
    items: [
      { name: 'Git', Icon: SiGit },
      { name: 'Docker', Icon: SiDocker },
      { name: 'Linux', Icon: SiLinux },
      { name: 'Vite', Icon: SiVite },
      { name: 'Android Studio', Icon: SiAndroidstudio },
      { name: 'PostgreSQL', Icon: SiPostgresql },
      { name: 'Supabase', Icon: SiSupabase },
      { name: 'Firebase', Icon: SiFirebase },
      { name: 'Figma', Icon: SiFigma },
    ],
  },
];

const Stack = () => {
  const { isTurkish } = useLanguage();
  const t = (tr, en) => (isTurkish ? tr : en);

  return (
    <section id="stack" aria-labelledby="stack-title" className="relative py-20 md:py-28">
      <div className="container-site">
        <SectionHeader
          id="stack-title"
          index="03"
          label={t('Teknolojiler', 'Stack')}
          title={t('Kullandığım teknolojiler.', 'What I build with.')}
          lead={t(
            'Projelerimde ve çalışma alanlarımda gerçekten kullandığım diller, kütüphaneler ve araçlar.',
            'The languages, libraries and tools I actually use across my projects and focus areas.',
          )}
        />

        <div>
          {GROUPS.map((group, groupIndex) => (
            <Reveal
              key={group.id}
              delay={groupIndex * 0.06}
              className="grid gap-5 border-t border-line/10 py-8 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:gap-8"
            >
              <div className="lg:col-span-3">
                <h3 className="text-h4">{group.title[isTurkish ? 'tr' : 'en']}</h3>
                <p className="label mt-1">{String(group.items.length).padStart(2, '0')}</p>
              </div>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:col-span-9 lg:grid-cols-4">
                {group.items.map(({ name, Icon }) => (
                  <li key={name} className="card flex min-w-0 items-center gap-3 px-4 py-3.5">
                    <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" />
                    <span className="min-w-0 text-sm font-medium">{name}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stack;
