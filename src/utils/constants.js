import { PROJECTS, caseStudyPath } from '../data/projects';

// Personal information
export const PERSONAL_INFO = {
  name: 'Mert Soylu',
  title: 'Junior Full-Stack Developer',
  university: 'Kütahya Dumlupınar University',
  email: 's6ylumert@gmail.com',
  github: 'https://github.com/MertSoylu',
  location: 'İzmir, Turkey',
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
  tr: 'CV İndir',
  en: 'Download CV',
};

export const CV_PATH = '/cv.pdf';

export const SKILLS_DESCRIPTIONS = {
  web: {
    icon: 'HiCode',
    title: { tr: 'Web Geliştirme', en: 'Web Development' },
    description: {
      tr: 'React ve Tailwind ile ürün hissi olan, hızlı ve okunur web arayüzleri geliştiriyorum.',
      en: 'Building fast, readable web interfaces with a product feel using React and Tailwind.',
    },
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'HTML/CSS'],
    proficiency: 80,
    link: '/web',
  },
  android: {
    icon: 'HiAcademicCap',
    title: { tr: 'Android Geliştirme', en: 'Android Development' },
    description: {
      tr: 'Native Android, Compose ve günlük kullanım akışlarına odaklanan mobil işler geliştiriyorum.',
      en: 'Building mobile work around native Android, Compose, and daily-use flows.',
    },
    technologies: ['Kotlin', 'Jetpack Compose', 'Android Studio', 'Material 3'],
    proficiency: 65,
    link: '/android',
  },
  security: {
    icon: 'HiShieldCheck',
    title: { tr: 'Siber Güvenlik', en: 'Cybersecurity' },
    description: {
      tr: 'Web güvenliği, güvenli kodlama ve otomasyon araçlarını pratik projelerle çalışıyorum.',
      en: 'Practicing web security, secure coding, and automation tools through practical projects.',
    },
    technologies: ['Python', 'Network Security', 'Encryption', 'Secure Coding'],
    proficiency: 60,
    link: '/cybersecurity',
  },
  datascience: {
    icon: 'HiChip',
    title: { tr: 'Veri Bilimi ve Derin Öğrenme', en: 'Data Science & Deep Learning' },
    description: {
      tr: 'Veri bilimi ve derin öğrenme temellerini küçük deneylerle güçlendiriyorum.',
      en: 'Building data science and deep learning fundamentals through small experiments.',
    },
    technologies: ['Python', 'NumPy', 'Pandas', 'Deep Learning'],
    proficiency: 40,
    link: '/data-science',
  },
};

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

export const SEO_META = {
  '/': {
    tr: {
      title: 'Mert Soylu | Junior Full-Stack Developer',
      description:
        'Junior Full-Stack Developer. Web ve Android projeleri; siber güvenlik ve yapay zekaya ilgi.',
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
      title: 'Web Geliştirme | Mert Soylu',
      description: 'React, Tailwind CSS ve Vite ile yapılan hızlı, erişilebilir web projeleri.',
    },
    en: {
      title: 'Web Development | Mert Soylu',
      description: 'Fast, accessible web projects built with React, Tailwind CSS, and Vite.',
    },
    canonical: `${SITE_URL}/web`,
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/android': {
    tr: {
      title: 'Android Geliştirme | Mert Soylu',
      description: 'Kotlin ve temiz mimari ile yapılan Android uygulamaları.',
    },
    en: {
      title: 'Android Development | Mert Soylu',
      description: 'Android apps built with Kotlin and clean architecture.',
    },
    canonical: `${SITE_URL}/android`,
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/cybersecurity': {
    tr: {
      title: 'Siber Güvenlik | Mert Soylu',
      description: 'Güvenli kod yazma, ağ güvenliği ve savunma odaklı çalışmalar.',
    },
    en: {
      title: 'Cybersecurity | Mert Soylu',
      description: 'Secure coding, network security, and defense-oriented projects.',
    },
    canonical: `${SITE_URL}/cybersecurity`,
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/data-science': {
    tr: {
      title: 'AI & Veri Bilimi | Mert Soylu',
      description: 'Yapay zeka, derin öğrenme ve veri bilimi öğrenme yolculuğu.',
    },
    en: {
      title: 'AI & Data Science | Mert Soylu',
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
          tr: { title: `${project.title} Case Study | Mert Soylu`, description: project.summary.tr },
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
      description: 'Aradığınız sayfa mevcut değil.',
    },
    en: {
      title: 'Page Not Found | Mert Soylu',
      description: "The page you're looking for doesn't exist.",
    },
    canonical: `${SITE_URL}/404`,
    ogImage: DEFAULT_OG_IMAGE,
  },
};

export const FALLBACK_PROJECTS = [
  {
    id: 'fallback-1',
    name: 'Portfolio Website',
    description: 'Personal portfolio built with React, Vite, Tailwind CSS, and Framer Motion.',
    html_url: 'https://github.com/MertSoylu',
    language: 'JavaScript',
    stargazers_count: 0,
  },
  {
    id: 'fallback-2',
    name: 'Android App Projects',
    description: 'Mobile projects built with Kotlin and Jetpack Compose on Android Studio.',
    html_url: 'https://github.com/MertSoylu',
    language: 'Kotlin',
    stargazers_count: 0,
  },
  {
    id: 'fallback-3',
    name: 'Cybersecurity Labs',
    description: 'Hands-on security labs and learning projects on Linux and web security basics.',
    html_url: 'https://github.com/MertSoylu',
    language: 'Python',
    stargazers_count: 0,
  },
];
