import React from 'react';
import { HiCursorClick, HiLightningBolt } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';
import CaseStudyLayout from '../../components/CaseStudyLayout';
import FadeContent from '../../components/FadeContent';

const InfoCard = ({ title, children }) => (
  <div className="card-raised p-6">
    <h2 className="mb-3 text-h3 text-ink-900 dark:text-white">{title}</h2>
    <div className="text-body text-ink-600 dark:text-ink-200">{children}</div>
  </div>
);

const TypeSprintCaseStudy = () => {
  const { isTurkish } = useLanguage();

  const facts = isTurkish
    ? [
        { label: 'Yüzey', value: 'Canlı WPM uygulaması' },
        { label: 'Odak', value: 'Doğruluk + ritim' },
        { label: 'Dil', value: 'Çok dilli kelime havuzu' },
      ]
    : [
        { label: 'Surface', value: 'Live WPM application' },
        { label: 'Focus', value: 'Accuracy + rhythm' },
        { label: 'Language', value: 'Multilingual word pools' },
      ];

  const decisions = isTurkish
    ? [
        'Yanlış tuşla devam etmeye izin vermeyen akış, skoru daha dürüst hale getirir.',
        'Arayüzde odak metin alanında kalır; yardımcı bilgiler çevrede daha sessiz durur.',
        'Çok dilli yapı, Türkçe dahil farklı kelime ritimlerini ölçüme dahil eder.',
      ]
    : [
        'Stopping progress on a wrong key makes the score more honest.',
        'The interface keeps focus on the text area while supporting data stays quieter.',
        'The multilingual structure includes different word rhythms, including Turkish.',
      ];

  return (
    <CaseStudyLayout
      routePath="/case-study/typesprint"
      title="TypeSprint"
      subtitle={
        isTurkish
          ? 'Yazma hızını sadece hız değil, doğruluk ve akış kontrolüyle ölçen canlı web uygulaması.'
          : 'A live web app that measures typing speed through accuracy and flow control, not only raw speed.'
      }
      liveUrl="https://typesprint.online"
      currentId="typesprint"
      isTurkish={isTurkish}
      facts={facts}
      previewVariant="typing"
    >
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="grid gap-5 md:grid-cols-2">
          <InfoCard title={isTurkish ? 'Problem' : 'Problem'}>
            {isTurkish
              ? 'Birçok WPM testi hızlı görünür ama hatalı yazmayı yeterince cezalandırmaz. Kullanıcı kendini geliştirirken hız ve doğruluk ayrımını net göremez.'
              : 'Many WPM tests feel fast but do not penalize incorrect typing clearly. Users cannot always separate speed from accuracy while improving.'}
          </InfoCard>
          <InfoCard title={isTurkish ? 'Çözüm' : 'Solution'}>
            {isTurkish
              ? 'TypeSprint, yanlış girişte akışı durduran ve çok dilli kelime havuzuyla çalışan bir ölçüm deneyimi sunar. Amaç hızlı skor değil, güvenilir sonuçtur.'
              : 'TypeSprint provides a measurement experience that stops on wrong input and works with multilingual word pools. The goal is reliable results, not inflated speed.'}
          </InfoCard>
        </div>
      </FadeContent>

      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-prominent p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <HiCursorClick className="h-6 w-6 text-accent-600 dark:text-accent-200" />
            <h2 className="text-h3 text-ink-900 dark:text-white">
              {isTurkish ? 'Ürün kararları' : 'Product decisions'}
            </h2>
          </div>
          <ul className="grid gap-3">
            {decisions.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-lg border border-ink-200/70 bg-white/50 p-4 text-body-sm font-semibold text-ink-600 dark:border-white/10 dark:bg-white/10 dark:text-ink-200"
              >
                <HiLightningBolt className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </FadeContent>

      <FadeContent duration={700} blur threshold={0.1}>
        <InfoCard title={isTurkish ? 'Sonuç' : 'Result'}>
          {isTurkish
            ? 'TypeSprint, küçük bir web aracında bile ölçüm mantığı, kullanıcı psikolojisi ve arayüz ritminin birlikte tasarlanması gerektiğini gösteriyor.'
            : 'TypeSprint shows that even a small web tool needs measurement logic, user psychology, and interface rhythm designed together.'}
          <div className="mt-4 flex flex-wrap gap-2">
            {['JavaScript', 'WPM', 'Multilingual', 'Leaderboard'].map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-accent-300/50 bg-accent-50 px-2.5 py-1 text-xs font-bold text-accent-700 dark:border-accent-300/20 dark:bg-accent-300/10 dark:text-accent-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </InfoCard>
      </FadeContent>
    </CaseStudyLayout>
  );
};

export default TypeSprintCaseStudy;
