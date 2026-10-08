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
      tr: 'Terminali bir çalışma alanına dönüştüren tek native binary: git projeleri, gerçek kabuklar, AI ajan kotaları ve sistem monitörü aynı ekranda.',
      en: 'A single native binary that turns your terminal into a workspace: git projects, real shells, AI agent quotas and a system monitor on one screen.',
    },
    facts: [
      { label: { tr: 'Dil', en: 'Language' }, value: 'Rust 2024 · ratatui' },
      { label: { tr: 'Platformlar', en: 'Platforms' }, value: 'Windows · Linux · macOS' },
      {
        label: { tr: 'Dağıtım', en: 'Distribution' },
        value: { tr: 'crates.io + hazır binary', en: 'crates.io + prebuilt binaries' },
      },
    ],
    extraLinks: [{ label: 'crates.io', href: 'https://crates.io/crates/noble' }],
    video: { src: '/media/noble-promo.mp4', poster: '/media/noble-promo-poster.webp' },
    problem: {
      tr: 'AI kodlama ajanlarıyla çalışan bir gün, birkaç terminal penceresi arasında bölünüyor. Her projenin git durumu, sistem yükü ve Claude Code / Codex kotasından ne kaldığı farklı araçlarda aranıyor; bu bağlam değişikliği dikkati sürekli dağıtıyor.',
      en: 'A day of working with AI coding agents gets split across terminal windows. Each project’s git state, the system load and the remaining Claude Code / Codex quota live in different tools, and constant context switching breaks focus.',
    },
    solution: {
      tr: 'NOBLE bu bilgileri terminalin içindeki tek bir kokpitte topluyor. Home ekranı git projelerini dal, değişiklik ve commit durumuyla listeler; tek tuşla seçili projede kabuk, Claude Code ya da Codex açılır. Sekmeler ve bölmeler gerçek PTY üzerinde çalışır; AI kotaları ve sistem sensörleri aynı ekranda canlı güncellenir.',
      en: 'NOBLE brings all of it into one cockpit inside the terminal. Home lists git projects with branch, change and commit status; one key opens a shell, Claude Code or Codex in the selected project. Tabs and splits run on a real PTY, while AI quotas and system sensors stay live alongside.',
    },
    features: [
      {
        title: { tr: 'Gerçek terminaller', en: 'Real terminals' },
        desc: {
          tr: 'Windows’ta ConPTY, Linux ve macOS’ta PTY. Sekme, bölme, zoom ve scrollback araması var; vim, htop ve Claude Code tam ekran çalışır.',
          en: 'ConPTY on Windows, PTY on Linux and macOS. Tabs, splits, zoom and scrollback search; vim, htop and Claude Code run full-screen.',
        },
      },
      {
        title: { tr: 'Projeler bir bakışta', en: 'Projects at a glance' },
        desc: {
          tr: 'Git repolarını bulur; dal, değişiklikler, push ya da pull bekleyen commit’ler ve son commit’leri gösterir. Komut bittiğinde durum kendiliğinden yenilenir.',
          en: 'Finds your git repositories and shows the branch, changes, commits waiting to be pushed or pulled, and recent commits. Status refreshes when a command finishes.',
        },
      },
      {
        title: { tr: 'AI kota ve oturumlar', en: 'AI quota and sessions' },
        desc: {
          tr: 'Claude Code, Codex ve diğer ajanların 5 saatlik ve haftalık limitleri; hangi ajanın çalıştığı ve hangisinin sıranı beklediği.',
          en: 'The 5-hour and weekly limits of Claude Code, Codex and other agents, plus which agent is running and which one is waiting for you.',
        },
      },
      {
        title: { tr: 'Hızlı başlatma', en: 'Quick launch' },
        desc: {
          tr: 'Claude Code, Codex, OpenCode, Copilot ve diğer AI CLI’ları seçili projede tek tuşla açılır; yalnızca PATH’te kurulu olanlar listelenir.',
          en: 'Claude Code, Codex, OpenCode, Copilot and other AI CLIs open in the selected project with one key; only the ones installed on your PATH are listed.',
        },
      },
      {
        title: { tr: 'Sistem monitörü', en: 'System monitor' },
        desc: {
          tr: 'CPU geçmişi ve çekirdek bazlı yük, bellek, ağ, diskler, batarya ve sıralanabilir bir süreç tablosu.',
          en: 'CPU history and per-core load, memory, network, disks, battery, and a sortable process table.',
        },
      },
      {
        title: { tr: '22 tema, canlı ayar', en: '22 themes, live config' },
        desc: {
          tr: 'Amber, Catppuccin, Tokyo Night, Nord ve diğerleri. `config.toml` değişikliği anında uygulanır; hatalı bir değer uygulamayı çökertmez.',
          en: 'Amber, Catppuccin, Tokyo Night, Nord and more. Changes to `config.toml` apply live, and a bad value never crashes the app.',
        },
      },
    ],
    decisionsTitle: DECISIONS.technical,
    decisions: {
      tr: [
        'Yalnızca ekranda görünen bir şey değiştiğinde çizim yapılır: boştaki bir terminal sekmesi tek çekirdeğin ~%0,05’ini, Home ekranı ~%0,4’ünü kullanıyor.',
        'Süreçler portable-pty, ekran durumu vt100 ile yönetilir; aynı kod Windows’ta ConPTY, Linux ve macOS’ta PTY üzerinde çalışır.',
        'AI kotaları CLI’ların zaten tuttuğu giriş bilgilerinden okunur; tokenlar yalnızca kendi sağlayıcısına gider, hiçbir yerde gösterilmez ya da loglanmaz.',
        '`noble update`, indirilen binary’yi sürümün SHA-256 özetiyle doğrular; eşleşmezse kurulu sürüme dokunmaz.',
        'CI; gerçek terminal ve uçtan uca testler dahil tüm test paketini üç platformda çalıştırır.',
      ],
      en: [
        'Redraw only when something visible changes: an idle terminal tab costs ~0.05% of one core and the Home screen ~0.4%.',
        'Processes run through portable-pty and the screen state through vt100; the same code runs on ConPTY on Windows and on a PTY on Linux and macOS.',
        'AI quotas are read from the logins the CLIs already keep; tokens only go to their own provider and are never shown or logged.',
        '`noble update` verifies the downloaded binary against the release SHA-256 digest; on a mismatch the installed version is left untouched.',
        'CI runs the full test suite, including real-terminal and end-to-end tests, on all three platforms.',
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
          tr: 'Claude Code ve Codex, yan yana bölmelerde',
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
          tr: 'Komut paleti: her eylem, proje, sekme ve tema tek yerde',
          en: 'Command palette: every action, project, tab and theme in one place',
        },
      },
      {
        src: '/previews/noble/themes.webp',
        caption: { tr: '22 temadan altısı', en: 'Six of the 22 themes' },
        wide: true,
      },
    ],
    result: {
      tr: 'NOBLE; crates.io ve GitHub Releases üzerinden üç platform için hazır binary’lerle, kendi dokümantasyon sitesiyle yayında. Proje, bir TUI’yi ürün gibi ele almanın uçtan uca bir denemesi oldu: kurulum, güncelleme, temalar, fare desteği ve test altyapısı.',
      en: 'NOBLE is live on crates.io and GitHub Releases with prebuilt binaries for three platforms, plus its own documentation site. It was an end-to-end exercise in treating a TUI as a product: installation, updates, themes, mouse support and test infrastructure.',
    },
    resultTags: ['Rust', 'ratatui', 'crossterm', 'portable-pty', 'vt100', 'sysinfo'],
  },

  typesprint: {
    subtitle: {
      tr: 'Yazma hızını yalnızca ham hızla değil, doğruluk ve akış kontrolüyle ölçen canlı bir web uygulaması.',
      en: 'A live web app that measures typing speed through accuracy and flow control, not raw speed alone.',
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
      tr: 'Birçok WPM testi hızlı görünür ama hatalı yazmayı yeterince cezalandırmaz. Kullanıcı hızını geliştirirken hız ile doğruluğu birbirinden ayıramaz.',
      en: 'Many WPM tests feel fast but barely penalize wrong keystrokes. While trying to improve, users cannot tell speed apart from accuracy.',
    },
    solution: {
      tr: 'TypeSprint, yanlış girişte akışı durduran bir ölçüm deneyimi sunar ve kelimeleri çok dilli kelime havuzlarından çeker. Hedef hızlı bir skor değil, güvenilir bir sonuçtur.',
      en: 'TypeSprint is a measurement flow that stops on a wrong key and draws words from multilingual pools. The goal is a reliable result, not an inflated score.',
    },
    decisionsTitle: DECISIONS.product,
    decisions: {
      tr: [
        'Yanlış tuşla ilerlemeye izin verilmemesi skoru daha dürüst hâle getirir.',
        'Arayüzde odak metin alanında kalır; yardımcı bilgiler çevrede daha sessiz durur.',
        'Çok dilli yapı, Türkçe dahil farklı kelime ritimlerini ölçüme dahil eder.',
      ],
      en: [
        'Stopping progress on a wrong key makes the score more honest.',
        'The interface keeps focus on the text area while supporting data stays quieter.',
        'The multilingual structure brings different word rhythms, Turkish included, into the measurement.',
      ],
    },
    result: {
      tr: 'TypeSprint, küçük bir web aracında bile ölçüm mantığı, kullanıcı psikolojisi ve arayüz ritminin birlikte tasarlanması gerektiğini gösteriyor.',
      en: 'TypeSprint shows that even a small web tool needs measurement logic, user psychology and interface rhythm designed together.',
    },
    resultTags: ['JavaScript', 'WPM', 'Multilingual', 'Leaderboard'],
  },

  harita: {
    subtitle: {
      tr: 'Türkiye’nin 81 ilinden gelen sorun bildirimlerini haritada toplayan, Supabase destekli bir topluluk platformu.',
      en: 'A Supabase-backed community platform that collects issue reports from all 81 provinces of Turkey and maps them.',
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
      tr: 'Topluluğun 81 ile yayılan sorun bildirimleri dağınık kanallarda kayboluyordu. Sorunların hangi bölgelerde yoğunlaştığını görmek zordu; tek bir harita yüzeyine ihtiyaç vardı.',
      en: 'Issue reports from across 81 provinces were getting lost in scattered channels, making it hard to see where problems concentrate. A single map surface was needed.',
    },
    solution: {
      tr: 'Bildirimleri il bazında haritada gösteren bir platform: d3-geo ile SVG harita, Supabase üzerinde RLS korumalı veri katmanı, zod ile uçtan uca doğrulama ve Turnstile ile bot koruması.',
      en: 'A platform that shows reports per province on one map: an SVG map built with d3-geo, an RLS-protected data layer on Supabase, end-to-end validation with zod, and bot protection with Turnstile.',
    },
    decisionsTitle: DECISIONS.technical,
    decisions: {
      tr: [
        'Türkiye haritası, d3-geo Mercator izdüşümüyle SVG olarak çizildi; harita kütüphanesi olmadan hafif bir temel kuruldu.',
        'Supabase tarafında RLS, görünümler ve tetikleyiciler kullanıldı; okuma özetleri veritabanı görünümlerinden türetiliyor.',
        'İstemci ve sunucu aynı zod şemasını paylaşır; form doğrulaması tek kaynakta tutulur.',
        'Veritabanı yapılandırılmadan site örnek veri kipinde açılır; geliştirme ve demo akışı kesilmez.',
      ],
      en: [
        'The Turkey map is drawn as SVG with a d3-geo Mercator projection: a light base without a map library.',
        'The Supabase side uses RLS, views and triggers; read summaries come from database views.',
        'Client and server share one zod schema, so form validation lives in a single place.',
        'Without database configuration the site opens in sample-data mode, so development and demo flows keep working.',
      ],
    },
    result: {
      tr: 'BİZ Şehir Haritası, ana sitenin tasarım dilini paylaşan bir alt alan adında yayında. Harita ve ülke özetleri veritabanı görünümlerinden türetiliyor; yazma uçları ortak şema ve bot korumasıyla çalışıyor.',
      en: 'BİZ Şehir Haritası is live on a subdomain that shares the main site’s design language. Map and country summaries come from database views, and write endpoints run on a shared schema with bot protection.',
    },
    resultTags: ['Next.js 16', 'Supabase', 'd3-geo', 'PostgreSQL', 'zod'],
  },

  biztoplulugu: {
    subtitle: {
      tr: 'Etkinlik, rapor ve duyuru arşivini MDX tabanlı içerikle taşıyan, build sırasında statik üretilen topluluk kurumsal sitesi.',
      en: 'A community organization site that carries its event, report and announcement archive in MDX, statically generated at build time.',
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
      tr: 'Topluluğun yıllara yayılan etkinlik, rapor ve duyuru arşivi WordPress üzerindeydi. Eski yapı içerik girişini yavaşlatıyor, sitenin hızını ve bakımını kısıtlıyordu.',
      en: 'The community’s multi-year archive of events, reports and announcements lived on WordPress. The legacy setup slowed content work and limited the site’s speed and maintainability.',
    },
    solution: {
      tr: 'Arşiv MDX dosyalarına taşındı. Beş koleksiyon, kurumsal sayfalar ve üyelik akışı tek bir tasarım diliyle, build sırasında statik üretilen bir Next.js sitesinde birleşti. WordPress adresleri kalıcı yönlendirmelerle korundu.',
      en: 'The archive moved to MDX files. Five collections, corporate pages and the membership flow now sit in one Next.js site with a single design language, statically generated at build time. WordPress URLs are kept alive with permanent redirects.',
    },
    decisionsTitle: DECISIONS.technical,
    decisions: {
      tr: [
        'WordPress arşivi MDX içerik dosyalarına taşındı; eski adresler kalıcı yönlendirmelerle korundu.',
        'Veritabanı yok: tüm sayfalar build sırasında statik üretiliyor, bakım yükü ve maliyet düşük kalıyor.',
        'Künye kartı arşivin temel birimi olarak tasarlandı; beş koleksiyon bu birimi paylaşıyor.',
      ],
      en: [
        'The WordPress archive moved to MDX content files; old URLs are kept with permanent redirects.',
        'No database: every page is generated statically at build time, keeping maintenance and cost low.',
        'The künye card is designed as the base unit of the archive, and all five collections share it.',
      ],
    },
    result: {
      tr: 'Biz Topluluğu, içerik ağırlıklı bir kurumsal sitenin veritabanı olmadan da ne kadar yeterli olabileceğini gösteren bir çalışma. Künye kartı sistemi sayesinde beş farklı koleksiyon tek bir bileşen dilinde okunuyor.',
      en: 'Biz Topluluğu shows how far a database-free architecture can go for a content-heavy organization site. Thanks to the künye card system, five different collections read in one component language.',
    },
    resultTags: ['Next.js', 'MDX', 'Tailwind v4', { tr: 'Statik üretim', en: 'Static generation' }],
  },

  walkkittie: {
    subtitle: {
      tr: 'Günlük yürüyüşü piksel pet bakım döngüsüyle birleştiren, Google Play’de yayında bir Android uygulaması.',
      en: 'An Android app on Google Play that connects daily walking with pixel-pet care.',
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
      tr: 'Sağlık uygulamaları çoğu zaman sayaç ve grafiklerden ibaret kalıyor. Günlük bir alışkanlık kurmak isteyen biri için bu yapı soğuk ve motive etmekten uzak olabiliyor.',
      en: 'Health apps often stop at counters and charts. For someone trying to build a daily habit, that can feel cold and far from motivating.',
    },
    solution: {
      tr: 'WalkKittie; adım ve su takibini animasyonlu piksel pet bakımıyla birleştirir. Kullanıcı hareket ettikçe oyun döngüsü de ilerler.',
      en: 'WalkKittie combines step and water tracking with animated pixel-pet care. As the user moves, the game loop moves forward too.',
    },
    decisionsTitle: DECISIONS.product,
    decisions: {
      tr: [
        'Adım sayacı tek başına kuru kalabileceği için animasyonlu piksel pet motivasyon döngüsüne bağlandı.',
        'Su takibi, oyun ve bakım akışları ayrı araçlar gibi değil, günlük rutinin parçası olarak ele alındı.',
        'Native Android yaklaşımı, uygulamanın bir web vitrini gibi değil telefonda gerçek bir uygulama gibi hissettirmesini hedefledi.',
      ],
      en: [
        'A step counter alone can feel dry, so it is tied to an animated pixel-pet motivation loop.',
        'Water tracking, the game and pet care are treated as parts of one daily routine, not separate tools.',
        'The native Android approach aims for an app that feels like a real phone app, not a web showcase inside a phone.',
      ],
    },
    result: {
      tr: 'WalkKittie yalnızca bir öğrenme projesi değil, mağazaya çıkarılmış bir mobil ürün. Android tarafında yayın sürecini ve gerçek kullanıcı akışlarını deneyimleme fırsatı verdi.',
      en: 'WalkKittie is not just a learning project; it is a mobile product shipped to a store. It gave hands-on experience with the Android release flow and real user journeys.',
    },
    resultTags: ['Kotlin', 'Jetpack Compose', 'Material 3', 'Google Play'],
  },

  msscan: {
    subtitle: {
      tr: 'XSS, SQLi, CSRF, SSRF, open redirect, header ve subdomain kontrolleri için yazılmış, async çalışan Python CLI aracı.',
      en: 'An async Python CLI tool for XSS, SQLi, CSRF, SSRF, open redirect, header and subdomain checks.',
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
      tr: 'Web güvenliği öğrenirken aynı kontrolleri elle tekrar etmek hem yavaş hem hataya açık. Küçük, okunabilir ve yapılandırılabilir bir CLI aracı pratiği hızlandırır.',
      en: 'Repeating the same web-security checks by hand is slow and error-prone. A small, readable, configurable CLI tool speeds up practice.',
    },
    solution: {
      tr: 'msscan, farklı güvenlik kontrollerini async çalışan modüller hâlinde bir araya getirir. Terminal çıktısı ve HTML rapor, bulguları daha okunur kılar.',
      en: 'msscan groups different security checks into async modules. Console output and the HTML report make findings easier to read.',
    },
    decisionsTitle: DECISIONS.technical,
    decisions: {
      tr: [
        'Tarama modülleri ayrı tutuldu; yeni bir kontrol eklemek kolaylaştı.',
        'Rate limiting ve timeout seçenekleri, hedef sistemi gereksiz yere zorlamadan test yapmaya yardımcı olur.',
        'SSRF ve SQLi için baseline karşılaştırması yanlış pozitifleri azaltır.',
        'HTML rapor, terminal çıktısını paylaşılabilir ve okunabilir bir forma taşır.',
      ],
      en: [
        'Scan modules are kept separate, which makes new checks easier to add.',
        'Rate limiting and timeout options help you test without overloading the target.',
        'Baseline comparison for SSRF and SQLi reduces false positives.',
        'The HTML report turns terminal output into a readable, shareable document.',
      ],
    },
    result: {
      tr: 'msscan, güvenlik öğrenimini bir ürüne dönüştürüyor: yalnızca teorik bir açık listesi değil, terminalden çalıştırılabilen ve rapor üreten bir pratik alanı.',
      en: 'msscan turns security learning into a product: not just a theoretical list of vulnerabilities, but a practice space you run from the terminal and that produces a report.',
    },
    resultTags: ['Python', 'Async', 'Rate limiting', { tr: 'HTML rapor', en: 'HTML reports' }],
  },
};
