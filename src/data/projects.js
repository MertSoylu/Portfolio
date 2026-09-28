// Projelerin tek kaynağı: ana sayfa kartları, uzmanlık sayfaları, case study
// navigasyonu, SEO kayıtları ve sitemap buradan beslenir. Uzun case study metinleri
// ayrı dosyada (caseStudies.js) durur; böylece yalnızca case study chunk'ına girer.
//
// Çift dilli alanlar { tr, en } nesnesidir; `pick(value, isTurkish)` ile okunur.

export const pick = (value, isTurkish) => {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'tr' in value) {
    return isTurkish ? value.tr : value.en;
  }
  return value;
};

export const CATEGORY_LABELS = {
  Tool: { tr: 'Terminal', en: 'Terminal' },
  Web: { tr: 'Web', en: 'Web' },
  Android: { tr: 'Android', en: 'Android' },
  Security: { tr: 'Güvenlik', en: 'Security' },
};

const LIVE = { tr: 'Canlı', en: 'Live' };

export const PROJECTS = [
  {
    id: 'noble',
    title: 'NOBLE',
    category: 'Tool',
    status: { tr: 'Yeni · v1.5', en: 'New · v1.5' },
    featured: true,
    liveUrl: 'https://noble.mertsoylu.dev',
    githubUrl: 'https://github.com/MertSoylu/noble',
    // Görsel pencere çerçevesini zaten içeriyor; tarayıcı çerçevesine sarılmaz.
    preview: { kind: 'window', src: '/previews/noble-live.webp' },
    summary: {
      tr: 'Gerçek kabuklar, git projeleri, sistem sensörleri ve AI kotalarını tek bir kokpitte toplayan, Rust ile yazılmış terminal çalışma alanı.',
      en: 'A Rust terminal workspace that puts real shells, git projects, system sensors and AI quotas into one cockpit.',
    },
    highlights: [
      { value: '~22 MB', label: { tr: 'RAM kullanımı', en: 'RAM usage' } },
      { value: '3', label: { tr: 'platform', en: 'platforms' } },
      { value: '22', label: { tr: 'tema', en: 'themes' } },
    ],
    tags: ['Rust', 'ratatui', 'PTY / ConPTY', 'crates.io'],
  },
  {
    id: 'mnemosyne',
    title: 'Mnemosyne',
    category: 'Web',
    status: LIVE,
    liveUrl: 'https://m-nemosyne.live',
    preview: { kind: 'browser', src: '/previews/mnemosyne-live.webp' },
    summary: {
      tr: 'Konum bazlı anıları harita ve zaman katmanlarıyla sunan canlı web uygulaması.',
      en: 'A live web app for location-based memories, built around maps and time layers.',
    },
    focus: {
      tr: 'Odak: anı paylaşımını klasik galeri yerine mekân ve zaman bağlamıyla okutmak.',
      en: 'Focus: make memory sharing readable through place and time, not a plain gallery.',
    },
    tags: ['React', 'PWA', { tr: 'Konum', en: 'Location' }, { tr: 'Zaman katmanları', en: 'Time layers' }],
  },
  {
    id: 'typesprint',
    title: 'TypeSprint',
    category: 'Web',
    status: LIVE,
    liveUrl: 'https://typesprint.online',
    preview: { kind: 'browser', src: '/previews/typesprint-live.webp' },
    summary: {
      tr: 'Yazma hızını doğrulukla ölçen, çok dilli kelime havuzlu WPM uygulaması.',
      en: 'A typing-speed app built around accuracy and multilingual word pools.',
    },
    focus: {
      tr: 'Odak: yanlış girişte akışı durdurarak ölçümü daha dürüst hâle getirmek.',
      en: 'Focus: make measurement more honest by stopping progress on wrong input.',
    },
    tags: ['JavaScript', 'WPM', { tr: 'Çok dilli', en: 'Multilingual' }, 'Leaderboard'],
  },
  {
    id: 'harita',
    title: 'BİZ Şehir Haritası',
    category: 'Web',
    status: LIVE,
    liveUrl: 'https://harita.biztoplulugu.com.tr',
    preview: { kind: 'browser', src: '/previews/harita-live.webp' },
    summary: {
      tr: '81 ilden gelen sorun bildirimlerini haritada toplayan, Supabase destekli topluluk platformu.',
      en: 'A community platform backed by Supabase that maps issue reports from all 81 provinces.',
    },
    focus: {
      tr: 'Odak: haritayı kütüphanesiz SVG ile üreterek hafif ve hızlı bir veri yüzeyi kurmak.',
      en: 'Focus: render the map as library-free SVG for a lightweight, fast data surface.',
    },
    tags: ['Next.js 16', 'Supabase', 'd3-geo', 'PostgreSQL'],
  },
  {
    id: 'biztoplulugu',
    title: 'Biz Topluluğu',
    category: 'Web',
    status: LIVE,
    liveUrl: 'https://biztoplulugu.com.tr',
    preview: { kind: 'browser', src: '/previews/biztoplulugu-live.webp' },
    summary: {
      tr: 'MDX tabanlı içerik arşiviyle, build sırasında statik üretilen topluluk kurumsal sitesi.',
      en: 'A community organization site with an MDX-based archive, statically generated at build time.',
    },
    focus: {
      tr: 'Odak: veritabanısız mimariyle içerik ağırlıklı arşivi hızlı ve düşük maliyetli tutmak.',
      en: 'Focus: keep a content-heavy archive fast and low-cost with a database-free architecture.',
    },
    tags: ['Next.js', 'MDX', 'Tailwind v4', { tr: 'Statik üretim', en: 'Static generation' }],
  },
  {
    id: 'walkkittie',
    title: 'WalkKittie',
    category: 'Android',
    status: { tr: 'Google Play', en: 'Google Play' },
    liveUrl: 'https://play.google.com/store/apps/details?id=com.mert.paticat',
    liveLabel: { tr: 'Google Play', en: 'Google Play' },
    githubUrl: 'https://github.com/MertSoylu/WalkKittie_App',
    preview: { kind: 'phone', src: '/previews/walkkittie.webp' },
    summary: {
      tr: "Adım sayacı, su takibi ve piksel pet bakımını birleştiren, Google Play'de yayında bir Android uygulaması.",
      en: 'A Google Play Android app combining step tracking, water tracking, and pixel-pet care.',
    },
    tags: ['Kotlin', 'Jetpack Compose', 'Material 3', 'Google Play'],
  },
  {
    id: 'msscan',
    title: 'msscan',
    category: 'Security',
    status: { tr: 'Açık kaynak', en: 'Open source' },
    githubUrl: 'https://github.com/MertSoylu/msscan',
    // Ekran görüntüsü yok; gerçek etkileşimli kabuk komutlarıyla terminal önizlemesi çizilir.
    preview: {
      kind: 'terminal',
      title: 'msscan',
      lines: [
        { prompt: 'msscan>', text: 'set url https://example.com' },
        { prompt: 'msscan>', text: 'set modules xss,sqli,headers' },
        { prompt: 'msscan>', text: 'scan' },
        { tone: 'warn', text: '[HIGH]  XSS · reflected in html body' },
        { tone: 'warn', text: '[MED]   Headers · CSP missing' },
        { tone: 'ok', text: '[OK]    SQLi · no injection found' },
        { tone: 'accent', text: 'HTML report ready → report.html' },
      ],
    },
    summary: {
      tr: 'XSS, SQLi, CSRF, SSRF, header ve subdomain kontrolleri için async Python CLI güvenlik tarayıcısı.',
      en: 'An async Python CLI security scanner for XSS, SQLi, CSRF, SSRF, headers, and subdomains.',
    },
    tags: ['Python', 'CLI', 'Async', { tr: 'HTML rapor', en: 'HTML reports' }],
  },
];

export const caseStudyPath = (id) => `/case-study/${id}`;

export const getProject = (id) => PROJECTS.find((project) => project.id === id);

export const projectsByCategory = (category) => PROJECTS.filter((project) => project.category === category);
