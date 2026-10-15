// The four focus areas — single source for the About area cards, Footer links, NotFound quick links,
// area-page content and SEO_META titles. Bilingual fields are { tr, en }, read via `pick(value, isTurkish)`
// (src/data/projects.js). `stack` holds plain tech names, identical in both languages.
//
// Each area also carries its page copy under `page` (rendered by src/pages/*Page.jsx through
// SpecialtyPageLayout). Everything a page shows that is not a project (those come from projects.js)
// lives here: the h1 `title`, the `lead`, an optional `status`, and one block per page section
// ({ label, title, lead?, ...items }). Text may use the placeholders {count} (projects in the area) and
// {live} (projects with a live URL); fill them with `fill()`.

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
    page: {
      title: { tr: 'Yayında çalışan web projeleri', en: 'Web projects running live' },
      lead: {
        tr: 'JavaScript ve Next.js ile geliştirdiğim projeler. Kararlarını ve teknik tercihlerini vaka incelemelerinde anlattım.',
        en: 'Projects built with JavaScript and Next.js. Each case study lays out the decisions and trade-offs behind it.',
      },
      projects: {
        label: { tr: 'Projeler', en: 'Projects' },
        title: { tr: '{count} proje, {live} tanesi yayında', en: '{count} projects, {live} of them live' },
        lead: {
          tr: 'Her birinde önizleme, odak notu ve vaka incelemesi var.',
          en: 'Each one has a preview, a focus note and a case study.',
        },
      },
      // Tag cloud is derived from the tags of the area's projects (deduplicated).
      tech: {
        label: { tr: 'Teknoloji', en: 'Tech' },
        title: { tr: 'Kullandığım teknolojiler', en: 'Tech used' },
        lead: {
          tr: 'Yukarıdaki projelerde geçen teknolojiler.',
          en: 'The technologies that appear in the projects above.',
        },
      },
      // Each point is backed by a decision written up in that project's case study (`project` = id).
      approach: {
        label: { tr: 'Yaklaşım', en: 'Approach' },
        title: { tr: 'Projelerde verdiğim kararlar', en: 'Decisions from the projects' },
        items: [
          {
            project: 'harita',
            title: { tr: 'Hafif temel', en: 'Light foundations' },
            desc: {
              tr: 'Harita kütüphanesi yerine SVG: Türkiye haritası d3-geo projeksiyonuyla çiziliyor.',
              en: 'SVG instead of a map library: the Turkey map is drawn with a d3-geo projection.',
            },
          },
          {
            project: 'biztoplulugu',
            title: { tr: 'Düşük bakım yükü', en: 'Low maintenance' },
            desc: {
              tr: 'Veritabanı yok: tüm sayfalar build sırasında statik üretiliyor, bakım yükü ve maliyet düşük kalıyor.',
              en: 'No database: every page is generated statically at build time, keeping maintenance and cost low.',
            },
          },
          {
            project: 'typesprint',
            title: { tr: 'Dürüst sonuç', en: 'Honest results' },
            desc: {
              tr: 'Yanlış tuşla ilerlemeye izin vermemek skoru daha dürüst hâle getiriyor.',
              en: 'Stopping progress on a wrong key makes the score more honest.',
            },
          },
        ],
      },
    },
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
    page: {
      title: {
        tr: 'Google Play’de yayında bir Android ürünü',
        en: 'A native Android product live on Google Play',
      },
      lead: {
        tr: 'Kotlin ve Jetpack Compose ile native geliştirdiğim WalkKittie, adım ve su takibini piksel pet bakımıyla birleştiriyor.',
        en: 'WalkKittie, built natively with Kotlin and Jetpack Compose, pairs step and water tracking with pixel-pet care.',
      },
      projects: {
        label: { tr: 'Uygulama', en: 'App' },
        title: { tr: 'Adım, su ve piksel pet', en: 'Steps, water and a pixel pet' },
      },
      features: {
        label: { tr: 'Özellikler', en: 'Features' },
        title: { tr: 'Öne çıkan özellikler', en: 'Key features' },
        lead: {
          tr: 'Uygulama adım takibi, su tüketimi ve piksel pet bakımını tek bir günlük rutinde birleştiriyor. Amaç, sağlık takibini soğuk bir sayaç olmaktan çıkarıp motive edici bir alışkanlığa dönüştürmek.',
          en: 'The app joins step tracking, water intake and pixel-pet care in one daily routine. The goal is to turn health tracking from a cold counter into a habit that feels motivating.',
        },
        items: [
          {
            title: { tr: 'Adım takibi', en: 'Step tracking' },
            desc: {
              tr: 'Günlük yürüyüşünü uygulama içinde görünür bir ilerlemeye çevirir.',
              en: 'Turns your daily walking into visible progress inside the app.',
            },
          },
          {
            title: { tr: 'Su takibi', en: 'Water tracking' },
            desc: {
              tr: 'Su tüketimi, pet bakım döngüsünün bir parçası olarak günlük rutine girer.',
              en: 'Water intake becomes part of the pet care loop, inside the same daily routine.',
            },
          },
          {
            title: { tr: 'Piksel pet', en: 'Pixel pet' },
            desc: {
              tr: 'Verilen sprite’tan türetilen animasyonlu pet; sen hareket ettikçe oyun döngüsü ilerler.',
              en: 'An animated pet built from the supplied sprite; the game loop moves forward as you move.',
            },
          },
        ],
      },
      // `derive` marks values computed from data: 'features' = number of key features, 'live' = live projects.
      stats: {
        label: { tr: 'Özet', en: 'Summary' },
        title: { tr: 'Bir bakışta', en: 'At a glance' },
        items: [
          {
            value: 1,
            label: { tr: 'piksel pet', en: 'pixel pet' },
            sub: { tr: 'adımlarınla beslenen animasyonlu pet', en: 'an animated pet fed by your steps' },
          },
          {
            derive: 'features',
            label: { tr: 'bakım döngüsü', en: 'care loops' },
            sub: { tr: 'adım, su tüketimi, pet bakımı', en: 'steps, water intake, pet care' },
          },
          {
            value: 'Kotlin',
            label: { tr: 'native Android', en: 'native Android' },
            sub: { tr: 'Jetpack Compose + Material 3', en: 'Jetpack Compose + Material 3' },
          },
          {
            derive: 'live',
            label: { tr: 'mağaza yayını', en: 'store release' },
            sub: { tr: 'Google Play’de canlı', en: 'live on Google Play' },
          },
        ],
      },
    },
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
    page: {
      title: {
        tr: 'Güvenlik kavramlarından çalışan araçlara',
        en: 'From security concepts to working tools',
      },
      lead: {
        tr: 'Öğrendiğim güvenlik kavramlarını küçük, çalışan ve tekrarlanabilir araçlara dönüştürüyorum.',
        en: 'I turn the security concepts I learn into small, working and repeatable tools.',
      },
      status: { tone: 'neutral', label: { tr: 'Açık kaynak araç', en: 'Open-source tool' } },
      projects: {
        label: { tr: 'Proje', en: 'Project' },
        title: { tr: 'Terminalden çalışan tarayıcı', en: 'A scanner that runs from the terminal' },
      },
      checks: {
        label: { tr: 'Kontroller', en: 'Checks' },
        title: { tr: 'Neleri kontrol eder', en: 'What it checks' },
        lead: {
          tr: 'Her kontrol ayrı bir async modül olarak çalışır.',
          en: 'Each check runs as its own async module.',
        },
        // Short technical names are identical in both languages; the others are natural translations.
        items: [
          { tr: 'XSS', en: 'XSS' },
          { tr: 'SQLi', en: 'SQLi' },
          { tr: 'CSRF', en: 'CSRF' },
          { tr: 'SSRF', en: 'SSRF' },
          { tr: 'Açık yönlendirme', en: 'Open redirect' },
          { tr: 'Güvenlik başlıkları', en: 'Security headers' },
          { tr: 'Alt alan adları', en: 'Subdomains' },
        ],
      },
      focus: {
        label: { tr: 'Odak', en: 'Focus' },
        title: { tr: 'Odak alanları', en: 'Focus areas' },
        items: [
          {
            title: { tr: 'Web açıklıkları', en: 'Web vulnerabilities' },
            desc: {
              tr: 'XSS, SQLi, CSRF, SSRF ve açık yönlendirme gibi sık görülen açıklıkları tanımak ve tespit etmek.',
              en: 'Recognizing and detecting common flaws such as XSS, SQLi, CSRF, SSRF and open redirects.',
            },
          },
          {
            title: { tr: 'CLI otomasyonu', en: 'CLI automation' },
            desc: {
              tr: 'Güvenlik kontrollerini terminalden, her seferinde aynı adımlarla çalıştırmak.',
              en: 'Running security checks from the terminal, the same way every time.',
            },
          },
          {
            title: { tr: 'Güvenli kodlama', en: 'Secure coding' },
            desc: {
              tr: 'Saldırgan bakış açısını günlük ürün ve tasarım kararlarının içine taşımak.',
              en: 'Bringing an attacker’s perspective into everyday product and design decisions.',
            },
          },
        ],
      },
      // The certificate itself is read from CERTIFICATES (src/utils/constants.js) by id.
      certificate: {
        id: 'intro-cybersecurity',
        label: { tr: 'Sertifika', en: 'Certificate' },
        title: { tr: 'Siber güvenlik sertifikam', en: 'My cybersecurity certificate' },
        open: { tr: 'PDF’i aç', en: 'Open PDF' },
      },
    },
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
    page: {
      title: { tr: 'Temelleri çalışıyorum', en: 'Building the fundamentals' },
      lead: {
        tr: 'Veri analizi, makine öğrenmesi ve derin öğrenme temellerini öğrenme notları ve küçük deneylerle çalışıyorum.',
        en: 'I am working through data analysis, machine learning and deep learning basics with study notes and small experiments.',
      },
      status: { tone: 'neutral', label: { tr: 'Öğrenme aşamasında', en: 'Learning stage' } },
      // The one place that says there is no shipped product yet.
      statement: {
        label: { tr: 'Durum', en: 'Status' },
        title: { tr: 'Henüz yayında bir ürünüm yok', en: 'No shipped product yet' },
        body: {
          tr: 'Amacım bu alanı olduğundan büyük göstermek değil. Temel kavramları düzenli çalışıyor, öğrendiklerimi okunabilir küçük çıktılarla paylaşıyorum.',
          en: 'The goal is not to make this field look bigger than it is. I study the core concepts consistently and share what I learn through small, readable outputs.',
        },
      },
      learning: {
        label: { tr: 'Konular', en: 'Topics' },
        title: { tr: 'Öğrenme alanları', en: 'Learning areas' },
        // level: key of LEARNING_LEVELS below.
        items: [
          {
            level: 'learning',
            title: { tr: 'Veri analizi', en: 'Data analysis' },
            desc: {
              tr: 'Pandas ve NumPy ile veri temizleme, keşifsel analiz ve görselleştirme.',
              en: 'Cleaning, exploratory analysis and visualization with Pandas and NumPy.',
            },
          },
          {
            level: 'learning',
            title: { tr: 'Makine öğrenmesi', en: 'Machine learning' },
            desc: {
              tr: 'Baseline model kurma, özellik mühendisliği ve değerlendirme metrikleri.',
              en: 'Baseline models, feature engineering and evaluation metrics.',
            },
          },
          {
            level: 'planned',
            title: { tr: 'Derin öğrenme', en: 'Deep learning' },
            desc: {
              tr: 'Sinir ağı temelleri, eğitim akışı ve küçük ölçekli deneyler.',
              en: 'Neural network basics, the training loop and small-scale experiments.',
            },
          },
        ],
      },
      outputs: {
        label: { tr: 'Çıktılar', en: 'Outputs' },
        title: { tr: 'Sıradaki küçük çıktılar', en: 'Next small outputs' },
        items: [
          { tr: 'Açık bir veri seti üzerinde EDA notu', en: 'An EDA note on an open dataset' },
          {
            tr: 'Scikit-learn ile baseline sınıflandırma modeli',
            en: 'A baseline classification model with Scikit-learn',
          },
          {
            tr: 'Küçük bir CNN ile görüntü sınıflandırma denemesi',
            en: 'A small CNN image-classification experiment',
          },
          {
            tr: 'Model sonuçlarını okunabilir bir rapora dönüştürmek',
            en: 'Turning model results into a readable report',
          },
        ],
      },
    },
  },
];

// Text level of a learning topic (replaces the old percentage meters — no fake numbers).
export const LEARNING_LEVELS = {
  learning: { tr: 'Öğreniyorum', en: 'Learning' },
  planned: { tr: 'Planlandı', en: 'Planned' },
};

export const areaByPath = (path) => AREAS.find((area) => area.path === path);

export const areaById = (id) => AREAS.find((area) => area.id === id);

// The area that follows `id`, wrapping around after the last one.
export const nextArea = (id) => {
  const position = AREAS.findIndex((area) => area.id === id);
  return AREAS[(position + 1) % AREAS.length];
};

// Replaces {count} / {live} placeholders in page copy with numbers derived from project data.
export const fill = (text, values) =>
  typeof text === 'string'
    ? text.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match))
    : text;
