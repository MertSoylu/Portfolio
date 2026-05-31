import React from 'react';
import { motion } from 'framer-motion';
import { HiBookOpen, HiExternalLink, HiGlobe } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SitePreview from '../components/SitePreview';
import SpecialtyPageLayout from '../components/SpecialtyPageLayout';

const WebDevPage = () => {
  const { isTurkish } = useLanguage();

  const projects = [
    {
      id: 'mnemosyne',
      caseStudyPath: '/case-study/mnemosyne',
      title: 'Mnemosyne',
      url: 'https://m-nemosyne.live',
      variant: 'memory',
      snapshotSrc: '/previews/mnemosyne-live.png',
      forceSnapshot: true,
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
      variant: 'typing',
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
      accent="blue"
      eyebrow={isTurkish ? 'Web geliştirme' : 'Web development'}
      eyebrowIcon={<HiGlobe className="h-4 w-4" />}
      title={isTurkish ? 'Canlı web ürünleri' : 'Live web products'}
      subtitle={
        isTurkish
          ? 'React, Vite ve ürün odaklı arayüz kararlarıyla geliştirdiğim web projeleri.'
          : 'Web projects built with React, Vite, and product-minded interface decisions.'
      }
      sideNode={
        <SitePreview
          title="Web product system"
          url="https://mertsoylu.dev"
          variant="portfolio"
          expandable={false}
          showActions={false}
        />
      }
    >
      <div className="grid gap-4 sm:gap-5">
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: index * 0.1 }}
            className="card-prominent grid gap-3 p-2.5 sm:gap-5 sm:p-4 lg:grid-cols-[420px_minmax(0,1fr)]"
          >
            <SitePreview
              title={project.title}
              url={project.url}
              variant={project.variant}
              expandable={false}
              showActions={false}
              snapshotSrc={project.snapshotSrc}
              forceSnapshot={project.forceSnapshot}
              livePreview={!project.livePreviewBlocked}
            />
            <div className="flex flex-col p-1.5 sm:p-2">
              <p className="mb-2 text-caption text-cyan-700 dark:text-cyan-200">
                Case {String(index + 1).padStart(2, '0')}
              </p>
              <h2 className="mb-2 text-[1.45rem] font-extrabold leading-tight text-ink-900 dark:text-white sm:mb-3 sm:text-h3">
                {project.title}
              </h2>
              <p className="mb-3 text-sm leading-relaxed text-ink-600 dark:text-ink-200 sm:mb-4 sm:text-body-sm">
                {project.description}
              </p>
              <p className="mb-3 rounded-lg border border-ink-200/70 bg-white/50 p-3 text-sm font-semibold text-ink-700 dark:border-white/10 dark:bg-white/10 dark:text-ink-100 sm:mb-4">
                {project.decision}
              </p>
              <div className="mb-4 flex flex-wrap gap-2 sm:mb-5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-ink-200/70 bg-white/50 px-2.5 py-1 text-xs font-bold text-ink-600 dark:border-white/10 dark:bg-white/10 dark:text-ink-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                <Link
                  to={project.caseStudyPath}
                  className="btn-primary min-h-[44px] px-3 py-2 text-xs sm:px-4"
                >
                  <HiBookOpen className="h-4 w-4" />
                  Case Study
                </Link>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary min-h-[44px] px-3 py-2 text-xs sm:px-4"
                >
                  <HiExternalLink className="h-4 w-4" />
                  {isTurkish ? 'Canlı aç' : 'Open live'}
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </SpecialtyPageLayout>
  );
};

export default WebDevPage;
