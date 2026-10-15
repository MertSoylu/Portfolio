import { DiReact, DiNodejsSmall, DiPython, DiAndroid, DiGit, DiDocker } from 'react-icons/di';
import { SiTypescript, SiTailwindcss, SiKotlin, SiPostgresql, SiFigma, SiFirebase } from 'react-icons/si';
import LogoLoop from './ui/LogoLoop';

// TEMPORARY: the tech marquee, kept as-is but split out of App.jsx so its icon packs load lazily.
// Phase 2 replaces this section with the static Stack grid and deletes this file.
const techLogos = [
  <DiReact key="react" className="text-[#61DAFB]" />,
  <DiNodejsSmall key="node" className="text-[#339933]" />,
  <SiTypescript key="ts" className="text-[#3178C6]" />,
  <SiTailwindcss key="tw" className="text-[#06B6D4]" />,
  <DiPython key="py" className="text-[#3776AB]" />,
  <DiAndroid key="android" className="text-[#3DDC84]" />,
  <SiKotlin key="kotlin" className="text-[#7F52FF]" />,
  <DiGit key="git" className="text-[#F05032]" />,
  <DiDocker key="docker" className="text-[#2496ED]" />,
  <SiPostgresql key="pg" className="text-[#4169E1]" />,
  <SiFigma key="figma" className="text-[#F24E1E]" />,
  <SiFirebase key="firebase" className="text-[#FFCA28]" />,
];

const TechLogoLoop = () => (
  <section className="py-9 sm:py-10">
    <LogoLoop
      logos={techLogos}
      speed={70}
      direction="right"
      logoHeight={30}
      gap={36}
      hoverSpeed={18}
      fadeOut
      scaleOnHover
    />
  </section>
);

export default TechLogoLoop;
