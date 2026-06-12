import React from 'react';
import { HiHeart, HiTrendingUp } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';
import CaseStudyLayout from '../../components/CaseStudyLayout';
import FadeContent from '../../components/FadeContent';

const InfoCard = ({ title, children }) => (
  <div className="card-raised p-6">
    <h2 className="mb-3 text-h3 text-ink-900 dark:text-white">{title}</h2>
    <div className="text-body text-ink-600 dark:text-ink-200">{children}</div>
  </div>
);

const WalkKittieCaseStudy = () => {
  const { isTurkish } = useLanguage();
  const playUrl = 'https://play.google.com/store/apps/details?id=com.mert.paticat';

  const facts = isTurkish
    ? [
        { label: 'Platform', value: 'Google Play' },
        { label: 'Stack', value: 'Kotlin + Jetpack Compose' },
        { label: 'Odak', value: 'Sağlık takibini oyunlaştırma' },
      ]
    : [
        { label: 'Platform', value: 'Google Play' },
        { label: 'Stack', value: 'Kotlin + Jetpack Compose' },
        { label: 'Focus', value: 'Gamified health tracking' },
      ];

  const decisions = isTurkish
    ? [
        'Adım sayacı tek başına kuru kalacağı için sanal kedi motivasyon döngüsüne bağlandı.',
        'Su takibi, oyun ve bakım akışları ayrı ayrı değil günlük rutin içinde ele alındı.',
        'Native Android yaklaşımı, telefon deneyimini web vitrini gibi değil uygulama gibi hissettirmeyi hedefledi.',
      ]
    : [
        'Step tracking alone can feel dry, so it is connected to a virtual-cat motivation loop.',
        'Water tracking, game, and care flows are treated as one daily routine instead of separate tools.',
        'The native Android approach aims to feel like an app, not a web showcase inside a phone.',
      ];

  return (
    <CaseStudyLayout
      routePath="/case-study/walkkittie"
      title="WalkKittie"
      subtitle={
        isTurkish
          ? 'Günlük yürüyüşü sanal evcil hayvan bakımıyla birleştiren, Google Play’de yayınlanmış Android uygulaması.'
          : 'An Android app published on Google Play that connects daily walking with virtual pet care.'
      }
      liveUrl={playUrl}
      githubUrl="https://github.com/MertSoylu/WalkKittie_App"
      currentId="walkkittie"
      isTurkish={isTurkish}
      facts={facts}
      previewVariant="mobile"
      previewSnapshotSrc="/previews/walkkittie.png"
    >
      <FadeContent duration={700} blur threshold={0.1}>
        <div className="grid gap-5 md:grid-cols-2">
          <InfoCard title={isTurkish ? 'Problem' : 'Problem'}>
            {isTurkish
              ? 'Sağlık uygulamaları çoğu zaman sayaç ve grafiklerden ibaret kalır. Bu yapı, günlük alışkanlık oluşturmak isteyen kullanıcı için yeterince sıcak ve motive edici olmayabilir.'
              : 'Health apps often become counters and charts. That can feel too cold for users trying to build daily habits.'}
          </InfoCard>
          <InfoCard title={isTurkish ? 'Çözüm' : 'Solution'}>
            {isTurkish
              ? 'WalkKittie, adım ve su takibini sanal kedi bakımıyla birleştirir. Kullanıcı hareket ettikçe oyun döngüsü de ilerler.'
              : 'WalkKittie combines step and water tracking with virtual pet care. As the user moves, the game loop progresses too.'}
          </InfoCard>
        </div>
      </FadeContent>

      <FadeContent duration={700} blur threshold={0.1}>
        <div className="card-prominent p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <HiHeart className="h-6 w-6 text-accent-600 dark:text-accent-200" />
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
                <HiTrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </FadeContent>

      <FadeContent duration={700} blur threshold={0.1}>
        <InfoCard title={isTurkish ? 'Sonuç' : 'Result'}>
          {isTurkish
            ? 'WalkKittie, yalnızca öğrenme projesi olarak değil, mağazaya çıkarılmış bir mobil ürün olarak duruyor. Bu da Android tarafında yayın sürecini ve gerçek kullanıcı akışını deneyimlememi sağladı.'
            : 'WalkKittie is not only a learning project; it is a mobile product shipped to a store. That gave me experience with Android release flow and real user journeys.'}
          <div className="mt-4 flex flex-wrap gap-2">
            {['Kotlin', 'Jetpack Compose', 'Material 3', 'Google Play'].map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-purple-300/50 bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 dark:border-purple-300/20 dark:bg-purple-300/10 dark:text-purple-200"
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

export default WalkKittieCaseStudy;
