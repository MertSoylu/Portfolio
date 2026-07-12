// Site metadata
export const SITE_TITLE = 'Mert Soylu | Junior Full-Stack Developer';
export const SITE_DESCRIPTION =
  'Junior Full-Stack Developer focused on web and Android, with a growing interest in cybersecurity and AI.';

// Personal information
export const PERSONAL_INFO = {
  name: 'Mert Soylu',
  title: 'Junior Full-Stack Developer',
  university: 'Kütahya Dumlupınar University',
  email: 's6ylumert@gmail.com',
  github: 'https://github.com/MertSoylu',
  location: 'İzmir, Turkey',
};

// Skills and expertise
export const SKILLS = [
  'Web Development',
  'Android Development',
  'Cybersecurity',
  'Data Science',
  'Deep Learning',
];

export const TECHNOLOGIES = {
  frontend: ['React', 'JavaScript', 'Tailwind CSS', 'HTML/CSS', 'Vite', 'Framer Motion'],
  backend: ['Node.js', 'Express'],
  mobile: ['Kotlin', 'Jetpack Compose', 'Android Studio'],
  tools: ['Git', 'GitHub', 'VS Code', 'Linux'],
};

// Color palette
export const COLORS = {
  sand: {
    50: '#faf8f3',
    100: '#f5f1e8',
    200: '#ede6db',
    300: '#e0d5c7',
    400: '#d4c4af',
    500: '#c9b8a0',
    600: '#b8a08c',
    700: '#9d8872',
    800: '#7a6a5c',
    900: '#5a4a42',
  },
  warm: {
    50: '#fffbf5',
    100: '#fff8f0',
    200: '#ffe8d6',
    300: '#ffd4b3',
    400: '#ffb88a',
    500: '#ff9a5c',
    600: '#f07d2d',
    700: '#d45e1f',
    800: '#a84617',
    900: '#7a3410',
  },
};

// Animation timings
export const ANIMATION_TIMINGS = {
  fast: 0.3,
  normal: 0.6,
  slow: 1,
};

// Navigation links
export const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

// Sections
export const SECTIONS = {
  about: 'about',
  projects: 'projects',
  contact: 'contact',
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
