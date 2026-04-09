# WebDevPage Kompakt Yeniden Tasarım

**Tarih:** 2026-04-09  
**Kapsam:** `src/pages/WebDevPage.jsx`  
**Amaç:** Proje kartlarını daha kompakt hale getirmek — tüm projeler görünür kalırken dikey alan dramatik şekilde azaltılır.

---

## Tasarım Kararları

### Kart Yapısı (Yaklaşım 1 — Yatay Kompakt Kart)

Gradient başlık bandı **tamamen kaldırılır**. Her kart yatay düzende üç bölüme ayrılır:

```
┌─────────────────────────────────────────────────────────┐
│  [Thumbnail]  │  TypeSprint                             │
│  w-28 h-20    │  typesprint.online              [Ziyaret]│
│  rounded-xl   │  Kısa açıklama (sadece description)     │
│  accent border│  [JS] [HTML/CSS] [Leaderboard] [feat…]  │
└─────────────────────────────────────────────────────────┘
                  ▼ "Daha fazla oku" tıklanırsa:
┌─────────────────────────────────────────────────────────┐
│  longDesc metni — AnimatePresence ile smooth açılma     │
└─────────────────────────────────────────────────────────┘
```

- **Thumbnail:** `SitePreview` bileşeni `w-28 h-20` boyutunda, projenin accent rengiyle border
- **Başlık alanı:** Proje adı (bold), URL (muted text), sağda "Ziyaret Et" butonu
- **Açıklama:** Sadece `description` alanı gösterilir (`longDesc` toggle arkasına gizlenir)
- **Tag satırı:** Mevcut `tags` + `features` tek `flex-wrap` satırında birleştirilir, `text-xs` font
- **Toggle:** Chevron ikon (`▸`/`▴`) + "Daha fazla oku" / "Kapat" metni

### longDesc Toggle Davranışı

- Framer Motion `AnimatePresence` ile `height: 0 → auto`, `opacity: 0 → 1`
- `duration: 0.3s`, `ease: easeInOut`
- Toggle state her kart için bağımsız (`useState` per kart veya `openId` state ile)

### Sayfa Genel Düzeni

| Alan | Önce | Sonra |
|------|------|-------|
| Container genişliği | `max-w-5xl` | `max-w-3xl` |
| Hero alt boşluk | `mb-16` | `mb-8` |
| Kartlar arası boşluk | `space-y-20` | `space-y-4` |
| Başlık font | `text-6xl` | `text-4xl md:text-5xl` |
| Açıklama font | `text-lg` | `text-base` |

### Animasyonlar ve Etkileşimler

- `GlareHover` + `FadeContent` wrapper'ları **korunur**
- Thumbnail hover: hafif `scale(1.05)` + gradient border parlaması
- Kart hover `translate-y` efekti **kaldırılır** (kompakt düzende gereksiz)
- "Ziyaret Et" butonu sağa sabit konumlanır, mevcut `scale + y` hover animasyonu korunur
- Accent rengi gradient başlık bandından thumbnail border'ına ve butona taşınır

---

## Değiştirilecek Dosyalar

- `src/pages/WebDevPage.jsx` — tek dosya, tüm değişiklikler burada

## Değiştirilmeyecekler

- `SitePreview` bileşeni — sadece boyut props'ları değişir
- `GlareHover`, `FadeContent`, `BlurText` — korunur
- Proje verisi (`projects` array) — içerik değişmez, sadece render değişir
- i18n yapısı — Türkçe/İngilizce desteği korunur
