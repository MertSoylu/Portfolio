import { Link } from 'react-router-dom';
import { HiBookOpen, HiExternalLink, HiGlobe } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';
import Reveal from '../components/ui/Reveal';
import { BrowserFrame } from '../components/ui/DevicePreview';

const ProjectRow = ({ project, index, isTurkish }) => {
  const flip = index % 2 === 1;
  return (
    <Reveal className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div className={flip ? 'lg:order-2' : ''}>
        <BrowserFrame
          url={project.url}
          src={project.snapshotSrc}
          alt={`${project.title} preview`}
          title={project.title}
        />
      </div>
      <div className={flip ? 'lg:order-1' : ''}>
        <p className="eyebrow mb-3 text-accent">Case {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mb-3 text-h2 text-fg">{project.title}</h2>
        <p className="mb-4 text-body text-muted">{project.description}</p>
        <p className="mb-5 border-l-2 border-accent/60 pl-4 text-sm font-medium leading-relaxed text-fg">
          {project.decision}
        </p>
        <div className="mb-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line/12 bg-surface2 px-2.5 py-1 text-xs font-medium text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={project.caseStudyPath} className="btn-primary px-4 py-2 text-sm">
            <HiBookOpen className="h-4 w-4" />
            Case Study
          </Link>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-4 py-2 text-sm"
          >
            <HiExternalLink className="h-4 w-4" />
            {isTurkish ? 'Canlı aç' : 'Open live'}
          </a>
        </div>
      </div>
    </Reveal>
  );
};

const WebDevPage = () => {
  const { isTurkish } = useLanguage();

  const projects = [
    {
      id: 'mnemosyne',
      caseStudyPath: '/case-study/mnemosyne',
      title: 'Mnemosyne',
      url: 'https://m-nemosyne.live',
      snapshotSrc: '/previews/mnemosyne-live.png',
      description: isTurkish
        ? 'Konumlara bırakılan anılar fikrini, harita ve zaman katmanlarıyla çalışan canlı web deneyimine dönüştürdüm.'
        : 'Turned location-based memories into a live web experience built around maps and time layers.',
      tags: [
        'React',
        'PWA',
        isTurkish ? 'Konum' : 'Location',
        isTurkish ? 'Zaman katmanları' : 'Time layers',
      ],
      decision: isTurkish
        ? 'Odak: anı paylaşımını klasik galeri yerine mekan ve zaman bağlamıyla okutmak.'
        : 'Focus: make memory sharing readable through place and time, not a plain gallery.',
    },
    {
      id: 'typesprint',
      caseStudyPath: '/case-study/typesprint',
      title: 'TypeSprint',
      url: 'https://typesprint.online',
      snapshotSrc: '/previews/typesprint-live.png',
      description: isTurkish
        ? 'Yazma hızı ölçümünü doğruluk, ritim ve çok dilli kelime havuzu üzerinden kurgulayan WPM uygulaması.'
        : 'A WPM app designed around accuracy, rhythm, and multilingual word pools.',
      tags: ['JavaScript', 'WPM', isTurkish ? 'Çok dilli' : 'Multilingual', 'Leaderboard'],
      decision: isTurkish
        ? 'Odak: yanlış girişte akışı durdurarak ölçümü daha dürüst hale getirmek.'
        : 'Focus: make measurement more honest by stopping progress on wrong input.',
    },
  ];

  return (
    <SpecialtyPageLayout
      routePath="/web"
      eyebrow={isTurkish ? 'Web geliştirme' : 'Web development'}
      eyebrowIcon={<HiGlobe className="h-4 w-4" />}
      title={isTurkish ? 'Canlı web ürünleri' : 'Live web products'}
      subtitle={
        isTurkish
          ? 'React, Vite ve ürün odaklı arayüz kararlarıyla geliştirdiğim web projeleri.'
          : 'Web projects built with React, Vite, and product-minded interface decisions.'
      }
    >
      <div className="space-y-20 sm:space-y-24">
        {projects.map((project, index) => (
          <ProjectRow key={project.id} project={project} index={index} isTurkish={isTurkish} />
        ))}
      </div>
    </SpecialtyPageLayout>
  );
};

export default WebDevPage;
