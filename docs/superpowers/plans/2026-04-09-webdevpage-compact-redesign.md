# WebDevPage Compact Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** WebDevPage'deki proje kartlarını yatay kompakt düzene getirmek — gradient başlık bandını kaldırarak, thumbnail'i küçülterek, tag+özellik satırını birleştirerek ve longDesc'i toggle arkasına taşıyarak dikey alanı dramatik ölçüde azaltmak.

**Architecture:** Tek dosya değişikliği (`WebDevPage.jsx`). Gradient başlık bandı kaldırılır, her kart `flex-row` düzeninde thumbnail (sol) + bilgi alanı (orta) + buton (sağ) şeklinde yeniden düzenlenir. `AnimatePresence` ile "Daha fazla oku" toggle eklenir. `SitePreview` boyutu CSS wrapper ile küçültülür.

**Tech Stack:** React 18, Framer Motion (AnimatePresence), Tailwind CSS, mevcut GlareHover/FadeContent bileşenleri

---

### Task 1: Hero bölümünü ve sayfa layout'unu sıkıştır

**Files:**
- Modify: `src/pages/WebDevPage.jsx`

- [ ] **Step 1: Hero bölümü boşluğunu azalt**

`WebDevPage.jsx` içinde şu değişiklikleri yap:

```jsx
// mb-16 → mb-8
<div className="text-center mb-8">

// text-3xl sm:text-4xl md:text-6xl → text-2xl sm:text-3xl md:text-5xl
className="text-2xl sm:text-3xl md:text-5xl font-bold ..."

// text-lg → text-base
className="text-base text-sand-600 dark:text-dark-200 max-w-2xl mx-auto"
```

- [ ] **Step 2: Container genişliğini ve kart boşluklarını azalt**

```jsx
// max-w-5xl → max-w-3xl
<div className="max-w-3xl mx-auto">

// space-y-20 → space-y-4
<div className="space-y-4">
```

- [ ] **Step 3: Geliştirme sunucusunu başlat ve hero bölümünü görsel olarak kontrol et**

```bash
npm run dev
```

Beklenen: Hero başlığı daha küçük, projelerle arası daha az boş alan, container daha dar.

- [ ] **Step 4: Commit**

```bash
git add src/pages/WebDevPage.jsx
git commit -m "refactor(WebDevPage): compact hero section and reduce layout spacing"
```

---

### Task 2: Gradient başlık bandını kaldır ve yatay kart düzenini oluştur

**Files:**
- Modify: `src/pages/WebDevPage.jsx`

- [ ] **Step 1: useState import'unu ekle**

Dosyanın başına:
```jsx
import React, { useState } from 'react';
```

- [ ] **Step 2: openSet state'ini bileşen içine ekle**

`const { isTurkish } = useLanguage();` satırından sonra:
```jsx
const [expandedIds, setExpandedIds] = useState(new Set());

const toggleExpanded = (id) => {
  setExpandedIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};
```

- [ ] **Step 3: Proje kartı JSX'ini tamamen değiştir**

`{projects.map((project, index) => (` bloğunun içindeki mevcut JSX'i aşağıdakiyle değiştir:

```jsx
{projects.map((project, index) => (
  <FadeContent key={project.id} duration={700} delay={index * 150} blur={true} threshold={0.1}>
    <GlareHover
      width="100%"
      height="auto"
      background="transparent"
      borderRadius="16px"
      borderColor={isDark ? 'rgba(71,85,105,0.4)' : 'rgba(212,196,175,0.4)'}
      glareColor={isDark ? '#ff9a5c' : '#f07d2d'}
      glareOpacity={0.12}
      glareSize={300}
      transitionDuration={800}
      className="!grid !place-items-stretch"
    >
      <div className="bg-white/50 dark:bg-dark-600/50 backdrop-blur-md rounded-2xl overflow-hidden w-full p-4 sm:p-5">
        {/* Ana satır: thumbnail + bilgi + buton */}
        <div className="flex gap-4 items-start">
          {/* Thumbnail */}
          <div className={`flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden border-2 border-transparent bg-gradient-to-r ${project.gradient} p-0.5`}>
            <div className="w-full h-full rounded-[10px] overflow-hidden bg-white dark:bg-dark-600">
              <SitePreview
                url={project.url}
                type="web"
                title={project.title}
                gradient={project.gradient}
                expandable={false}
              />
            </div>
          </div>

          {/* Bilgi alanı */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <h2 className="text-lg font-bold text-sand-900 dark:text-dark-50 leading-tight">
                  {project.title}
                </h2>
                <p className="text-xs text-sand-500 dark:text-dark-300">
                  {project.url.replace('https://', '')}
                </p>
              </div>

              {/* Ziyaret Et butonu */}
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${project.gradient} text-white rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-shadow`}
              >
                <HiExternalLink className="w-3.5 h-3.5" />
                {isTurkish ? 'Ziyaret Et' : 'Visit'}
              </motion.a>
            </div>

            {/* Kısa açıklama */}
            <p className="text-sm text-sand-700 dark:text-dark-200 leading-relaxed mb-2 line-clamp-2">
              {project.description}
            </p>

            {/* Birleşik tag + özellik satırı */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 text-xs rounded-full border ${project.accentLight} ${project.accentDark}`}
                >
                  {tag}
                </span>
              ))}
              {project.features.map((feat) => (
                <span
                  key={feat}
                  className="px-2 py-0.5 text-xs rounded-full border border-sand-200 dark:border-dark-400 text-sand-600 dark:text-dark-300"
                >
                  {feat}
                </span>
              ))}
            </div>

            {/* Daha fazla oku toggle */}
            <button
              onClick={() => toggleExpanded(project.id)}
              className="flex items-center gap-1 text-xs font-medium text-sand-500 dark:text-dark-300 hover:text-sand-700 dark:hover:text-dark-100 transition-colors"
            >
              <motion.span
                animate={{ rotate: expandedIds.has(project.id) ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >
                ▸
              </motion.span>
              {expandedIds.has(project.id)
                ? (isTurkish ? 'Kapat' : 'Close')
                : (isTurkish ? 'Daha fazla oku' : 'Read more')}
            </button>
          </div>
        </div>

        {/* Genişleyen longDesc */}
        <AnimatePresence>
          {expandedIds.has(project.id) && (
            <motion.div
              key="longdesc"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="mt-3 pt-3 border-t border-sand-200/60 dark:border-dark-400/60 text-sm text-sand-600 dark:text-dark-300 leading-relaxed">
                {project.longDesc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlareHover>
  </FadeContent>
))}
```

- [ ] **Step 4: AnimatePresence import'u kontrol et**

`framer-motion` import'unun `AnimatePresence` içerdiğini doğrula:
```jsx
import { motion, AnimatePresence } from 'framer-motion';
```

- [ ] **Step 5: Tarayıcıda kartları kontrol et**

- Her kart kompakt yatay düzende görünmeli
- Thumbnail sol tarafta, accent border'lı
- "Daha fazla oku" tıklandığında longDesc smooth açılmalı
- "Kapat" tıklandığında kapanmalı
- Dark mode'da doğru renkler

- [ ] **Step 6: Commit**

```bash
git add src/pages/WebDevPage.jsx
git commit -m "feat(WebDevPage): compact horizontal card layout with expandable longDesc"
```

---

### Task 3: Gereksiz dosyaları temizle

**Files:**
- Check: proje genelinde kullanılmayan bileşen/dosya var mı

- [ ] **Step 1: Artık kullanılmayan import'ları WebDevPage.jsx'ten kaldır**

Gradient başlık bandı kaldırıldığı için `HiCode` ve `HiGlobe` import'larını kontrol et — `HiGlobe` hâlâ badge'de kullanılıyor, `HiCode` sadece `project.icon` alanında kullanılıyordu.

`projects` array'inden `icon` alanını ve `project.icon` kullanımını kaldır (artık render edilmiyor):

```jsx
// projects array'inden icon satırlarını sil:
// icon: <HiCode className="w-10 h-10 text-white" />,
// icon: <HiGlobe className="w-10 h-10 text-white" />,
```

- [ ] **Step 2: Kullanılmayan React Icons import'larını temizle**

```jsx
// Önce:
import { HiArrowLeft, HiExternalLink, HiGlobe, HiCode } from 'react-icons/hi';

// Sonra (HiCode artık kullanılmıyor):
import { HiArrowLeft, HiExternalLink, HiGlobe } from 'react-icons/hi';
```

- [ ] **Step 3: ESLint ile kontrol et**

```bash
npm run lint
```

Beklenen: Uyarı/hata yok.

- [ ] **Step 4: Son görsel kontrol**

Her iki proje kartı da kompakt görünmeli, toggle çalışmalı, dark/light mode doğru.

- [ ] **Step 5: Commit**

```bash
git add src/pages/WebDevPage.jsx
git commit -m "chore(WebDevPage): remove unused icon imports and project.icon field"
```
