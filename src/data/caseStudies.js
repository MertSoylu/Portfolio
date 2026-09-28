// Case study içerikleri. Kart düzeyindeki bilgiler (başlık, linkler, önizleme)
// projects.js'te; burada yalnızca detay sayfasının metinleri durur.

const DECISIONS = {
  design: { tr: 'Tasarım kararları', en: 'Design decisions' },
  product: { tr: 'Ürün kararları', en: 'Product decisions' },
  technical: { tr: 'Teknik kararlar', en: 'Technical decisions' },
};

export const CASE_STUDIES = {
  noble: {
    subtitle: {
      tr: 'Terminali bir çalışma alanına çeviren tek native binary: git projeleri, gerçek kabuklar, AI ajan kotaları ve sistem monitörü aynı ekranda.',
      en: 'A single native binary that turns the terminal into a workspace: git projects, real shells, AI agent quotas and a system monitor on one screen.',
    },
    facts: [
      { label: { tr: 'Dil', en: 'Language' }, value: 'Rust 2024 · ratatui' },
      { label: { tr: 'Platform', en: 'Platforms' }, value: 'Windows · Linux · macOS' },
      {
        label: { tr: 'Dağıtım', en: 'Distribution' },
        value: { tr: 'crates.io + hazır binary', en: 'crates.io + prebuilt binaries' },
      },
    ],
    extraLinks: [{ label: 'crates.io', href: 'https://crates.io/crates/noble' }],
    video: { src: '/media/noble-promo.mp4', poster: '/media/noble-promo-poster.webp' },
    problem: {
      tr: 'AI kodlama ajanlarıyla çalışırken gün; birden fazla terminal penceresi, her projenin ayrı git durumu, sistem yükü ve Claude Code / Codex kotasından ne kadar kaldığı arasında bölünüyor. Bu bilgiler farklı araçlara dağılmış durumda ve sürekli bağlam değiştirmeyi gerektiriyor.',
      en: 'Working with AI coding agents splits the day between several terminal windows, the git state of each project, system load and how much Claude Code / Codex quota is left. That information lives in different tools and forces constant context switching.',
    },
    solution: {
      tr: 'NOBLE bunları terminalin içinde çalışan tek bir kokpitte topluyor. Home ekranı git projelerini dal, değişiklik ve commit durumuyla listeliyor; tek tuşla projede kabuk ya da Claude Code / Codex açılıyor. Sekmeler ve bölmeler gerçek PTY üzerinde çalışıyor, yanda AI kotaları ve sistem sensörleri canlı akıyor.',
      en: 'NOBLE gathers all of it into one cockpit that runs inside the terminal. Home lists git projects with branch, changes and commit status; one key opens a shell, Claude Code or Codex in the project. Tabs and splits run on a real PTY while AI quotas and system sensors update alongside.',
    },
    features: [
      {
        title: { tr: 'Gerçek terminaller', en: 'Real terminals' },
        desc: {
          tr: "Windows'ta ConPTY, Linux ve macOS'ta PTY. Sekme, bölme, zoom ve scrollback araması; vim, htop ve Claude Code tam ekran çalışır.",
          en: 'ConPTY on Windows, a PTY on Linux and macOS. Tabs, splits, zoom and scrollback search; vim, htop and Claude Code run full-screen.',
        },
      },
      {
        title: { tr: 'Projeler bir bakışta', en: 'Projects at a glance' },
        desc: {
          tr: "Git repolarını bulur; dal, değişiklik, push/pull bekleyen commit'ler ve son commit'ler. Komut bitince durum kendiliğinden yenilenir.",
          en: 'Finds your git repositories: branch, changes, commits to push or pull and recent commits. Status refreshes when a command finishes.',
        },
      },
      {
        title: { tr: 'AI kota ve oturumlar', en: 'AI quota and sessions' },
        desc: {
          tr: 'Claude Code, Codex ve diğerlerinin 5 saatlik ve haftalık limitleri; hangi ajanın çalıştığı, hangisinin sıranı beklediği.',
          en: 'The 5-hour and weekly limits of Claude Code, Codex and more; which agent is working and which one is waiting for you.',
        },
      },
      {
        title: { tr: 'Hızlı başlatma', en: 'Quick launch' },
        desc: {
          tr: "Claude Code, Codex, OpenCode, Copilot ve diğer AI CLI'ları seçili projede tek tuşla; yalnızca PATH'te kurulu olanlar görünür.",
          en: 'Claude Code, Codex, OpenCode, Copilot and other AI CLIs start in the selected project with one key; only installed ones are shown.',
        },
      },
      {
        title: { tr: 'Sistem monitörü', en: 'System monitor' },
        desc: {
          tr: 'CPU geçmişi ve çekirdek yükü, bellek, ağ, diskler, batarya ve sıralanabilir süreç tablosu.',
          en: 'CPU history and per-core load, memory, network, disks, battery and a sortable process table.',
        },
      },
      {
        title: { tr: '22 tema, canlı ayar', en: '22 themes, live config' },
        desc: {
          tr: 'Amber, Catppuccin, Tokyo Night, Nord… config.toml canlı yeniden yüklenir; hatalı bir değer uygulamayı asla çökertmez.',
          en: 'Amber, Catppuccin, Tokyo Night, Nord… config.toml reloads live and a bad value never crashes the app.',
        },
      },
    ],
    decisionsTitle: DECISIONS.technical,
    decisions: {
      tr: [
        'Yalnızca ekranda görünen bir şey değiştiğinde yeniden çizim: boştaki bir terminal sekmesi tek çekirdeğin ~%0,05’ini, Home ekranı ~%0,4’ünü kullanıyor.',
        'Süreçler portable-pty, ekran vt100 ile yönetiliyor; aynı kod Windows’ta ConPTY, Linux ve macOS’ta PTY üzerinde çalışıyor.',
        'AI kotaları CLI’ların zaten tuttuğu girişlerden okunuyor; tokenlar yalnızca kendi sağlayıcısına gidiyor, hiçbir yerde gösterilmiyor ya da loglanmıyor.',
        '`noble update` indirilen binary’yi sürümün SHA-256 özetiyle doğruluyor; eşleşmezse kurulu sürüme dokunmuyor.',
        'CI, gerçek terminal ve uçtan uca testler dahil tüm test paketini üç platformda da çalıştırıyor.',
      ],
      en: [
        'Redraw only when something visible changes: an idle terminal tab costs ~0.05% of one core and the Home screen ~0.4%.',
        'Processes run through portable-pty and the screen through vt100; the same code uses ConPTY on Windows and a PTY on Linux and macOS.',
        'AI quotas are read from the logins the CLIs already keep; tokens only go to their own provider and are never shown or logged.',
        '`noble update` checks the downloaded binary against the release SHA-256; on a mismatch the installed binary is left alone.',
        'CI runs the whole test suite, real terminals and end-to-end tests included, on all three platforms.',
      ],
    },
    gallery: [
      {
        src: '/previews/noble/home.webp',
        caption: {
          tr: 'Home: projeler, son commit’ler, AI kullanımı ve sistem sensörleri',
          en: 'Home: projects, recent commits, AI usage and system sensors',
        },
      },
      {
        src: '/previews/noble/terminals.webp',
        caption: {
          tr: 'Claude Code ve Codex yan yana bölmelerde',
          en: 'Claude Code and Codex side by side in splits',
        },
      },
      {
        src: '/previews/noble/system.webp',
        caption: {
          tr: 'Sistem: CPU, çekirdekler, bellek, ağ, disk ve süreçler',
          en: 'System: CPU, cores, memory, network, disks and processes',
        },
      },
      {
        src: '/previews/noble/palette.webp',
        caption: {
          tr: 'Komut paleti: her eylem, proje, sekme ve tema',
          en: 'Command palette: every action, project, tab and theme',
        },
      },
      {
        src: '/previews/noble/themes.webp',
        caption: { tr: '22 temadan altısı', en: 'Six of the twenty-two themes' },
        wide: true,
      },
    ],
    result: {
      tr: 'NOBLE; crates.io’da ve GitHub Releases’ta üç platform için hazır binary’lerle, kendi dokümantasyon sitesiyle yayında. Bir TUI’yi ürün gibi ele almanın (kurulum, güncelleme, temalar, fare desteği, test altyapısı) uçtan uca pratiği oldu.',
      en: 'NOBLE ships on crates.io and GitHub Releases with prebuilt binaries for three platforms and its own documentation site. It was an end-to-end exercise in treating a TUI as a product: install, updates, themes, mouse support and test infrastructure.',
    },
    resultTags: ['Rust', 'ratatui', 'crossterm', 'portable-pty', 'vt100', 'sysinfo'],
  },

  typesprint: {
    subtitle: {
      tr: 'Yazma hızını sadece hız değil, doğruluk ve akış kontrolüyle ölçen canlı web uygulaması.',
      en: 'A live web app that measures typing speed through accuracy and flow control, not only raw speed.',
    },
    facts: [
      {
        label: { tr: 'Yüzey', en: 'Surface' },
        value: { tr: 'Canlı WPM uygulaması', en: 'Live WPM application' },
      },
      { label: { tr: 'Odak', en: 'Focus' }, value: { tr: 'Doğruluk + ritim', en: 'Accuracy + rhythm' } },
      {
        label: { tr: 'Dil', en: 'Language' },
        value: { tr: 'Çok dilli kelime havuzu', en: 'Multilingual word pools' },
      },
    ],
    problem: {
      tr: 'Birçok WPM testi hızlı görünür ama hatalı yazmayı yeterince cezalandırmaz. Kullanıcı kendini geliştirirken hız ve doğruluk ayrımını net göremez.',
      en: 'Many WPM tests feel fast but do not penalize incorrect typing clearly. Users cannot always separate speed from accuracy while improving.',
    },
    solution: {
      tr: 'TypeSprint, yanlış girişte akışı durduran ve çok dilli kelime havuzuyla çalışan bir ölçüm deneyimi sunar. Amaç hızlı skor değil, güvenilir sonuçtur.',
      en: 'TypeSprint provides a measurement experience that stops on wrong input and works with multilingual word pools. The goal is reliable results, not inflated speed.',
    },
    decisionsTitle: DECISIONS.product,
    decisions: {
      tr: [
        'Yanlış tuşla devam etmeye izin vermeyen akış, skoru daha dürüst hâle getirir.',
        'Arayüzde odak metin alanında kalır; yardımcı bilgiler çevrede daha sessiz durur.',
        'Çok dilli yapı, Türkçe dahil farklı kelime ritimlerini ölçüme dahil eder.',
      ],
      en: [
        'Stopping progress on a wrong key makes the score more honest.',
        'The interface keeps focus on the text area while supporting data stays quieter.',
        'The multilingual structure includes different word rhythms, including Turkish.',
      ],
    },
    result: {
      tr: 'TypeSprint, küçük bir web aracında bile ölçüm mantığı, kullanıcı psikolojisi ve arayüz ritminin birlikte tasarlanması gerektiğini gösteriyor.',
      en: 'TypeSprint shows that even a small web tool needs measurement logic, user psychology, and interface rhythm designed together.',
    },
    resultTags: ['JavaScript', 'WPM', 'Multilingual', 'Leaderboard'],
  },

  harita: {
    subtitle: {
      tr: "Türkiye'nin 81 ilinden gelen sorun bildirimlerini haritada toplayan, Supabase destekli topluluk platformu.",
      en: 'A community platform backed by Supabase that collects and maps issue reports from all 81 provinces of Turkey.',
    },
    facts: [
      {
        label: { tr: 'Yüzey', en: 'Surface' },
        value: { tr: 'Etkileşimli harita platformu', en: 'Interactive map platform' },
      },
      { label: { tr: 'Yığın', en: 'Stack' }, value: 'Next.js 16, Supabase, d3-geo' },
      { label: { tr: 'Doğrulama', en: 'Validation' }, value: 'zod + Cloudflare Turnstile' },
    ],
    problem: {
      tr: 'Topluluğun 81 ile yayılan sorun bildirimlerinin dağınık kanallarda kaybolması, sorunun nerede yoğunlaştığının görülmesini zorlaştırıyordu; tek bir harita yüzeyine ihtiyaç vardı.',
      en: 'Issue reports scattered across channels made it hard to see where problems concentrate across 81 provinces; a single map surface was needed.',
    },
    solution: {
      tr: 'Bildirimleri il bazında haritada toplayan bir platform kurdum: d3-geo ile SVG harita, Supabase üzerinde RLS korumalı veri katmanı, zod ile uçtan uca doğrulama ve Turnstile ile bot koruması.',
      en: 'I built a platform that maps reports per province: an SVG map with d3-geo, an RLS-protected data layer on Supabase, end-to-end validation with zod, and bot protection with Turnstile.',
    },
    decisionsTitle: DECISIONS.technical,
    decisions: {
      tr: [
        'Türkiye haritası d3-geo Mercator izdüşümüyle SVG olarak üretildi; harita kütüphanesi olmadan hafif ve hızlı bir temel kuruldu.',
        'Supabase tarafında RLS, görünümler ve tetikleyiciler kullanıldı; okuma özetleri veritabanı görünümlerinden türetiliyor.',
        'İstemci ve sunucu aynı zod şemasını paylaşıyor; form doğrulaması tek kaynakta tutuluyor.',
        'Veritabanı yapılandırması olmadan site örnek veri kipinde açılıyor; geliştirme ve demo akışı kopmuyor.',
      ],
      en: [
        'The Turkey map is rendered as SVG via d3-geo Mercator projection; a lightweight base without a map library.',
        'Supabase side uses RLS, views, and triggers; reading summaries derive from database views.',
        'Client and server share the same zod schema, keeping form validation in a single source.',
        'Without database configuration, the site opens in sample-data mode; dev and demo flows never break.',
      ],
    },
    result: {
      tr: 'BİZ Şehir Haritası, ana sitenin tasarım dilini paylaşan bir alt alan adı olarak yayında: harita özeti, ülke özeti ve kırılımlar veritabanı görünümlerinden türetiliyor, yazma uçları ortak şema ve bot korumasıyla çalışıyor.',
      en: 'BİZ Şehir Haritası is live as a subdomain sharing the main site design language: map and country summaries derive from database views, while write endpoints run on a shared schema with bot protection.',
    },
    resultTags: ['Next.js 16', 'Supabase', 'd3-geo', 'PostgreSQL', 'zod'],
  },

  biztoplulugu: {
    subtitle: {
      tr: 'Etkinlik, rapor ve duyuru arşivini MDX tabanlı içerik akışıyla taşıyan, build sırasında statik üretilen topluluk kurumsal sitesi.',
      en: 'A community organization site that carries the event, report, and announcement archive through MDX content, statically generated at build time.',
    },
    facts: [
      {
        label: { tr: 'Yüzey', en: 'Surface' },
        value: { tr: 'Kurumsal topluluk sitesi', en: 'Community organization site' },
      },
      { label: { tr: 'Yığın', en: 'Stack' }, value: 'Next.js + MDX, Tailwind v4' },
      {
        label: { tr: 'İçerik', en: 'Content' },
        value: { tr: 'Build sırasında statik üretim', en: 'Statically generated at build' },
      },
    ],
    problem: {
      tr: 'Topluluğun yıllara yayılan etkinlik, rapor ve duyuru arşivi WordPress üzerindeydi; eski yapı içerik yönetimini yavaşlatıyor, sitenin hızını ve güncellenebilirliğini kısıtlıyordu.',
      en: "The community's multi-year archive of events, reports, and announcements lived on WordPress; the legacy setup slowed content work and limited speed and maintainability.",
    },
    solution: {
      tr: 'Arşivi MDX dosyalarına taşıdım; beş koleksiyon, kurumsal sayfalar ve üyelik akışı tek tasarım diliyle, build sırasında statik üretilen bir Next.js sitesinde birleşti. WordPress adresleri kalıcı yönlendirmelerle korundu.',
      en: 'I moved the archive to MDX files; five collections, corporate pages, and the membership flow now sit in one Next.js site with a single design language, statically generated at build. WordPress URLs are preserved via permanent redirects.',
    },
    decisionsTitle: DECISIONS.technical,
    decisions: {
      tr: [
        'WordPress arşivi MDX içerik dosyalarına taşındı; eski adresler kalıcı yönlendirmelerle korundu.',
        'Veritabanı yok: bütün sayfalar build sırasında statik üretiliyor, bakım yükü ve maliyet düşüyor.',
        'Künye kartı, arşivin temel birimi olarak tasarlandı; beş koleksiyon aynı birimi paylaşıyor.',
      ],
      en: [
        'The WordPress archive moved to MDX content files; old URLs are preserved with permanent redirects.',
        'No database: every page is statically generated at build time, keeping maintenance and cost low.',
        'The künye card is designed as the base unit of the archive; five collections share it.',
      ],
    },
    result: {
      tr: 'Biz Topluluğu, içerik ağırlıklı bir kurumsal site için veritabanısız mimarinin ne kadar yeterli olduğunu gösteren bir iş: künye kartı sistemi sayesinde beş farklı koleksiyon tek bileşen dilinde okunuyor.',
      en: 'Biz Topluluğu shows how sufficient a database-free architecture can be for a content-heavy organization site: thanks to the künye card system, five different collections read in one component language.',
    },
    resultTags: ['Next.js', 'MDX', 'Tailwind v4', { tr: 'Statik üretim', en: 'Static generation' }],
  },

  walkkittie: {
    subtitle: {
      tr: 'Günlük yürüyüşü piksel pet bakım döngüsüyle birleştiren, Google Play’de yayınlanmış Android uygulaması.',
      en: 'An Android app published on Google Play that connects daily walking with pixel-pet care.',
    },
    facts: [
      { label: { tr: 'Platform', en: 'Platform' }, value: 'Google Play' },
      { label: { tr: 'Yığın', en: 'Stack' }, value: 'Kotlin + Jetpack Compose' },
      {
        label: { tr: 'Odak', en: 'Focus' },
        value: { tr: 'Sağlık takibini oyunlaştırma', en: 'Gamified health tracking' },
      },
    ],
    problem: {
      tr: 'Sağlık uygulamaları çoğu zaman sayaç ve grafiklerden ibaret kalır. Bu yapı, günlük alışkanlık oluşturmak isteyen kullanıcı için yeterince sıcak ve motive edici olmayabilir.',
      en: 'Health apps often become counters and charts. That can feel too cold for users trying to build daily habits.',
    },
    solution: {
      tr: 'WalkKittie, adım ve su takibini animasyonlu piksel pet bakımıyla birleştirir. Kullanıcı hareket ettikçe oyun döngüsü de ilerler.',
      en: 'WalkKittie combines step and water tracking with animated pixel-pet care. As the user moves, the game loop progresses too.',
    },
    decisionsTitle: DECISIONS.product,
    decisions: {
      tr: [
        'Adım sayacı tek başına kuru kalacağı için animasyonlu piksel pet motivasyon döngüsüne bağlandı.',
        'Su takibi, oyun ve bakım akışları ayrı ayrı değil günlük rutin içinde ele alındı.',
        'Native Android yaklaşımı, telefon deneyimini web vitrini gibi değil uygulama gibi hissettirmeyi hedefledi.',
      ],
      en: [
        'Step tracking alone can feel dry, so it is connected to an animated pixel-pet motivation loop.',
        'Water tracking, game, and care flows are treated as one daily routine instead of separate tools.',
        'The native Android approach aims to feel like an app, not a web showcase inside a phone.',
      ],
    },
    result: {
      tr: 'WalkKittie yalnızca bir öğrenme projesi değil, mağazaya çıkarılmış bir mobil ürün. Bu da Android tarafında yayın sürecini ve gerçek kullanıcı akışını deneyimlememi sağladı.',
      en: 'WalkKittie is not only a learning project; it is a mobile product shipped to a store. That gave me experience with Android release flow and real user journeys.',
    },
    resultTags: ['Kotlin', 'Jetpack Compose', 'Material 3', 'Google Play'],
  },

  msscan: {
    subtitle: {
      tr: 'XSS, SQLi, CSRF, SSRF, open redirect, header ve subdomain kontrolleri için geliştirilmiş async Python CLI aracı.',
      en: 'An async Python CLI tool for XSS, SQLi, CSRF, SSRF, open redirect, header, and subdomain checks.',
    },
    facts: [
      { label: { tr: 'Dil', en: 'Language' }, value: 'Python 3.10+' },
      {
        label: { tr: 'Yüzey', en: 'Surface' },
        value: { tr: 'Etkileşimli terminal', en: 'Interactive terminal' },
      },
      {
        label: { tr: 'Çıktı', en: 'Output' },
        value: { tr: 'Konsol + HTML rapor', en: 'Console + HTML report' },
      },
    ],
    problem: {
      tr: 'Web güvenliği öğrenirken aynı kontrolleri elle tekrar etmek hem yavaş hem de hataya açık. Küçük, okunur ve yapılandırılabilir bir CLI aracı pratik öğrenmeyi hızlandırır.',
      en: 'Repeating the same web-security checks manually is slow and error-prone. A small, readable, configurable CLI tool makes practice faster.',
    },
    solution: {
      tr: 'msscan, farklı güvenlik kontrollerini async çalışan modüller hâlinde toplar. Terminal çıktısı ve HTML raporla bulguları daha okunur hâle getirir.',
      en: 'msscan groups different security checks into async modules. Console output and HTML reports make findings easier to read.',
    },
    decisionsTitle: DECISIONS.technical,
    decisions: {
      tr: [
        'Tarama modülleri ayrı tutuldu; yeni kontrol eklemek daha kolay hâle geldi.',
        'Rate limiting ve timeout seçenekleri, hedef sistemi gereksiz zorlamadan test etmeye yardımcı olur.',
        'SSRF ve SQLi için baseline karşılaştırması, yanlış pozitifleri azaltır.',
        'HTML rapor, terminal çıktısını paylaşılabilir ve okunabilir forma taşır.',
      ],
      en: [
        'Scan modules are separated, making new checks easier to add.',
        'Rate limiting and timeout options help test without overloading targets.',
        'Baseline comparison for SSRF and SQLi reduces false positives.',
        'HTML reporting turns terminal output into a readable and shareable artifact.',
      ],
    },
    result: {
      tr: 'msscan, güvenlik öğrenimini ürünleştiren bir araç: yalnızca teorik açık listesi değil, terminalden çalıştırılabilir ve rapora dökülebilir bir pratik alanı.',
      en: 'msscan productizes security learning: not only a theoretical list of vulnerabilities, but a terminal workflow that can produce reports.',
    },
    resultTags: ['Python', 'Async', 'Rate limiting', { tr: 'HTML rapor', en: 'HTML reports' }],
  },
};
