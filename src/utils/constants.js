import { PROJECTS, caseStudyPath } from '../data/projects';
import { areaByPath } from '../data/areas';

// Personal information. Bilingual fields are { tr, en } (read with `pick` from src/data/projects.js).
export const PERSONAL_INFO = {
  name: 'Mert Soylu',
  title: 'Junior Full-Stack Developer',
  university: { tr: 'Kütahya Dumlupınar Üniversitesi', en: 'Kütahya Dumlupınar University' },
  email: 's6ylumert@gmail.com',
  github: 'https://github.com/MertSoylu',
  linkedin: 'https://www.linkedin.com/in/mertsoylu/',
  location: { tr: 'İzmir, Türkiye', en: 'İzmir, Turkey' },
  locationShort: 'İzmir, TR',
};

export const HERO_ROLES = {
  tr: [
    'React Geliştiricisi',
    'Junior Full-Stack Geliştirici',
    'Android Geliştiricisi',
    'Yapay Zekâya Meraklı',
  ],
  en: ['React Developer', 'Junior Full-Stack Developer', 'Android Developer', 'AI Enthusiast'],
};

export const CV_LABEL = {
  tr: 'CV indir',
  en: 'Download CV',
};

export const CV_PATH = '/cv.pdf';

export const CERTIFICATES = [
  {
    id: 'intro-cybersecurity',
    title: { tr: 'Siber Güvenliğe Giriş', en: 'Introduction to Cybersecurity' },
    issuer: 'Cisco Networking Academy',
    date: '2024',
    fileUrl: '/certificates/Introduction_to_Cybersecurity_certificate.pdf',
    skills: ['Network Security', 'Threat Analysis', 'Cyber Defense'],
  },
];

const SITE_URL = 'https://mertsoylu.dev';
export const FOREST_SITE_URL = 'https://orman.mertsoylu.dev';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// Area route titles come from src/data/areas.js so they never drift from the nav/footer names.
const areaTitle = (path, lang) => `${areaByPath(path).name[lang]} | Mert Soylu`;

export const SEO_META = {
  '/': {
    tr: {
      title: 'Mert Soylu | Junior Full-Stack Developer',
      description:
        'Junior Full-Stack Developer. Web ve Android projeleri; siber güvenlik ve yapay zekâya ilgi.',
    },
    en: {
      title: 'Mert Soylu | Junior Full-Stack Developer',
      description:
        'Junior Full-Stack Developer building web and Android projects, with a growing interest in cybersecurity and AI.',
    },
    canonical: `${SITE_URL}/`,
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/web': {
    tr: {
      title: areaTitle('/web', 'tr'),
      description: 'React, Tailwind CSS ve Vite ile yapılan hızlı, erişilebilir web projeleri.',
    },
    en: {
      title: areaTitle('/web', 'en'),
      description: 'Fast, accessible web projects built with React, Tailwind CSS, and Vite.',
    },
    canonical: `${SITE_URL}/web`,
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/android': {
    tr: {
      title: areaTitle('/android', 'tr'),
      description: 'Kotlin ve temiz mimari ile yapılan Android uygulamaları.',
    },
    en: {
      title: areaTitle('/android', 'en'),
      description: 'Android apps built with Kotlin and clean architecture.',
    },
    canonical: `${SITE_URL}/android`,
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/cybersecurity': {
    tr: {
      title: areaTitle('/cybersecurity', 'tr'),
      description: 'Güvenli kod yazma, ağ güvenliği ve savunma odaklı çalışmalar.',
    },
    en: {
      title: areaTitle('/cybersecurity', 'en'),
      description: 'Secure coding, network security, and defense-oriented projects.',
    },
    canonical: `${SITE_URL}/cybersecurity`,
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/data-science': {
    tr: {
      title: areaTitle('/data-science', 'tr'),
      description: 'Yapay zekâ, derin öğrenme ve veri bilimi öğrenme yolculuğum.',
    },
    en: {
      title: areaTitle('/data-science', 'en'),
      description: 'AI, deep learning, and data science learning journey.',
    },
    canonical: `${SITE_URL}/data-science`,
    ogImage: DEFAULT_OG_IMAGE,
  },
  ...Object.fromEntries(
    PROJECTS.map((project) => {
      const route = caseStudyPath(project.id);
      return [
        route,
        {
          tr: { title: `${project.title} Vaka incelemesi | Mert Soylu`, description: project.summary.tr },
          en: { title: `${project.title} Case Study | Mert Soylu`, description: project.summary.en },
          canonical: `${SITE_URL}${route}`,
          ogImage: DEFAULT_OG_IMAGE,
        },
      ];
    }),
  ),
  '/404': {
    tr: {
      title: 'Sayfa Bulunamadı | Mert Soylu',
      description: 'Aradığın sayfa mevcut değil.',
    },
    en: {
      title: 'Page Not Found | Mert Soylu',
      description: "The page you're looking for doesn't exist.",
    },
    canonical: `${SITE_URL}/404`,
    ogImage: DEFAULT_OG_IMAGE,
  },
};

// Shown when the GitHub API is unreachable or returns nothing. Descriptions are bilingual; there is no
// star count or update date because these are placeholders that point at the profile, not real repos.
export const FALLBACK_PROJECTS = [
  {
    id: 'fallback-1',
    name: 'Portfolio Website',
    description: {
      tr: 'React, Vite, Tailwind CSS ve Framer Motion ile yapılmış kişisel portfolyo sitesi.',
      en: 'Personal portfolio built with React, Vite, Tailwind CSS, and Framer Motion.',
    },
    html_url: PERSONAL_INFO.github,
    language: 'JavaScript',
  },
  {
    id: 'fallback-2',
    name: 'Android App Projects',
    description: {
      tr: "Android Studio'da Kotlin ve Jetpack Compose ile geliştirdiğim mobil projeler.",
      en: 'Mobile projects built with Kotlin and Jetpack Compose on Android Studio.',
    },
    html_url: PERSONAL_INFO.github,
    language: 'Kotlin',
  },
  {
    id: 'fallback-3',
    name: 'Cybersecurity Labs',
    description: {
      tr: 'Linux ve web güvenliği temellerini çalıştığım uygulamalı güvenlik laboratuvarları.',
      en: 'Hands-on security labs and learning projects on Linux and web security basics.',
    },
    html_url: PERSONAL_INFO.github,
    language: 'Python',
  },
];
