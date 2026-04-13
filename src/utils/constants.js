// Site metadata
export const SITE_TITLE = 'Mert Soylu | Portfolio';
export const SITE_DESCRIPTION = 'Computer Programming Student & Developer - Web Development, Android Development, Cybersecurity, Data Science and Deep Learning';

// Personal information
export const PERSONAL_INFO = {
  name: 'Mert Soylu',
  title: 'Computer Programming Student',
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
