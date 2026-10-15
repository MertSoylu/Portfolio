// The four focus areas — single source for the About area cards, Footer links, NotFound quick links,
// area-page headers and SEO_META titles. Bilingual fields are { tr, en }, read via `pick(value, isTurkish)`
// (src/data/projects.js). `stack` holds plain tech names, identical in both languages.

export const AREAS = [
  {
    id: 'web',
    path: '/web',
    index: '01',
    name: { tr: 'Web Geliştirme', en: 'Web Development' },
    short: {
      tr: 'React ve Next.js ile hızlı, erişilebilir ve yayında çalışan web ürünleri.',
      en: 'Fast, accessible web products built with React and Next.js, running live.',
    },
    stack: ['React', 'Next.js', 'JavaScript', 'Tailwind CSS', 'Supabase'],
  },
  {
    id: 'android',
    path: '/android',
    index: '02',
    name: { tr: 'Android Geliştirme', en: 'Android Development' },
    short: {
      tr: 'Kotlin ve Jetpack Compose ile günlük kullanıma uygun native Android uygulamaları.',
      en: 'Native Android apps built with Kotlin and Jetpack Compose for everyday use.',
    },
    stack: ['Kotlin', 'Jetpack Compose', 'Material 3', 'Android Studio'],
  },
  {
    id: 'cybersecurity',
    path: '/cybersecurity',
    index: '03',
    name: { tr: 'Siber Güvenlik', en: 'Cybersecurity' },
    short: {
      tr: 'Öğrendiğim güvenlik kavramlarını küçük, tekrarlanabilir araçlara dönüştürüyorum.',
      en: 'Turning the security concepts I learn into small, repeatable tools.',
    },
    stack: ['Python', 'Linux', 'Network Security', 'Secure Coding'],
  },
  {
    id: 'data-science',
    path: '/data-science',
    index: '04',
    name: { tr: 'Veri Bilimi ve Yapay Zekâ', en: 'Data Science & AI' },
    short: {
      tr: 'Veri analizi, makine öğrenmesi ve derin öğrenme temellerini küçük deneylerle çalışıyorum.',
      en: 'Practicing data analysis, machine learning and deep learning basics through small experiments.',
    },
    stack: ['Python', 'NumPy', 'Pandas'],
  },
];

export const areaByPath = (path) => AREAS.find((area) => area.path === path);
