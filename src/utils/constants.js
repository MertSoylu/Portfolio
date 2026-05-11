// Site metadata
export const SITE_TITLE = 'Mert Soylu | Full-Stack Developer & AI Developer';
export const SITE_DESCRIPTION =
  'Full-Stack Developer & AI Developer - Web Development, Android Development, Cybersecurity, Data Science and Deep Learning';

// Personal information
export const PERSONAL_INFO = {
  name: 'Mert Soylu',
  title: 'Full-Stack Developer & AI Developer',
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
  mobile: ['Java', 'Android Studio'],
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
  tr: ['React Developer', 'Full-Stack Developer', 'AI Developer', 'Security-Minded'],
  en: ['React Developer', 'Full-Stack Developer', 'AI Developer', 'Security-Minded'],
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
      tr: 'React ve Tailwind CSS ile hızlı, responsive siteler yapıyorum. Tasarım güzel, kod temiz. Lighthouse 90+, erişilebilir.',
      en: 'Building fast, responsive web apps with React and Tailwind CSS. Beautiful design, clean code. Lighthouse 90+, accessible.',
    },
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'HTML/CSS'],
    proficiency: 80,
    link: '/web',
  },
  android: {
    icon: 'HiAcademicCap',
    title: { tr: 'Android Geliştirme', en: 'Android Development' },
    description: {
      tr: 'Temiz mimari ile mobil uygulamalar geliştiriyorum. Hızlı yükleme, kusursuz deneyim, bakım kolay.',
      en: 'Creating mobile apps with clean architecture. Fast load times, seamless experiences, code built to last.',
    },
    technologies: ['Kotlin', 'React Native', 'Android Studio', 'Mobile UI/UX'],
    proficiency: 65,
    link: '/android',
  },
  security: {
    icon: 'HiShieldCheck',
    title: { tr: 'Siber Güvenlik', en: 'Cybersecurity' },
    description: {
      tr: 'Güvenli kod yazma ve veri korumasını ciddiye alıyorum. Attacker gibi düşün, Defender gibi kod yaz.',
      en: 'I prioritize secure coding and data protection. Think like an attacker, code like a defender.',
    },
    technologies: ['Python', 'Network Security', 'Encryption', 'Secure Coding'],
    proficiency: 60,
    link: '/cybersecurity',
  },
  datascience: {
    icon: 'HiChip',
    title: { tr: 'Veri Bilimi ve Derin Öğrenme', en: 'Data Science & Deep Learning' },
    description: {
      tr: 'Python, NumPy, Pandas öğreniyorum. Temel bilgiler sağlam, küçük projelerle pratik yapıyorum.',
      en: 'Learning Python, NumPy, Pandas with strong fundamentals. Building projects to deepen real-world knowledge.',
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
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const SEO_META = {
  '/': {
    tr: {
      title: 'Mert Soylu | Full-Stack Developer & AI Developer',
      description: 'Full-Stack Developer & AI Developer. Web, mobil, siber güvenlik ve yapay zeka projeleri.',
    },
    en: {
      title: 'Mert Soylu | Full-Stack Developer & AI Developer',
      description:
        'Full-Stack Developer & AI Developer building projects in web, mobile, cybersecurity, and AI.',
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
    ogImage: `${SITE_URL}/og-web.png`,
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
    ogImage: `${SITE_URL}/og-android.png`,
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
    ogImage: `${SITE_URL}/og-cyber.png`,
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
    ogImage: `${SITE_URL}/og-data.png`,
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
    description: 'Mobile projects focused on Java and Android Studio development practices.',
    html_url: 'https://github.com/MertSoylu',
    language: 'Java',
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
