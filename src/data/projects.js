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
      tr: 'Rust ile yazılmış terminal çalışma alanı: gerçek kabuklar, git projeleri, sistem sensörleri ve AI kotaları tek ekranda.',
      en: 'A Rust terminal workspace where real shells, git projects, system sensors and AI quotas share one screen.',
    },
    focus: {
      tr: 'Odak: AI ajanlarıyla çalışırken araçlar arasında bağlam değiştirmeyi bitirmek.',
      en: 'Focus: end the context switching of AI agent work by keeping project state, quotas and shells together.',
    },
    highlights: [
      { value: '~22 MB', label: { tr: 'RAM kullanımı', en: 'RAM usage' } },
      { value: '3', label: { tr: 'platform', en: 'platforms' } },
      { value: '22', label: { tr: 'tema', en: 'themes' } },
    ],
    tags: ['Rust', 'ratatui', 'PTY / ConPTY', 'crates.io'],
  },
  {
    id: 'typesprint',
    title: 'TypeSprint',
    category: 'Web',
    status: LIVE,
    liveUrl: 'https://typesprint.online',
    preview: { kind: 'browser', src: '/previews/typesprint-live.webp' },
    summary: {
      tr: 'Yazma hızını doğrulukla birlikte ölçen, çok dilli kelime havuzlu bir WPM uygulaması.',
      en: 'A WPM typing test that measures speed together with accuracy, using multilingual word pools.',
    },
    focus: {
      tr: 'Odak: yanlış girişte akışı durdurarak skoru daha dürüst hâle getirmek.',
      en: 'Focus: stop progress on wrong input so the score reflects real typing.',
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
      tr: 'Supabase destekli bir topluluk platformu: 81 ilden gelen sorun bildirimlerini haritada toplar.',
      en: 'A Supabase-backed community platform that maps issue reports from all 81 provinces.',
    },
    focus: {
      tr: 'Odak: haritayı kütüphanesiz SVG ile çizerek hafif ve hızlı bir veri yüzeyi kurmak.',
      en: 'Focus: draw the map as library-free SVG for a light, fast data surface.',
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
      tr: 'Etkinlik, rapor ve duyuru arşivini MDX ile taşıyan, build sırasında statik üretilen topluluk sitesi.',
      en: 'A community site that carries its event, report and announcement archive in MDX, statically generated at build time.',
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
      tr: "Adım ve su takibini piksel pet bakımıyla birleştiren, Google Play'de yayında bir Android uygulaması.",
      en: 'A Google Play Android app that pairs step and water tracking with pixel-pet care.',
    },
    focus: {
      tr: 'Odak: sağlık takibini sayaç ve grafiklerin ötesine taşıyıp günlük alışkanlığa bağlamak.',
      en: 'Focus: move health tracking beyond counters and charts, tying it to a daily habit.',
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
      tr: 'XSS, SQLi, CSRF, SSRF, header ve subdomain kontrollerini async modüllerle çalıştıran Python CLI tarayıcısı.',
      en: 'A Python CLI scanner that runs XSS, SQLi, CSRF, SSRF, header and subdomain checks as async modules.',
    },
    focus: {
      tr: 'Odak: tarama modüllerini ayrı tutarak yeni kontrol eklemeyi kolaylaştırmak ve bulguları HTML raporla okunur kılmak.',
      en: 'Focus: keep scan modules separate so new checks are easy to add, and turn findings into a readable HTML report.',
    },
    tags: ['Python', 'CLI', 'Async', { tr: 'HTML rapor', en: 'HTML reports' }],
  },
];

// Kategori → uzmanlık sayfası yolu. Terminal (Tool) kategorisinin ayrı bir sayfası yok;
// proje kartı ana sayfadaki proje bölümüne döner.
export const CATEGORY_ROUTES = { Web: '/web', Android: '/android', Security: '/cybersecurity' };

export const categoryPath = (category) => CATEGORY_ROUTES[category] ?? '/#projects';

// Proje sayfalarında ve bileşenlerde kullanılan ortak arayüz metinleri.
export const UI_COPY = {
  caseStudy: { tr: 'Vaka incelemesi', en: 'Case study' },
  liveSite: { tr: 'Canlı site', en: 'Live site' },
  sourceCode: { tr: 'Kaynak kodu', en: 'Source code' },
  preview: { tr: 'önizleme', en: 'preview' },
  backHome: { tr: 'Ana sayfaya dön', en: 'Back to home' },
  backToProjects: { tr: 'Projelere dön', en: 'Back to projects' },
};

export const caseStudyPath = (id) => `/case-study/${id}`;

export const getProject = (id) => PROJECTS.find((project) => project.id === id);

export const projectsByCategory = (category) => PROJECTS.filter((project) => project.category === category);
